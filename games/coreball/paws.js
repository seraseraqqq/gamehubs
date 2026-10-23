/* Original flat top-down paw art and event-driven impact effects. No sprite download. */
(() => {
  'use strict';
  function drawPaw(ctx){
    ctx.save();ctx.lineJoin='round';ctx.lineCap='round';ctx.lineWidth=1.8;
    // Back of a closed paw, seen directly from above: no thumb, toe spread or pads.
    ctx.beginPath();ctx.moveTo(14,102);ctx.lineTo(13,39);
    ctx.bezierCurveTo(7,29,9,17,15,14);ctx.bezierCurveTo(17,9,23,9,26,12);
    ctx.bezierCurveTo(28,7,35,7,38,12);ctx.bezierCurveTo(44,9,49,13,49,19);
    ctx.bezierCurveTo(54,23,53,33,49,40);ctx.lineTo(48,102);ctx.closePath();
    ctx.fillStyle='#fff2d9';ctx.fill();ctx.strokeStyle='#bf9b7b';ctx.stroke();
    ctx.strokeStyle='#c9ab8b';ctx.lineWidth=1.35;
    for(const x of [23,32,41]){ctx.beginPath();ctx.moveTo(x,17);ctx.quadraticCurveTo(x-1,21,x,24);ctx.stroke();}
    ctx.strokeStyle='#e0c9a8';ctx.beginPath();ctx.moveTo(42,42);ctx.lineTo(42,100);ctx.stroke();ctx.restore();
  }
  for(const canvas of typeof document==='undefined'?[]:document.querySelectorAll('canvas.paw')){
    canvas.width=128;canvas.height=200;const ctx=canvas.getContext('2d');if(!ctx)continue;ctx.scale(2,2);drawPaw(ctx);
  }
  const NS='http://www.w3.org/2000/svg';
  const layer=typeof document==='undefined'?null:document.getElementById('hitEffects');
  const reduced=typeof matchMedia==='function'?matchMedia('(prefers-reduced-motion: reduce)'):{matches:true};
  const svg=(tag,attrs)=>{const el=document.createElementNS(NS,tag);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,value);return el;};
  function impact(kind,streak=0){
    if(!layer||reduced.matches)return;
    const group=svg('g',{class:'impact '+(kind==='miss'?'impact-miss':'impact-hit'),transform:'translate(250 363)'});
    group.append(svg('circle',{class:'impact-ring',r:8,cx:0,cy:0}));
    const count=kind==='miss'?6:streak>=3?10:6;
    for(let i=0;i<count;i++){
      const a=i/count*Math.PI*2,dist=kind==='miss'?25:streak>=3?42:31;
      const pixel=svg('rect',{x:-2,y:-2,width:i%3===0?6:4,height:i%3===0?6:4,rx:0,class:'impact-pixel'});
      pixel.style.setProperty('--dx',Math.cos(a)*dist+'px');pixel.style.setProperty('--dy',Math.sin(a)*dist+'px');pixel.style.setProperty('--rot',i*30+'deg');group.append(pixel);
    }
    layer.append(group);setTimeout(()=>group.remove(),600);
  }
  function launch(side){
    if(reduced.matches)return;
    const paw=document.querySelector('.paw-'+side);if(!paw?.animate)return;
    paw.getAnimations().forEach(animation=>animation.cancel());
    const flip='';
    paw.animate([
      {transform:flip+'translate(0,0) scale(1)',offset:0},
      {transform:flip+'translate(0,5px) scale(1.04,.94)',offset:.12},
      {transform:flip+'translate(0,-27px) scale(.98,1.03)',offset:.40},
      {transform:flip+'translate(0,-27px) scale(.98,1.03)',offset:.58},
      {transform:flip+'translate(0,0) scale(1)',offset:1}
    ],{duration:500,easing:'linear'});
  }
  if(typeof window!=='undefined')window.CoreballPaws={impact,launch};
  if(typeof module==='object'&&module.exports)module.exports={drawPaw};
})();
