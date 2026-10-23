#!/usr/bin/env python3
import subprocess,json,pathlib,time
ROOT=pathlib.Path(__file__).resolve().parents[2]
OUT=ROOT/'research/2026-10-23-existing-games'
def run(*args,session='existing-after',jsonout=False):
 p=subprocess.run(['agent-browser','--session',session,*args,*(['--json'] if jsonout else [])],capture_output=True,text=True,timeout=40)
 if p.returncode: raise RuntimeError(p.stderr+p.stdout)
 if jsonout:
  x=json.loads(p.stdout)
  if not x.get('success'): raise RuntimeError(str(x))
  return x.get('data')
 return p.stdout

result={}
for slug,port in [('block-blast-unblocked',4191),('costcodle',4192),('gulperio',4193),('summit-unlimited',4194)]:
 p=subprocess.run(['agent-browser','--session','existing-storage','--init-script',str(OUT/'storage-disabled-init.js'),'open',f'http://127.0.0.1:{port}/'],capture_output=True,text=True,timeout=40)
 if p.returncode:raise RuntimeError(p.stdout+p.stderr)
 ok={'block-blast-unblocked':"document.querySelectorAll('.cell').length===64 && document.querySelectorAll('.piece-item').length===3",'costcodle':"document.querySelector('#productName').textContent!=='Your next price puzzle' && !document.querySelector('#priceInput').disabled",'gulperio':"Boolean(window.gameEngine) && document.querySelectorAll('.skin-chip').length===7",'summit-unlimited':"Boolean(window.flightScene) && document.querySelectorAll('#roundPips i').length===7"}[slug]
 result[slug]={'boot':run('eval',ok,session='existing-storage',jsonout=True),'errors':run('errors',session='existing-storage',jsonout=True),'storageBlocked':run('eval',"(()=>{try{localStorage.getItem('x');return false}catch{return true}})()",session='existing-storage',jsonout=True)}
 print(slug,result[slug],flush=True)
(OUT/'storage-disabled.json').write_text(json.dumps(result,indent=2))
run('close',session='existing-storage')
