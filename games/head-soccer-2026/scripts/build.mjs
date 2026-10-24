import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'dist');
const args=process.argv.slice(2);if(args.includes('--help')){console.log('node scripts/build.mjs [--origin HTTPS_ORIGIN]');process.exit(0);}
if(args.length&&(args[0]!=='--origin'||args.length!==2))throw Error('Expected --origin HTTPS_ORIGIN');
let origin=args[1]||process.env.SITE_ORIGIN||null;
if(origin){const u=new URL(origin);if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash||!u.hostname.includes('.')||u.hostname.endsWith('.local')||/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname))throw Error('Use a public bare HTTPS origin');origin=u.origin;}
if(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production')origin=null;
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const name of ['style.css','app.js','favicon.svg','manifest.webmanifest','assets'])await cp(path.join(root,name),path.join(out,name),{recursive:true});
const pages=['index.html','how-to-play.html','about.html','privacy.html','404.html'];
for(const name of pages){let html=await readFile(path.join(root,name),'utf8');if(origin&&name!=='404.html'){const url=origin+(name==='index.html'?'/':'/'+name);html=html.replace('content="noindex, nofollow"','content="index, follow, max-image-preview:large"').replace('</head>',`<link rel="canonical" href="${url}"><meta property="og:url" content="${url}"></head>`).replace('content="./assets/social-card.png"',`content="${origin}/assets/social-card.png"`).replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(_,a,b,c)=>{const j=JSON.parse(b);j.url=url;j['@id']=url+'#game';j.image=origin+'/assets/social-card.png';return a+JSON.stringify(j)+c;});}await writeFile(path.join(out,name),html);}
await writeFile(path.join(out,'robots.txt'),origin?'User-agent: *\nAllow: /\nSitemap: '+origin+'/sitemap.xml\n':'User-agent: *\nDisallow: /\n');
if(origin)await writeFile(path.join(out,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.filter(n=>n!=='404.html').map(n=>'<url><loc>'+origin+(n==='index.html'?'/':'/'+n)+'</loc></url>').join('')+'</urlset>');
console.log('Static export: '+out+'; '+(origin||'preview / noindex')+'. Not deployed.');
