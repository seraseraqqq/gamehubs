// Exercise the actual browser script with a minimal DOM event harness.
// This checks frame preservation/replacement and focus; it is not visual QA.
import assert from 'node:assert/strict';
import {readFile}from'node:fs/promises';
import vm from'node:vm';
import {fileURLToPath}from'node:url';
import path from'node:path';
export async function verifyReloadFlow(){
  const checks=[],elements=new Map(),frames=[];let active=null;const docEvents=new Map();
  class Element{
    constructor(){this.hidden=false;this.disabled=false;this.attrs=new Map();this.events=new Map();}
    addEventListener(name,handler){this.events.set(name,handler);}
    click(){if(!this.disabled)this.events.get('click')?.();}
    focus(){active=this;}
    setAttribute(name,value){this.attrs.set(name,value);}
    append(element){frames.push(element);}
    remove(){this.removed=true;}
  }
  for(const id of ['stage','game-status','opening-screen','game','play-button','reload-game','focus-game','cinema-button','fullscreen-button','reload-confirmation','confirm-reload','cancel-reload','launch-screen','loading-help'])elements.set('#'+id,new Element());
  const get=id=>elements.get('#'+id),panel=get('reload-confirmation');panel.hidden=true;get('reload-game').disabled=true;get('focus-game').disabled=true;
  const document={querySelector:key=>elements.get(key),createElement:()=>new Element(),fullscreenElement:null,addEventListener:(name,handler)=>docEvents.set(name,handler),body:{classList:{toggle(){},contains(){return false;}}}};
  const source=await readFile(new URL('../app.js',import.meta.url),'utf8');
  vm.runInNewContext(source,{document,window:{},setTimeout:()=>1,clearTimeout:()=>{}},{filename:'app.js'});
  const check=(name,fn)=>{fn();checks.push(name);};
  get('reload-game').click();check('reload cannot open before game launch',()=>{assert.equal(panel.hidden,true);assert.equal(frames.length,0);});
  get('play-button').click();const original=frames[0];check('launch creates one official frame',()=>{assert.equal(frames.length,1);assert.equal(original.src,'https://activities.cs2n.org/acceleration-city/');});
  get('reload-game').click();check('requesting reload preserves the current frame',()=>{assert.equal(panel.hidden,false);assert.equal(original.removed,undefined);assert.equal(frames.length,1);assert.equal(get('reload-game').attrs.get('aria-expanded'),'true');assert.equal(active,get('cancel-reload'));});
  get('cancel-reload').click();check('Keep playing preserves frame and restores focus',()=>{assert.equal(panel.hidden,true);assert.equal(original.removed,undefined);assert.equal(frames.length,1);assert.equal(active,get('reload-game'));assert.equal(get('reload-game').attrs.get('aria-expanded'),'false');});
  get('confirm-reload').click();check('hidden confirm cannot reload the frame',()=>assert.equal(frames.length,1));
  get('reload-game').click();docEvents.get('keydown')({key:'Escape'});check('Escape cancels inline reload without replacing frame',()=>{assert.equal(panel.hidden,true);assert.equal(frames.length,1);assert.equal(original.removed,undefined);});
  get('reload-game').click();get('confirm-reload').click();check('explicit Reload game replaces exactly one frame',()=>{assert.equal(panel.hidden,true);assert.equal(original.removed,true);assert.equal(frames.length,2);assert.equal(frames[1].src,original.src);assert.notEqual(frames[1],original);});
  get('confirm-reload').click();check('second hidden confirm does not reload again',()=>assert.equal(frames.length,2));
  return checks;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify({passed:(await verifyReloadFlow()).length},null,2));
