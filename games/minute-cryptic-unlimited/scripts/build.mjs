// Dependency-free static export. Preview builds remain noindex.
import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'dist');
const args=process.argv.slice(2);
if(args.includes('--help')){console.log('node scripts/build.mjs [--origin https://owned-domain.example]');process.exit(0);}
if(args.length&&(args[0]!=='--origin'||args.length!==2))throw Error('Expected --origin HTTPS origin');
let origin=args[1]||process.env.SITE_ORIGIN||null;
if(origin){const u=new URL(origin);if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash||['localhost','127.0.0.1','[::1]'].includes(u.hostname)||u.hostname.endsWith('.local'))throw Error('Use a public bare HTTPS origin');origin=u.origin;}
if(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production')origin=null;
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const name of ["style.css","favicon.svg","LICENSE","clues.js","practice.js"])await cp(path.join(root,name),path.join(out,name));
await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
const pages=['index.html','how-to-solve-cryptic-clues.html'];
for(const name of pages){
 let page=await readFile(path.join(root,name),'utf8');
 if(origin){
  const url=origin+(name==='index.html'?'/':'/'+name);
  page=page.replace('content="noindex, nofollow"','content="index, follow, max-image-preview:large"');
  page=page.replace('</head>','<link rel="canonical" href="'+url+'"><meta property="og:url" content="'+url+'"></head>');
  page=page.replace(/content="\.\/assets\/([^"<>]+)"/g,(_,asset)=>'content="'+origin+'/assets/'+asset+'"');
  page=page.replace(/(<script type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g,(_,open,json,close)=>{
   const schema=JSON.parse(json),entity=schema['@graph']?schema['@graph'][0]:schema;
   entity.url=url;entity['@id']=url+(name==='index.html'?'#game':'#article');entity.image=origin+'/assets/'+(name==='index.html'?'social-card.png':'guide-card.png');
   return open+JSON.stringify(schema)+close;
  });
 }
 await writeFile(path.join(out,name),page);
}
if(origin){
 await writeFile(path.join(out,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n');
 const urls=pages.map(name=>origin+(name==='index.html'?'/':'/'+name));
 await writeFile(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>'<url><loc>'+url+'</loc></url>').join('')+'</urlset>\n');
}else await writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('Exported '+out+': '+(origin||'preview / noindex')+'. Nothing was deployed.');
