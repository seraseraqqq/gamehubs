// Static export. No deployment or game files are copied. Explicit licensing gate.
import {readFile,writeFile,mkdir,cp,access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
export const root=fileURLToPath(new URL('../',import.meta.url));
export async function build({origin=process.env.SITE_ORIGIN||'',license=process.env.GAME_EMBED_LICENSE_CONFIRMED||'',preview=process.env.VERCEL_ENV==='preview',outDir=path.join(root,'dist')}={}){
  let site='';
  if(origin){let url;try{url=new URL(origin);}catch{throw Error('SITE_ORIGIN must be an absolute HTTPS origin.');}if(url.protocol!=='https:'||url.username||url.password||url.pathname!=='/'||url.search||url.hash)throw Error('SITE_ORIGIN must be an HTTPS origin without a path, query, or credentials.');site=url.origin;}
  const production=!!site&&!preview;
  if(production&&license!=='true')throw Error('Production export blocked: confirm the game embedding licence before setting GAME_EMBED_LICENSE_CONFIRMED=true.');
  await mkdir(outDir,{recursive:true});
  let hasImage=false;try{await access(path.join(root,'assets/og-game.jpg'));hasImage=true;}catch{}
  const pages=[['index.html','/','Acceleration City'],['guide.html','/guide.html','Getting started'],['about.html','/about.html','About & privacy']];
  for(const[file,route,name]of pages){
    let html=await readFile(path.join(root,file),'utf8');
    const graph=[];
    if(file==='index.html')graph.push({'@type':'VideoGame',name:'Acceleration City',description:'An open-world driving and exploration game with a programmable CoBot.',url:'https://activities.cs2n.org/acceleration-city/',gamePlatform:'Web browser',operatingSystem:'WebGL-capable browser',genre:['Driving','Educational'],author:{'@type':'Organization',name:'Carnegie Mellon Robotics Academy',url:'https://www.cmu.edu/roboticsacademy/'},isAccessibleForFree:true});
    graph.push({'@type':'WebPage',name,description:html.match(/name="description" content="([^"]+)"/)?.[1],...(site?{url:site+route}:{}),about:{'@type':'VideoGame',name:'Acceleration City'}});
    if(site)graph.push({'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Acceleration City',item:site+'/'},...(route==='/'?[]:[{'@type':'ListItem',position:2,name,item:site+route}])]});
    const tags=[`<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph}).replace(/</g,'\\u003c')}</script>`];
    if(production){html=html.replace('content="noindex, nofollow"','content="index, follow"');tags.push(`<link rel="canonical" href="${site+route}">`,`<meta property="og:url" content="${site+route}">`);if(hasImage)tags.push(`<meta property="og:image" content="${site}/assets/og-game.jpg">`,`<meta name="twitter:card" content="summary_large_image">`);}
    html=html.replace('<!-- SITE_METADATA -->',tags.join('\n  '));
    await writeFile(path.join(outDir,file),html);
  }
  for(const file of ['404.html','style.css','app.js','favicon.svg'])await cp(path.join(root,file),path.join(outDir,file));
  try{await cp(path.join(root,'assets'),path.join(outDir,'assets'),{recursive:true});}catch(e){if(e.code!=='ENOENT')throw e;}
  await writeFile(path.join(outDir,'robots.txt'),production?`User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
  await writeFile(path.join(outDir,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${production?pages.map(([,route])=>`<url><loc>${site+route}</loc></url>`).join(''):''}</urlset>`);
  const csp="default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; frame-src https://activities.cs2n.org; object-src 'none'; base-uri 'self'; frame-ancestors 'self'";
  await writeFile(path.join(outDir,'_headers'),`/*\n  Content-Security-Policy: ${csp}\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n${production?'':'  X-Robots-Tag: noindex, nofollow\n'}`);
  await writeFile(path.join(outDir,'vercel.json'),JSON.stringify({headers:[{source:'/(.*)',headers:[{key:'Content-Security-Policy',value:csp},{key:'X-Content-Type-Options',value:'nosniff'},...(!production?[{key:'X-Robots-Tag',value:'noindex, nofollow'}]:[])]}]},null,2));
  return{outDir,production,origin:site||null,hasImage,pages:pages.length};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await build(),null,2));
