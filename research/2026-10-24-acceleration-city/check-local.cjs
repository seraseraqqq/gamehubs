// Usage: node research/2026-10-24-acceleration-city/check-local.cjs [port]
const fs=require('node:fs/promises');
(async()=>{
const port=Number(process.argv[2]||4198);
const checks=[];for(const route of ['/','/guide.html','/about.html','/app.js','/style.css','/favicon.svg','/assets/og-game.jpg','/robots.txt','/sitemap.xml','/missing-route']){try{const r=await fetch('http://127.0.0.1:'+port+route);checks.push({route,status:r.status,type:r.headers.get('content-type'),robots:r.headers.get('x-robots-tag'),bytes:(await r.arrayBuffer()).byteLength});}catch(e){checks.push({route,error:e.message})}}await fs.writeFile('research/2026-10-24-acceleration-city/raw/local-http-checks.json',JSON.stringify({at:new Date().toISOString(),checks},null,2));console.log(JSON.stringify(checks));
})();
