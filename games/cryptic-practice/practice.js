(()=>{'use strict';
 const {clues,normalize}=window.ClueGarden,$=id=>document.getElementById(id),KEY='clue-garden-v1',labels={anagram:'Anagram',hidden:'Hidden word',reversal:'Reversal',charade:'Charade',container:'Container'};
 const get=()=>{try{return JSON.parse(localStorage.getItem(KEY));}catch{return null;}},save=()=>{try{localStorage.setItem(KEY,JSON.stringify(records));}catch{}};
 const raw=get(),records={};for(const q of clues){const r=raw?.[q.id];if(r&&['solved','revealed'].includes(r.outcome))records[q.id]={outcome:r.outcome};}
 let filter='all',queue=[],current=clues[0],hints=0,attempts=0,done=false,round=1,lastId=null;
 function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}if(a.length>1&&a[0].id===lastId)[a[0],a[1]]=[a[1],a[0]];return a;}
 const pool=()=>clues.filter(q=>filter==='all'||q.type===filter);
 function drawClue(){const text=$('clueText');text.replaceChildren();
  const highlights=[];if(hints>=1||done)highlights.push({value:current.definition,kind:'definition'});if(done)highlights.push({value:current.indicator,kind:'indicator'});
  let offset=0;const points=highlights.map(h=>({...h,start:current.clue.indexOf(h.value)})).sort((a,b)=>a.start-b.start);
  for(const h of points){if(h.start<offset)continue;text.append(document.createTextNode(current.clue.slice(offset,h.start)));const n=document.createElement(h.kind==='definition'?'mark':'span');n.textContent=h.value;n.className=h.kind;text.append(n);offset=h.start+h.value.length;}
  text.append(document.createTextNode(current.clue.slice(offset)+' '));const enumeration=document.createElement('span');enumeration.className='enumeration';enumeration.textContent=`(${current.answer.length})`;text.append(enumeration);
 }
 function progress(){const solved=Object.values(records).filter(r=>r.outcome==='solved').length,revealed=Object.values(records).filter(r=>r.outcome==='revealed').length;
  $('solved').textContent=solved;$('solvedMini').textContent=solved;$('revealedMini').textContent=revealed;$('gardenDots').replaceChildren();
  clues.forEach(q=>{const n=document.createElement('i'),outcome=records[q.id]?.outcome;n.className=outcome||'';n.title=`${q.id}: ${outcome||'not completed'}`;n.setAttribute('aria-hidden','true');$('gardenDots').append(n);});$('gardenDots').setAttribute('aria-label',`${solved} solved, ${revealed} revealed, ${20-solved-revealed} not completed`);
 }
 function next(){if(!queue.length){queue=shuffle(pool());if(lastId)round++;}current=queue.shift();lastId=current.id;hints=0;attempts=0;done=false;
  const n=pool().length; $('clueNumber').textContent=`CLUE ${String(n-queue.length).padStart(2,'0')} / ${String(n).padStart(2,'0')}`;$('difficulty').textContent=current.difficulty;
  $('bankSize').textContent=`${n} original ${n===1?'clue':'clues'} · no daily limit`;$('roundLabel').textContent=round===1?'A FRESH LITTLE PATCH':`PRACTICE ROUND ${round} · CLUES REPEAT`;
  $('answer').value='';$('answer').disabled=false;$('answer').removeAttribute('aria-invalid');$('answerLabel').textContent=`Your answer · ${current.answer.length} letters`;$('check').disabled=false;
  $('feedback').textContent='Take your time. There’s no clock here.';$('feedback').className='';$('hintList').replaceChildren();$('hintList').hidden=true;$('hint').disabled=false;$('hintCount').textContent='0 / 3';$('reveal').disabled=false;$('explanation').hidden=true;
  const old=records[current.id];$('previousStatus').hidden=!old;$('previousStatus').textContent=old?`You ${old.outcome==='solved'?'solved':'revealed'} this one before. Here’s another little practice.`:'';
  drawClue();
 }
 function finish(revealed){if(done)return;done=true;
  // Replaying a revealed clue can become a solve; a later reveal never erases an earlier solve.
  if(records[current.id]?.outcome!=='solved')records[current.id]={outcome:revealed?'revealed':'solved'};
  save();progress();$('answer').value=current.answer;$('answer').disabled=true;$('check').disabled=true;$('hint').disabled=true;$('reveal').disabled=true;$('explanation').hidden=false;
  $('feedback').textContent=revealed?'A peek is part of learning. Let’s unpack it.':'That’s it. A lovely little discovery.';$('feedback').className='';$('resultKind').textContent=revealed?'ANSWER REVEALED':'YOU FOUND IT.';$('resultWord').textContent=current.answer;
  $('explanationText').textContent=current.explanation;$('definitionPart').textContent=current.definition;$('wordplayPart').textContent=`${labels[current.type]} · “${current.indicator}”`;
  $('resultSummary').textContent=revealed?'Marked as revealed for this round.':`Solved in ${attempts} ${attempts===1?'try':'tries'} with ${hints} ${hints===1?'nudge':'nudges'}.`;
  drawClue();
 }
 $('answerForm').addEventListener('submit',e=>{e.preventDefault();if(done)return;const answer=normalize($('answer').value);
  if(!answer){$('feedback').textContent='Try a word first. A hunch is enough to begin.';$('feedback').className='error';$('answer').setAttribute('aria-invalid','true');return;}
  attempts++;if(answer===current.answer)finish(false);else{$('feedback').textContent=answer.length!==current.answer.length?`This answer needs ${current.answer.length} letters. Try another thought.`:'Not quite this time. Try another word or take a gentle nudge.';$('feedback').className='error';$('answer').setAttribute('aria-invalid','true');}
 });
 $('answer').addEventListener('input',()=>$('answer').removeAttribute('aria-invalid'));
 $('hint').addEventListener('click',()=>{if(done||hints>=3)return;const text=[`The definition is “${current.definition}”. Look for a word with ${current.answer.length} letters.`,`${labels[current.type]}: ${current.hint}`,current.nudge][hints];hints++;const li=document.createElement('li');li.textContent=text;$('hintList').append(li);$('hintList').hidden=false;$('hintCount').textContent=`${hints} / 3`;$('hint').disabled=hints>=3;$('feedback').textContent=`Nudge ${hints} is open below. Keep following your hunch.`;$('feedback').className='';drawClue();});
 $('reveal').addEventListener('click',()=>$('revealDialog').showModal());$('confirmReveal').addEventListener('click',()=>finish(true));
 $('next').addEventListener('click',next);$('skip').addEventListener('click',next);
 $('typeFilter').addEventListener('change',()=>{filter=$('typeFilter').value;queue=[];round=1;lastId=null;next();});
 document.querySelectorAll('[data-type]').forEach(b=>b.addEventListener('click',()=>{$('typeFilter').value=b.dataset.type;$('typeFilter').dispatchEvent(new Event('change'));$('puzzle').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}));
 $('reset').addEventListener('click',()=>$('resetDialog').showModal());$('confirmReset').addEventListener('click',()=>{for(const id of Object.keys(records))delete records[id];save();progress();queue=[];round=1;lastId=null;next();});
 progress();next();
})();
