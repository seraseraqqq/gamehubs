#!/usr/bin/env python3
"""Local GameHubs registry. Python 3.10+, standard library only."""
from __future__ import annotations
import argparse
import csv
import hashlib
import io
import json
import math
import os
from pathlib import Path
import re
import secrets
import sys
import threading
import unicodedata
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, parse_qs, unquote
from contextlib import contextmanager

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT
QUALIFICATIONS = ['qualified', 'rejected', 'needs_review', 'unknown']
DECISIONS = ['build', 'defer', 'abandon', 'unset']
STAGES = ['idea', 'planned', 'building', 'awaiting_release', 'blocked', 'deployed', 'abandoned']
KEYWORD_STATUSES = ['observing', 'abandoned', 'building', 'live']

def check_metrics(metrics):
    if not isinstance(metrics,dict) or set(metrics)-{'volume','kd','intitle'}:
        raise ValueError('指标只支持 volume、kd、intitle')
    for key,value in metrics.items():
        if value is None:continue
        if isinstance(value,bool) or not isinstance(value,(int,float)) or not math.isfinite(value) or value<0:
            raise ValueError('指标必须是非负有限数字或 null')
        if key in ['volume','intitle'] and value!=int(value):raise ValueError('Volume 和 intitle 数必须是整数')
        if key=='kd' and value>100:raise ValueError('KD 必须在 0–100 之间')

def metric_summary(observations, events):
    """Manual corrections are independent events; original observations stay immutable."""
    values=dict.fromkeys(['volume','kd','intitle','allintitle']);sources={}
    aliases={'volume':['volume','search_volume'],'kd':['kd','keyword_difficulty'],
        'intitle':['intitle','intitle_count','intitleCount'],'allintitle':['allintitle','allintitle_count','allintitleCount']}
    for observation in observations:
        for provider,metrics in observation.get('metrics',{}).items():
            if not isinstance(metrics,dict):continue
            for key,keys in aliases.items():
                value=next((metrics[k] for k in keys if metrics.get(k) is not None),None)
                if isinstance(value,(int,float)) and not isinstance(value,bool) and math.isfinite(value) and value>=0:
                    values[key]=value;sources[key]={'provider':provider,'batchId':observation['batchId']}
                    for source_key in ['query','queryMode']:
                        if isinstance(metrics.get(source_key),str):sources[key][source_key]=metrics[source_key]
    for key in values:
        corrections=[e for e in events if e.get('kind')=='keyword_edit' and e['actorType']=='human' and key in e.get('metrics',{})]
        heads=review_heads(corrections,events)
        if len(heads)==1:
            event=next(e for e in corrections if e['id']==heads[0])
            values[key]=event['metrics'][key];sources[key]={'provider':'manual','reviewId':event['id'],'at':event['createdAt']}
        elif len(heads)>1:
            values[key]=None;sources[key]={'provider':'conflict','heads':heads}
    return {**values,
        'ratio':values['intitle']/values['volume'] if values['intitle'] is not None and values['volume'] else None,
        'kgr':values['allintitle']/values['volume'] if values['allintitle'] is not None and values['volume'] else None,
        'kgrBasis':'allintitle' if values['allintitle'] is not None else None,'sources':sources}

def research_assessment(observations, batches):
    """Research tiers are evidence summaries, independent from owner decisions."""
    candidates=[]
    for observation in observations:
        assessment=observation.get('raw',{}).get('assessment') if isinstance(observation.get('raw'),dict) else None
        batch=batches[observation['batchId']]
        if batch.get('kind','research')!='research' or not isinstance(assessment,dict):continue
        if assessment.get('tier') not in ['S','A','B','C','PENDING','REJECT']:continue
        candidates.append((observation,assessment,batch))
    if not candidates:return None
    def order(item):
        observation,_,batch=item
        try:
            stamp=datetime.fromisoformat((observation.get('observedAt') or '').replace('Z','+00:00'))
            observed=(stamp if stamp.tzinfo else stamp.replace(tzinfo=timezone.utc)).timestamp()
        except (ValueError,OverflowError,OSError):observed=float('-inf')
        return (batch['date']!='unknown',batch['date'],observed,observation['batchId'],observation['id'])
    observation,assessment,batch=max(candidates,key=order)
    return {**assessment,'batchId':observation['batchId'],'observedAt':observation.get('observedAt'),'batchDate':batch['date']}

def now():
    return datetime.now(timezone.utc).isoformat()

def encoded(value):
    return (json.dumps(value, ensure_ascii=False, sort_keys=True, indent=2) + '\n').encode('utf-8')

def digest(value):
    return hashlib.sha256(encoded(value)).hexdigest()

def keyword_id(term, country='unknown', language='unknown'):
    normalized = ' '.join(unicodedata.normalize('NFKC', term).casefold().split())
    return 'kw-' + digest([normalized, country.upper(), language.lower()])[:20]

def atomic(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temp = path.with_name('.' + path.name + '.' + uuid.uuid4().hex + '.tmp')
    try:
        with temp.open('xb') as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp, path)
    finally:
        temp.unlink(missing_ok=True)

