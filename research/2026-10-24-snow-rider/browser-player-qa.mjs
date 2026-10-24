// Reusable CUA-only shell checks. In cua_repl: import this file, then await verifyPlayer(tab).
// Uses only documented tab methods and read-only DOM inspection. Does not bypass provider UI.
import assert from 'node:assert/strict';
export async function verifyPlayer(tab){
 const checks=[];const check=(name,pass,evidence)=>{checks.push({name,pass,evidence});assert.ok(pass,name);};
 await tab.reload();await tab.playwright.getByRole('button',{name:'Play Snow Rider 3D',exact:true}).waitFor({state:'visible'});
 const initial=await tab.playwright.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,frames:document.querySelectorAll('iframe').length,canvas:document.querySelectorAll('canvas').length,scripts:Array.from(document.scripts).map(s=>s.getAttribute('src')).filter(Boolean),cover:document.querySelector('.poster img').naturalWidth,reloadDisabled:document.querySelector('#reload').disabled}));
 check('No external game frame before Play',initial.frames===0,initial.frames);
 check('Original simulation is not loaded',initial.canvas===0&&initial.scripts.length===1&&initial.scripts[0]==='./player.js',initial.scripts);
 check('Default viewport has no horizontal overflow',!initial.overflow,{width:initial.width});
 check('Publisher cover loaded',initial.cover===1280,initial.cover);
 check('Reload disabled until first play',initial.reloadDisabled);
 await tab.playwright.getByRole('button',{name:'Play Snow Rider 3D',exact:true}).click();
 const connected=await tab.playwright.evaluate(()=>({src:document.querySelector('#publisher-game')?.getAttribute('src'),title:document.querySelector('#publisher-game')?.title,frameCount:document.querySelectorAll('#publisher-game').length,posterHidden:document.querySelector('#poster').hidden,reloadDisabled:document.querySelector('#reload').disabled}));
 const url=new URL(connected.src),page=new URL(await tab.url());
 check('One publisher frame is mounted',connected.frameCount===1,connected.frameCount);
 check('Selected existing publisher game is used',url.origin==='https://html5.gamedistribution.com'&&url.pathname==='/3b79a8537ebc414fb4f9672a9b8c68c8/',url.href);
 check('Referrer is the actual parent page',url.searchParams.get('gd_sdk_referrer_url')===page.origin+page.pathname);
 check('Poster removed and reload enabled',connected.posterHidden&&!connected.reloadDisabled);
 return {checkedAt:new Date().toISOString(),checks,scope:'First-party shell and embed URL. Iframe load is not claimed as Unity gameplay readiness.'};
}
