// Chrome acceptance helper. Import through cua_repl and pass an owned real-browser tab.
// Local fixture writes are permitted only on port 4311. Never writes the formal 4310 data.
// Verified 2026-10-25. Requires the Codex Chrome extension; no external account login.
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
export async function capture(tab,out,label,expected){
 await mkdir(out,{recursive:true});
 const result=await tab.playwright.evaluate(()=>({url:location.href,width:innerWidth,height:innerHeight,overflow:document.documentElement.scrollWidth>innerWidth+1,text:document.body.innerText,dialogs:document.querySelectorAll('dialog[open]').length}));
 await writeFile(path.join(out,label+'.png'),await tab.screenshot({fullPage:false}));
 await writeFile(path.join(out,label+'.json'),JSON.stringify(result,null,2)+'\n');
 assert.equal(result.overflow,false,'page overflow');if(expected)assert.equal(result.width,expected.width,'viewport override did not apply');return {label,width:result.width,height:result.height,overflow:result.overflow};
}
export async function editFixture(tab){
 assert.equal(new URL(await tab.url()).port,'4311','fixture writes require isolated 4311 server');
 await tab.playwright.getByRole('button',{name:'fish eat fish',exact:true}).waitFor({state:'visible',timeoutMs:8000});
 await tab.playwright.getByRole('button',{name:'fish eat fish',exact:true}).click();
 await tab.playwright.getByRole('button',{name:'保存关键词',exact:true}).waitFor({state:'visible',timeoutMs:2000});
 await tab.playwright.getByLabel('Volume',{exact:true}).fill('2400');
 await tab.playwright.getByLabel('KD',{exact:true}).fill('47');
 await tab.playwright.getByLabel('intitle 数（竞争度）',{exact:true}).fill('120');
 await tab.playwright.getByLabel('关键词状态',{exact:true}).selectOption('abandoned');
 await tab.playwright.getByRole('button',{name:'保存关键词',exact:true}).click();
 await tab.playwright.getByText('关键词已保存',{exact:true}).waitFor({state:'visible',timeoutMs:8000});
 assert.match(await tab.playwright.locator('#detail-content').innerText(),/比值 0.05/);
 await tab.playwright.getByRole('button',{name:'关闭详情'}).click();
 await tab.reload();await tab.playwright.getByRole('button',{name:'fish eat fish',exact:true}).waitFor({state:'visible',timeoutMs:8000});
 await tab.playwright.getByRole('searchbox').fill('fish eat fish');
 await tab.playwright.getByLabel('建站状态',{exact:true}).selectOption('abandoned');
 assert.equal(await tab.playwright.locator('tbody tr').count(),1);
 assert.match(await tab.playwright.locator('tbody').innerText(),/2,400[\s\S]*47[\s\S]*120[\s\S]*0.05[\s\S]*已放弃/);
 await tab.playwright.getByRole('button',{name:'网站目录',exact:true}).click();
 await tab.playwright.getByRole('button',{name:'Coreball',exact:true}).click();
 assert.equal(await tab.playwright.locator('#detail-content h2').innerText(),'Coreball');
 await tab.playwright.getByLabel('站点 URL',{exact:true}).fill('https://coreball.example/');
 await tab.playwright.getByLabel('GitHub 仓库',{exact:true}).fill('https://github.com/example/coreball');
 await tab.playwright.getByLabel('建站日期',{exact:true}).fill('2026-10-20');
 await tab.playwright.getByRole('button',{name:'保存站点',exact:true}).click();
 await tab.playwright.locator('dialog').waitFor({state:'hidden',timeoutMs:8000});
 await tab.playwright.getByRole('button',{name:'Coreball',exact:true}).click();
 assert.equal(await tab.playwright.locator('#detail-content h2').innerText(),'Coreball');
 await tab.playwright.getByLabel('Volume',{exact:true}).fill('10000');
 await tab.playwright.getByLabel('KD',{exact:true}).fill('15');
 await tab.playwright.getByLabel('intitle 数（竞争度）',{exact:true}).fill('50');
 await tab.playwright.getByRole('button',{name:'保存关键词指标',exact:true}).click();
 await tab.playwright.locator('dialog').waitFor({state:'hidden',timeoutMs:8000});
 await tab.reload();await tab.playwright.getByRole('button',{name:'Coreball',exact:true}).waitFor({state:'visible',timeoutMs:8000});
 await tab.playwright.getByRole('searchbox').fill('Coreball');
 const text=await tab.playwright.locator('tbody').innerText();
 assert.match(text,/coreball.example/);assert.equal(await tab.playwright.locator('a[href="https://github.com/example/coreball"]').count(),1);assert.match(text,/10,000[\s\S]*15[\s\S]*50[\s\S]*0.005/);assert.match(text,/2026-10-20/);
 await tab.playwright.getByRole('searchbox').fill('Cutle');
 await tab.playwright.getByRole('button',{name:'Cutle',exact:true}).click();
 assert.equal(await tab.playwright.locator('#detail-content h2').innerText(),'Cutle');
 await tab.playwright.getByLabel('Volume',{exact:true}).fill('13000');
 await tab.playwright.getByLabel('KD',{exact:true}).fill('9');
 await tab.playwright.getByLabel('intitle 数（竞争度）',{exact:true}).fill('26');
 await tab.playwright.getByRole('button',{name:'保存关键词指标',exact:true}).click();
 await tab.playwright.getByText('关键词指标已保存',{exact:true}).waitFor({state:'visible',timeoutMs:8000});
 await tab.playwright.getByRole('button',{name:'编辑关键词状态 / 查看批次',exact:true}).click();
 assert.equal(await tab.playwright.getByLabel('Volume',{exact:true}).getAttribute('value'),'13000');
 assert.match(await tab.playwright.locator('#detail-content').innerText(),/比值 0.002/);
 return {keywordEdit:'persisted after reload',siteEdit:'URL, repository, creation date and standalone metrics persisted',sharedMetrics:'directory edits match keyword-pool values'};
}
