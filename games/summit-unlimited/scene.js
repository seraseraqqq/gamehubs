/* The world uses a low-resolution canvas; text remains sharp, accessible HTML. */
(() => {
  const canvas = document.getElementById('universe'), ctx = canvas.getContext('2d', { alpha: false });
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const assets = {};
  const names = ['rocket', 'spaceport', 'earth', 'moon', 'mars', 'jupiter', 'saturn', 'sun', 'satellite', 'asteroids', 'beacon', 'galaxy', 'cloud', 'meteor'];
  const ready = Promise.all(names.map(name => new Promise(resolve => {
    const image = new Image(); assets[name] = image; image.onload = resolve; image.onerror = () => resolve(); image.src = `./assets/pixel/${name}.png`;
  })));
  const palettes = [
    [[45, 92, 116], [134, 181, 187]], [[12, 38, 68], [61, 125, 155]],
    [[5, 17, 35], [17, 43, 67]], [[10, 18, 35], [51, 37, 52]],
    [[9, 19, 35], [40, 45, 61]], [[6, 18, 34], [19, 45, 65]],
    [[9, 17, 37], [33, 46, 73]], [[5, 13, 28], [17, 35, 51]]
  ];
  let width = 640, height = 360, stage = 0, transition = null, clock = 0, lastFrame = 0, frame = 0;
  let seed = 51;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const stars = Array.from({length: 155}, () => ({x: random(), y: random(), depth: 0.2 + random() * .8, phase: random() * 10}));
  const dust = Array.from({length: 32}, () => ({x: random(), y: random(), speed: .4 + random(), phase: random() * 12}));
  const web = Array.from({length: 28}, () => ({x: random(), y: random()}));
  function resize() {
    width = canvas.width = Math.round(canvas.clientWidth / 3);
    height = canvas.height = Math.round(canvas.clientHeight / 3);
    ctx.imageSmoothingEnabled = false;
    frame = 0;
  }
  const mix = (a,b,p) => a.map((v,i) => Math.round(v + (b[i]-v)*p));
  const rgb = values => `rgb(${values.join(',')})`;
  const ease = p => p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2;
  const mod = (n,m) => ((n % m)+m)%m;
  function sprite(name, x, y, w, alpha = 1, angle = 0) {
    const image = assets[name]; if (!image?.complete || !image.naturalWidth || alpha <= 0) return;
    const h = Math.round(w * image.naturalHeight / image.naturalWidth);
    ctx.save(); ctx.globalAlpha = alpha; ctx.translate(Math.round(x), Math.round(y)); if (angle) ctx.rotate(angle);
    ctx.drawImage(image, -Math.round(w/2), -Math.round(h/2), Math.round(w), h); ctx.restore();
  }
  function sky(time, from, to, p, velocity) {
    const top = mix(palettes[from][0], palettes[to][0], p), bottom = mix(palettes[from][1], palettes[to][1], p);
    // Deliberate color bands, rather than soft painted gradients.
    for (let row = 0; row < height; row += 5) { ctx.fillStyle = rgb(mix(top,bottom,row/height)); ctx.fillRect(0,row,width,5); }
    for (const s of stars) {
      const x = Math.floor(s.x*width), y = Math.floor(mod(s.y*height + time*s.depth*1.5 + velocity*s.depth*80, height));
      ctx.globalAlpha = (stage < 2 ? .27 : .56) + Math.sin(time*.8+s.phase)*.18;
      ctx.fillStyle = s.depth > .8 ? '#d6e9d5' : '#709cac';
      ctx.fillRect(x,y,1, Math.max(1,Math.round(velocity*s.depth*7)));
      if (s.depth>.96 && Math.sin(time+s.phase)>.5) {ctx.fillRect(x-1,y+1,3,1);ctx.fillRect(x,y,1,3);}
    }
    ctx.globalAlpha = 1;
  }
  function clouds(time, alpha, offset=0) {
    for (let i = 0; i < 6; i++) {
      const x = mod(i*width/3 + time*(i%2?2:4), width+100)-50;
      sprite('cloud',x,height*(.27+(i%3)*.20)+offset, i%2?90:135,alpha*(i%2?.2:.38));
    }
  }
  function world(index, time, offset, alpha, horizontal = 0, scale = 1) {
    ctx.save(); ctx.translate(Math.round(horizontal),Math.round(offset));
    if (scale !== 1) { ctx.translate(width/2,height/2); ctx.scale(scale,scale); ctx.translate(-width/2,-height/2); }
    ctx.globalAlpha = alpha;
    if (index === 0) {
      clouds(time,alpha);
      sprite('moon',width*.81,height*.23,25,alpha*.7);
      if (assets.spaceport.complete && assets.spaceport.naturalWidth) {
        const portHeight = width*360/640;
        ctx.drawImage(assets.spaceport,0,height-portHeight,width,portHeight);
      }
      // Service lights and independent wind-blown vapor on the pad.
      ctx.fillStyle = Math.sin(time*3)>0?'#fa7183':'#7c4a64';
      ctx.fillRect(Math.round(width*.074),Math.round(height-width*.312),2,2);
      for(let i=0;i<8;i++){ctx.fillStyle=`rgba(168,203,207,${.25-i*.02})`;ctx.fillRect(Math.round(width*(width<=250?.22:width<340?.10:.18)+mod(time*4+i*5,37)-18),Math.round(height-width*.065-4-i%3),5,2);}
    } else if(index === 1) {
      sprite('earth',width*.65,height*1.06,Math.max(width*.9,220),alpha);
      clouds(time,alpha, height*.38);
      sprite('satellite',mod(time*5,width+60)-30,height*.30+Math.sin(time*.5)*3,29,alpha,.12*Math.sin(time*.3));
    } else if(index === 2) {
      sprite('earth',width*.12,height*.22,28,alpha);
      sprite('moon',width*.85,height*.87+Math.sin(time*.11)*2,Math.max(110,width*.42),alpha);
      sprite('satellite',width*.25+Math.sin(time*.12)*35,height*.65+Math.cos(time*.16)*9,28,alpha,.10*Math.sin(time));
    } else if(index === 3) {
      sprite('mars',width*.84,height*.88+Math.sin(time*.14)*2,Math.max(140,width*.48),alpha);
      sprite('asteroids',mod(width*.2-time*1.7,width),height*.21,25,alpha*.8,time*.015);
      sprite('beacon',width*.79,height*.55+Math.sin(time*.7)*3,17,alpha);
    } else if(index === 4) {
      sprite('jupiter',width*.88,height*.81,Math.max(185,width*.55),alpha);
      sprite('moon',width*.16+Math.sin(time*.09)*12,height*.23+Math.cos(time*.09)*8,22,alpha);
      sprite('moon',width*.64,height*.66+Math.sin(time*.13)*7,12,alpha);
      sprite('satellite',mod(width*.2+time*2,width+40)-20,height*.75,25,alpha,.18);
    } else if(index === 5) {
      const cx=width*.72,cy=height*.72;
      ctx.strokeStyle='#345466';ctx.lineWidth=1;
      [49,77,109,146].forEach(r=>{ctx.beginPath();ctx.ellipse(cx,cy,r,r*.31,-.13,0,Math.PI*2);ctx.stroke();});
      sprite('sun',cx,cy,37,alpha);
      ['earth','mars','jupiter','saturn'].forEach((name,i)=>{const a=time*(.055-i*.008)+i*1.6,r=49+i*32;sprite(name,cx+Math.cos(a)*r,cy+Math.sin(a)*r*.31,13+i*3,alpha);});
    } else if(index === 6) {
      sprite('galaxy',width*.78,height*.75,Math.max(180,width*.55),alpha,-.15+Math.sin(time*.07)*.02);
      sprite('galaxy',width*.12,height*.23,35,alpha*.55,.4);
      for(let i=0;i<5;i++)sprite('asteroids',mod(width*.15+i*27-time*(2+i*.3),width),height*.78+i%2*7,10+i%3*4,alpha*.7,time*.015);
    } else {
      ctx.strokeStyle='#376477';ctx.fillStyle='#a7d7d0';
      web.forEach((a,i)=>{const x=a.x*width,y=a.y*height+Math.sin(time*.2+i)*2;web.slice(i+1).forEach(b=>{if(Math.hypot((a.x-b.x)*width,(a.y-b.y)*height)<60){ctx.globalAlpha=alpha*.35;ctx.beginPath();ctx.moveTo(Math.round(x),Math.round(y));ctx.lineTo(Math.round(b.x*width),Math.round(b.y*height));ctx.stroke();}});ctx.globalAlpha=alpha*.7;ctx.fillRect(Math.round(x),Math.round(y),2,2);});
      sprite('galaxy',width*.84,height*.77,60,alpha*.75,.2);
      sprite('galaxy',width*.19,height*.2,22,alpha*.5,-.4);
    }
    ctx.restore();
  }
  function ship(time, velocity, progress) {
    const grounded = stage===0 && !transition;
    const x = width*(width <= 250 ? .22 : width < 340 ? .10 : .18) + (grounded?0:Math.sin(time*.8)*1.7);
    const w = width<=250?20:26, h=w*assets.rocket.naturalHeight/(assets.rocket.naturalWidth||1);
    const groundY=height-width*.065-h/2-2;
    const cruiseY=height*(width<=250?.78:.60);
    let y = grounded ? groundY : cruiseY+Math.sin(time*1.5)*1.8;
    if(transition){const departureY=stage===0?groundY:cruiseY;y=departureY*(1-progress)+cruiseY*progress-Math.sin(progress*Math.PI)*28;}
    if(!grounded) {
      const flame = 8+Math.floor(mod(time*16,3))*3+velocity*17;
      ctx.fillStyle='#fa7183';ctx.fillRect(Math.round(x-4),Math.round(y+h/2-2),8,Math.round(flame));
      ctx.fillStyle='#e6cb8b';ctx.fillRect(Math.round(x-2),Math.round(y+h/2),4,Math.round(flame*.8));
      ctx.fillStyle='#edf2db';ctx.fillRect(Math.round(x-1),Math.round(y+h/2),2,Math.round(flame*.4));
      for(let i=0;i<7;i++){const f=mod(time*(.7+velocity)+i*.17,1);ctx.globalAlpha=1-f;ctx.fillStyle=i%2?'#fa7183':'#8fe3e1';ctx.fillRect(Math.round(x+Math.sin(i+time)*f*8),Math.round(y+h/2+f*(30+velocity*45)),2,2);}ctx.globalAlpha=1;
    }
    sprite('rocket',x,y,w,1,grounded?0:Math.sin(time*.9)*.018);
  }
  function particles(time,velocity) {
    if(stage===0&&!transition)return;
    for(const d of dust){const y=mod(d.y*height+time*(3+d.speed*6)+velocity*clock*35,height);ctx.globalAlpha=.18+d.speed*.15;ctx.fillStyle=stage===3?'#cf8790':'#a6d0d2';ctx.fillRect(Math.round(d.x*width),Math.round(y),1,1+Math.round(velocity*5));}ctx.globalAlpha=1;
    if(stage>1 && stage<7){const p=mod(time*.026,1);sprite('meteor',width*(1.1-p*1.5),height*(.12+p*.6),22,.6);}
  }
  function render(now) {
    const dt=Math.min((now-lastFrame)/1000 || 0,.05);lastFrame=now;
    if(!document.hidden && (!reducedMotion.matches || transition || frame===0)){
      if(!reducedMotion.matches)clock+=dt;
      let p=0,velocity=0,from=stage,to=stage;
      if(transition){p=Math.min(1,(now-transition.start)/transition.duration);from=transition.from;to=transition.to;velocity=reducedMotion.matches?0:Math.sin(p*Math.PI);}
      const t=reducedMotion.matches?0:clock;
      sky(t,from,to,ease(p),velocity);
      if(transition){
        const progress=ease(p);
        if(reducedMotion.matches){world(to,t,0,1);}
        else if(to===1){
          // Liftoff: the launch complex drops away through a moving cloud curtain.
          world(from,t,progress*height,1-progress*.5);
          world(to,t,-height+progress*height,Math.min(1,p*3));
          clouds(t,Math.sin(p*Math.PI)*.7,(progress-.5)*height);
        } else if(to<=4){
          // Planet flybys: the previous landmark passes behind the ship laterally.
          world(from,t,progress*height*.25,1-progress,-progress*width*.8);
          world(to,t,(1-progress)*-height*.15,progress,(1-progress)*width*.8);
        } else {
          // Each larger scale pulls back from the previous world into a new map.
          world(from,t,progress*height*.1,1-progress,0,1-progress*.88);
          world(to,t,0,progress,0,1.8-progress*.8);
        }
      }
      else world(stage,t,0,1);
      particles(t,velocity); ship(t,velocity,ease(p));frame++;
      if(transition&&p>=1){const done=transition.done;stage=transition.to;transition=null;done();}
    }
    requestAnimationFrame(render);
  }
  window.flightScene = {
    ready,
    reset(){stage=0;transition=null;frame=0;},
    travel(to){return new Promise(resolve=>{transition={from:stage,to,start:performance.now(),duration:reducedMotion.matches?150:2700,done:resolve};frame=0;});},
    getState(){return {stage,transitioning:!!transition,frame,width,height,reducedMotion:reducedMotion.matches};}
  };
  addEventListener('resize',resize);reducedMotion.addEventListener('change',()=>{frame=0;});
  resize();ready.then(()=>requestAnimationFrame(render));
})();