@contextmanager
def write_lock(root):
    """OS advisory lock; released on process exit, never commit the lock file."""
    path = root / '.hub-write.lock'
    with path.open('a+b') as f:
        if os.name == 'nt':
            import msvcrt
            f.seek(0)
            f.write(b'0')
            f.flush()
            f.seek(0)
            msvcrt.locking(f.fileno(), msvcrt.LK_LOCK, 1)
        else:
            import fcntl
            fcntl.flock(f, fcntl.LOCK_EX)
        try:
            yield
        finally:
            if os.name == 'nt':
                f.seek(0)
                msvcrt.locking(f.fileno(), msvcrt.LK_UNLCK, 1)
            else:
                fcntl.flock(f, fcntl.LOCK_UN)

def validate_schema(obj, schema, at='$'):
    """The small, explicit JSON Schema subset used in data/schemas/*.json."""
    errors = []
    types = {'object': dict, 'array': list, 'string': str, 'integer': int,
             'number': (int, float), 'boolean': bool, 'null': type(None)}
    if 'type' in schema:
        kinds = schema['type'] if isinstance(schema['type'], list) else [schema['type']]
        valid = any(isinstance(obj, types[k]) and not (k in ['number','integer'] and isinstance(obj, bool)) for k in kinds)
        if not valid:
            return [f'{at}: expected {kinds}']
    if 'enum' in schema and obj not in schema['enum']:
        errors.append(f'{at}: invalid enum {obj!r}')
    if isinstance(obj, str):
        if len(obj.strip()) < schema.get('minLength', 0): errors.append(f'{at}: empty string')
        if 'pattern' in schema and not re.search(schema['pattern'], obj): errors.append(f'{at}: invalid pattern')
    if isinstance(obj, dict):
        for key in schema.get('required', []):
            if key not in obj: errors.append(f'{at}.{key}: required')
        for key, value in obj.items():
            if key in schema.get('properties', {}): errors += validate_schema(value, schema['properties'][key], at+'.'+key)
            elif schema.get('additionalProperties') is False: errors.append(f'{at}.{key}: unknown property')
    if isinstance(obj, list):
        for i, value in enumerate(obj): errors += validate_schema(value, schema.get('items', {}), f'{at}[{i}]')
    return errors

def schema_for(kind):
    return json.loads((ROOT/'data/schemas'/f'{kind}.schema.json').read_text(encoding='utf-8'))

def checked(obj, kind):
    issues=validate_schema(obj, schema_for(kind))
    if issues:return issues
    if kind=='batch' and obj['date']!='unknown':
        try:datetime.strptime(obj['date'],'%Y-%m-%d')
        except ValueError:issues.append('batch.date must be YYYY-MM-DD or unknown')
    if kind=='site':
        if obj.get('createdAt'):
            try:datetime.strptime(obj['createdAt'],'%Y-%m-%d')
            except ValueError:issues.append('createdAt must be YYYY-MM-DD or null')
        directory=obj['source']['directory']
        if directory!='.' and (directory.startswith(('/','\\')) or ':' in directory or any(p in ['','..','.'] for p in directory.split('/'))):
            issues.append('source.directory must be a repository-relative directory, never a device path')
        for mapping in obj['keywordMappings']:
            if 'metrics' in mapping:
                try:check_metrics(mapping['metrics'])
                except ValueError as e:issues.append(str(e))
            if mapping['keywordId']!=keyword_id(mapping['term'],mapping['country'],mapping['language']):issues.append('keyword mapping identity mismatch')
        for url in obj['urls'].values():
            if url is not None and (urlparse(url).scheme not in ['http','https'] or not urlparse(url).netloc):issues.append('invalid site URL')
    if kind=='review' and 'metrics' in obj:
        try:check_metrics(obj['metrics'])
        except ValueError as e:issues.append(str(e))
        if obj.get('kind')!='keyword_edit':issues.append('metrics require keyword_edit event')
    if kind=='review' and 'keywordStatus' in obj and obj.get('kind')!='keyword_edit':issues.append('keywordStatus requires keyword_edit event')
    return issues

def read_records(root):
    batches, observations, reviews, sites, errors = [], [], [], [], []
    def load(path, kind, line=None):
        try:
            value = json.loads(line if line is not None else path.read_text(encoding='utf-8'))
            issues = checked(value, kind)
            if issues: raise ValueError('; '.join(issues))
            return value
        except (ValueError, OSError) as e:
            errors.append({'path':str(path.relative_to(root)), 'error':str(e)})
    for directory in sorted((root/'data/batches').glob('*')):
        if not directory.is_dir() or directory.name.startswith('.'): continue
        batch = load(directory/'batch.json', 'batch')
        if not batch: continue
        if batch['id'] != directory.name:
            errors.append({'path':str(directory), 'error':'batch id/path mismatch'})
            continue
        batches.append(batch)
        try:
            lines = (directory/'keywords.jsonl').read_text(encoding='utf-8').splitlines()
        except OSError as e:
            errors.append({'path':str(directory/'keywords.jsonl'), 'error':str(e)})
            continue
        for number, line in enumerate(lines, 1):
            if not line.strip(): continue
            value = load(directory/'keywords.jsonl','keyword',line)
            if value:
                if value['batchId'] != batch['id'] or value['keywordId'] != keyword_id(value['term'],value['country'],value['language']):
                    errors.append({'path':str(directory/'keywords.jsonl'), 'line':number,'error':'observation identity mismatch'})
                else: observations.append(value)
            elif errors: errors[-1]['line'] = number
        if batch.get('rejectedRowCount',0):
            errors.append({'path':str(directory.relative_to(root)), 'error':f"{batch['rejectedRowCount']} invalid input rows preserved in errors.jsonl"})
    for kind, target in [('review',reviews),('site',sites)]:
        for path in sorted((root/f'data/{kind}s').glob('*.json')):
            value=load(path,kind)
            if value:
                if path.stem != value['id']: errors.append({'path':str(path),'error':'id/path mismatch'})
                else: target.append(value)
    return batches, observations, reviews, sites, errors

