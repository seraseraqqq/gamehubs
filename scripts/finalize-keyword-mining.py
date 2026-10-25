"""Build an evidence-backed mining batch; --import writes through the hub importer.

Only consumes saved evidence, never queries services or treats missing data as zero.
2026-10-25: user KGR basis is exact-phrase intitle / US monthly volume.
"""
import argparse
import json
import re
from pathlib import Path
import statistics
import hub


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def trend_summary(record):
    tables=record.get('tables',[])
    series=next((t for t in tables if len(t)>=25 and t[0][0]=='x'),None)
    if record.get('status')!='observed' or not record.get('queryVerified') or not series:return {}
    result={}
    for column,term in enumerate(record['terms'],1):
        if term=='gpts':continue
        try:values=[float(r[column].replace('<1','0.5')) for r in series[1:-1]]
        except (ValueError,IndexError):continue
        if len(values)<24:continue
        a,b,c,d=(statistics.mean(v) for v in (values[-8:],values[-16:-8],values[-4:],values[-8:-4]))
        last=values[-12:];xm=5.5;ym=statistics.mean(last)
        slope=sum((i-xm)*(v-ym) for i,v in enumerate(last))/sum((i-xm)**2 for i in range(12))
        low=a<2 or max(values)<=6
        r8=a/b if b else None;r4=c/d if d else None
        if low:status='low_resolution';passed=None
        elif (r8 is not None and r8>=1.15 or b==0 and a>0) and slope>0 and (r4 is not None and r4>=1.05 or d==0 and c>0):status='rising';passed=True
        elif r8 is not None and r8<0.85 and slope<0 and c<=d:status='declining';passed=False
        elif r8 is not None and r8<=1.05 and slope<=0 and c<=d:status='flat_or_declining';passed=False
        elif slope>0 and r8 is not None and r8>1.15:status='rising_with_recent_pullback';passed=None
        else:status='mixed_or_flat';passed=None
        result[term]={'status':status,'passesRisingGate':passed,'completeWeeks':len(values),'last8':a,'prior8':b,'last4':c,'prior4':d,'first8':statistics.mean(values[:8]),'ratio8':r8,'ratio4':r4,'slope12':slope,'lowResolution':low,'series':values,'observedAt':record['observedAt']}
    return result


