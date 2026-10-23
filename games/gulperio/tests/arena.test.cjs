const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function arena(seed=51) {
 let value=seed;
 const random=()=>{value=(value*16807)%2147483647;return (value-1)/2147483646;};
 const math=Object.create(Math);math.random=random;
 const elements=new Map();
 const element=id=>{
  if(!elements.has(id))elements.set(id,{value:'Test pilot',style:{},classList:{add(){}},textContent:'',close(){},showModal(){},focus(){}});
  return elements.get(id);
 };
 const context=vm.createContext({Math:math,console,window:{addEventListener(){}},document:{getElementById:element},clearTimeout(){},setTimeout(){return 1;},requestAnimationFrame(){return 1;}});
 const dir=path.join(__dirname,'..');
 vm.runInContext(fs.readFileSync(path.join(dir,'bot-brain.js'),'utf8'),context);
 let source=fs.readFileSync(path.join(dir,'game.js'),'utf8');
 source=source.replace("  window.addEventListener('DOMContentLoaded'", "  window.ArenaTest = { Snake, GameEngine };\n  window.addEventListener('DOMContentLoaded'");
 vm.runInContext(source,context);
 const e=Object.create(context.window.ArenaTest.GameEngine.prototype);
 const sound=new Proxy({}, {get:()=>()=>{}});
 Object.assign(e,{soundEngine:sound,bestScore:0,selectedSkinIndex:0,mouse:{x:0,y:0,isDown:false},canvas:{focus(){}},displayWidth:936,displayHeight:620,camera:{x:0,y:0,zoom:1},snakes:[],rafId:1});
 e.startGame();return e;
}
test('start creates a varied roster and bots keep normal movement physics',()=>{
 const e=arena(),bots=e.snakes.filter(s=>!s.isPlayer);
 assert.equal(bots.length,18);assert.equal(new Set(bots.map(b=>b.name)).size,18);
 assert.equal(new Set(bots.map(b=>b.brain.profile.id)).size,4);
 assert.equal(e.player.brain,null);
 for(const b of bots){assert.ok(b.turnRate<=.095);assert.ok(b.boostSpeed<=7);assert.ok(b.brain);}
});
test('death queues a varied delay, then restores the same rival identity',()=>{
 const e=arena(),bot=e.snakes[2];const identity={name:bot.name,skin:bot.skin,style:bot.brain.profile.id,id:bot.id,idx:bot.rosterIndex};
 bot.isDead=true;e.update();
 const pending=e.botRespawns.find(p=>p.idx===identity.idx);assert.ok(pending);assert.ok(pending.at-e.runFrame>=150&&pending.at-e.runFrame<330);
 e.runFrame=pending.at-1;e.update();
 const replacement=e.snakes.find(b=>b.rosterIndex===identity.idx&&!b.isDead);
 assert.equal(replacement.name,identity.name);assert.equal(replacement.skin,identity.skin);assert.equal(replacement.brain.profile.id,identity.style);assert.notEqual(replacement.id,identity.id);
 assert.ok(replacement.score<=130);assert.ok(replacement.shieldTimer>0);
});
test('new run clears old respawn queues and preserves population bounds',()=>{
 const e=arena();e.snakes[3].isDead=true;e.update();assert.ok(e.botRespawns.length);
 e.startGame();assert.equal(e.botRespawns.length,0);assert.equal(e.snakes.length,19);
 for(let frame=0;frame<350;frame++)e.update();
 const living=e.snakes.filter(s=>!s.isPlayer&&!s.isDead);
 assert.ok(living.length<=18);assert.equal(new Set(living.map(b=>b.rosterIndex)).size,living.length);
});
test('seeded 3600-frame arena exercises competing bots, deaths and varied behavior',t=>{
 const e=arena(2026);e.player.isDead=true;
 const states=new Set(),styles=new Set(),huntsOnBots=new Set();let respawns=0,boostFrames=0,maxBots=0;
 const actualSpawn=e.spawnBot;e.spawnBot=function(...args){respawns++;return actualSpawn.apply(this,args);};
 for(let frame=0;frame<3600;frame++){
  e.update();const bots=e.snakes.filter(s=>!s.isPlayer&&!s.isDead);maxBots=Math.max(maxBots,bots.length);
  assert.ok(bots.length<=18);assert.equal(new Set(bots.map(b=>b.rosterIndex)).size,bots.length);
  for(const b of bots){
   assert.ok(Number.isFinite(b.x)&&Number.isFinite(b.y)&&Number.isFinite(b.targetAngle));
   states.add(b.brain.state);styles.add(b.brain.profile.id);if(b.isBoosting)boostFrames++;
   if(b.brain.goal?.prey&&!b.brain.goal.prey.isPlayer)huntsOnBots.add(b.name);
  }
 }
 assert.equal(styles.size,4);assert.ok(states.has('hunt'));assert.ok(states.has('forage'));assert.ok(states.has('avoid'));assert.ok(states.has('return'));
 assert.ok(respawns>0);assert.ok(huntsOnBots.size>1);assert.ok(boostFrames>0);assert.equal(maxBots,18);
 t.diagnostic(JSON.stringify({frames:3600,states:[...states],respawns,boostFrames,hunters:huntsOnBots.size,maxBots}));
});

test('boundary death reports the player result once instead of stranding the arena',()=>{
 const e=arena();let reports=0;e.soundEngine={playExplosion(){},stopBoost(){reports++;}};
 e.player.x=1602;e.player.y=0;e.player.angle=0;e.player.targetAngle=0;
 e.update();assert.equal(e.player.isDead,true);assert.equal(e.resultForPlayer,e.player);assert.equal(reports,1);
 e.update();assert.equal(reports,1);
});
