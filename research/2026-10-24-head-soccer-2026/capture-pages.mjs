// Reusable CUA capture routine for the connected, real Chrome browser.
// Import in cua_repl and call capturePages({cua, outputDir, pages, sessionName}).
// Needs current CUA permission/session; no login, CAPTCHA interaction or headless browser.
// Verified 2026-10-24. Captures arrival state only; does not claim gameplay success.
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
export async function capturePages({cua,outputDir,pages,sessionName}){
 if(!sessionName)throw Error('Supply a task-specific sessionName');
 await mkdir(outputDir,{recursive:true});const results=[];
 for(const {name,url} of pages){let tab;try{tab=await cua.createBrowserTab('chrome',url,{sessionName});const state=await tab.getAXState({emit:false});await writeFile(path.join(outputDir,name+'.jpg'),await tab.screenshot({fullPage:false}));await writeFile(path.join(outputDir,name+'.txt'),state.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[redacted account]'));results.push({name,url,checkedAt:new Date().toISOString(),status:'captured'});}catch(e){results.push({name,url,status:'failed',error:e.message});}finally{if(tab)await tab.close();}}
 await writeFile(path.join(outputDir,'capture-manifest.json'),JSON.stringify(results,null,2));return results;
}
