// Prepare a freshly cloned git-subtree split. Never copies ignored local files.
import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';import {fileURLToPath} from 'node:url';
const source=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const [slug,targetArg,researchArg]=process.argv.slice(2),target=path.resolve(targetArg||'.');
if(!/^[a-z0-9-]+$/.test(slug||'')||!researchArg?.startsWith('research/')||researchArg.includes('..'))throw Error('Expected slug, fresh checkout and research directory');
if(target===source||target.startsWith(source+path.sep)||source.startsWith(target+path.sep))throw Error('Standalone checkout must be a sibling, not a nested repository');
const git=(cwd,args,buffer=false)=>execFileSync('git',args,{cwd,encoding:buffer?undefined:'utf8',maxBuffer:64*1024*1024,stdio:['ignore','pipe','pipe']});
if(path.resolve(git(target,['rev-parse','--show-toplevel']).trim())!==target||git(target,['status','--porcelain']).trim())throw Error('Destination must be a clean repository root');
if(path.resolve(git(target,['remote','get-url','origin']).trim())!==source||fs.existsSync(path.join(target,'ORIGIN.md')))throw Error('Expected a fresh local subtree clone');
const ref=git(source,['rev-parse','HEAD']).trim(),game='games/'+slug+'/',research=researchArg.replace(/\/$/,'')+'/';
const tracked=git(source,['ls-tree','-r','--name-only','-z',ref,'--',game,research]).split('\0').filter(Boolean);
if(!tracked.some(p=>p.startsWith(game))||!tracked.some(p=>p.startsWith(research)))throw Error('Game or research tree missing');
const mapping=new Map(tracked.map(p=>[p,p.startsWith(game)?p.slice(game.length):p]));
for(const [old,dest]of mapping){
 if(/(^|\/)(\.env[^/]*|node_modules|dist|\.vercel)(\/|$)/.test(old))throw Error('Private/generated source path');
 const full=path.resolve(target,dest);if(!full.startsWith(target+path.sep))throw Error('Export escapes target');
 fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,git(source,['show',ref+':'+old],true));
}
function rewrite(refName,oldFile,newFile){
 if(!refName||/^(https?:|mailto:|#|\/)/.test(refName))return refName;
 const hash=refName.indexOf('#'),plain=hash<0?refName:refName.slice(0,hash),fragment=hash<0?'':refName.slice(hash);
 const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(oldFile),plain));
 if(mapping.has(resolved)){let relative=path.posix.relative(path.posix.dirname(newFile),mapping.get(resolved));return (relative||'./')+fragment;}
 if(!resolved.startsWith('../')&&fs.existsSync(path.join(source,resolved)))return 'https://github.com/seraseraqqq/gamehubs/blob/main/'+resolved+fragment;
 return refName;
}
for(const [old,dest]of mapping){const full=path.join(target,dest);if(dest.endsWith('.md')){let text=fs.readFileSync(full,'utf8');text=text.replace(/(\]\()([^\s)]+)(\))/g,(_,a,r,b)=>a+rewrite(r,old,dest)+b).replace(/`(\.\.?\/[^`\n]+)`/g,(_,r)=>'`'+rewrite(r,old,dest)+'`');fs.writeFileSync(full,text);}else if(old.startsWith(game)&&dest.endsWith('.mjs')){let text=fs.readFileSync(full,'utf8');text=text.replaceAll('../../'+researchArg,'./'+researchArg);fs.writeFileSync(full,text);}}
fs.appendFileSync(path.join(target,'.gitignore'),'\n# Standalone local/generated files\n.env*\n.vercel/\nnode_modules/\n.impeccable/review/\nresearch/*/raw/\n');
fs.writeFileSync(path.join(target,'ORIGIN.md'),`# Source migration\n\nCanonical repository: https://github.com/seraseraqqq/gamehubs-${slug}\n\nGame source history was preserved with git subtree split from ${game} in https://github.com/seraseraqqq/gamehubs, snapshot ${ref}. Related tracked research was copied to ${research}. Relative documentation links and the local export-check report path were adapted to the standalone layout.\n\nThis private repository is the active editing source. The old GameHubs directory is a transitional archive; do not maintain two live copies. Game/publisher permissions, credits and noindex defaults remain as documented. No deployment or permission grant is implied by this migration.\n`);
fs.writeFileSync(path.join(target,'AGENTS.md'),`# ${slug}\n\nThis repository owns only this game website. Read README.md, ORIGIN.md and any .rankup/INDEX.md before changes. Run the existing build/export verifier after runtime changes. Keep default builds noindex; respect the recorded game-embedding permission and release decisions. Do not claim ownership of third-party games or remove provider branding/SDK/ads. Production deployment requires the owner's requested release scope. This is the canonical editing source; the old gamehubs/games/${slug} copy is archived during migration.\n`);
console.log(JSON.stringify({slug,target,sourceCommit:ref,trackedFiles:tracked.length,historyPreserved:true}));