def review_heads(events, graph=None):
    # Traverse AI intermediates too: human -> AI -> human is one human lineage.
    lookup={e['id']:e for e in (graph if graph is not None else events)}
    ancestors=set()
    for event in events:
        pending=list(event['parents']);seen=set()
        while pending:
            parent=pending.pop()
            if parent in seen:continue
            seen.add(parent);ancestors.add(parent)
            if parent in lookup:pending.extend(lookup[parent]['parents'])
    return sorted(e['id'] for e in events if e['id'] not in ancestors)

def aggregate(root=ROOT):
    batches, observations, reviews, sites, errors=read_records(root)
    pool={}
    for o in observations:
        row=pool.setdefault(o['keywordId'],{'id':o['keywordId'],'term':o['term'],'aliases':[],
            'country':o['country'],'language':o['language'],'observations':[], 'batches':[],
            'qualification':'unknown','reviewState':'pending','decision':'unset','heads':[],
            'history':[], 'sites':[], 'conflicts':[], 'clusterIds':[], 'aiReview':None})
        row['observations'].append(o)
        if o['term'] not in row['aliases']: row['aliases'].append(o['term'])
        if o['batchId'] not in row['batches']: row['batches'].append(o['batchId'])
        if o.get('clusterId') and o['clusterId'] not in row['clusterIds']: row['clusterIds'].append(o['clusterId'])
    bybatch={b['id']:b for b in batches}
    byreview={e['id']:e for e in reviews}
    events_by_keyword={}
    for event in reviews:events_by_keyword.setdefault(event['keywordId'],[]).append(event)
    for row in pool.values():
        row['observations'].sort(key=lambda o:(bybatch[o['batchId']]['date']!='unknown',bybatch[o['batchId']]['date'],o['batchId'],o['id']))
        states={o['qualification'] for o in row['observations'] if o['qualification']!='unknown'}
        row['qualification']=next(iter(states)) if len(states)==1 else 'needs_review' if states else 'unknown'
        if len(states)>1: row['conflicts'].append('研究资格结论不一致；保留各批次观察，需复核')
        metrics={}
        for o in row['observations']:
            for provider, values in o.get('metrics',{}).items():
                if isinstance(values,dict):
                    for metric,value in values.items():
                        if value is not None and metric in ['volume','kd']:
                            metrics.setdefault((provider,metric),set()).add(str(value))
        for (provider,metric),values in metrics.items():
            if len(values)>1: row['conflicts'].append(f'{provider} {metric} 多个观察值，不能视为同一快照')
        events=events_by_keyword.get(row['id'],[])
        row['history']=sorted(events,key=lambda e:(e['createdAt'],e['id']))
        row['heads']=review_heads(events)
        row['metrics']=metric_summary(row['observations'],events)
        row['researchAssessment']=research_assessment(row['observations'],bybatch)
        human=[e for e in events if e['actorType']=='human' and e.get('kind')!='keyword_edit']
        chosen=human
        heads=review_heads(chosen,events)
        if len(heads)>1 or any(byreview[x].get('conflict') for x in heads):
            row['reviewState']='conflict'
            row['conflicts'].append('审核分支冲突：阅读各决定后再保存复核以合并全部当前分支')
        elif heads:
            e=byreview[heads[0]]
            row['reviewState']=e['state'];row['decision']=e['decision']
        ai=[e for e in events if e['actorType']=='ai' and e.get('kind')!='keyword_edit']
        aiheads=review_heads(ai,events)
        if aiheads:
            row['aiReview']={'state':'conflict' if len(aiheads)>1 else byreview[aiheads[0]]['state'],
                'decision':byreview[aiheads[0]]['decision'] if len(aiheads)==1 else 'unset','heads':aiheads}
        if events and not row['heads']:
            errors.append({'path':'data/reviews','error':f"review cycle for {row['id']}"})
        for e in events:
            for p in e['parents']:
                if p not in byreview or byreview[p]['keywordId']!=row['id']:
                    errors.append({'path':f"data/reviews/{e['id']}.json",'error':'missing or foreign review parent'})
            if any(b not in bybatch for b in e['basedOnBatches']):
                errors.append({'path':f"data/reviews/{e['id']}.json",'error':'missing evidence batch'})
            if not e['basedOnBatches'] or any(b not in row['batches'] for b in e['basedOnBatches']):
                errors.append({'path':f"data/reviews/{e['id']}.json",'error':'evidence batch does not contain this keyword'})
    for e in reviews:
        if e['keywordId'] not in pool: errors.append({'path':f"data/reviews/{e['id']}.json",'error':'unknown keyword'})
    seen=set()
    for o in observations:
        if o['id'] in seen:errors.append({'path':f"data/batches/{o['batchId']}/keywords.jsonl",'error':'duplicate observation id'})
        seen.add(o['id'])
    for site in sites:
        for mapping in site['keywordMappings']:
            kid=mapping['keywordId']
            if kid not in pool and mapping.get('poolLinked',True):
                errors.append({'path':f"data/sites/{site['id']}.json",'error':f'unknown keyword {kid}'})
            elif kid in pool: pool[kid]['sites'].append({'id':site['id'],'name':site['name'],'stage':site['stage'],'hasBlockers':bool(site['blockers']),**mapping})
    for row in pool.values():
        dates=[bybatch[b]['date'] for b in row['batches'] if bybatch[b]['date']!='unknown' and bybatch[b].get('kind','research')=='research']
        row['batchDate']=max(dates) if dates else None
        status='abandoned' if row['decision']=='abandon' else 'live' if any(s['stage']=='deployed' for s in row['sites']) else 'building' if row['decision']=='build' or any(s['stage'] in ['building','awaiting_release','blocked'] for s in row['sites']) else 'observing'
        edits=[e for e in row['history'] if e.get('kind')=='keyword_edit' and e['actorType']=='human' and 'keywordStatus' in e]
        heads=review_heads(edits,row['history'])
        row['statusOverride']=next((e['keywordStatus'] for e in edits if len(heads)==1 and e['id']==heads[0]),None)
        row['keywordStatus']=row['statusOverride'] or status
        if len(heads)>1:row['conflicts'].append('关键词状态修改存在并发分支，需重新保存合并')
    return {'keywords':sorted(pool.values(),key=lambda r:(r['term'],r['country'],r['language'])),
        'batches':batches,'sites':sites,'errors':errors,
        'counts':{'keywords':len(pool),'observations':len(observations),'batches':len(batches),'reviews':len(reviews),'sites':len(sites)},
        'plans':sorted([o['raw']['plan'] for o in observations if o.get('raw',{}).get('type')=='build-plan'],key=lambda p:p.get('rank',999)),
        'dataRevision':digest([batches,observations,reviews,sites,errors])}

