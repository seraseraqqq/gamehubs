/** GameHubs keyword discovery evidence. Import in cua_repl, pass owned Chrome tabs.
 * Read-only DOM, US/en, 12m. No background HTTP from page, no paid refresh, no CAPTCHA solving.
 * Google Trends normalized values are not monthly volume. Last weekly point omitted conservatively.
 * Verified with real Chrome 2026-10-25. Outputs preserve null/blocked/error.
 */
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const save=async(out,name,data)=>{await mkdir(path.join(out,'raw'),{recursive:true});await writeFile(path.join(out,'raw',name+'.json'),JSON.stringify(data,null,2)+'\n');return data;};
export async function captureTrends(tab,terms,out,label){
  await tab.playwright.locator('table tr:nth-child(25)').first().waitFor({state:'attached',timeoutMs:15000}).catch(()=>{});
  const page=await tab.playwright.evaluate(()=>({
    tables:[...document.querySelectorAll('table')].map(t=>[...t.rows].map(r=>[...r.cells].map(c=>c.innerText))),
    related:[...document.querySelectorAll('a[href*="/trends/explore?"]')].filter(a=>/^\d+\s/.test(a.innerText.trim())).map(a=>({text:a.innerText.trim(),href:a.getAttribute('href')})),
    visibleText:document.body.innerText.slice(0,22000)
  }));
  const url=await tab.url(),u=new URL(url),actual=(u.searchParams.get('q')||'').split(',');
  const verified=u.searchParams.get('geo')==='US'&&actual.length===terms.length&&actual.every((t,i)=>t===terms[i]);
  const rows=page.tables.find(t=>t.length>=25)||[];
  return save(out,label,{terms,url,observedAt:new Date().toISOString(),country:'US',language:'en',timeframe:'Past 12 months',queryVerified:verified,status:verified&&rows.length>=25?'observed':'unknown',partialPolicy:'Drop last row conservatively; partial flag not in DOM.',...page});
}
export async function collectTrends(tab,terms,out,label){
  if(!terms.length||terms.length>5)throw Error('1–5 terms only');
  const u=new URL('https://trends.google.com/trends/explore');
  for(const [k,v] of Object.entries({geo:'US',hl:'en',date:'today 12-m',q:terms.join(',')}))u.searchParams.set(k,v);
  await tab.goto(u.href);
  await tab.playwright.waitForLoadState({state:'networkidle',timeoutMs:12000}).catch(()=>{});
  return captureTrends(tab,terms,out,label);
}
export async function googleEvidence(tab,term,mode,out,label){
  const query=['allintitle','intitle'].includes(mode)?mode+':"'+term+'"':term;
  const u=new URL('https://www.google.com/search');for(const [k,v] of Object.entries({q:query,gl:'us',hl:'en',pws:'0'}))u.searchParams.set(k,v);
  await tab.goto(u.href);
  await tab.playwright.waitForLoadState({state:'networkidle',timeoutMs:12000}).catch(()=>{});
  await tab.playwright.getByRole('button',{name:'Tools',exact:true}).waitFor({state:'visible',timeoutMs:10000}).catch(()=>{});
  let snapshot=await tab.playwright.domSnapshot();
  const blocked=/unusual traffic|not a robot|About this page.*traffic/i.test(snapshot);
  if(['allintitle','intitle'].includes(mode)&&!blocked&&snapshot.includes('button "Tools"')){
    await tab.playwright.getByRole('button',{name:'Tools',exact:true}).click();
    await tab.playwright.locator('#result-stats').waitFor({state:'visible',timeoutMs:5000}).catch(()=>{});
  }
  return captureGoogle(tab,term,mode,out,label);
}
export async function captureGoogle(tab,term,mode,out,label){
  const query=['allintitle','intitle'].includes(mode)?mode+':"'+term+'"':term;
  const page=await tab.playwright.evaluate(()=>({
    stats:document.querySelector('#result-stats')?.innerText||null,
    blocked:location.pathname.includes('/sorry/')||/unusual traffic|not a robot/i.test(document.querySelector('#main')?.innerText||''),
    results:[...document.querySelectorAll('#search a:has(h3)')].filter(a=>a.getClientRects().length&&!a.closest('[data-text-ad]')).map(a=>({title:a.querySelector('h3')?.innerText,url:a.href})),
    searchText:document.querySelector('#search')?.innerText?.slice(0,22000)||null
  }));
  const url=await tab.url(),v=new URL(url),verified=v.searchParams.get('q')===query&&v.searchParams.get('gl')==='us'&&v.searchParams.get('hl')==='en';
  const match=page.stats?.match(/(?:About\s+)?([\d,]+)\s+results?/i);
  const operatorIgnored=['allintitle','intitle'].includes(mode)&&new RegExp('Missing:\\s*'+mode+':','i').test(page.searchText||'');
  const allintitle=mode==='allintitle'&&verified&&!page.blocked&&!operatorIgnored&&match?Number(match[1].replaceAll(',','')):null;
  const intitle=mode==='intitle'&&verified&&!page.blocked&&!operatorIgnored&&match?Number(match[1].replaceAll(',','')):null;
  const count=mode==='intitle'?intitle:allintitle;
  return save(out,label,{term,query,mode,queryMode:['allintitle','intitle'].includes(mode)?'quoted_phrase':'plain',url,observedAt:new Date().toISOString(),country:'US',language:'en',physicalUSLocationVerified:false,queryVerified:verified,operatorIgnored,status:page.blocked?'blocked':['allintitle','intitle'].includes(mode)?(count===null?'unknown':'observed'):(page.results.length?'observed':'unknown'),allintitle,intitle,completeTopTen:page.results.length>=10,...page});
}

export async function captureGamePage(tab,url,out,label){
  if(await tab.url()!==url)await tab.goto(url);
  await tab.playwright.waitForLoadState({state:'networkidle',timeoutMs:12000}).catch(()=>{});
  const page=await tab.playwright.evaluate(()=>({title:document.title,text:document.body.innerText.slice(0,30000),
    controls:[...document.querySelectorAll('button,input,select')].filter(e=>e.getClientRects().length).map(e=>({tag:e.tagName,label:e.getAttribute('aria-label'),text:e.innerText||'',placeholder:e.getAttribute('placeholder')})),
    links:[...document.querySelectorAll('a[href]')].filter(e=>e.getClientRects().length).map(e=>({text:e.innerText,url:e.href}))}));
  return save(out,label,{url:await tab.url(),observedAt:new Date().toISOString(),scope:'Visible public game page; no claim of licence or comprehensive gameplay acceptance',...page});
}
