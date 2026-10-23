/* Original deterministic timing-puzzle engine. No third-party level data. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.OrbitEngine=api;})(typeof window!=='undefined'?window:globalThis,()=>{
 'use strict';
 const TAU=Math.PI*2,ENTRY=Math.PI/2,FLIGHT=.24,MIN_GAP=2*Math.asin(18/(2*140));
 const wrap=a=>((a%TAU)+TAU)%TAU;
 const gap=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
 const levels=Object.freeze(Array.from({length:30},(_,i)=>{
  const chapter=Math.floor(i/10),n=i%10;
  return Object.freeze({id:i+1,name:['Finding a rhythm','A change of pace','Into the flow'][chapter],
   initial:3+Math.floor(n/3)+chapter*2,shots:5+Math.floor(n/2)+chapter*2,
   speed:(.48+n*.055+chapter*.12)*(i%4===2?-1:1),
   wave:chapter===0?0:chapter===1?.32:.58,frequency:.7+(i%3)*.18,phase:wrap(i*1.137)});
 }));
 function rotationAt(level,time,scale=1){
  const t=time*scale;
  return level.phase+level.speed*(t+level.wave*(1-Math.cos(t*level.frequency))/level.frequency);
 }
 function create(levelId=1,practice=false){
  if(!Number.isInteger(levelId)||levelId<1||levelId>levels.length)throw new RangeError('Choose a level from 1 to 30');
  const level=levels[levelId-1];
  return {level,practice,scale:practice?.7:1,time:0,activeTime:0,status:'ready',paused:false,
   pins:Array.from({length:level.initial},(_,i)=>TAU*i/level.initial),remaining:level.shots,flight:null,last:null};
 }
 function launch(state){
  if(state.paused||state.flight||!['ready','playing'].includes(state.status))return false;
  if(state.status==='ready')state.status='playing';
  state.flight={start:state.time,arrival:state.time+FLIGHT};state.last=null;return true;
 }
 function finishShot(state){
  const angle=wrap(ENTRY-rotationAt(state.level,state.time,state.scale));
  const collision=state.pins.some(p=>gap(p,angle)<MIN_GAP);
  state.flight=null;state.last={angle,collision};
  if(collision){state.status='lost';return;}
  state.pins.push(angle);state.remaining--;
  if(state.remaining===0)state.status='won';
 }
 function advance(state,seconds){
  if(!Number.isFinite(seconds)||seconds<0)throw new RangeError('Expected finite nonnegative elapsed time');
  if(state.paused||!['ready','playing'].includes(state.status))return;
  const end=state.time+seconds;
  if(state.flight&&state.flight.arrival<=end+1e-9){
   const dt=Math.max(0,state.flight.arrival-state.time);state.time+=dt;
   if(state.status==='playing')state.activeTime+=dt;
   finishShot(state);
  }
  if(['ready','playing'].includes(state.status)){
   if(state.status==='playing')state.activeTime+=end-state.time;state.time=end;
  }
 }
 function setPaused(state,value){state.paused=Boolean(value);}
 return Object.freeze({levels,create,launch,advance,setPaused,rotationAt,gap,wrap,FLIGHT,MIN_GAP,ENTRY});
});