def regenerate(root=ROOT):
    state=aggregate(root)
    atomic(root/'generated/hub.json',encoded(state))
    summary=['# GameHubs 站群索引','', '> 自动生成；维护 data/，运行 python3 scripts/hub.py generate。', '',
        f"关键词 {state['counts']['keywords']} · 观察记录 {state['counts']['observations']} · 批次 {state['counts']['batches']} · 站点 {state['counts']['sites']}",
        '', '| 站点 | 阶段 | 地址 | 唯一源码 | 阻塞 |','|---|---|---|---|---|']
    for s in state['sites']:
        source=s['source'];summary.append(f"| {s['name']} | {s['stage']} | {s['urls'].get('production') or s['urls'].get('preview') or '待定'} | {source['repository']} / {source['directory']} | {'；'.join(s['blockers']) or '未记录'} |")
    summary += ['',f"校验问题：{len(state['errors'])}。详细记录见 generated/hub.json；未知、历史记录与冲突不代表当前验收通过。",'']
    atomic(root/'INDEX.md','\n'.join(summary).encode('utf-8'))
    export_compatibility(root,state)
    return state

def export_compatibility(root,state):
    """Preserve old tool fields while maintaining sites in exactly one place."""
    directory=root/'data/migration'
    registry_path=directory/'source-repositories.json'
    matrix_path=directory/'source-matrix-sites.json'
    if not registry_path.exists() or not matrix_path.exists():return
    refs_path=directory/'registry-sources.json'
    refs=json.loads(refs_path.read_text(encoding='utf-8')) if refs_path.exists() else {}
    registry=json.loads((root/refs['repositories']).read_text(encoding='utf-8')) if refs.get('repositories') else json.loads(registry_path.read_text(encoding='utf-8'))
    matrix=json.loads(matrix_path.read_text(encoding='utf-8'))
    sites={s['id']:s for s in state['sites']}
    pool={r['id']:r for r in state['keywords']}
    def keyword_view(site):
        mappings=site['keywordMappings'];mapping=next((m for m in mappings if m['role']=='primary'),mappings[0] if mappings else {})
        row=pool.get(mapping.get('keywordId'))
        metrics=row['metrics'] if row else {**dict.fromkeys(['volume','kd','intitle','ratio']),**mapping.get('metrics',{})}
        if not row:metrics['ratio']=metrics['intitle']/metrics['volume'] if metrics['intitle'] is not None and metrics['volume'] else None
        return {'primaryKeyword':mapping.get('term'),'keywordId':mapping.get('keywordId'),
            'keywordMetrics':metrics,'keywordMetricsSource':'keyword_pool' if row else 'site_mapping',
            'keywordBatchDate':row['batchDate'] if row else None,'createdAt':site.get('createdAt')}
    note={'generatedFrom':'data/sites/*.json + data/batches/* + data/reviews/*.json','command':'python3 scripts/hub.py generate',
          'note':'兼容视图，勿手填。源码/阶段来自站点记录，已关联主词的指标及批次来自同一关键词池。'}
    for group in ['games','plannedGames']:
        entries={r['siteId']:r for r in registry.get(group,[])}
        for sid,site in sites.items():
            if site.get('legacyGroup','plannedGames')!=group:continue
            entry=entries.setdefault(sid,{'siteId':sid})
            entry.update(repo=site['source']['repository'],rootDirectory=site['source']['directory'])
            entry.update(keyword_view(site))
            entry['sourceBranch']=site['source']['branch']
            if site['source']['frozenSnapshots']:
                entry['frozenSnapshot']=site['source']['frozenSnapshots'][0]
            else:
                entry.pop('frozenSnapshot',None)
            if site['source'].get('archivedSnapshots'):
                entry['archivedSnapshots']=site['source']['archivedSnapshots']
                entry.pop('legacyPath',None)
                entry['legacyState']='removed-from-management-checkout; available-in-git-history'
            entry['managementStage']=site['stage'];entry['managementRecord']='data/sites/'+sid+'.json'
            # Device paths remain historical source metadata, never the development identity.
            if 'localPath' in entry:
                entry['historicalLocalPath']=entry['localPath']
                entry['localPathScope']='recorded-source-device-only; not a portable source identity'
            if site.get('development'):
                development=site['development']
                entry['developmentState']=development.get('state',entry.get('developmentState'))
                entry['verifiedHead']=development.get('recordedHead',entry.get('verifiedHead'))
                entry['verifiedAt']=development.get('pushRecordedAt',entry.get('verifiedAt'))
                entry['localWorktreeState']='clean-pushed' if development.get('implementationPushed') else 'uncommitted-implementation'
                if development.get('optimizationValidation'):entry['optimizationValidation']=development['optimizationValidation']
                migration=development.get('deploymentMigration')
                if migration:
                    entry['migrationState']='independent-repository-verified'
                    entry.setdefault('vercel',{}).update(migration['vercel'])
                    entry['migrationEvidence']=migration['evidencePath']
                latest=development.get('vercelRelease')
                if latest:
                    vercel=dict(entry.get('vercel') or {})
                    vercel.update(projectId=latest['projectId'],projectName=latest['projectName'],
                        productionBranch=latest.get('branch',site['source']['branch']),
                        productionDeployment={'id':latest['deploymentId'],'readyState':latest['state'],
                            'url':latest.get('deploymentUrl') or site['urls']['production']},
                        productionUrl=site['urls']['production'],sourceCommit=latest.get('sourceCommit'))
                    entry['vercel']=vercel
                    entry['releaseState']=site['release']['deployment']
                if development.get('webAnalytics'):entry['webAnalytics']=development['webAnalytics']
                if development.get('domainConfiguration'):entry['domainConfiguration']=development['domainConfiguration']
        registry[group]=list(entries.values())
    if any(s.get('development',{}).get('deploymentMigration') for s in sites.values()):
        if all(s['source']['directory']=='.' for s in sites.values() if s.get('legacyGroup')=='games'):
            registry['phase']='all-game-sources-independent'
        registry['updatedAt']=max(s.get('verification',{}).get('recheckedAt') or '' for s in sites.values())
    for entry in matrix['sites']:
        site=sites.get(entry['siteId'])
        if not site:continue
        # Paths belong to each canonical repository, never this management checkout.
        entry.update(repo=site['source']['repository'],path=site['source']['directory'],pathScope='relative-to-canonical-repository',
            url=site['urls']['production'] or site['urls']['preview'] or entry.get('url'),nextDecision=site['nextAction'])
        entry['canonicalSource']=site['source']
        entry.update(keyword_view(site))
        entry.update({k:entry['keywordMetrics'][k] for k in ['volume','kd','intitle','ratio']})
        entry['managementStage']=site['stage'];entry['managementRecord']='data/sites/'+site['id']+'.json'
        entry['keywordPages']=[{'path':m['page'],'primaryKeyword':m['term'],'country':m['country'],'language':m['language']} for m in site['keywordMappings']]
    registry['_management']=note;matrix['_management']=note
    atomic(root/'data/repositories.json',encoded(registry));atomic(root/'data/matrix-sites.json',encoded(matrix))

