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

checks=[]
def cmd(*args):return run(*args,session='existing-flow')
def ev(js):
 d=run('eval',js,session='existing-flow',jsonout=True);return d.get('result')
def check(name,js):
 value=ev(js);checks.append({'check':name,'pass':value is True,'value':value});print(name,value,flush=True)
 if value is not True:raise RuntimeError(name+': '+str(value))

cmd('set','viewport','390','844')
cmd('open','http://127.0.0.1:4191/')
cmd('focus','.piece-item')
cmd('press','Enter')
check('Block: keyboard selects a piece and focuses board',"document.activeElement.classList.contains('cell') && document.querySelector('.piece-item[aria-pressed=\"true\"]')!==null")
cmd('press','ArrowRight');cmd('press','Enter')
check('Block: keyboard placement scores and fills cells',"Number(document.querySelector('#currentScore').textContent)>0 && document.querySelectorAll('.cell[aria-label*=\"occupied\"]').length>0")
ev("window.confirm=()=>true") # Accept native restart confirmation in this automation fixture.
cmd('click','#btnRestart')
check('Block: restart clears board',"Number(document.querySelector('#currentScore').textContent)===0")
cmd('click','.piece-item');cmd('click','.cell[data-row=\"0\"][data-col=\"0\"]')
check('Block: pointer selection and placement still score',"Number(document.querySelector('#currentScore').textContent)>0")
cmd('reload')
check('Block: best score survives reload',"Number(document.querySelector('#bestScore').textContent)>0")
cmd('open','http://127.0.0.1:4192/')
ev("localStorage.clear()")
cmd('reload')
check('Costcodle: page does not autofocus input',"document.activeElement.id!=='priceInput'")
cmd('click','#btnSubmit')
check('Costcodle: empty amount gets inline error',"document.querySelector('#priceInput').getAttribute('aria-invalid')==='true' && !document.querySelector('#guessFeedback').hidden")
price=ev("COSTCO_ITEMS.find(i=>i.name===document.querySelector('#productName').textContent).price")
cmd('fill','#priceInput',str(price));cmd('press','Enter');cmd('wait','#resultModal[open]')
check('Costcodle: exact daily reference wins',"document.querySelector('#resultModalTitle').textContent==='YOU GOT IT!'")
cmd('reload');cmd('wait','#resultModal[open]')
check('Costcodle: daily completion restores',"document.querySelector('#priceInput').disabled && document.querySelector('#resultModalTitle').textContent==='YOU GOT IT!'")
cmd('click','#btnNextItem')
check('Costcodle: switches to unlimited and resets attempts',"document.querySelector('#btnUnlimited').getAttribute('aria-pressed')==='true' && !document.querySelector('#priceInput').disabled")
price=ev("COSTCO_ITEMS.find(i=>i.name===document.querySelector('#productName').textContent).price")
cmd('fill','#priceInput',str(price));cmd('click','#btnSubmit');cmd('wait','#resultModal[open]');cmd('click','#btnNextItem')
check('Costcodle: unlimited next item playable',"!document.querySelector('#priceInput').disabled && !document.querySelector('#resultModal').open")
ev("localStorage.setItem('costcodle_stats','null');localStorage.setItem('costcodle_daily_'+new Date().toISOString().slice(0,10),JSON.stringify({guesses:[null],isWin:true}))")
cmd('reload')
check('Costcodle: malformed saved records recover',"!document.querySelector('#priceInput').disabled && document.querySelectorAll('.history-row').length===6")
cmd('open','http://127.0.0.1:4193/')
cmd('fill','#playerNameInput','Test');cmd('press','Space');cmd('keyboard','type','Pilot')
check('Gulper: nickname accepts spaces',"document.querySelector('#playerNameInput').value==='Test Pilot'")
check('Gulper: skin choices named and selected',"[...document.querySelectorAll('.skin-chip')].length===7 && [...document.querySelectorAll('.skin-chip')].every(e=>e.getAttribute('aria-label')) && document.querySelectorAll('.skin-chip[aria-pressed=\"true\"]').length===1")
cmd('click','#btnStartGame')
check('Gulper: starts solo arena with bots',"gameEngine.isPlaying && gameEngine.snakes.length>1 && document.activeElement.id==='gameCanvas'")
ev("window.qaStart={x:gameEngine.player.x,y:gameEngine.player.y}")
cmd('press','Space')
check('Gulper: real game loop moves player',"Math.hypot(gameEngine.player.x-qaStart.x,gameEngine.player.y-qaStart.y)>0")
ev("document.querySelector('#gameCanvas').dispatchEvent(new KeyboardEvent('keydown',{code:'Space',bubbles:true}));window.qaBoost=gameEngine.player.isBoosting;window.dispatchEvent(new Event('blur'))")
check('Gulper: focus loss releases boost',"qaBoost===true && gameEngine.player.isBoosting===false")
ev("gameEngine.onPlayerDeath()")
cmd('wait','#gameOverModal[open]')
cmd('press','Escape');cmd('click','#btnNewRun')
check('Gulper: dismissed result can restart from header',"gameEngine.isPlaying && !document.querySelector('#gameOverModal').open && !gameEngine.player.isDead")
ev("gameEngine.onPlayerDeath()")
cmd('click','#btnNewRun');time.sleep(.9)
check('Gulper: quick restart cancels old result timer',"!document.querySelector('#gameOverModal').open && !gameEngine.player.isDead")
cmd('open','http://127.0.0.1:4194/');cmd('tab','t1');cmd('set','media','reduced-motion');cmd('click','#startButton');cmd('wait','#playPanel:not(.is-hidden)')
cmd('fill','#answer','not-a-real-answer');cmd('press','Enter')
check('STARLING: invalid answer stays on same prompt',"state.round===0 && state.altitude===0 && state.running")
for i in range(7):
 answer=ev(f"window.StarlingAnswers.prompts[{i}].entries[0].answer")
 cmd('fill','#answer',answer);cmd('press','Enter')
 for _ in range(60):
  if ev("!state.transitioning"):break
  time.sleep(.08)
check('STARLING: seven accepted answers reach horizon',"state.answers.length===7 && state.stage===7 && !state.running && !document.querySelector('#resultPanel').classList.contains('is-hidden')")
cmd('click','#againButton');cmd('wait','#playPanel:not(.is-hidden)');cmd('click','#skipButton')
for _ in range(30):
 if ev("!state.transitioning"):break
 time.sleep(.08)
check('STARLING: passing advances prompt without flight',"state.round===1 && state.stage===0 && state.altitude===0")
(OUT/'gameplay-checks.json').write_text(json.dumps(checks,indent=2))
cmd('close')
print('PASS',len(checks))
