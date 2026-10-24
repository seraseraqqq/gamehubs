// Read-only HTTP evidence. No browser login required. Verified 2026-10-24.
// Usage: node research/2026-10-24-acceleration-city/verify-public-sources.mjs [output-directory]
import fs from 'node:fs/promises';
import path from 'node:path';
const out=path.resolve(process.argv[2]||'research/2026-10-24-acceleration-city/raw');
await fs.mkdir(out,{recursive:true});
const domains=['accelerationcity.com','playaccelerationcity.com','accelerationcitygame.com','accelerationcityonline.com','accelerationcityplay.com','acceleration-city.com','accelerationcity.games','accelerationcity.gg'];
const records=[];
for(const [key,url] of Object.entries({data:'https://activities.cs2n.org/acceleration-city/unity_game/Build/unity_game.data.unityweb',wasm:'https://activities.cs2n.org/acceleration-city/unity_game/Build/unity_game.wasm.unityweb',framework:'https://activities.cs2n.org/acceleration-city/unity_game/Build/unity_game.framework.js.unityweb'})){
  try{const r=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(15000)});records.push({key,url,status:r.status,headers:Object.fromEntries(r.headers)});}catch(e){records.push({key,url,error:e.message});}
}
await fs.writeFile(path.join(out,'game-asset-headers.json'),JSON.stringify({at:new Date().toISOString(),records},null,2));
try{
 const r=await fetch('https://api.vercel.com/v1/registrar/domains/search',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({domains}),signal:AbortSignal.timeout(25000)});
 const body=await r.text();let data;try{data=JSON.parse(body)}catch{data={body:body.slice(0,500)}}
 await fs.writeFile(path.join(out,'domain-availability.json'),JSON.stringify({at:new Date().toISOString(),source:'https://api.vercel.com/v1/registrar/domains/search',request:{domains},status:r.status,data},null,2));
 console.log(JSON.stringify({assets:records.map(({headers,...x})=>({...x,bytes:headers?.['content-length']})),domains:data},null,2));
}catch(e){console.log(JSON.stringify({domainError:e.message}));}