def import_batch(root, batch, rows):
    if checked(batch,'batch'): raise ValueError('; '.join(checked(batch,'batch')))
    if not re.fullmatch(r'[a-zA-Z0-9_-]+',batch['id']): raise ValueError('invalid batch id')
    accepted=[];rejected=[]
    for number,raw in enumerate(rows,1):
        try:
            obj=json.loads(raw) if isinstance(raw,str) else dict(raw)
            obj['batchId']=batch['id']
            obj.setdefault('country',batch['market']['country'])
            obj.setdefault('language',batch['market']['language'])
            obj['keywordId']=keyword_id(obj['term'],obj['country'],obj['language'])
            obj.setdefault('id','obs-'+digest([batch['id'],number,obj])[:20])
            obj.setdefault('qualification','unknown');obj.setdefault('metrics',{});obj.setdefault('evidence',[])
            issues=checked(obj,'keyword')
            if issues: raise ValueError('; '.join(issues))
            accepted.append(obj)
        except (ValueError,KeyError,TypeError) as e:
            rejected.append({'line':number,'raw':raw,'error':str(e)})
    batch=dict(batch,acceptedRowCount=len(accepted),rejectedRowCount=len(rejected))
    payload={'batch.json':encoded(batch),'keywords.jsonl':b''.join((json.dumps(o,ensure_ascii=False,sort_keys=True)+'\n').encode('utf-8') for o in accepted)}
    if rejected: payload['errors.jsonl']=b''.join((json.dumps(o,ensure_ascii=False)+'\n').encode('utf-8') for o in rejected)
    with write_lock(root):
        destination=root/'data/batches'/batch['id']
        if destination.exists():
            if all((destination/k).is_file() and (destination/k).read_bytes()==v for k,v in payload.items()):
                return {'status':'unchanged','accepted':len(accepted),'rejected':len(rejected)}
            raise ValueError('批次 ID 已存在且内容不同：保留原批次，请使用新 ID（建议设备名与 UUID）')
        temp=destination.with_name('.'+destination.name+'-'+uuid.uuid4().hex)
        temp.mkdir(parents=True)
        try:
            for name,data in payload.items(): (temp/name).write_bytes(data)
            destination.parent.mkdir(parents=True,exist_ok=True)
            temp.rename(destination)
        finally:
            if temp.exists(): shutil_remove_empty_batch(temp)
    return {'status':'imported','accepted':len(accepted),'rejected':len(rejected)}