def build(root,out,bases=None):
    candidates=read(out/'candidates.json');batch_id=out.name;relative=out.relative_to(root).as_posix()
    context=read(out/'assessment-context.json') if (out/'assessment-context.json').exists() else {}
    folders=[*(bases or []),out]
    def files(pattern):return [f for folder in folders for f in sorted((folder/'raw').glob(pattern))]
    trend={};attempts={};metrics={};titles={};alltitles={};google_attempts={}
    for file in files('trends-*-ready.json'):
        record=read(file)
        for term in record.get('terms',[]):
            if term!='gpts':attempts[term]={'path':file.relative_to(root).as_posix(),'status':record.get('status')}
        for term,value in trend_summary(record).items():trend[term]={**value,'path':file.relative_to(root).as_posix()}
    for file in files('semrush-*.json'):
        record=read(file)
        if not record.get('rows'):continue
        header=record['rows'][0]
        if not all(key in header for key in ['Keyword','Volume','KD %','Updated']):continue
        for row in record['rows'][1:]:
            term=row[header.index('Keyword')]
            def number(column):
                value=row[header.index(column)].strip().replace(',','')
                return int(value) if value.isdigit() else None
            value={'volume':number('Volume'),'kd':number('KD %'),'updated':row[header.index('Updated')],'observedAt':record['observedAt'],'path':file.relative_to(root).as_posix()}
            old=metrics.get(term)
            if not old or value['volume'] is not None and value['kd'] is not None or not(old['volume'] is not None and old['kd'] is not None):metrics[term]=value
    serps={}
    for file in files('google-*.json'):
        record=read(file);term=record.get('term')
        if not term:continue
        google_attempts.setdefault(term,[]).append({'path':file.relative_to(root).as_posix(),'status':record.get('status'),'mode':record.get('mode')})
        if record.get('status')!='observed' or not record.get('queryVerified'):continue
        if record.get('mode')=='serp':serps[term]={**record,'path':file.relative_to(root).as_posix()}
        for key,target in [('intitle',titles),('allintitle',alltitles)]:
            ignored=record.get('operatorIgnored') or re.search(r'Missing:\s*'+re.escape(key)+':',record.get('searchText') or '',re.I)
            if record.get(key) is not None and not ignored:
                target[term]={'count':record[key],'query':record['query'],'queryMode':record.get('queryMode'),'observedAt':record['observedAt'],'path':file.relative_to(root).as_posix()}
    assessments=read(out/'serp-assessments.json') if (out/'serp-assessments.json').exists() else {}
    criteria={'country':'US','language':'en','volumeMinExclusive':3000,'kdMaxInclusive':30,'kgrMaxInclusive':0.25,'kgrBasis':'intitle_exact_phrase','risingTrendsRequired':True,'reasonableGoogleSerpRequired':True,'bestTier':{'volumeMinExclusive':10000,'kdMaxExclusive':20,'kgrMaxExclusive':0.2},'otherTiers':{'A':'All gates pass; volume >10000, KD<=25, KGR<=0.25, or volume>=5000/KD<20/KGR<0.2','B':'All gates pass; remaining numeric pass with clear rising trend and a feasible SERP opening','C':'All gates pass but seasonal/mixed-intent or strong-competitor caveats require a smaller validation experiment'},'trendHeuristic':'Exclude final week; recent8/prior8>=1.15, positive last12 slope, recent4/prior4>=1.05; low resolution and pullbacks remain pending. Not an official Google threshold.'}
    rows=[];summaries=[]
    for c in candidates:
        term=c['term'];m=metrics.get(term,{});tr=trend.get(term);ti=titles.get(term);at=alltitles.get(term);serp=serps.get(term);assessment=assessments.get(term,{})
        v=m.get('volume');kd=m.get('kd');kgr=ti['count']/v if ti and v else None
        reasons=[];failures=[];missing=[];evidence=[{'path':relative+'/candidates.json','note':'公开平台/原作来源、发现线索和版本风险；不代表Trends已验证'}]
        providers={}
        if m:
            providers['semrush_mirror']={k:m[k] for k in ['volume','kd','updated','observedAt']};providers['semrush_mirror'].update(database='us',officiallyVerified=False)
            evidence.append({'path':m['path'],'note':'US免费镜像实际显示估值；非官方独立核验'})
        if v is None:missing.append('Volume')
        elif v<=3000:failures.append('Volume '+str(v)+'，未超过3000')
        if kd is None:missing.append('KD')
        elif kd>30:failures.append('KD '+str(kd)+'，超过30')
        if tr:
            evidence.append({'path':tr['path'],'note':'US过去12个月实际Trends表；最后一周保守排除；指数不折月量'})
            if tr['passesRisingGate'] is True:reasons.append('Trends近期8周和4周上升，12周斜率为正')
            elif tr['passesRisingGate'] is False:failures.append('Trends当前为'+tr['status']+'，未达到本轮上升要求')
            else:missing.append('明确上升趋势（'+tr['status']+'）')
        elif term in attempts:
            evidence.append({'path':attempts[term]['path'],'note':'趋势采集未取得可用时间序列，不当成零需求'});missing.append('Trends可用曲线')
        else:missing.append('Google Trends尚未采集')
        if ti:
            providers['google_intitle']={'intitle':ti['count'],'query':ti['query'],'queryMode':'quoted_phrase','estimated':True,'observedAt':ti['observedAt']}
            evidence.append({'path':ti['path'],'note':'真实Google Tools结果数；本轮主KGR的分子'})
            if kgr is not None and kgr>0.25:failures.append('KGR '+format(kgr,'.6g')+'，超过0.25（intitle精确短语口径）')
        else:missing.append('intitle/KGR')
        if at:
            providers['google_allintitle_comparison']={'allintitle':at['count'],'query':at['query'],'queryMode':at['queryMode'],'estimated':True,'observedAt':at['observedAt']}
            evidence.append({'path':at['path'],'note':'额外allintitle对照，绝不替代用户intitle/Volume门槛'})
        evidence.extend({'path':a['path'],'note':'Google查询尝试：'+str(a['status'])+'；异常结果不用于数值'} for a in google_attempts.get(term,[]) if a['status']!='observed')
        serp_pass=assessment.get('reasonable') if serp else None
        if serp:
            evidence.append({'path':serp['path'],'note':'真实Google普通搜索结果；实际可见数量'+str(len(serp.get('results',[])))})
        if assessment:
            evidence.append({'path':relative+'/serp-assessments.json','note':'按真实结果及逐页核对作出的AI竞争判断，独立于人工建设决定'})
            evidence.extend({'path':p,'note':'实际页面能力/版本核对'} for p in assessment.get('evidenceFiles',[]))
            reasons.extend(assessment.get('reasons',[]))
        if serp_pass is None:missing.append('普通Google SERP竞争与实际玩法入口验证')
        elif serp_pass is False:failures.append('SERP当前缺少可确认的合理切口')
        numeric_pass=v is not None and kd is not None and v>3000 and kd<=30
        if numeric_pass:reasons.insert(0,'已满足搜索量和KD门槛；仍须通过其余条件')
        reasons+=failures+['待补：'+x for x in missing]
        all_pass=not failures and numeric_pass and tr is not None and tr['passesRisingGate'] is True and kgr is not None and kgr<=0.25 and serp_pass is True
        tier='REJECT' if failures else 'PENDING'
        if all_pass:
            tier='S' if v>10000 and kd<20 and kgr<0.2 else 'A' if v>10000 and kd<=25 or v>=5000 and kd<20 and kgr<0.2 else 'B'
            if assessment.get('tierCap')=='C':tier='C'
        certainty='medium' if failures or all_pass else 'low' if numeric_pass or tr else 'unknown'
        if all_pass and assessment.get('certainty')=='high':certainty='high'
        availability={}
        for key,value in [('volume',v),('kd',kd)]:
            if value is None:availability[key]={'status':'unavailable','reason':'已查询免费Semrush US镜像，暂无缓存数值；现有额度内的刷新接口返回错误，不代表0。'}
        if ti is None:
            skipped='本轮已因搜索量/KD未过线，未继续标题采集。' if v is not None and kd is not None and not numeric_pass else 'Volume/KD尚无可确认数值，未进入标题采集阶段。'
            availability['intitle']={'status':'not_sampled','reason':skipped}
        if kgr is None:availability['ratio']={'status':'not_computable','reason':'KGR需要已采集的intitle标题页数和大于0的Volume；缺失不记0。'}
        execution_note='已获用户继续授权；原始批次保留，后续查询按真实可用性补采。' if bases else '浏览器因Windows当前URL无法可靠确认而被安全检查中止，后续未继续浏览器操作。'
        rows.append({'schemaVersion':1,'term':term,'country':'US','language':'en','qualification':'qualified' if all_pass else 'rejected' if failures else 'unknown','clusterId':'cluster-'+hub.digest(c.get('clusterHint',term))[:16],'metrics':providers,'evidence':evidence,'observedAt':max([x for x in [m.get('observedAt'),tr.get('observedAt') if tr else None,ti.get('observedAt') if ti else None,serp.get('observedAt') if serp else None,context.get('recordedAt')] if x],default=None),'notes':['本轮研究筛选不代表人工建设/放弃决定。','KGR沿用用户指定intitle精确短语页数/US月Volume；额外allintitle只作对照。','综合判读时间与各来源采集日期分开；复用证据仍保留原来源日期。',c.get('intentRisk',''),execution_note],'raw':{'type':'keyword_mining','discovery':c,'trend':tr,'assessment':{'tier':tier,'certainty':certainty,'reasons':reasons,'criteria':criteria},'gates':{'volumeAndKD':numeric_pass,'risingTrends':tr.get('passesRisingGate') if tr else None,'kgr':kgr<=0.25 if kgr is not None else None,'reasonableSerp':serp_pass,'allPass':True if all_pass else False if failures else None},'metricAvailability':availability,'missing':missing,'executionStatus':'supplement' if bases else 'browser_safety_interrupted'}})
        summaries.append({'term':term,'volume':v,'kd':kd,'intitle':ti['count'] if ti else None,'kgr':kgr,'trend':tr['status'] if tr else attempts.get(term,{}).get('status','not_attempted'),'tier':tier,'certainty':certainty,'volumeKdPass':numeric_pass,'reasons':reasons,'sourceURLs':c['sourceURLs']})
    batch={'schemaVersion':1,'id':batch_id,'date':'2026-10-25','device':'windows-sera','kind':'research','label':'150个游戏词发现与严格门槛筛查（中断，含待验证及未达标）','market':{'country':'US','language':'en'},'status':'partial','seeds':[r['term'] for r in candidates],'sources':[{'path':relative+'/README.md','note':'来源、明确门槛、覆盖、分级与中断原因'},{'path':relative+'/results.json','note':'逐词实际结果、待补及未达标原因'}],'notes':['用户要求Volume>3000、US Google Trends上涨、KD<=30、KGR<=0.25、SERP竞争合理；最优档Volume>10000、KD<20、KGR<0.2。','KGR本轮沿用用户上文指定intitle精确短语页数/Volume公式；不以额外allintitle或旧数据代替。','尚无完成全部门槛验收的词，不制造S/A/B推荐；所有150发现词按REJECT/PENDING研究状态完整入池。','浏览器安全检查因无法可靠确认Windows当前URL中止浏览器，余下查询未完成。','未直接调用付费API、未购买/部署/更改人工决定。']}
    (out/'batch.json').write_bytes(hub.encoded(batch));(out/'keywords.jsonl').write_text(''.join(json.dumps(r,ensure_ascii=False)+'\n' for r in rows),encoding='utf-8');(out/'results.json').write_bytes(hub.encoded(summaries));(out/'criteria.json').write_bytes(hub.encoded(criteria))
    if bases:
        batch['label']='150词补充验证与确定性分级';batch['notes']=['用户重新授权继续补充150词；原始批次与本轮证据并存，不修改旧观察。','KGR沿用用户已指定intitle精确短语/Volume口径；allintitle只作对照。','空值和服务报错保留未知，未实施直接付费API、购买、游戏发布或自动化。']
        (out/'batch.json').write_bytes(hub.encoded(batch))
    confirmed=sum(s['tier'] in ['S','A','B','C'] for s in summaries)
    counts={'discovered':len(candidates),'trendAttempted':len(attempts),'trendObserved':len(trend),'volumeKdAttempted':sum(c['term'] in metrics for c in candidates),'volumeKdComplete':sum(metrics.get(c['term'],{}).get('volume') is not None and metrics.get(c['term'],{}).get('kd') is not None for c in candidates),'volumeKdPass':sum(s['volumeKdPass'] for s in summaries),'intitleObserved':len(titles),'serpObserved':len(serps),'allGatesConfirmed':confirmed,'tiers':{t:sum(s['tier']==t for s in summaries) for t in ['S','A','B','C','REJECT','PENDING']},'rejected':sum(s['tier']=='REJECT' for s in summaries),'pending':sum(s['tier']=='PENDING' for s in summaries),'risingObserved':sum(t['passesRisingGate'] is True for t in trend.values())}
    (out/'coverage.json').write_bytes(hub.encoded(counts));return batch,rows,counts


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--research',type=Path,required=True);parser.add_argument('--base',type=Path,action='append',default=[]);parser.add_argument('--import',dest='write',action='store_true');args=parser.parse_args()
    root=hub.ROOT;out=args.research.resolve();out.relative_to(root)
    batch,rows,counts=build(root,out,[p.resolve() for p in args.base])
    if args.write:
        result=hub.import_batch(root,batch,rows);state=hub.regenerate(root);counts.update(importResult=result,hubCounts=state['counts'],errors=state['errors']);(out/'writeback-verification.json').write_bytes(hub.encoded(counts))
    print(json.dumps(counts,ensure_ascii=False))
