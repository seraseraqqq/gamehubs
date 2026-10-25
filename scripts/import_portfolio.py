#!/usr/bin/env python3
"""Import the fetched 117-term research and planning records. No network calls."""
import json
from pathlib import Path
from hub import ROOT, REPO, atomic, encoded, digest, keyword_id, import_batch, regenerate, checked, write_lock

RESEARCH='research/2026-10-24-keyword-opportunities/keyword-ledger.json'
PLAN='research/2026-10-24-game-build-plan/plan.json'
DISPOSITIONS='research/2026-10-24-game-build-plan/dispositions.json'

def load(path):return json.loads((REPO/path).read_text(encoding='utf-8'))

def ingest(root,key,label,kind,rows,sources,notes,date='2026-10-24'):
    bid=date+'-'+key+'-'+digest([rows,sources])[:12]
    batch={'schemaVersion':1,'id':bid,'label':label,'kind':kind,'date':date,'device':'unknown-other-device',
        'market':{'country':'US','language':'en'},'status':'historical','seeds':[r['term'] for r in rows],
        'competitors':[],'sources':[{'path':s,'note':'从已拉取的远端资料导入，原文与完整证据保留原位'} for s in sources],'notes':notes}
    return {'id':bid,**import_batch(root,batch,rows)}

def obs(term,path,raw,qualification='unknown',metrics=None,cluster=None):
    result={'schemaVersion':1,'term':term,'country':'US','language':'en','qualification':qualification,'metrics':metrics or {},
        'evidence':[{'path':path,'note':'历史来源，导入不代表新的研究或线上验收'}],'raw':raw,'notes':[]}
    if cluster:result['clusterId']=cluster
    return result