def shutil_remove_empty_batch(path):
    import shutil
    shutil.rmtree(path)

def save_reviews(root, payload):
    if payload.get('actorType','human') not in ['human','ai']: raise ValueError('invalid actorType')
    if not isinstance(payload.get('items'),list) or not 1<=len(payload['items'])<=1000: raise ValueError('select 1–1000 keywords')
    for key in ['reason','actor']:
        if not isinstance(payload.get(key),str) or not payload[key].strip(): raise ValueError(key+' is required')
    if payload.get('state') not in ['approved','rejected','hold'] or payload.get('decision') not in DECISIONS: raise ValueError('invalid review state/decision')
    with write_lock(root):
        state=aggregate(root);lookup={r['id']:r for r in state['keywords']};pending=[]
        if len({i.get('keywordId') for i in payload['items']})!=len(payload['items']):raise ValueError('duplicate keyword in request')
        for item in payload['items']:
            row=lookup.get(item.get('keywordId'))
            if not row: raise ValueError('unknown keyword')
            expected=item.get('expectedHeads')
            if not isinstance(expected,list) or any(p not in [e['id'] for e in row['history']] for p in expected): raise ValueError('invalid expectedHeads')
            evidence=item.get('basedOnBatches',row['batches'])
            if not evidence or any(b not in row['batches'] for b in evidence): raise ValueError('invalid evidence batches')
            e={'id':'rev-'+uuid.uuid4().hex,'keywordId':row['id'],'actorType':payload.get('actorType','human'),
                'schemaVersion':1,'actor':payload['actor'].strip(),'state':payload['state'],'decision':payload['decision'],
                'reason':payload['reason'].strip(),'createdAt':now(),'parents':sorted(set(expected)),
                'basedOnBatches':sorted(set(evidence)), 'conflict':sorted(expected)!=row['heads']}
            issues=checked(e,'review')
            if issues: raise ValueError('; '.join(issues))
            pending.append(e)
        for e in pending: atomic(root/f"data/reviews/{e['id']}.json",encoded(e))
        regenerate(root)
    return {'saved':len(pending),'conflicts':[e['keywordId'] for e in pending if e['conflict']], 'ids':[e['id'] for e in pending]}

