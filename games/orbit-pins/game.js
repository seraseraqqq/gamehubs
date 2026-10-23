(()=>{'use strict';
 const E=window.OrbitEngine,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
 const storage={get(k){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}};
 const KEY='orbit-pins-v1';
 function load(){const raw=storage.get(KEY)||{},data={level:1,practice:false,sound:false,challenge:{},practiceRecords:{}};
  if(Number.isInteger(raw.level)&&raw.level>=1&&raw.level<=30)data.level=raw.level;
  data.sound=raw.sound===true;data.practice=raw.practice===true;
  for(const mode of ['challenge','practiceRecords'])for(let i=1;i<=30;i++){
   const r=raw[mode]?.[i];if(!r||typeof r!=='object')continue;
   data[mode][i]={attempts:Number.isSafeInteger(r.attempts)&&r.attempts>=0?r.attempts:0,clear:r.clear===true,best:Number.isFinite(r.best)&&r.best>0?r.best:null};
  }return data;
 }
 let records=load(),state=E.create(records.level,records.practice),audio=null,lastFrame=0,recorded=false;
 const save=()=>storage.set(KEY,records), modeKey=()=>state.practice?'practiceRecords':'challenge';
 const item=()=>records[modeKey()][state.level.id] ||= {attempts:0,clear:false,best:null};
 function tone(win=false){if(!records.sound)return;try{audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume().catch(()=>{});const t=audio.currentTime;
  for(const [i,hz] of (win?[440,554,659]:[300]).entries()){const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=hz;o.connect(g);g.connect(audio.destination);g.gain.setValueAtTime(.035,t+i*.07);g.gain.exponentialRampToValueAtTime(.001,t+.18+i*.07);o.start(t+i*.07);o.stop(t+.2+i*.07);}
 }catch{}}
 function svg(tag,attrs){const n=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;}
 function draw(){const angle=E.rotationAt(state.level,state.time,state.scale);$('pins').setAttribute('transform',`translate(250 223) rotate(${angle*180/Math.PI})`);
  if($('pins').childElementCount!==state.pins.length){$('pins').replaceChildren();state.pins.forEach((a,i)=>{const g=svg('g',{class:i>=state.level.initial?'new-pin':''}),x=Math.cos(a),y=Math.sin(a);g.append(svg('line',{x1:x*63,y1:y*63,x2:x*140,y2:y*140}),svg('circle',{cx:x*140,cy:y*140,r:8}));$('pins').append(g);});}
  $('remaining').textContent=state.remaining;$('projectile').style.display=state.flight||state.remaining===0||state.status==='lost'?'none':'';
  $('incoming').replaceChildren();if(state.flight){const p=Math.max(0,Math.min(1,(state.time-state.flight.start)/E.FLIGHT));$('incoming').append(svg('circle',{cx:250,cy:435-p*72,r:8}));}
 }
 function updateUI(){const entry=item(),completed=Object.values(records.challenge).filter(r=>r.clear).length;
  $('levelLabel').textContent=`Level ${String(state.level.id).padStart(2,'0')}`;$('cleared').textContent=String(completed).padStart(2,'0');$('progressBar').style.width=`${completed/30*100}%`;
  $('attempts').textContent=`${entry.attempts} ${entry.attempts===1?'attempt':'attempts'}`;$('best').textContent=entry.best?`${entry.best.toFixed(1)} sec`:'—';
  $('practiceNote').hidden=!state.practice;$('practice').setAttribute('aria-pressed',String(state.practice));$('challenge').setAttribute('aria-pressed',String(!state.practice));
  $('pause').setAttribute('aria-pressed',String(state.paused));$('pause').setAttribute('aria-label',state.paused?'Resume game':'Pause game');$('pause').textContent=state.paused?'▷':'Ⅱ';
  $('pause').disabled=['won','lost'].includes(state.status);$('shoot').disabled=state.paused||['won','lost'].includes(state.status);
  $('sound').textContent=records.sound?'Sound on':'Sound off';$('sound').setAttribute('aria-pressed',String(records.sound));
  $('play').classList.toggle('paused',state.paused);
  document.querySelectorAll('[data-level]').forEach(b=>{const id=Number(b.dataset.level),done=records[modeKey()][id]?.clear;b.setAttribute('aria-pressed',String(id===state.level.id));b.classList.toggle('done',Boolean(done));b.setAttribute('aria-label',`Level ${id}${done?', completed':''}`);});
 }
 function showOverlay(){const won=state.status==='won',lost=state.status==='lost';$('overlay').hidden=!(won||lost||state.paused);
  if($('overlay').hidden)return;
  $('outcomeKicker').textContent=state.paused?'A MOMENT TO RESET':won?'NICELY IN ORBIT':'SO CLOSE. GO AGAIN.';
  $('outcomeTitle').textContent=state.paused?'Take a breath.':won?state.level.id===30?'All the way around.':'That’s your rhythm.':'One more try?';
  $('outcomeText').textContent=state.paused?'Your orbit is paused. Pick up exactly where you left off.':won?`${state.practice?'Practice':'Challenge'} clear · ${state.activeTime.toFixed(1)} seconds. ${state.level.id===30?'Replay any orbit and try a cleaner run.':'A new orbit is waiting.'}`:'A pin touched another pin. Watch the opening, then try a new rhythm.';
  $('continue').textContent=state.paused?'Back to the orbit →':won&&state.level.id<30?'Next orbit →':'Try this orbit again ↺';
 }
 function selectLevel(id,practice=state.practice){const returnFocus=$('play').contains(document.activeElement);state=E.create(id,practice);records.level=id;records.practice=practice;recorded=false;lastFrame=performance.now();$('pins').replaceChildren();$('status').textContent=practice?'Practice · slower rotation, separate records.':'Watch the orbit. Launch when there’s room.';save();updateUI();showOverlay();draw();if(returnFocus)$('arena').focus({preventScroll:true});}
 function launch(){if(E.launch(state)){if(!recorded){item().attempts++;recorded=true;save();}tone();$('status').textContent='Pin on its way…';updateUI();}}
 function togglePause(force){if(['won','lost'].includes(state.status))return;const returnFocus=$('play').contains(document.activeElement)&&document.hasFocus();E.setPaused(state,typeof force==='boolean'?force:!state.paused);$('status').textContent=state.paused?'Paused. Your next opening can wait.':`${state.remaining} pins left. Find the opening.`;updateUI();showOverlay();if(returnFocus)(state.paused?$('continue'):$('arena')).focus({preventScroll:true});}
 function frame(now){const delta=Math.min(.05,Math.max(0,(now-lastFrame)/1000));lastFrame=now;const oldCount=state.remaining,oldStatus=state.status;E.advance(state,delta);
  if(state.remaining!==oldCount){$('status').textContent=`Nice. ${state.remaining} ${state.remaining===1?'pin':'pins'} left.`;}
  if(state.status!==oldStatus&&['won','lost'].includes(state.status)){
   if(state.status==='won'){const r=item();r.clear=true;r.best=r.best?Math.min(r.best,state.activeTime):state.activeTime;save();tone(true);$('status').textContent=`Level ${state.level.id} complete.`;}
   else $('status').textContent='Collision. Restart to find a fresh opening.';
   const returnFocus=$('play').contains(document.activeElement)&&document.hasFocus();updateUI();showOverlay();if(returnFocus)$('continue').focus({preventScroll:true});
  }draw();requestAnimationFrame(frame);
 }
 for(let i=1;i<=30;i++){const b=document.createElement('button');b.type='button';b.dataset.level=i;b.textContent=String(i).padStart(2,'0');b.addEventListener('click',()=>selectLevel(i));$('levelGrid').append(b);}
 $('arena').tabIndex=0;$('arena').setAttribute('aria-label','Game controls: Space or Enter launches; P pauses; R restarts.');
 $('board').addEventListener('click',()=>{launch();$('arena').focus({preventScroll:true});});$('shoot').addEventListener('click',launch);$('shoot').addEventListener('keydown',e=>{if(e.repeat&&[' ','Enter'].includes(e.key))e.preventDefault();});
 $('play').addEventListener('keydown',e=>{if(e.repeat&&[' ','Enter','p','r'].includes(e.key)){e.preventDefault();return;}if(e.target.closest('button')&&!['p','r'].includes(e.key.toLowerCase()))return;
  if([' ','Enter'].includes(e.key)){e.preventDefault();launch();}if(e.key.toLowerCase()==='p'){e.preventDefault();togglePause();}if(e.key.toLowerCase()==='r'){e.preventDefault();selectLevel(state.level.id);}
 });
 $('pause').addEventListener('click',()=>togglePause());$('restart').addEventListener('click',()=>selectLevel(state.level.id));
 $('continue').addEventListener('click',()=>{if(state.paused)togglePause(false);else selectLevel(state.status==='won'&&state.level.id<30?state.level.id+1:state.level.id);$('arena').focus({preventScroll:true});});
 $('practice').addEventListener('click',()=>selectLevel(state.level.id,true));$('challenge').addEventListener('click',()=>selectLevel(state.level.id,false));
 $('sound').addEventListener('click',()=>{records.sound=!records.sound;save();updateUI();if(records.sound)tone();});
 $('reset').addEventListener('click',()=>$('resetDialog').showModal());$('confirmReset').addEventListener('click',()=>{records={level:1,practice:false,sound:false,challenge:{},practiceRecords:{}};save();selectLevel(1,false);});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)togglePause(true);lastFrame=performance.now();});window.addEventListener('blur',()=>togglePause(true));
 selectLevel(records.level,records.practice);lastFrame=performance.now();requestAnimationFrame(frame);
})();
