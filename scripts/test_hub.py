"""Behavior tests use disposable data roots; never approve real project keywords."""
import csv
import io
import json
from pathlib import Path
import shutil
import tempfile
import threading
import unittest
from hub import (ROOT, aggregate, atomic, checked, csv_export, digest, encoded,
                 import_batch, keyword_id, read_records, regenerate, save_reviews, save_site)
from import_portfolio import migrate

class HubTest(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name)
        self.batch={'schemaVersion':1,'id':'test-2026-device-a','date':'2026-10-24','device':'device-a',
            'market':{'country':'US','language':'en'},'status':'complete','seeds':['coreball'],'sources':[]}
        self.row={'schemaVersion':1,'term':'coreball','qualification':'qualified','evidence':[]}
        import_batch(self.root,self.batch,[self.row])
        self.kid=keyword_id('coreball','US','en')
    def tearDown(self):self.temp.cleanup()
    def row_state(self,kid=None):return next(r for r in aggregate(self.root)['keywords'] if r['id']==(kid or self.kid))
    def review(self,heads=None,**options):
        payload={'actor':'test-owner','actorType':'human','reason':'实测依据与产品方案已复核','state':'approved','decision':'build',
                 'items':[{'keywordId':self.kid,'expectedHeads':self.row_state()['heads'] if heads is None else heads}]}
        payload.update(options);return save_reviews(self.root,payload)
    def test_market_identity_and_original_aliases(self):
        b=dict(self.batch,id='second');rows=[dict(self.row,term=' CoreBall '),dict(self.row,country='GB'),dict(self.row,language='zh')]
        import_batch(self.root,b,rows)
        state=aggregate(self.root);self.assertEqual(len(state['keywords']),3)
        self.assertEqual(set(self.row_state()['aliases']),{'coreball',' CoreBall '})
        self.assertNotEqual(keyword_id('soccer','US','en'),keyword_id('football','US','en'))
    def test_idempotence_and_no_same_id_overwrite(self):
        self.assertEqual(import_batch(self.root,self.batch,[self.row])['status'],'unchanged')
        before=(self.root/f"data/batches/{self.batch['id']}/keywords.jsonl").read_bytes()
        with self.assertRaises(ValueError):import_batch(self.root,self.batch,[dict(self.row,term='different')])
        self.assertEqual(before,(self.root/f"data/batches/{self.batch['id']}/keywords.jsonl").read_bytes())
    def test_invalid_rows_preserved_and_valid_rows_survive(self):
        result=import_batch(self.root,dict(self.batch,id='broken-input'),[self.row,'{broken',dict(self.row,term='')])
        self.assertEqual(result['accepted'],1);self.assertEqual(result['rejected'],2)
        self.assertEqual(len((self.root/'data/batches/broken-input/errors.jsonl').read_text().splitlines()),2)
        self.assertEqual(aggregate(self.root)['counts']['observations'],2)
        path=self.root/'data/batches/broken-input/keywords.jsonl'
        with path.open('a') as f:f.write('{corrupt\n')
        self.assertEqual(aggregate(self.root)['counts']['observations'],2)
        self.assertTrue(aggregate(self.root)['errors'])
    def test_review_persistence_and_research_independence(self):
        self.review()
        import_batch(self.root,dict(self.batch,id='new-ai-screen'),[dict(self.row,qualification='rejected')])
        row=self.row_state();self.assertEqual(row['reviewState'],'approved');self.assertEqual(row['decision'],'build')
        self.assertEqual(row['qualification'],'needs_review');self.assertEqual(len(row['history']),1)
        self.assertEqual(len(list((self.root/'data/reviews').glob('*.json'))),1)
    def test_stale_concurrent_review_is_retained_and_resolved(self):
        self.review(heads=[]);result=self.review(heads=[],state='rejected',decision='abandon')
        self.assertEqual(result['conflicts'],[self.kid]);self.assertEqual(self.row_state()['reviewState'],'conflict')
        self.assertEqual(len(self.row_state()['history']),2)
        self.review(state='hold',decision='defer')
        self.assertEqual(self.row_state()['reviewState'],'hold');self.assertEqual(len(self.row_state()['heads']),1)
    def test_git_merged_parallel_branches_detected_without_flag(self):
        self.review(heads=[])
        self.review(heads=[],state='hold')
        for path in (self.root/'data/reviews').glob('*.json'):
            obj=json.loads(path.read_text());obj['conflict']=False;atomic(path,encoded(obj))
        self.assertEqual(self.row_state()['reviewState'],'conflict')
    def test_human_priority_across_ai_intermediates(self):
        self.review()
        self.review(actorType='ai',state='rejected',decision='abandon')
        self.assertEqual(self.row_state()['decision'],'build')
        self.review(state='hold',decision='defer')
        self.assertEqual(self.row_state()['reviewState'],'hold')
    def test_ai_only_is_a_recommendation_not_owner_decision(self):
        self.review(actorType='ai')
        self.assertEqual(self.row_state()['decision'],'unset')
        self.assertEqual(self.row_state()['reviewState'],'pending')
        self.assertEqual(self.row_state()['aiReview']['decision'],'build')
    def test_bulk_save_and_one_invalid_item_prevents_partial_write(self):
        import_batch(self.root,dict(self.batch,id='other-term'),[dict(self.row,term='gunspin')])
        payload={'actor':'owner','actorType':'human','state':'hold','decision':'defer','reason':'验证批量保存',
            'items':[{'keywordId':self.kid,'expectedHeads':[]},{'keywordId':keyword_id('gunspin','US','en'),'expectedHeads':[]}]}
        self.assertEqual(save_reviews(self.root,payload)['saved'],2)
        payload['items'][1]['keywordId']='missing'
        with self.assertRaises(ValueError):save_reviews(self.root,payload)
        self.assertEqual(aggregate(self.root)['counts']['reviews'],2)
    def test_real_threads_stale_review_conflict(self):
        results=[]
        def task():results.append(self.review(heads=[]))
        threads=[threading.Thread(target=task) for _ in range(2)]
        for t in threads:t.start()
        for t in threads:t.join()
        self.assertEqual(len(results),2);self.assertEqual(self.row_state()['reviewState'],'conflict')
    def test_csv_excel_encoding_quotes_and_formula_injection(self):
        import_batch(self.root,dict(self.batch,id='csv'),[dict(self.row,term='=SUM(1,2)')])
        result=csv_export(aggregate(self.root)['keywords'])
        self.assertTrue(result.startswith(b'\xef\xbb\xbf'))
        parsed=list(csv.reader(io.StringIO(result.decode('utf-8-sig'))))
        self.assertEqual(len(parsed),3);self.assertTrue(any(r[0].startswith("'=") for r in parsed[1:]))
        self.assertTrue(all(len(r)==10 for r in parsed))
    def test_site_mapping_persistence_and_revision_conflict(self):
        site={'schemaVersion':1,'id':'test-site','name':'测试站','source':{'repository':'https://github.com/test/test-site','directory':'.','branch':'main','frozenSnapshots':[]},
            'stage':'planned','blockers':[],'nextAction':'完成原型','urls':{'production':None,'preview':None},
            'keywordMappings':[{'keywordId':self.kid,'term':'coreball','country':'US','language':'en','page':'/guide/','role':'secondary'}],
            'release':{'deployment':'unknown','gameplayAcceptance':'unknown','indexingPermission':'unknown'},'sources':[],
            'verification':{'recordedAt':None,'recheckedAt':None,'scope':'本地测试'},'notes':[],'history':[]}
        save_site(self.root,{'site':site,'expectedRevision':None})
        self.assertEqual(self.row_state()['sites'][0]['page'],'/guide/')
        current=json.loads((self.root/'data/sites/test-site.json').read_text())
        changed=dict(current,stage='building')
        self.assertTrue(save_site(self.root,{'site':changed,'expectedRevision':None})['conflict'])
        self.assertEqual(json.loads((self.root/'data/sites/test-site.json').read_text())['stage'],'planned')
        save_site(self.root,{'site':changed,'expectedRevision':digest(current)})
        self.assertEqual(len(json.loads((self.root/'data/sites/test-site.json').read_text())['history']),2)
    def test_full_migration_idempotence_and_holds(self):
        shutil.copytree(ROOT/'data/migration',self.root/'data/migration')
        report=migrate(self.root);before=aggregate(self.root)
        files={str(p.relative_to(self.root)):p.read_bytes() for p in (self.root/'data').rglob('*') if p.is_file()}
        migrate(self.root);after=aggregate(self.root)
        self.assertEqual(before,after);self.assertEqual(report['counts']['sites'],17)
        self.assertEqual(files,{str(p.relative_to(self.root)):p.read_bytes() for p in (self.root/'data').rglob('*') if p.is_file()})
        for sid in ['snow-rider-3d-unblocked','cluster-rush','acceleration-city']:
            s=next(s for s in after['sites'] if s['id']==sid)
            self.assertEqual(s['release']['indexingPermission'],'hold')
        self.assertFalse(after['errors'])
    def test_schema_rejects_absolute_source_path_and_unknown_stage(self):
        self.assertTrue(checked({'term':'test'},'keyword'))
        self.assertTrue(checked({'schemaVersion':1,'id':'a','market':{},'date':'','device':'','status':'wrong','seeds':[],'sources':[]},'batch'))
    def test_verified_repository_migration_replaces_stale_vercel_compatibility(self):
        shutil.copytree(ROOT/'data/migration',self.root/'data/migration')
        migrate(self.root)
        path=self.root/'data/sites/coreball.json';current=json.loads(path.read_text())
        site=json.loads(path.read_text())
        site['source']={'repository':'https://github.com/test/gameshub-coreball','directory':'.','branch':'main','frozenSnapshots':['games/coreball']}
        site['development']={'implementationPushed':True,'recordedHead':'1'*40,'deploymentMigration':{
            'evidencePath':'deployments/test/coreball-final.json','vercel':{
                'projectId':'original-project','rootDirectory':None,'ignoreCommand':None,
                'repository':'https://github.com/test/gameshub-coreball','productionBranch':'main'}}}
        self.assertEqual(save_site(self.root,{'site':site,'expectedRevision':digest(current),'actor':'test-ai'})['saved'],'coreball')
        recorded=json.loads(path.read_text())
        self.assertEqual(recorded['history'][-1]['previous']['source'],current['source'])
        registry=json.loads((self.root/'data/repositories.json').read_text())
        entry=next(x for x in registry['games'] if x['siteId']=='coreball')
        self.assertEqual(entry['repo'],site['source']['repository']);self.assertEqual(entry['rootDirectory'],'.')
        self.assertIsNone(entry['vercel']['rootDirectory']);self.assertIsNone(entry['vercel']['ignoreCommand'])
        self.assertEqual(entry['vercel']['projectId'],'original-project')
        self.assertEqual(entry['migrationState'],'independent-repository-verified')
        matrix=json.loads((self.root/'data/matrix-sites.json').read_text())
        entry=next(x for x in matrix['sites'] if x['siteId']=='coreball')
        self.assertEqual(entry['path'],'.');self.assertEqual(entry['canonicalSource'],site['source'])
        self.assertEqual(entry['pathScope'],'relative-to-canonical-repository')
        # Removing the management snapshot must retain provenance without recreating a local path.
        current=json.loads(path.read_text());site=json.loads(path.read_text())
        site['source']['frozenSnapshots']=[]
        site['source']['archivedSnapshots']=[{'repository':'https://github.com/test/management','directory':'games/coreball',
            'commit':'2'*40,'removedAt':'2026-10-25T00:00:00Z','evidence':'docs/history/removal.json'}]
        saved=save_site(self.root,{'site':site,'expectedRevision':digest(current),'actor':'test-ai'})
        self.assertEqual(saved['saved'],'coreball')
        registry=json.loads((self.root/'data/repositories.json').read_text())
        entry=next(x for x in registry['games'] if x['siteId']=='coreball')
        self.assertNotIn('frozenSnapshot',entry);self.assertNotIn('legacyPath',entry)
        self.assertEqual(entry['archivedSnapshots'],site['source']['archivedSnapshots'])
        self.assertIsNone(entry['vercel']['rootDirectory']);self.assertIsNone(entry['vercel']['ignoreCommand'])
        self.assertEqual(json.loads(path.read_text())['release'],current['release'])
    def test_primary_remote_data_scope_and_compatibility(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);shutil.copytree(ROOT/'data/migration',root/'data/migration')
            migrate(root);state=aggregate(root)
            self.assertEqual(state['counts'],{'keywords':117,'observations':239,'batches':4,'reviews':0,'sites':17})
            self.assertEqual(len(state['plans']),11)
            self.assertEqual(sum(any(o.get('raw',{}).get('strictMetricMatch') for o in r['observations']) for r in state['keywords']),17)
            self.assertEqual(sum(r['qualification']=='qualified' for r in state['keywords']),9)
            self.assertTrue(all(r['reviewState']=='pending' and r['decision']=='unset' for r in state['keywords']))
            self.assertNotIn('coreball',{r['term'] for r in state['keywords']})
            cost=next(s for s in state['sites'] if s['id']=='costcodle')
            self.assertEqual(cost['urls']['production'],'https://costcodle.cc/')
            projects=[s for s in state['sites'] if s.get('legacyGroup')=='plannedGames']
            self.assertEqual(len(projects),5);self.assertTrue(all(s['stage']=='awaiting_release' and s['release']['deployment']=='not_deployed' for s in projects))
            self.assertTrue(all(s['development']['implementationPushed'] for s in projects))
            registry=json.loads((root/'data/repositories.json').read_text());self.assertEqual(len(registry['games']),12);self.assertEqual(len(registry['plannedGames']),5)
            self.assertIn('_management',registry)
            self.assertTrue(all('localPath' in r and 'recorded-source-device-only' in r['localPathScope'] for r in registry['plannedGames']))
    def test_source_device_paths_rejected_and_portfolio_metadata_not_auto_pooled(self):
        site=json.loads((ROOT/'data/sites/coreball.json').read_text())
        site['source']['directory']='E:/Projects/coreball'
        self.assertTrue(checked(site,'site'))
        site['source']['directory']='../coreball'
        self.assertTrue(checked(site,'site'))
        site['source']['directory']='games/coreball'
        self.assertFalse(checked(site,'site'))

if __name__=='__main__':unittest.main(verbosity=2)
