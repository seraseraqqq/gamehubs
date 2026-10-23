const prompts = window.StarlingAnswers.prompts;
const scenes = [
  {name:'EARTH',title:'EARTH / LAUNCH COMPLEX',detail:'GROUND CONTROL CONNECTED',distance:'0',unit:'km',transit:'CLEARED FOR LIFTOFF'},
  {name:'ATMOSPHERE',title:'EARTH / UPPER ATMOSPHERE',detail:'CLOUD DECK BELOW · SIGNAL STRONG',distance:'100',unit:'km',transit:'BREAKING THE CLOUDS'},
  {name:'MOON',title:'LUNA / FIRST LIGHT',detail:'EARTHRISE ON THE PORT SIDE',distance:'384,400',unit:'km',transit:'LUNAR INSERTION'},
  {name:'MARS',title:'MARS / RED PLANET',detail:'DUST IN THE SOLAR WIND',distance:'225 M',unit:'km',transit:'THE RED APPROACH'},
  {name:'JUPITER',title:'JUPITER / THE GREAT GIANT',detail:'PASSING THE GALILEAN MOONS',distance:'778 M',unit:'km',transit:'GIANT IN THE WINDOW'},
  {name:'SOLAR SYSTEM',title:'SOLAR SYSTEM / OUTBOUND',detail:'LEAVING THE LIGHT OF HOME',distance:'1',unit:'ly',transit:'OUT OF THE SUN\'S REACH'},
  {name:'MILKY WAY',title:'MILKY WAY / OUTER ARM',detail:'A HUNDRED BILLION DISTANT LIGHTS',distance:'100 K',unit:'ly',transit:'BETWEEN THE STARS'},
  {name:'COSMIC HORIZON',title:'COSMIC HORIZON / UNKNOWN',detail:'THE LAST LIGHT · CHANNEL OPEN',distance:'46 B',unit:'ly',transit:'BEYOND THE KNOWN'}
];
const $ = id => document.getElementById(id);
const saved = key => {try{return Number(localStorage.getItem(key))||0;}catch{return 0;}};
const store = (key,value) => {try{localStorage.setItem(key,value);}catch{}};
const state = {round:0,stage:0,altitude:0,answers:[],timer:null,deadline:0,running:false,transitioning:false,sound:false,audio:null,peak:saved('starling-validated-v1-best'),climbs:saved('starling-climbs')};
const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
$('routeList').innerHTML=scenes.map((s,i)=>`<li data-stage="${i}">${s.name}</li>`).join('');
$('roundPips').innerHTML=prompts.map(()=>'<i></i>').join('');
function setScene(index){
  state.stage=index;const s=scenes[index];$('game').dataset.stage=index;
  $('sceneTitle').textContent=s.title;$('sceneDetail').textContent=s.detail;
  $('distance').replaceChildren(document.createTextNode(s.distance+' '),Object.assign(document.createElement('small'),{textContent:s.unit}));
  document.querySelectorAll('#routeList li').forEach((el,i)=>{el.classList.toggle('reached',i<index);el.classList.toggle('current',i===index);if(i===index)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
}
function updateScore(){ $('altitude').textContent=state.altitude.toLocaleString(); }
function updatePips(){document.querySelectorAll('#roundPips i').forEach((el,i)=>{const outcome=state.answers[i];el.classList.toggle('done',outcome?.outcome==='correct');el.classList.toggle('missed',Boolean(outcome&&outcome.outcome!=='correct'));el.classList.toggle('current',state.running&&i===state.round&&!outcome);});}
async function begin(){
  if(state.running)return;
  state.round=0;state.altitude=0;state.answers=[];state.running=true;state.transitioning=true;
  clearInterval(state.timer);window.flightScene.reset();setScene(0);updateScore();updatePips();
  $('introPanel').classList.add('is-hidden');$('resultPanel').classList.add('is-hidden');$('playPanel').classList.add('is-hidden');
  $('transit').classList.remove('is-hidden');$('transitCode').textContent='GROUND CONTROL / CHECK IN';$('transitNote').textContent='FLIGHT SYSTEMS NOMINAL';
  $('roundLabel').textContent='SEQUENCE INITIATED';
  await window.flightScene.ready;
  for(let count=3;count>0;count--){$('transitTitle').textContent=`T−0${count}`;tone(320+count*40,.12);await wait(reduced.matches?120:700);}
  $('transit').classList.add('is-hidden');state.transitioning=false;showPrompt();
}
function showPrompt(notice){
  if(state.round>=prompts.length)return finish();
  const p=prompts[state.round];$('playPanel').classList.remove('is-hidden');$('category').textContent=`SIGNAL 0${state.round+1} / ${p.category}`;$('prompt').textContent=p.text;
  $('roundLabel').textContent=`PROMPT ${state.round+1} OF 7`;updatePips();
  $('answer').value='';$('answer').removeAttribute('aria-invalid');$('answer').disabled=false;document.querySelector('.submit-button').disabled=false;$('skipButton').disabled=false;
  $('feedback').textContent=notice||'CHANNEL OPEN. TRUST YOUR INSTINCTS.';$('timer').textContent='25';$('timeBar').style.width='100%';
  if(matchMedia('(min-width:751px)').matches)$('answer').focus({preventScroll:true});
  state.deadline=performance.now()+25000;clearInterval(state.timer);
  state.timer=setInterval(()=>{const remaining=Math.max(0,state.deadline-performance.now());$('timer').textContent=Math.ceil(remaining/1000);$('timeBar').style.width=`${remaining/250}%`;if(!remaining)resolveAnswer('',true,'timeout');},200);
}
async function resolveAnswer(value,skipped=false,reason='pass'){
  if(!state.running||state.transitioning)return;
  if(performance.now()>=state.deadline){skipped=true;reason='timeout';}
  const result=skipped?null:window.StarlingAnswers.validate(state.round,value);
  if(!skipped&&!result.accepted){
    $('answer').setAttribute('aria-invalid','true');
    $('feedback').textContent='ANSWER NOT RECOGNIZED FOR THIS PROMPT. TRY ANOTHER.';
    if(document.activeElement!==$('answer'))$('answer').focus({preventScroll:true});
    tone(150,.12);
    return;
  }
  state.transitioning=true;clearInterval(state.timer);state.deadline=0;
  $('answer').removeAttribute('aria-invalid');$('answer').disabled=true;document.querySelector('.submit-button').disabled=true;$('skipButton').disabled=true;
  const score=skipped?0:result.score,gain=score*10;
  state.altitude+=gain;state.answers.push({answer:skipped?'—':result.answer,score,outcome:skipped?reason:'correct'});updateScore();updatePips();
  if(skipped){
    // A consumed question is not a successful flight leg. Keep the world in place.
    const notice=reason==='timeout'?'TIME UP / +0 PTS. NO BOOST.':'PASSED / +0 PTS. NO BOOST.';
    $('feedback').textContent=notice;
    if(reason==='timeout'){$('timer').textContent='0';$('timeBar').style.width='0%';}
    tone(180,.2);
    await wait(reduced.matches?300:1400);
    state.round++;state.transitioning=false;showPrompt(notice);
    return;
  }
  $('feedback').textContent=`${score>75?'RARE SIGNAL':score>45?'CURIOUS FIND':'SIGNAL RECEIVED'} / +${gain} PTS`;
  tone(score>75?690:440,.2);
  await wait(reduced.matches?100:700);
  const destination=Math.min(state.stage+1,scenes.length-1);
  $('game').classList.add('is-launching');$('transitCode').textContent=`TRANSIT 0${destination} / 07`;$('transitTitle').textContent=scenes[destination].transit;$('transitNote').textContent=`DESTINATION / ${scenes[destination].name}`;$('transit').classList.remove('is-hidden');
  launchWhoosh();
  await window.flightScene.travel(destination);setScene(destination);
  $('transit').classList.add('is-hidden');$('game').classList.remove('is-launching');state.round++;state.transitioning=false;showPrompt();
}
function finish(){
  state.running=false;clearInterval(state.timer);state.deadline=0;state.climbs++;store('starling-climbs',state.climbs);
  const newBest=state.altitude>state.peak;if(newBest){state.peak=state.altitude;store('starling-validated-v1-best',state.peak);}
  const correct=state.answers.filter(a=>a.outcome==='correct').length;
  const arrived=state.stage===scenes.length-1,grounded=state.stage===0;
  $('playPanel').classList.add('is-hidden');$('resultPanel').classList.remove('is-hidden');$('roundLabel').textContent=arrived?'MISSION COMPLETE':'FLIGHT ENDED';updatePips();
  $('resultEyebrow').textContent=`${scenes[state.stage].name} / ${correct} OF ${prompts.length} CORRECT`;
  $('resultTitle').textContent=arrived?'BEYOND THE KNOWN.':grounded?'STILL ON THE LAUNCH PAD.':'JOURNEY INCOMPLETE.';
  const location=grounded?'Your rocket stayed on the launch pad.':arrived?'Your signal reached the cosmic horizon.':`Your flight reached ${scenes[state.stage].name}.`;
  $('resultText').textContent=`${location} ${correct} of ${prompts.length} answers correct. ${newBest?'A new flight record. ':''}${arrived?'Fly again to beat your score.':'Answer all seven to reach the cosmic horizon.'}`;
  $('finalAltitude').textContent=`${state.altitude.toLocaleString()} PTS`;$('bestAnswer').textContent=state.answers.filter(a=>a.outcome==='correct').sort((a,b)=>b.score-a.score)[0]?.answer||'—';
  $('bestScore').textContent=`${state.peak.toLocaleString()} PTS`;$('runCount').textContent=`FLIGHTS ${state.climbs}`;tone(arrived?790:180,.28);
}
function audio() { if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)(); if (state.audio.state === 'suspended') state.audio.resume(); return state.audio; }
function tone(freq, duration) {
  if (!state.sound) return;
  const a = audio(), o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = freq;
  g.gain.setValueAtTime(.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(.045, a.currentTime + .025); g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + duration);
  o.connect(g).connect(a.destination); o.start(); o.stop(a.currentTime + duration + .03);
}
function launchWhoosh() {
  if (!state.sound) return;
  const a = audio(), o = a.createOscillator(), filter = a.createBiquadFilter(), gain = a.createGain();
  o.type = 'sawtooth'; o.frequency.setValueAtTime(96, a.currentTime); o.frequency.exponentialRampToValueAtTime(34, a.currentTime + 1.1);
  filter.type = 'lowpass'; filter.frequency.setValueAtTime(380, a.currentTime); filter.frequency.exponentialRampToValueAtTime(90, a.currentTime + 1.1);
  gain.gain.setValueAtTime(.0001, a.currentTime); gain.gain.linearRampToValueAtTime(.055, a.currentTime + .18); gain.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 1.15);
  o.connect(filter).connect(gain).connect(a.destination); o.start(); o.stop(a.currentTime + 1.2);
}
function startAmbience() {
  const a = audio(); if (state.pad) return;
  const master = a.createGain(); master.gain.setValueAtTime(.0001, a.currentTime); master.gain.linearRampToValueAtTime(.014, a.currentTime + 1.8); master.connect(a.destination);
  const oscillators = [];
  [55, 82.41, 110].forEach((f, i) => { const o = a.createOscillator(), g = a.createGain(); o.type = 'sine'; o.frequency.value = f; g.gain.value = i === 0 ? .42 : .12; o.connect(g).connect(master); o.start(); oscillators.push(o); });
  const delay = a.createDelay(1.5), echo = a.createGain(); delay.delayTime.value = .48; echo.gain.value = .16; delay.connect(echo).connect(master);
  const notes = [220, 261.63, 329.63, 392, 329.63, 293.66, 246.94, 329.63]; let step = 0;
  const playNote = () => {
    if (!state.sound || state.pad?.gain !== master) return;
    const o = a.createOscillator(), env = a.createGain(); o.type = 'sine'; o.frequency.value = notes[(step * 3) % notes.length];
    env.gain.setValueAtTime(.0001, a.currentTime); env.gain.exponentialRampToValueAtTime(.035, a.currentTime + .22); env.gain.exponentialRampToValueAtTime(.0001, a.currentTime + 2.2);
    o.connect(env); env.connect(master); env.connect(delay); o.start(); o.stop(a.currentTime + 2.25); oscillators.push(o);
    o.addEventListener('ended', () => { const index = oscillators.indexOf(o); if (index >= 0) oscillators.splice(index, 1); }); step++;
  };
  state.pad = { gain: master, oscillators }; playNote(); state.musicTimer = setInterval(playNote, 2600);
}
$('answer').addEventListener('input',()=>{if($('answer').hasAttribute('aria-invalid')){$('answer').removeAttribute('aria-invalid');$('feedback').textContent='TRY ANOTHER ANSWER. THE CLOCK IS STILL RUNNING.';}});
$('answerForm').addEventListener('submit',event=>{event.preventDefault();const value=$('answer').value.trim();if(value)resolveAnswer(value);});
$('skipButton').addEventListener('click',()=>resolveAnswer('',true));
$('startButton').addEventListener('click',begin);$('againButton').addEventListener('click',begin);
$('helpToggle').addEventListener('click',()=>$('helpDialog').showModal());
$('soundToggle').addEventListener('click',()=>{
  state.sound=!state.sound;$('soundState').textContent=state.sound?'ON':'OFF';$('soundToggle').setAttribute('aria-pressed',String(state.sound));$('soundToggle').setAttribute('aria-label',state.sound?'Turn sound off':'Turn sound on');
  if(state.sound){startAmbience();tone(440,.12);}
  else if(state.pad){const pad=state.pad;clearInterval(state.musicTimer);state.pad=null;pad.gain.gain.setTargetAtTime(.0001,state.audio.currentTime,.12);setTimeout(()=>pad.oscillators.forEach(o=>{try{o.stop();}catch{}}),800);}
});
$('bestScore').textContent=`${state.peak.toLocaleString()} PTS`;$('runCount').textContent=`FLIGHTS ${state.climbs}`;setScene(0);updateScore();updatePips();
