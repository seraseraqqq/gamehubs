#!/usr/bin/env python3
from pathlib import Path
import subprocess,json
ROOT=Path(__file__).resolve().parents[2];OUT=Path(__file__).resolve().parent
session='new-games-storage'
def run(*args):
 p=subprocess.run(['agent-browser','--session',session,*args,'--json'],cwd=ROOT,capture_output=True,text=True,timeout=30)
 if p.returncode:raise RuntimeError(p.stdout+p.stderr)
 d=json.loads(p.stdout)
 if not d.get('success'):raise RuntimeError(str(d))
 return d['data']
results={}
for slug,port in [('orbit-pins',4195),('cryptic-practice',4196)]:
 p=subprocess.run(['agent-browser','--session',session,'--init-script',str(OUT/'storage-disabled-init.js'),'open',f'http://127.0.0.1:{port}/'],cwd=ROOT,capture_output=True,text=True,check=True)
 blocked=run('eval',"(()=>{try{localStorage.getItem('x');return false}catch{return true}})()")['result']
 if slug=='orbit-pins':
  run('eval',"document.querySelector('#shoot').scrollIntoView({behavior:'instant',block:'center'})");run('click','#shoot');boot=run('eval',"document.querySelectorAll('[data-level]').length===30 && document.querySelector('#attempts').textContent==='1 attempt'")['result']
 else:
  run('eval',"document.querySelector('#hint').scrollIntoView({behavior:'instant',block:'center'})");run('click','#hint');boot=run('eval',"ClueGarden.clues.length===20 && document.querySelectorAll('#hintList li').length===1")['result']
 errors=run('errors')['errors'];print(slug,{'blocked':blocked,'boot':boot,'errors':errors},flush=True);assert blocked and boot and not errors
 results[slug]={'storageBlocked':blocked,'playable':boot,'errors':errors}
run('close');(OUT/'storage-checks.json').write_text(json.dumps(results,indent=2));print('PASS storage-disabled gameplay:',len(results),'games')
