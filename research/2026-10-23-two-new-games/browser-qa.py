#!/usr/bin/env python3
"""Local-only UI/input regression. Requires servers on 4195 and 4196 and agent-browser."""
import pathlib,subprocess,json,time
ROOT=pathlib.Path(__file__).resolve().parents[2];OUT=pathlib.Path(__file__).resolve().parent
SESSION='two-new-games-qa'
def cmd(*args,jsonout=False):
 if args and args[0]=='click':
  # CDP clicks use viewport coordinates: bring off-screen controls into view first.
  scroll='document.querySelector('+json.dumps(args[1])+').scrollIntoView({block:"center",behavior:"instant"})'
  subprocess.run(['agent-browser','--session',SESSION,'eval',scroll],cwd=ROOT,capture_output=True,text=True,check=True,timeout=20)
 p=subprocess.run(['agent-browser','--session',SESSION,*args,*(['--json'] if jsonout else [])],cwd=ROOT,capture_output=True,text=True,timeout=45)
 if p.returncode:raise RuntimeError(p.stdout+p.stderr)
 if jsonout:
  r=json.loads(p.stdout)
  if not r.get('success'):raise RuntimeError(str(r))
  return r['data']
 return p.stdout

def ev(js):return cmd('eval',js,jsonout=True).get('result')
checks=[]
def check(name,js):
 value=ev(js);checks.append({'check':name,'pass':value is True,'value':value});print(name,value,flush=True)
 if value is not True:raise AssertionError(name+': '+str(value))
layout={}
for slug,port in [('coreball',4195),('minute-cryptic-unlimited',4196)]:
 cmd('open',f'http://127.0.0.1:{port}/');cmd('tab','t1');ev('document.fonts.ready.then(()=>true)');layout[slug]={}
 for w,h in [(1440,1080),(390,844),(320,812),(768,1024)]:
  cmd('set','viewport',str(w),str(h));ev('window.scrollTo(0,0)')
  result=json.loads(ev("JSON.stringify({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,external:performance.getEntriesByType('resource').filter(r=>new URL(r.name).origin!==location.origin).map(r=>r.name),broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),active:document.activeElement.tagName})"));layout[slug][str(w)]=result
  if result['width']!=result['scroll']:raise AssertionError(f'{slug} overflow at {w}')
  if w in [1440,390]:cmd('screenshot',str(OUT/f'{slug}-{"desktop" if w==1440 else "mobile"}.png'))
 layout[slug]['errors']=cmd('errors',jsonout=True)
(OUT/'layout.json').write_text(json.dumps(layout,indent=2))
cmd('open','http://127.0.0.1:4195/');cmd('tab','t1');cmd('set','media','reduced-motion');ev("localStorage.removeItem('orbit-pins-v1')");cmd('reload');cmd('set','viewport','390','844')
check('Pinlark: 30 accessible level choices and no autofocus',"document.querySelectorAll('[data-level]').length===30 && document.activeElement.tagName==='BODY'")
cmd('click','#practice');check('Pinlark: Practice selected and disclosed',"document.querySelector('#practice').getAttribute('aria-pressed')==='true' && !document.querySelector('#practiceNote').hidden")
# Play a real round by reading the SVG geometry and clicking only when a launch is safe.
solve="""new Promise((resolve,reject)=>{const E=OrbitEngine,deadline=performance.now()+25000;let launches=0;
 if(document.querySelector('#pause').getAttribute('aria-pressed')==='true')document.querySelector('#continue').click();
 function frame(){const title=document.querySelector('#outcomeTitle').textContent;
  if(!document.querySelector('#overlay').hidden&&document.querySelector('#pause').getAttribute('aria-pressed')!=='true'){
   if(title.includes('rhythm')||title.includes('way around'))return resolve(launches);return reject(Error('Timed input hit a pin: '+title));}
  if(performance.now()>deadline)return reject(Error('Real round timed out'));
  const transform=document.querySelector('#pins').getAttribute('transform'),angle=Number(transform.match(/rotate\\(([^)]+)\\)/)[1])*Math.PI/180;
  const scale=document.querySelector('#practice').getAttribute('aria-pressed')==='true'?.7:1;
  const arrival=E.wrap(E.ENTRY-angle-E.levels[0].speed*scale*E.FLIGHT);
  const pins=[...document.querySelectorAll('#pins circle')].map(c=>Math.atan2(Number(c.getAttribute('cy')),Number(c.getAttribute('cx'))));
  if(!document.querySelector('#incoming').children.length&&!document.querySelector('#shoot').disabled&&pins.every(p=>E.gap(p,arrival)>E.MIN_GAP+.065)){
   document.querySelector('#shoot').click();launches++;}
  requestAnimationFrame(frame);
 }requestAnimationFrame(frame);})"""
