/** Read-only metric evidence through the owner's Chrome in cua_repl.
 * Import collectIntitle/readBulk and pass a claimed tab, explicit target list and output directory.
 * Google Tools exposes first-party #result-stats; ignore extension-injected counts.
 * Semrush bulk rows must be loaded in US first; never click paid Update metrics.
 * Verified 2026-10-25. Browser/Google estimates do not prove physical US location.
 */
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';

export async function readGoogle(tab,target,out){
  const url=await tab.url();
  const page=await tab.playwright.evaluate(()=>({
    stats:document.querySelector('#result-stats')?.innerText||null,
    blocked:location.pathname.includes('/sorry/')||/unusual traffic|not a robot/i.test(document.querySelector('#main')?.innerText||''),
    searchText:document.querySelector('#search')?.innerText||null,
    results:[...document.querySelectorAll('#search a:has(h3)')].map(a=>({title:a.querySelector('h3')?.innerText,url:a.href}))
  }));
  const u=new URL(url),query='intitle:"'+target.term+'"';
  const verified=u.searchParams.get('q')===query&&u.searchParams.get('gl')==='us'&&u.searchParams.get('hl')==='en';
  const match=page.stats?.match(/(?:About\s+)?([\d,]+)\s+results?/i);
  const intitle=verified&&!page.blocked&&match?Number(match[1].replaceAll(',','')):null;
  const row={...target,url,query,observedAt:new Date().toISOString(),country:'US',language:'en',physicalUSLocationVerified:false,queryVerified:verified,intitle,status:page.blocked?'blocked':intitle===null?'unknown':'observed',...page};
  await mkdir(path.join(out,'raw'),{recursive:true});
  await writeFile(path.join(out,'raw','google-'+target.id+'.json'),JSON.stringify(row,null,2)+'\n');
  return row;
}

export async function collectIntitle(tab,targets,out){
  const rows=[];
  for(const target of targets){
    const u=new URL('https://www.google.com/search');
    for(const [k,v] of Object.entries({q:'intitle:"'+target.term+'"',gl:'us',hl:'en',pws:'0'}))u.searchParams.set(k,v);
    await tab.goto(u.href);
    await tab.playwright.getByRole('button',{name:'Tools',exact:true}).waitFor({state:'visible',timeoutMs:12000}).catch(()=>{});
    const snapshot=await tab.playwright.domSnapshot();
    if(!/unusual traffic|not a robot/i.test(snapshot)&&snapshot.includes('button "Tools"')){
      await tab.playwright.getByRole('button',{name:'Tools',exact:true}).click();
      await tab.playwright.locator('#result-stats').waitFor({state:'visible',timeoutMs:5000}).catch(()=>{});
    }
    const row=await readGoogle(tab,target,out);rows.push(row);
    if(row.blocked)break;
  }
  return rows.map(({searchText,results,...r})=>r);
}

export async function readBulk(tab,out){
  const url=new URL(await tab.url());url.searchParams.delete('__gmitm');
  if(url.searchParams.get('db')!=='us')throw Error('Explicit US database required');
  const page=await tab.playwright.evaluate(()=>({
    text:document.querySelector('main')?.innerText||'',
    rows:[...document.querySelectorAll('[role="row"],tr')].map(r=>[...r.querySelectorAll('[role="cell"],[role="columnheader"],td,th')].map(c=>c.innerText))
  }));
  const result={observedAt:new Date().toISOString(),url:url.href,country:'US',language:'en',provider:'owner_free_semrush_mirror',officiallyVerified:false,...page};
  await mkdir(path.join(out,'raw'),{recursive:true});await writeFile(path.join(out,'raw','semrush-bulk-us.json'),JSON.stringify(result,null,2)+'\n');
  return result;
}
