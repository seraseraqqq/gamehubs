// Follow only source-observed script/frame paths. Public text inspection, not execution.
import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('./',import.meta.url),parent=JSON.parse(await readFile(new URL('./competitor-source-evidence.json',root),'utf8'));
const work=[];
for(const s of parent.sites){if(['snowrider.app','snowrunner.org','catninja.co'].includes(new URL(s.url).hostname))for(const src of s.scripts.filter(x=>x.startsWith('/_next/')))work.push({parent:s.url,type:'script',url:new URL(src,s.url).href});}
const known=[
 {parent:'https://snow-rider3d.github.io/',url:'https://snow-rider3d.github.io/file/',type:'frame'},
 {parent:'https://snow-rider-3d.gitlab.io/',url:'https://snow-rider-3d.gitlab.io/file/',type:'frame'},
 {parent:'https://snowrider3dunblocked.me/?play=1',url:'https://snowrider3dunblocked.me/game/',type:'frame'},
 {parent:'https://www.hoodamath.com/games/snowrider3d.html',url:'https://www.hoodamath.com/mobile/games/snow-rider-3d/game.html?nocheckorient=1',type:'frame'},
 {parent:'https://snowrider3d.com/',url:'https://snowrider3d.com/embed/snow-rider-3d?gd_sdk_referrer_url=https://snowrider3d.com/snow-rider-3d',type:'frame'},
 {parent:'https://dnrweqffuwjtx.cloudfront.net/snow-rider-3d/',url:'https://dnrweqffuwjtx.cloudfront.net/games/2025/unity2/snow-rider-3d/classroomgames/index.html',type:'frame'},
 {parent:'https://snowrider.com/',url:'https://snowrider.com/assets/js/app.js?v1.58',type:'script'},
 {parent:'https://hoparcade.com/',url:'https://hoparcade.com/_astro/GameFrame.astro_astro_type_script_index_0_lang.CaErCdQg.js',type:'script'},
];
work.push(...known);
const results=await Promise.all(work.map(async job=>{try{const r=await fetch(job.url,{signal:AbortSignal.timeout(18000)}),t=await r.text();
 const patterns=[['iframe',/.{0,100}(?:["']iframe["']|<iframe\b|iframe\.src|game-iframe|frame\.src).{0,180}/gi],['engine',/.{0,100}(?:WebGLRenderer|createUnityInstance|UnityLoader|\.unityweb|\.wasm["'?]|\.loader\.js|\.data(?:["'])|three\.js|THREE\.|new Scene\(|snowrider|SnowRider|gameSrc|iframeUrl).{0,180}/gi]];
 const signals={};for(const [k,re] of patterns)signals[k]=[...t.matchAll(re)].slice(0,k==='engine'?12:8).map(x=>x[0]);
 const interesting=job.type==='frame'||signals.engine.length||signals.iframe.some(x=>/snow|game|src/.test(x));
 const name=new URL(job.url).hostname.replaceAll('.','_')+'-'+new URL(job.url).pathname.split('/').filter(Boolean).slice(-1)[0].replace(/[^a-z0-9_.-]/gi,'_');if(interesting)await writeFile(new URL('./competitor-source/'+name+'.txt',root),t);
 return {...job,status:r.status,bytes:t.length,signals};}catch(e){return {...job,error:e.message};}}));
await writeFile(new URL('./competitor-loader-evidence.json',root),JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
for(const r of results)if(r.signals?.engine.length||r.type==='frame'||r.signals?.iframe.some(x=>/snow|game|src/.test(x)))console.log(JSON.stringify(r));