def save_keyword(root,payload):
    for key in ['actor','reason']:
        if not isinstance(payload.get(key),str) or not payload[key].strip():raise ValueError(key+' is required')
    if payload.get('actorType','human')!='human':raise ValueError('手动编辑仅接受 human；AI 建议请使用审核接口')
    metrics=payload.get('metrics',{})
    check_metrics(metrics)
    if 'keywordStatus' in payload and payload['keywordStatus'] not in KEYWORD_STATUSES+[None]:raise ValueError('invalid keyword status')
    if not metrics and 'keywordStatus' not in payload:raise ValueError('没有要保存的修改')
    with write_lock(root):
        row=next((r for r in aggregate(root)['keywords'] if r['id']==payload.get('keywordId')),None)
        if not row:raise ValueError('unknown keyword')
        if payload.get('expectedHeads')!=row['heads']:
            return {'conflict':True,'message':'关键词已被修改，请刷新后重试；本次未覆盖'}
        evidence=payload.get('basedOnBatches')
        if not isinstance(evidence,list) or not evidence or any(b not in row['batches'] for b in evidence):raise ValueError('invalid evidence batches')
        event={'schemaVersion':1,'id':'rev-'+uuid.uuid4().hex,'keywordId':row['id'],
            'kind':'keyword_edit','actorType':'human','actor':payload['actor'].strip(),
            'state':'hold','decision':'unset','reason':payload['reason'].strip(),
            'createdAt':now(),'parents':row['heads'],'basedOnBatches':sorted(set(evidence)),
            'conflict':False,'metrics':metrics}
        if 'keywordStatus' in payload:event['keywordStatus']=payload['keywordStatus']
        issues=checked(event,'review')
        if issues:raise ValueError('; '.join(issues))
        atomic(root/f"data/reviews/{event['id']}.json",encoded(event));regenerate(root)
    return {'saved':event['id']}

def save_site(root,payload):
    site=payload.get('site')
    issues=checked(site,'site')
    if issues: raise ValueError('; '.join(issues))
    if not re.fullmatch('[a-z0-9-]+',site['id']):raise ValueError('invalid site id')
    with write_lock(root):
        path=root/f"data/sites/{site['id']}.json"
        current=json.loads(path.read_text(encoding='utf-8')) if path.exists() else None
        if payload.get('expectedRevision')!=(digest(current) if current else None):
            return {'conflict':True,'message':'站点已由另一会话修改，请重新读取；本次内容未覆盖','current':current}
        state=aggregate(root);kids={r['id'] for r in state['keywords']}
        if any(m['keywordId'] not in kids and m.get('poolLinked',True) for m in site['keywordMappings']):raise ValueError('unknown keyword mapping')
        if current and site['source'] != current['source']:
            # A source migration must retain its prior identity in the revision history.
            site.setdefault('notes',[]).append('源码入口发生变更；旧入口保留在修订历史，核实范围以 verification 和来源证据为准。')
        site['history']=(current or {}).get('history',[])+[{'at':now(),'actor':payload.get('actor','local-owner'),'previousRevision':digest(current) if current else None,'previous':{k:v for k,v in (current or {}).items() if k!='history'}}]
        atomic(path,encoded(site));regenerate(root)
    return {'saved':site['id']}

def csv_export(rows):
    stream=io.StringIO(newline='');writer=csv.writer(stream)
    writer.writerow(['关键词','国家','语言','研究资格','人工审核','建站决定','站点/页面','批次','研究冲突','历史观察(JSON)','Volume','KD','intitle数','KGR','allintitle数','allintitle KGR（对照）','KGR口径','关键词状态','研究分级','确定性','分级批次'])
    def safe(value):
        text=str(value)
        return "'"+text if text.lstrip().startswith(('=','+','-','@','\t','\r')) else text
    for r in rows:
        writer.writerow([safe(x) for x in [r['term'],r['country'],r['language'],r['qualification'],r['reviewState'],r['decision'],
            '; '.join(s['id']+s['page'] for s in r['sites']),'; '.join(r['batches']),'; '.join(r['conflicts']),json.dumps(r['observations'],ensure_ascii=False),
            *[r['metrics'].get(k) if r['metrics'].get(k) is not None else '' for k in ['volume','kd','intitle','ratio','allintitle','kgr']],
            'intitle_exact_phrase' if r['metrics'].get('intitle') is not None else '',r['keywordStatus'],
            (r.get('researchAssessment') or {}).get('tier',''),(r.get('researchAssessment') or {}).get('certainty',''),
            (r.get('researchAssessment') or {}).get('batchId','')]])
    return b'\xef\xbb\xbf'+stream.getvalue().encode('utf-8')