assert ev(solve)==5
check('Pinlark: Practice win leaves Challenge progress untouched',"document.querySelector('#cleared').textContent==='00' && JSON.parse(localStorage.getItem('orbit-pins-v1')).practiceRecords[1].clear===true")
cmd('click','#challenge');assert ev(solve)==5
check('Pinlark: actual timed Challenge play wins and saves',"document.querySelector('#cleared').textContent==='01' && JSON.parse(localStorage.getItem('orbit-pins-v1')).challenge[1].best>0")
cmd('reload');check('Pinlark: completion persists after reload',"document.querySelector('#cleared').textContent==='01' && document.querySelector('[data-level=\"1\"]').classList.contains('done')")
cmd('click','#pause');angle=ev("document.querySelector('#pins').getAttribute('transform')");time.sleep(.3)
check('Pinlark: pause stops the world and launch input',f"document.querySelector('#pins').getAttribute('transform')==={json.dumps(angle)} && document.querySelector('#shoot').disabled")
cmd('click','#continue');cmd('focus','#arena');cmd('press','Space');check('Pinlark: keyboard launch starts an attempt',"JSON.parse(localStorage.getItem('orbit-pins-v1')).challenge[1].attempts>=2")
cmd('click','#restart');check('Pinlark: restart restores full pin count',"document.querySelector('#remaining').textContent==='5' && document.querySelector('#incoming').children.length===0")
cmd('focus','#shoot');cmd('press','p');check('Pinlark: keyboard pause keeps focus on a usable resume control',"document.querySelector('#pause').getAttribute('aria-pressed')==='true' && document.activeElement.id==='continue'")
cmd('press','r');check('Pinlark: keyboard restart restores playable focus',"document.querySelector('#pause').getAttribute('aria-pressed')==='false' && document.activeElement.id==='arena' && document.querySelector('#remaining').textContent==='5'")
ev("localStorage.setItem('orbit-pins-v1','{broken')");cmd('reload');check('Pinlark: corrupt storage recovers',"document.querySelectorAll('[data-level]').length===30 && document.querySelector('#cleared').textContent==='00'")
cmd('click','#sound');check('Pinlark: sound is explicitly opt-in and toggleable',"document.querySelector('#sound').getAttribute('aria-pressed')==='true'")
cmd('open','http://127.0.0.1:4196/');cmd('tab','t1');ev("localStorage.removeItem('clue-garden-v1')");cmd('reload')
check('Cryptic: 20-clue bank and initial input is not focused',"ClueGarden.clues.length===20 && document.activeElement.id!=='answer'")
cmd('click','#check');check('Cryptic: empty submission stays unsolved',"document.querySelector('#answer').getAttribute('aria-invalid')==='true' && document.querySelector('#solved').textContent==='0'")
cmd('fill','#answer','ZZZ');cmd('press','Enter');check('Cryptic: wrong answer permits retry',"document.querySelector('#answer').getAttribute('aria-invalid')==='true' && !document.querySelector('#answer').disabled")
for _ in range(3):cmd('click','#hint')
check('Cryptic: three progressive hints, including definition highlight',"document.querySelectorAll('#hintList li').length===3 && document.querySelector('#hint').disabled && document.querySelector('#clueText mark')!==null && document.querySelector('#explanation').hidden")
answer=ev("ClueGarden.clues.find(q=>document.querySelector('#clueText').textContent.startsWith(q.clue)).answer")
cmd('fill','#answer',answer.lower());cmd('press','Enter');check('Cryptic: correct answer explains construction and counts once',"document.querySelector('#solved').textContent==='1' && !document.querySelector('#explanation').hidden && document.querySelector('#resultSummary').textContent.includes('3 nudges')")
cmd('click','#next');cmd('click','#reveal');cmd('click','#confirmReveal');check('Cryptic: reveal has its own outcome and count',"document.querySelector('#solved').textContent==='1' && document.querySelector('#revealedMini').textContent==='1' && document.querySelector('#resultKind').textContent==='ANSWER REVEALED'")
cmd('reload');check('Cryptic: both outcome types persist',"document.querySelector('#solved').textContent==='1' && document.querySelector('#revealedMini').textContent==='1'")
for typ,n in [('anagram',4),('hidden',5),('reversal',3),('charade',4),('container',4)]:
 cmd('select','#typeFilter',typ);check('Cryptic: '+typ+' filter selects the matching bank',f"document.querySelector('#bankSize').textContent.startsWith('{n} original') && ClueGarden.clues.find(q=>document.querySelector('#clueText').textContent.startsWith(q.clue)).type==='{typ}'")
cmd('select','#typeFilter','all');cmd('click','#reset');cmd('click','#confirmReset');seen=[]
for i in range(20):
 q=json.loads(ev("JSON.stringify(ClueGarden.clues.find(q=>document.querySelector('#clueText').textContent.startsWith(q.clue)))"));seen.append(q['id']);cmd('fill','#answer',q['answer']);cmd('press','Enter')
 if i<19:cmd('click','#next')
assert len(set(seen))==20
check('Cryptic: complete real 20-clue practice round without duplicates',"document.querySelector('#solved').textContent==='20' && document.querySelectorAll('#gardenDots .solved').length===20")
cmd('click','#next');check('Cryptic: next round honestly discloses clue repetition',"document.querySelector('#roundLabel').textContent.includes('CLUES REPEAT')")
(OUT/'browser-checks.json').write_text(json.dumps(checks,indent=2));print('PASS',len(checks),'browser scenarios',flush=True)
cmd('close')
