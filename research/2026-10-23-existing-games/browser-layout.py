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
results={}
for slug,port in [('block-blast-unblocked',4191),('costcodle',4192),('gulperio',4193),('summit-unlimited',4194)]:
 run('open',f'http://127.0.0.1:{port}/')
 run('eval','document.fonts.ready.then(()=>true)')
 results[slug]={'viewports':{}}
 for width,height in [(1440,1000),(390,844),(320,812),(768,1024)]:
  run('set','viewport',str(width),str(height))
  run('eval','window.scrollTo(0,0)')
  results[slug]['viewports'][str(width)]=run('eval',"JSON.stringify({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,h1:[...document.querySelectorAll('h1')].map(e=>e.textContent.trim()),brokenImages:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),active:document.activeElement.tagName,external:performance.getEntriesByType('resource').filter(e=>new URL(e.name).origin!==location.origin).map(e=>e.name)})",jsonout=True)
  if width in [1440,390]: run('screenshot',str(OUT/f'{slug}-after-{"desktop" if width==1440 else "mobile"}.png'))
 results[slug]['errors']=run('errors',jsonout=True)
 print(slug,json.dumps(results[slug]),flush=True)
(OUT/'after-browser.json').write_text(json.dumps(results,indent=2))
run('close')
