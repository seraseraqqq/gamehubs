const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../engine.js');
function solution(state){const schedule=[];let safety=0;while(state.remaining>0&&safety++<80){
 let wait=null;for(let step=0;step<18000;step++){
  const delay=step*.012,arrival=state.time+delay+E.FLIGHT;
  const candidate=E.wrap(E.ENTRY-E.rotationAt(state.level,arrival,state.scale));
  if(state.pins.every(p=>E.gap(p,candidate)>E.MIN_GAP+.035)){wait=delay;break;}
 }
 assert.notEqual(wait,null,`No safe opening in level ${state.level.id}`);E.advance(state,wait);schedule.push(state.time);assert.equal(E.launch(state),true);E.advance(state,E.FLIGHT);assert.notEqual(state.status,'lost');
 }assert.equal(state.status,'won');return schedule;}
test('all 30 original challenges have a playable, collision-free solution',()=>{
 const counts=[];for(let i=1;i<=30;i++){const s=E.create(i);const schedule=solution(s);counts.push(schedule.length);assert.equal(s.pins.length,s.level.initial+s.level.shots);assert.equal(s.remaining,0);assert.ok(Number.isFinite(s.activeTime));}
 assert.equal(counts.length,30);
});
test('practice also solves all levels while keeping challenge inputs unchanged',()=>{
 for(let i=1;i<=30;i++){const s=E.create(i,true);solution(s);assert.equal(s.scale,.7);assert.equal(s.practice,true);}
});
test('one pin at a time: held/rapid launch cannot bypass the flight',()=>{const s=E.create(1);assert.ok(E.launch(s));assert.equal(E.launch(s),false);E.advance(s,.1);assert.equal(E.launch(s),false);assert.equal(s.remaining,5);});
test('pausing preserves clock and shot position and refuses new input',()=>{const s=E.create();E.launch(s);E.advance(s,.1);const t=s.time;E.setPaused(s,true);E.advance(s,100);assert.equal(s.time,t);assert.equal(E.launch(s),false);E.setPaused(s,false);E.advance(s,.14);assert.equal(s.flight,null);});
test('known collisions fail without attaching a pin or decrementing remaining',()=>{const s=E.create();s.pins=[E.wrap(E.ENTRY-E.rotationAt(s.level,E.FLIGHT))];const n=s.remaining;E.launch(s);E.advance(s,E.FLIGHT);assert.equal(s.status,'lost');assert.equal(s.remaining,n);assert.equal(s.pins.length,1);assert.equal(E.launch(s),false);});
test('large frame and subdivided time produce the same shot outcome',()=>{
 const a=E.create(17),b=E.create(17);E.launch(a);E.launch(b);E.advance(a,.6);for(let i=0;i<60;i++)E.advance(b,.01);assert.equal(a.status,b.status);assert.equal(a.remaining,b.remaining);assert.ok(E.gap(a.last.angle,b.last.angle)<1e-8);
});
test('completed and failed rounds do not change after additional time',()=>{const s=E.create();solution(s);const t=s.time,p=s.pins.length;E.advance(s,30);assert.equal(s.time,t);assert.equal(s.pins.length,p);});
test('fresh levels restart clean and invalid IDs/times are rejected',()=>{assert.throws(()=>E.create(0));assert.throws(()=>E.create(31));assert.throws(()=>E.create(1.2));assert.throws(()=>E.advance(E.create(),NaN));assert.throws(()=>E.advance(E.create(),-1));const s=E.create(12);E.launch(s);const fresh=E.create(12);assert.equal(fresh.status,'ready');assert.equal(fresh.flight,null);assert.equal(fresh.remaining,fresh.level.shots);});