def migrate(root=ROOT):
    ledger=load(RESEARCH);plan=load(PLAN);dispositions=load(DISPOSITIONS)
    metadata=root/'data/migration/registry-sources.json'
    refs=json.loads(metadata.read_text(encoding='utf-8')) if metadata.exists() else {'repositories':'data/migration/source-repositories.json'}
    registry_ref=refs['repositories']
    registry=json.loads((root/registry_ref).read_text(encoding='utf-8'))
    matrix=json.loads((root/'data/migration/source-matrix-sites.json').read_text(encoding='utf-8'))
    terms={r['keyword'] for r in ledger['keywords']}
    rows=[]
    for r in ledger['keywords']:
        verdict=r['verdict']
        qualification='rejected' if verdict.startswith(('排除','不作游戏主词')) else 'qualified' if verdict=='优先验证/小试假设' else 'needs_review'
        row=obs(r['keyword'],RESEARCH,{'type':'research','record':r,'strictMetricMatch':r['volume'] is not None and r['kd'] is not None and r['volume']>10000 and r['kd']<30},qualification,
            {'semrush_mirror':{'volume':r['volume'],'kd':r['kd'],'observedAt':r['observedAt'],'source':r['source']}},r['cluster'])
        row['observedAt']=r['observedAt']
        row['evidence'].append({'path':'research/2026-10-24-keyword-opportunities/'+r['metricFile'],'note':'指标页面原始快照；镜像估值，非官方实时数据'})
        for key in ['trends','serp']:
            if r.get(key):row['evidence'].append({'path':'research/2026-10-24-keyword-opportunities/'+r[key]['file'],'note':key+' 原始证据'})
        rows.append(row)
    imports=[ingest(root,'keyword-research','117词 · 美国英文研究','research',rows,[RESEARCH],
        ['保留全部117词：包括排除、暂缓、同意图变体和缺项。','研究资格“合格”表示原报告的优先验证/小试假设，仍未获人工立项批准。','17个严格指标达标另行标记，不等于17个批准项目。','历史执行设备未明确记载；没有运行新的搜索或付费API。'])]
    imports.append(ingest(root,'build-plan','11项 · 建站方案队列','build_plan',
        [obs(s['seo']['primary'],PLAN,{'type':'build-plan','plan':s}) for s in plan['sites']], [PLAN],['原计划为历史方案；当前建设进度以站点登记为准。']))
    imports.append(ingest(root,'dispositions','106词 · 其余候选处置','dispositions',
        [obs(r['keyword'],DISPOSITIONS,{'type':'disposition','record':r}) for r in dispositions],[DISPOSITIONS],['保留其余106个词的处置，不丢弃未立项/暂缓项。']))
    project_date=max((r.get('optimizationValidation',{}).get('date','2026-10-24') for r in registry['plannedGames']),default='2026-10-24')
    imports.append(ingest(root,'project-registry','5项目 · 源码版本与验收登记','project_registry',
        [obs(r['siteId'],registry_ref,{'type':'project-registry','record':r}) for r in registry['plannedGames']],
        [registry_ref,'docs/NEW_GAME_PROJECTS.md'],['源码推送、实体设备/玩家验收和实际部署分别记录；历史状态不覆盖人工决定。'],project_date))
    records=[];old={s['siteId']:s for s in matrix['sites']};plans={s['slug']:s for s in plan['sites']}
    for group in ['games','plannedGames']:
        for r in registry.get(group,[]):
            sid=r['siteId'];s=old.get(sid,{});p=plans.get(sid,{});planned=group=='plannedGames'
            market={'country':'US','language':'en'} if planned else s.get('targetMarket') or {'country':'unknown','language':'unknown'}
            country=market['country'];language=market['language']
            pairs=[]
            if planned:
                pairs=[(p.get('seo',{}).get('primary',sid),'/','primary')]+[(k,'/','secondary') for k in p.get('seo',{}).get('variants',[])]
            else:
                pages=s.get('keywordPages') or [{'path':'/','primaryKeyword':s.get('primaryKeyword',sid.replace('-',' '))}]
                pairs=[(page['primaryKeyword'],page['path'],'primary') for page in pages]+[(k,'/','secondary') for k in s.get('secondaryKeywords',[])]
            mappings=[]
            for term,page,role in pairs:
                mapping={'keywordId':keyword_id(term,country,language),'term':term,'country':country,'language':language,'page':page,'role':role,
                    'poolLinked':term in terms and country=='US' and language=='en'}
                if mapping not in mappings:mappings.append(mapping)
            audit=s.get('deploymentAudit',{});deployed=audit.get('vercelDeployed') is True
            blockers=[]
            pushed=r.get('localWorktreeState')=='clean-pushed'
            if planned:blockers=['实体设备/玩家/生产性能仍待验收'+('；源码推送已记录' if pushed else '；实现尚未推送'),'域名未购买，未建立Vercel项目、未部署']
            if sid=='acceleration-city':blockers=['等待嵌入许可；用户暂缓发布']
            if sid=='cluster-rush':blockers=['等待嵌入许可与域名决定']
            if sid=='snow-rider-3d-unblocked':blockers=['正式域名实际游玩验收前保持noindex']
            if sid in ['coreball','minute-cryptic-unlimited']:blockers=['等待独立域名，保留noindex']
            # The registry's current URL includes later domain updates; audit URLs may be older.
            public=s.get('url') or audit.get('publicURL');production=public if deployed else None;preview=None
            if public and '.vercel.app' in public and not s.get('domain'):preview=public;production=None
            # Do not copy another device's localhost preview into this machine's usable URL.
            name=r.get('displayName') or s.get('brandName') or s.get('primaryKeyword',sid.replace('-',' ')).title()
            notes=['以最新远端登记为来源，本次没有重新验收远程代码或线上可玩性。']
            if s.get('url') and audit.get('publicURL') and s['url']!=audit['publicURL']:
                notes.append('当前登记地址 '+s['url']+'；旧核验快照地址 '+audit['publicURL']+'。保留时间差，当前地址以最新matrix.url为准，本次未重新线上核实。')
            if r.get('localPath'):notes.append('原设备工作路径保留在来源快照，不能当作本机可用路径。')
            if r.get('localPreview'):notes.append('原设备预览地址 '+r['localPreview']+' 不代表本机已有该服务。')
            for field,a,b in [('sourceRepository',s.get('repo'),r['repo']),('sourceDirectory',s.get('path'),r['rootDirectory'])]:
                if a and a!=b:notes.append(f'历史差异 {field}: matrix={a}; registry={b}；源码入口采用最新仓库登记。')
            site={'schemaVersion':1,'id':sid,'name':name,'legacyGroup':group,
                'source':{'repository':r['repo'],'directory':r['rootDirectory'],'branch':r.get('defaultBranch','main'),
                    'frozenSnapshots':[r['legacyPath']] if r.get('legacyState')=='frozen-migration-snapshot' else []},
                'stage':'awaiting_release' if planned else 'deployed' if deployed else 'blocked' if blockers else 'planned',
                'blockers':blockers,'nextAction':'补实体设备、跨浏览器与玩家验收；之后按用户授权处理源码审查和发布门槛。' if planned else s.get('nextDecision') or '依据当前发布记录复核下一步，保留既有门禁。',
                'urls':{'production':production,'preview':preview},'keywordMappings':mappings,
                'release':{'deployment':'recorded_deployed' if deployed else 'not_deployed',
                    'gameplayAcceptance':'pending' if planned or sid=='snow-rider-3d-unblocked' else 'unknown',
                    'indexingPermission':'hold' if planned or sid in ['coreball','minute-cryptic-unlimited','snow-rider-3d-unblocked','cluster-rush','acceleration-city'] else 'unknown'},
                'verification':{'recordedAt':r.get('verifiedAt') if planned else audit.get('checkedAt'),'recheckedAt':None,'scope':'历史记录导入；未进行本次实时核验。'},
                'sources':[{'path':registry_ref+'#'+sid,'note':'最新远端原始仓库登记快照'},
                    {'path':'docs/NEW_GAME_PROJECTS.md' if planned else 'docs/DEPLOYMENT_STATUS.md','note':'最新远端项目/发布记录'}],
                'notes':notes,'history':[]}
            if planned:site['development']={'state':r['developmentState'],'implementationPushed':pushed,'recordedHead':r.get('verifiedHead'),'pushRecordedAt':r.get('verifiedAt'),'optimizationValidation':r.get('optimizationValidation'),'localValidation':r.get('localValidation'), 'evidence':'research/2026-10-24-five-game-development/STATUS.md'}
            issues=checked(site,'site')
            if issues:raise ValueError('; '.join(issues))
            records.append(site)
    with write_lock(root):
        for site in records:
            path=root/f"data/sites/{site['id']}.json"
            if not path.exists():atomic(path,encoded(site))
    state=regenerate(root)
    report={'sourceCommit':refs.get('sourceCommit','62defcb9cd1f179dfdc0d830cd5c12f7112ec388'),'counts':state['counts'],
        'sourceResearch':{'keywords':117,'clusters':99,'strictMetricMatches':17},'constructionPlans':len(state['plans']),
        'dispositions':len(dispositions),'existingSites':12,'newProjects':5,'imports':imports,
        'oldLocalData':'原本17批/191观察/122身份未混入主池，完整保存在工作区外的可恢复备份。',
        'errors':state['errors']}
    atomic(root/'generated/import-report.json',encoded(report));return report

if __name__=='__main__':print(json.dumps(migrate(),ensure_ascii=False,indent=2))