def serve(root,port):
    token=secrets.token_urlsafe(32)
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,format,*args): pass
        def reply(self,status,data,kind='application/json; charset=utf-8',headers=None):
            self.send_response(status);self.send_header('Content-Type',kind)
            self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff')
            self.send_header('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'")
            for key,val in (headers or {}).items():self.send_header(key,val)
            self.end_headers();self.wfile.write(data if isinstance(data,bytes) else encoded(data))
        def host_ok(self):return self.headers.get('Host') in [f'127.0.0.1:{self.server.server_port}',f'localhost:{self.server.server_port}']
        def do_GET(self):
            if not self.host_ok():return self.reply(403,{'error':'invalid host'})
            parsed=urlparse(self.path);path=parsed.path
            if path=='/api/state':
                state=aggregate(root)
                for s in state['sites']: s['_revision']=digest({k:v for k,v in s.items() if k!='_revision'})
                return self.reply(200,{**state,'token':token})
            if path=='/api/export.csv':
                ids=parse_qs(parsed.query).get('id',[])
                rows=[r for r in aggregate(root)['keywords'] if not ids or r['id'] in ids]
                return self.reply(200,csv_export(rows),'text/csv; charset=utf-8',{'Content-Disposition':'attachment; filename="gamehubs-keywords.csv"'})
            if path=='/api/evidence':
                rel=parse_qs(parsed.query).get('path',[''])[0].split('#')[0]
                target=(root/rel.removeprefix('management/')).resolve() if rel.startswith('management/') else (REPO/rel).resolve()
                allowed=[REPO/'research',REPO/'deployments',REPO/'docs',root/'data/batches',root/'data/migration']
                if not any(target.is_relative_to(p.resolve()) for p in allowed) or not target.is_file() or target.suffix.lower() not in ['.md','.json','.jsonl','.txt','.html']:
                    return self.reply(404,{'error':'evidence unavailable; see original file'})
                if target.stat().st_size>2_000_000:return self.reply(413,{'error':'file too large; open original locally'})
                return self.reply(200,target.read_bytes(),'text/plain; charset=utf-8')
            files={'/':'index.html','/app.js':'app.js','/style.css':'style.css'}
            if path in files:
                file=root/'dashboard'/files[path]
                kind='text/html; charset=utf-8' if path=='/' else 'text/javascript; charset=utf-8' if path.endswith('.js') else 'text/css; charset=utf-8'
                return self.reply(200,file.read_bytes(),kind)
            return self.reply(404,{'error':'not found'})
        def do_POST(self):
            if not self.host_ok() or self.headers.get('X-Hub-Token')!=token:return self.reply(403,{'error':'invalid session token'})
            origin=self.headers.get('Origin')
            if origin and origin not in [f'http://127.0.0.1:{self.server.server_port}',f'http://localhost:{self.server.server_port}']:return self.reply(403,{'error':'invalid origin'})
            try:
                length=int(self.headers.get('Content-Length','0'))
                if not 0<length<=2_000_000:raise ValueError('invalid body size')
                payload=json.loads(self.rfile.read(length))
                if not isinstance(payload,dict):raise ValueError('body must be a JSON object')
                if self.path=='/api/export':
                    ids=payload.get('ids')
                    if not isinstance(ids,list) or any(not isinstance(i,str) for i in ids):raise ValueError('invalid export IDs')
                    ids=set(ids)
                    return self.reply(200,csv_export([r for r in aggregate(root)['keywords'] if r['id'] in ids]),'text/csv; charset=utf-8',{'Content-Disposition':'attachment; filename="gamehubs-keywords.csv"'})
                if self.path=='/api/reviews': result=save_reviews(root,payload)
                elif self.path=='/api/keywords':result=save_keyword(root,payload)
                elif self.path=='/api/sites':result=save_site(root,payload)
                else:return self.reply(404,{'error':'not found'})
                return self.reply(409 if result.get('conflict') else 200,result)
            except (ValueError,KeyError,TypeError) as e:return self.reply(400,{'error':str(e)})
            except OSError as e:return self.reply(500,{'error':str(e)})
    server=ThreadingHTTPServer(('127.0.0.1',port),Handler)
    print(f'GameHubs 本地管理页 http://127.0.0.1:{server.server_port}/',flush=True)
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root',type=Path,default=ROOT,help='data root; useful for isolated tests')
    sub=parser.add_subparsers(dest='command',required=True)
    sub.add_parser('generate');sub.add_parser('validate')
    query=sub.add_parser('query');query.add_argument('text');query.add_argument('--kind',choices=['keyword','site'],default='keyword')
    run=sub.add_parser('serve');run.add_argument('--port',type=int,default=4310)
    ingest=sub.add_parser('import');ingest.add_argument('batch',type=Path);ingest.add_argument('keywords',type=Path)
    review=sub.add_parser('review');review.add_argument('payload',type=Path)
    site=sub.add_parser('site');site.add_argument('payload',type=Path)
    export=sub.add_parser('export');export.add_argument('output',type=Path)
    args=parser.parse_args();root=args.root.resolve()
    try:
        if args.command=='serve':return serve(root,args.port)
        if args.command=='import':
            print(json.dumps(import_batch(root,json.loads(args.batch.read_text(encoding='utf-8')),args.keywords.read_text(encoding='utf-8').splitlines()),ensure_ascii=False));regenerate(root);return
        if args.command=='review':print(json.dumps(save_reviews(root,json.loads(args.payload.read_text(encoding='utf-8'))),ensure_ascii=False));return
        if args.command=='site':print(json.dumps(save_site(root,json.loads(args.payload.read_text(encoding='utf-8'))),ensure_ascii=False));return
        state=regenerate(root) if args.command=='generate' else aggregate(root)
        if args.command=='query':
            rows=state['keywords' if args.kind=='keyword' else 'sites']
            print(json.dumps([r for r in rows if args.text.casefold() in json.dumps(r,ensure_ascii=False).casefold()],ensure_ascii=False,indent=2))
        elif args.command=='export':atomic(args.output,csv_export(state['keywords']));print(args.output)
        else:
            print(json.dumps({'counts':state['counts'],'errors':state['errors']},ensure_ascii=False,indent=2))
            if args.command=='validate' and state['errors']:return 1
    except (ValueError,OSError) as e:
        print(str(e),file=sys.stderr);return 1
    return 0

if __name__=='__main__':sys.exit(main())
