/* Local, bounded-perception opponents. No network, language model or player-only targeting. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.GulperBots = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const profiles = Object.freeze({
    collector: Object.freeze({id:'collector', reaction:14, jitter:8, vision:540, caution:1.25, aggression:.06, greed:1.3, error:.11, lapse:.05, commitment:55, chase:85, sprint:.18}),
    hunter: Object.freeze({id:'hunter', reaction:9, jitter:5, vision:610, caution:.95, aggression:.72, greed:.7, error:.07, lapse:.025, commitment:36, chase:150, sprint:.48}),
    drifter: Object.freeze({id:'drifter', reaction:17, jitter:10, vision:500, caution:1.1, aggression:.24, greed:1, error:.16, lapse:.08, commitment:70, chase:110, sprint:.3}),
    rookie: Object.freeze({id:'rookie', reaction:22, jitter:13, vision:430, caution:.8, aggression:.16, greed:1.2, error:.28, lapse:.12, commitment:90, chase:75, sprint:.22})
  });
  const clamp = (n,lo,hi) => Math.max(lo,Math.min(hi,n));
  const difference = (a,b) => Math.atan2(Math.sin(a-b),Math.cos(a-b));
  const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);

  function createBrain({style='collector', random=Math.random}={}) {
    const profile = profiles[style] || profiles.collector;
    return {profile,random,tick:0,nextThink:Math.floor(random()*profile.reaction),
      hand:random()<.5?-1:1,goal:null,state:'wander',decisions:0,
      boostUntil:0,boostRestUntil:0,huntRestUntil:0,avoidAngle:null};
  }

  function visibleRivals(bot,snakes,range) {
    return snakes.filter(s=>s!==bot&&!s.isDead&&distance(bot,s)<range);
  }

  function chooseGoal(brain,bot,foods,rivals,worldRadius) {
    const p=brain.profile, rand=brain.random;
    // Only an approaching nearby head causes a retreat. No knowledge of distant opponents.
    const threat=rivals.find(s=>s.shieldTimer<=0 && s.score>bot.score*1.35 &&
      distance(bot,s)<160+p.caution*85 &&
      (bot.x-s.x)*Math.cos(s.angle)+(bot.y-s.y)*Math.sin(s.angle)>distance(bot,s)*.3);
    if(threat) {
      const a=Math.atan2(bot.y-threat.y,bot.x-threat.x)+brain.hand*.35;
      return {kind:'flee',x:bot.x+Math.cos(a)*230,y:bot.y+Math.sin(a)*230,expires:brain.tick+30};
    }
    const old=brain.goal;
    if(old?.kind==='hunt' && brain.tick>=old.expires) brain.huntRestUntil=brain.tick+120;
    if(old && brain.tick<old.expires) {
      if(old.food && foods.includes(old.food) && distance(bot,old.food)<p.vision) return old;
      if(old.prey && !old.prey.isDead && old.prey.shieldTimer<=0 && distance(bot,old.prey)<p.vision) return old;
      if(old.kind==='wander' && distance(bot,old)>60) return old;
    }
    // All rivals are eligible, including other bots. Shielded and tiny starters are left alone.
    if(bot.shieldTimer<=0 && brain.tick>=brain.huntRestUntil && rand()<p.aggression) {
      const prey=rivals.filter(s=>s.shieldTimer<=0 && s.score>=130 && bot.score>s.score*.85 &&
        distance(bot,s)>100 && distance(bot,s)<p.vision*.8)
        .sort((a,b)=>distance(bot,a)-distance(bot,b))[0];
      if(prey) return {kind:'hunt',prey,expires:brain.tick+p.chase};
    }
    let best=null, value=-Infinity;
    for(const food of foods) {
      const d=distance(bot,food);
      if(d>p.vision) continue;
      const turn=Math.abs(difference(Math.atan2(food.y-bot.y,food.x-bot.x),bot.angle));
      const merit=food.mass*48*p.greed-d*.45-turn*24;
      if(merit>value){value=merit;best=food;}
    }
    if(best) {
      const contested=rivals.some(s=>s.shieldTimer<=0 && distance(s,best)<distance(bot,best)+30 && distance(s,best)<180);
      return {kind:contested?'contest':'forage',food:best,expires:brain.tick+p.commitment};
    }
    const a=bot.angle+brain.hand*(.35+rand()*.8),r=worldRadius-240;
    return {kind:'wander',x:clamp(bot.x+Math.cos(a)*300,-r,r),y:clamp(bot.y+Math.sin(a)*300,-r,r),expires:brain.tick+90+rand()*90};
  }

  function goalPoint(goal,bot,hand) {
    if(goal.food) return goal.food;
    if(goal.prey) {
      const prey=goal.prey,lead=clamp(distance(bot,prey)*.32,45,100),flank=hand*(45+prey.radius);
      // A short, fallible intercept guess, updated only when the bot reacts again.
      return {x:prey.x+Math.cos(prey.angle)*lead-Math.sin(prey.angle)*flank,
        y:prey.y+Math.sin(prey.angle)*lead+Math.cos(prey.angle)*flank};
    }
    return goal;
  }

  function nearbyBody(bot,snakes,range) {
    const hazards=[];
    for(const other of snakes) {
      if(other===bot || other.isDead || other.shieldTimer>0) continue;
      const r=other.radius;
      for(let i=0;i<other.segments.length;i+=2) {
        const seg=other.segments[i];
        if(Math.abs(seg.x-bot.x)>range+r || Math.abs(seg.y-bot.y)>range+r) continue;
        if(distance(bot,seg)<range+r) hazards.push({x:seg.x,y:seg.y,r});
      }
      // Anticipate a nearby moving head, with a small fixed prediction horizon.
      if(distance(bot,other)<range) hazards.push({x:other.x+Math.cos(other.angle)*other.speed*10,
        y:other.y+Math.sin(other.angle)*other.speed*10,r});
    }
    return hazards;
  }

  function clearance(bot,heading,hazards,worldRadius,speed) {
    let x=bot.x,y=bot.y,a=bot.angle,space=Infinity;
    // Simulate the same finite turning rate as the player, rather than teleporting the heading.
    for(let step=0;step<7;step++) {
      a+=clamp(difference(heading,a),-bot.turnRate*5,bot.turnRate*5);
      x+=Math.cos(a)*speed*5;y+=Math.sin(a)*speed*5;
      space=Math.min(space,worldRadius-Math.hypot(x,y)-bot.radius-12);
      for(const h of hazards) space=Math.min(space,Math.hypot(x-h.x,y-h.y)-bot.radius-h.r*.72);
    }
    return space;
  }

  function step(brain,bot,foods,snakes,worldRadius) {
    brain.tick++;
    if(brain.tick>=brain.boostUntil || bot.score<140 || bot.shieldTimer>0) bot.isBoosting=false;
    // Visible edge cue is a hard stop for sprinting; smaller turns still use normal physics.
    if(Math.hypot(bot.x,bot.y)>worldRadius-180-bot.radius) {
      bot.targetAngle=Math.atan2(-bot.y,-bot.x)+brain.hand*.15;
      bot.isBoosting=false;brain.boostUntil=0;brain.state='return';brain.goal=null;
      return;
    }
    if(brain.tick<brain.nextThink) return;
    brain.decisions++;
    const p=brain.profile,rand=brain.random;
    const lapse=rand()<p.lapse;
    brain.nextThink=brain.tick+p.reaction+Math.floor(rand()*p.jitter)+(lapse?18+Math.floor(rand()*20):0);
    const rivals=visibleRivals(bot,snakes,p.vision);
    brain.goal=chooseGoal(brain,bot,foods,rivals,worldRadius);
    const point=goalPoint(brain.goal,bot,brain.hand);
    const aim=Math.atan2(point.y-bot.y,point.x-bot.x)+(rand()-.5)*p.error*(lapse?3:1);
    const hazards=nearbyBody(bot,snakes,bot.boostSpeed*35+bot.radius+60);
    const desiredSpace=clearance(bot,aim,hazards,worldRadius,bot.baseSpeed);
    let heading=aim;
    brain.state=brain.goal.kind;
    if(desiredSpace<35*p.caution) {
      const options=[aim,bot.angle+brain.hand*.75,bot.angle-brain.hand*.75,
        bot.angle+brain.hand*1.4,bot.angle-brain.hand*1.4,bot.angle+brain.hand*2.2];
      let best=-Infinity;
      for(const angle of options) {
        const room=clearance(bot,angle,hazards,worldRadius,bot.baseSpeed);
        const continuity=brain.avoidAngle===null?0:Math.abs(difference(angle,brain.avoidAngle))*.12;
        const merit=clamp(room,-200,100)-Math.abs(difference(angle,aim))*13-continuity;
        if(merit>best){best=merit;heading=angle;}
      }
      brain.avoidAngle=heading;brain.state='avoid';
      brain.boostUntil=0;bot.isBoosting=false;
    } else brain.avoidAngle=null;
    bot.targetAngle=heading;
    if(brain.state==='avoid') return;
    const sprintGoal=['hunt','contest','flee'].includes(brain.state) || (brain.goal.food?.mass>=3 && distance(bot,point)>110);
    const aligned=Math.abs(difference(heading,bot.angle))<.4;
    if(brain.tick>=brain.boostRestUntil && bot.score>190 && bot.shieldTimer<=0 && sprintGoal && aligned &&
      rand()<p.sprint && clearance(bot,heading,hazards,worldRadius,bot.boostSpeed)>55*p.caution) {
      const duration=10+Math.floor(rand()*19);
      brain.boostUntil=brain.tick+duration;
      brain.boostRestUntil=brain.boostUntil+75+Math.floor(rand()*105);
      bot.isBoosting=true;
    }
  }
  return Object.freeze({profiles,createBrain,step});
});
