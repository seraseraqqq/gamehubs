import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url))),out=path.join(root,'dist');
const args=process.argv.slice(2);if(args.includes('--help')){console.log('node scripts/build.mjs [--origin https://owned-domain.example]');process.exit(0);}if(args.length&&(args[0]!=='--origin'||args.length!==2))throw Error('Expected --origin HTTPS origin');
let origin=args[1]||process.env.SITE_ORIGIN||null;
if(origin){const u=new URL(origin);if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash||['localhost','127.0.0.1','[::1]'].includes(u.hostname)||u.hostname.endsWith('.local')||!u.hostname.includes('.'))throw Error('Use a public bare HTTPS origin');origin=u.origin;}
if(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production')origin=null;
// Only remove this script's fixed, verified output directory.
if(path.dirname(out)!==root||path.basename(out)!=='dist')throw Error('Unsafe export path');await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const name of ['style.css','favicon.svg','manifest.webmanifest','player.js'])await cp(path.join(root,name),path.join(out,name));
await mkdir(path.join(out,'assets'),{recursive:true});
for(const name of ['Figtree-Latin.woff2','Figtree-OFL.txt','apple-touch-icon.png','icon-192.png','icon-512.png','publisher-cover.jpg'])await cp(path.join(root,'assets',name),path.join(out,'assets',name));
const pages=['index.html','snow-rider-3d-controls.html','about.html'];
for(const name of pages){let page=await readFile(path.join(root,name),'utf8');if(origin){const url=origin+(name==='index.html'?'/':'/'+name);page=page.replace('content="noindex, nofollow"','content="index, follow, max-image-preview:large"').replace('</head>',`<link rel="canonical" href="${url}"><meta property="og:url" content="${url}"></head>`).replace('content="./assets/publisher-cover.jpg"',`content="${origin}/assets/publisher-cover.jpg"`);page=page.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g,(_,a,json,b)=>{const s=JSON.parse(json);s.url=url;s['@id']=url+(name==='index.html'?'#game':'#article');s.image=origin+'/assets/publisher-cover.jpg';return a+JSON.stringify(s)+b;});}await writeFile(path.join(out,name),page);}
await writeFile(path.join(out,'robots.txt'),origin?`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`:'User-agent: *\nDisallow: /\n');
if(origin)await writeFile(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(n=>'<url><loc>'+origin+(n==='index.html'?'/':'/'+n)+'</loc></url>').join('')+'</urlset>\n');
console.log(`Exported ${pages.length} pages: ${origin||'preview / noindex'}. Nothing was deployed.`);
