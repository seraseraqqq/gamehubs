// Export runtime files only. A purchased, approved SITE_ORIGIN enables production indexing.
import {cp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url)),out=path.join(root,'dist');
const args=process.argv.slice(2);
if(args.includes('--help')){console.log('node scripts/build.mjs [--origin https://your-approved-domain.example]');console.log('Default / Vercel previews: noindex. No deployment or purchase occurs.');process.exit(0);}
if(args.length&&(args[0]!=='--origin'||args.length!==2))throw Error('Expected --origin HTTPS origin');
let origin=args[1]||process.env.SITE_ORIGIN||null;
if(origin){const u=new URL(origin);if(u.protocol!=='https:'||u.username||u.password||u.port||u.pathname!=='/'||u.search||u.hash||['localhost','127.0.0.1','[::1]'].includes(u.hostname)||u.hostname.endsWith('.local'))throw Error('Use a public bare HTTPS origin');origin=u.origin;}
if(process.env.VERCEL_ENV&&process.env.VERCEL_ENV!=='production')origin=null;
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const name of ["style.css", "favicon.svg", "LICENSE", "clues.js", "practice.js"])await cp(path.join(root,name),path.join(out,name));
await cp(path.join(root,'assets'),path.join(out,'assets'),{recursive:true});
let page=await readFile(path.join(root,'index.html'),'utf8');
if(origin){
 page=page.replace('content="noindex, nofollow"','content="index, follow, max-image-preview:large"');
 page=page.replace('</head>',`<link rel="canonical" href="${origin}/"><meta property="og:url" content="${origin}/"></head>`);
 page=page.replaceAll('content="./assets/social-card.png"',`content="${origin}/assets/social-card.png"`);
 const match=page.match(/(<script type="application\/ld\+json" id="game-schema">)([\s\S]*?)(<\/script>)/);
 const schema=JSON.parse(match[2]);schema['@graph'][0].url=origin+'/';schema['@graph'][0].image=origin+'/assets/social-card.png';
 page=page.replace(match[0],match[1]+JSON.stringify(schema)+match[3]);
 await writeFile(path.join(out,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
 await writeFile(path.join(out,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`);
}else await writeFile(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
await writeFile(path.join(out,'index.html'),page);
console.log(`Exported ${out}: ${origin||'preview / noindex'}. Nothing was deployed.`);
