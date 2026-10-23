const {test}=require('node:test');
const assert=require('node:assert/strict');
const {createBrain,step,profiles}=require('../bot-brain.js');
function snake(overrides={}) {return {x:0,y:0,angle:0,targetAngle:0,score:350,radius:13,turnRate:.09,
  speed:3.6,baseSpeed:3.6,boostSpeed:7,shieldTimer:0,isDead:false,isPlayer:false,isBoosting:false,
  segments:[{x:0,y:0},{x:-10,y:0}],...overrides};}
function brain(style='collector',value=.5){const b=createBrain({style,random:()=>value});b.nextThink=0;return b;}
function react(b,s,food=[],others=[]){b.nextThink=0;step(b,s,food,[s,...others],1600);}
test('different styles have distinct reaction, perception and risk profiles',()=>{
 assert.equal(Object.keys(profiles).length,4);assert.ok(profiles.rookie.reaction>profiles.hunter.reaction);
 assert.ok(profiles.hunter.aggression>profiles.collector.aggression);assert.ok(profiles.collector.caution>profiles.rookie.caution);
});
test('reaction delay holds a decision instead of tracking every frame',()=>{
 const b=brain(),s=snake();react(b,s,[{x:100,y:0,mass:1}]);const a=s.targetAngle,n=b.decisions;
 step(b,s,[{x:0,y:100,mass:4}],[s],1600);assert.equal(s.targetAngle,a);assert.equal(b.decisions,n);
});
test('food beyond perception is not tracked; nearby food gives a goal',()=>{
 const b=brain(),s=snake();react(b,s,[{x:1100,y:200,mass:100}]);assert.equal(b.state,'wander');
 b.goal=null;react(b,s,[{x:120,y:20,mass:2}]);assert.equal(b.goal.kind,'forage');
});
test('food commitment persists and consumed food is forgotten',()=>{
 const b=brain(),s=snake(),f={x:160,y:0,mass:2},bait={x:40,y:60,mass:6};react(b,s,[f]);
 react(b,s,[f,bait]);assert.equal(b.goal.food,f);react(b,s,[bait]);assert.equal(b.goal.food,bait);
});
test('hunter can intercept another bot without any player present',()=>{
 const b=brain('hunter',.2),s=snake({score:600}),r=snake({x:240,y:70,score:220,angle:Math.PI/2,segments:[{x:240,y:70}]});
 react(b,s,[],[r]);assert.equal(b.goal.kind,'hunt');assert.equal(b.goal.prey,r);assert.notEqual(s.targetAngle,Math.atan2(r.y,r.x));
});
test('shielded and tiny starters are excluded from hunting',()=>{
 for(const override of [{score:220,shieldTimer:180},{score:100,shieldTimer:0}]){
  const b=brain('hunter',.2),s=snake({score:600}),r=snake({x:250,y:80,segments:[{x:250,y:80}],...override});
  react(b,s,[],[r]);assert.notEqual(b.goal.kind,'hunt');
 }
});
test('distant prey cannot be pursued using global knowledge',()=>{
 const b=brain('hunter',.2),s=snake({score:1000}),r=snake({x:1100,y:0,score:200,segments:[{x:1100,y:0}]});
 react(b,s,[],[r]);assert.notEqual(b.goal.kind,'hunt');
});
test('larger approaching rival prompts retreat, even if it is a bot',()=>{
 const b=brain(),s=snake(),r=snake({x:170,y:30,score:1200,angle:Math.PI,segments:[{x:170,y:30}]});
 react(b,s,[],[r]);assert.equal(b.goal.kind,'flee');assert.ok(b.goal.x<0);
});
test('obstructed path chooses a detour and cancels sprinting',()=>{
 const b=brain(),s=snake({isBoosting:true}),r=snake({x:90,y:0,score:200,segments:[{x:90,y:0},{x:90,y:15},{x:90,y:30},{x:90,y:-15},{x:90,y:-30}]});
 b.boostUntil=90;react(b,s,[{x:250,y:0,mass:4}],[r]);assert.equal(b.state,'avoid');assert.equal(s.isBoosting,false);assert.ok(Math.abs(s.targetAngle)>.4);
});
test('edge retreat overrides food and boost safely',()=>{
 const b=brain(),s=snake({x:1490,isBoosting:true});b.boostUntil=200;
 react(b,s,[{x:1590,y:0,mass:9}]);assert.equal(b.state,'return');assert.equal(s.isBoosting,false);assert.ok(Math.cos(s.targetAngle)<0);
});
test('boosts are bounded bursts with a rest period; low mass never boosts',()=>{
 const b=brain('hunter',.2),s=snake({score:650}),f={x:270,y:0,mass:4};react(b,s,[f]);assert.equal(s.isBoosting,true);
 const end=b.boostUntil,rest=b.boostRestUntil;assert.ok(end-b.tick<=28);assert.ok(rest>end+70);
 for(let i=0;i<35;i++)step(b,s,[f],[s],1600);
 assert.equal(s.isBoosting,false);assert.ok(b.tick<rest);assert.equal(b.boostRestUntil,rest);
 const low=snake({score:100});react(brain('hunter',.2),low,[f]);assert.equal(low.isBoosting,false);
});
test('chases end and cannot immediately lock onto the same rival forever',()=>{
 const b=brain('hunter',.2),s=snake({score:650}),r=snake({x:240,y:70,score:220,segments:[{x:240,y:70}]});
 react(b,s,[],[r]);assert.equal(b.goal.kind,'hunt');b.tick=b.goal.expires;react(b,s,[],[r]);assert.notEqual(b.goal.kind,'hunt');assert.ok(b.huntRestUntil>b.tick);
});
test('rookie lapses add delayed reaction and steering error without invalid coordinates',()=>{
 const b=brain('rookie',.01),s=snake();react(b,s,[{x:200,y:0,mass:1}]);
 assert.ok(b.nextThink-b.tick>profiles.rookie.reaction);assert.ok(Math.abs(s.targetAngle)>.1);assert.ok(Number.isFinite(s.targetAngle));
});
