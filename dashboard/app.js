const $ = id => document.getElementById(id);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names = {qualified:'合格',rejected:'不合格',needs_review:'待复核',unknown:'未知',pending:'未审核',approved:'认可',hold:'暂缓',conflict:'审核冲突',build:'决定建设',defer:'暂缓决定',abandon:'已放弃',unset:'尚未决定',planned:'计划中',building:'建设中',blocked:'有阻塞',awaiting_release:'待验收/待发布',deployed:'已部署（历史）',abandoned:'已放弃',idea:'构想',recorded_deployed:'历史记录已部署',not_deployed:'未部署',recorded_pass:'历史验收通过',recorded_allowed:'历史允许索引',historical:'历史导入',partial:'部分完成',complete:'完成',failed:'失败'};
Object.assign(names,{observing:'观察中',live:'已上线',building:'开发中',deployed:'已上线'});
let data, view = 'keywords', page = 0, selected = new Set(), selectedHeads = new Map(), rendered = [], currentSite, direction='desc';
const size = 40;
const filterIds = ['status-filter','site-filter','sort'];
function tag(value) {return `<span class="tag ${['qualified','approved','recorded_pass','live'].includes(value)?'good':['conflict','rejected','abandoned','abandon'].includes(value)?'bad':['unknown','needs_review','hold','blocked','pending'].includes(value)?'warn':'blue'}">${esc(names[value] || value)}</span>`;}
function urlLink(url,label) {try {const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return esc(url);return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label || url)} ↗</a>`;} catch {return esc(url || '待定');}}
function message(text, error=false) {$('status').textContent=text;$('status').className=error?'error':'';if($('detail').open){$('dialog-status').textContent=text;$('dialog-status').className=error?'error':'';}}
async function load() {
  try {const res=await fetch('/api/state');if(!res.ok)throw Error('无法读取本地数据');data=await res.json();
    $('sync-label').textContent='文件已读取 · '+new Date().toLocaleTimeString('zh-CN');
    const linked=$('site-filter').value;$('site-filter').innerHTML='<option value="">全部关联</option><option value="linked">已关联</option><option value="unlinked">未关联</option>'+data.sites.map(s=>`<option value="${esc(s.id)}">${esc(s.name)}</option>`).join('');$('site-filter').value=linked;
    $('nav-count').textContent=data.counts.keywords;render();
    if(data.errors.length)message(`有 ${data.errors.length} 项数据校验问题，请在使用说明中查看。`,true);
  } catch(e) {message(e.message,true);}
}

const fmt=v=>v==null?'未知':Number(v).toLocaleString('en-US');
const ratio=v=>v==null?'未知':Number(v).toLocaleString('en-US',{maximumSignificantDigits:4});
const siteStatus=s=>s.stage==='abandoned'?'abandoned':s.stage==='deployed'?'live':['building','blocked','awaiting_release'].includes(s.stage)?'building':'observing';
function matchesSite(r,filter){return !filter||filter==='linked'&&r.sites.length>0||filter==='unlinked'&&!r.sites.length||r.sites.some(s=>s.id===filter);}
function comparator(value){return(a,b)=>{const x=value(a),y=value(b);if(x==null||y==null)return x==null?(y==null?String(a.id).localeCompare(b.id):1):-1;const c=typeof x==='number'?x-y:String(x).localeCompare(String(y));return (direction==='asc'?c:-c)||String(a.id).localeCompare(b.id);};}
function configureSort(){
  const old=$('sort').value,options=[...(view==='sites'?[['createdAt','建站时间']]:[]),['batchDate','关键词批次时间'],['volume','Volume'],['kd','KD'],['intitle','intitle 数（竞争度）'],['ratio','竞争度 / Volume']];
  $('sort').innerHTML=options.map(([v,n])=>`<option value="${v}">${n}</option>`).join('');
  if(options.some(([v])=>v===old))$('sort').value=old;
  $('direction').textContent=direction==='asc'?'升序 ↑':'降序 ↓';$('direction').setAttribute('aria-label',direction==='asc'?'切换为降序':'切换为升序');
}
function rows(){
  const q=$('search').value.trim().toLowerCase(),status=$('status-filter').value,site=$('site-filter').value;
  let list=data.keywords.filter(r=>(!q||JSON.stringify([r.term,r.aliases,r.sites]).toLowerCase().includes(q))&&(!status||r.keywordStatus===status)&&matchesSite(r,site));
  if(view==='builds')list=list.filter(r=>r.decision!=='unset'||r.sites.length||data.plans.some(p=>p.seo.primary===r.term));
  const key=$('sort').value;return list.sort(comparator(r=>key==='batchDate'?r.batchDate:r.metrics[key]));
}
function stats(){
  $('stats').innerHTML=[['关键词',data.counts.keywords],['观察中',data.keywords.filter(r=>r.keywordStatus==='observing').length],['开发中',data.keywords.filter(r=>r.keywordStatus==='building').length],['已上线站点',data.sites.filter(s=>s.stage==='deployed').length]].map(([label,count])=>`<span><strong>${count}</strong> ${label}</span>`).join('');
}
function pagination(list){
  page=Math.min(page,Math.max(0,Math.ceil(list.length/size)-1));
  $('pagination').innerHTML=`<span>${list.length? page*size+1:0}–${Math.min((page+1)*size,list.length)} / ${list.length}</span><button id="previous" ${page===0?'disabled':''}>上一页</button><button id="next" ${(page+1)*size>=list.length?'disabled':''}>下一页</button>`;
  $('previous').onclick=()=>{page--;render();};$('next').onclick=()=>{page++;render();};
  return list.slice(page*size,(page+1)*size);
}
function metricCells(m){return `<td class="numeric">${fmt(m.volume)}</td><td class="numeric">${fmt(m.kd)}</td><td class="numeric">${fmt(m.intitle)}</td><td class="numeric">${ratio(m.ratio)}</td>`;}
function render(){
  if(!data)return;stats();configureSort();
  const labels={keywords:'关键词池',builds:'建站清单',sites:'网站目录'};
  $('crumb').textContent=labels[view];$('title').textContent=labels[view];$('table-title').textContent=view==='keywords'?'全部关键词':view==='sites'?'全部站点':'建设与决定';
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  $('bulk').hidden=!(selected.size&&['keywords','builds'].includes(view));$('selected-count').textContent=`已选 ${selected.size} 个词`;$('export').hidden=view==='sites';
  if(view==='sites')return renderSites();if(view==='builds')return renderBuilds();
  rendered=rows();const slice=pagination(rendered);$('result-count').textContent=`${rendered.length} 个关键词`;
  $('content').innerHTML=slice.length?`<table><thead><tr><th><input id="select-page" type="checkbox" aria-label="选择当前页" ${slice.every(r=>selected.has(r.id))?'checked':''}></th><th>关键词</th><th class="numeric">Volume</th><th class="numeric">KD</th><th class="numeric">intitle 数</th><th class="numeric">竞争度 / Volume</th><th>建站状态</th><th>站点与页面</th><th>批次时间</th><th></th></tr></thead><tbody>${slice.map(r=>`<tr><td><input type="checkbox" data-select="${r.id}" aria-label="选择 ${esc(r.term)}" ${selected.has(r.id)?'checked':''}></td><td><button class="term" data-keyword="${r.id}">${esc(r.term)}</button></td>${metricCells(r.metrics)}<td>${tag(r.keywordStatus)}</td><td>${r.sites.length?r.sites.map(s=>`<button class="term" data-site="${s.id}">${esc(s.name)}</button><small>${esc(s.page)}</small>`).join(''):'<span class="muted">未关联</span>'}</td><td class="date">${esc(r.batchDate||'未知')}</td><td><button class="edit-link" data-keyword="${r.id}">编辑</button></td></tr>`).join('')}</tbody></table>`:'<div class="empty">没有匹配的关键词</div>';
  if($('select-page'))$('select-page').onchange=e=>{slice.forEach(r=>choose(r.id,e.target.checked));render();};
  document.querySelectorAll('[data-select]').forEach(c=>c.onchange=()=>{choose(c.dataset.select,c.checked);render();});bindDetails();
}

function choose(id,on){if(on){selected.add(id);selectedHeads.set(id,[...data.keywords.find(r=>r.id===id).heads]);}else{selected.delete(id);selectedHeads.delete(id);}}
function bindDetails(){document.querySelectorAll('[data-keyword]').forEach(b=>b.onclick=()=>keywordDetail(b.dataset.keyword));document.querySelectorAll('[data-site]').forEach(b=>b.onclick=()=>siteDetail(b.dataset.site));}
function researchSummary(r){
  const source=r.observations.find(o=>o.raw?.type==='research')?.raw?.record;
  const disposition=r.observations.find(o=>o.raw?.type==='disposition')?.raw?.record?.disposition;
  if(!source)return '';
  return `<h3>研究摘要</h3><p><strong>${esc(source.verdict)}</strong> · ${esc(source.tier)} · 词簇 ${esc(source.cluster)}</p><p>${esc(source.note)}</p><p>美国月量 ${esc(source.volume??'未知')} / KD ${esc(source.kd??'未知')} · 镜像估值，采集于 ${esc(source.observedAt)}</p>${disposition?`<h3>候选处置</h3><p>${esc(disposition)}</p>`:''}`;
}
function renderBuilds(){
  const list=rows(),matches=new Set(list.map(r=>r.term));
  const planned=data.plans.filter(p=>matches.has(p.seo.primary));
  const manual=list.filter(r=>r.decision!=='unset'&&!data.plans.some(p=>p.seo.primary===r.term));
  $('result-count').textContent=`${planned.length} 个方案 · ${manual.length} 个人工决定`;$('pagination').innerHTML='';
  $('content').innerHTML=``+planned.map(p=>{
    const s=data.sites.find(s=>s.id===p.slug),r=data.keywords.find(r=>r.term===p.seo.primary&&r.country==='US');
    return `<article class="build-card"><div><small>${esc(p.cohort)} · 原方案顺序 ${p.rank}</small><h3><button class="term" data-keyword="${r.id}">${esc(p.name)}</button></h3>${tag(s?.stage||'planned')} ${tag(r.reviewState)}<p>人工决定：${esc(names[r.decision])}</p></div><div><small>方案与差异假设</small><p>${esc(p.decision)}</p><p>${esc(p.differentiation)}</p></div><div><small>当前阻塞与下一步</small><p>${esc(s?s.blockers.join('；'):'尚未登记独立源码；许可/数据/域名等条件以原方案为准')}</p><p>${esc(s?s.nextAction:p.tasks[0]?.[1]||'继续验证来源与差异')}</p>${s?`<button data-site="${s.id}">查看项目 / 源码</button>`:`<button data-keyword="${r.id}">查看方案与证据 / 登记站点</button>`}</div></article>`;
  }).join('')+manual.map(r=>`<article class="build-card"><div><button class="term" data-keyword="${r.id}">${esc(r.term)}</button>${tag(r.decision)}</div><div>${tag(r.reviewState)}</div><div>${r.sites.map(s=>`<button data-site="${s.id}">${esc(s.name)}</button>`).join('')||'尚未关联站点'}</div></article>`).join('');
  bindDetails();
}

function sitePrimary(s){return s.keywordMappings.find(m=>m.role==='primary')||s.keywordMappings[0];}
function siteKeyword(s){const m=sitePrimary(s);return data.keywords.find(r=>r.id===m?.keywordId);}
function siteMetrics(s){const r=siteKeyword(s);if(r)return r.metrics;const m=sitePrimary(s)?.metrics||{};return {...m,ratio:m.intitle!=null&&m.volume?m.intitle/m.volume:null};}
function siteBatchDate(s){return siteKeyword(s)?.batchDate||null;}
function renderSites(){
  const q=$('search').value.trim().toLowerCase(),status=$('status-filter').value,filter=$('site-filter').value;
  let list=data.sites.filter(s=>(!q||JSON.stringify([s.name,s.id,s.urls,s.source.repository,s.keywordMappings]).toLowerCase().includes(q))&&(!status||siteStatus(s)===status)&&(!filter||filter==='linked'&&s.keywordMappings.length||filter==='unlinked'&&!s.keywordMappings.length||s.id===filter));
  const key=$('sort').value;list.sort(comparator(s=>key==='createdAt'?s.createdAt||null:key==='batchDate'?siteBatchDate(s):siteMetrics(s)[key]));
  const slice=pagination(list);$('result-count').textContent=`${list.length} 个站点`;
  $('content').innerHTML=list.length?`<table class="sites-table"><thead><tr><th>站点与关键词</th><th>站点 URL / 仓库</th><th class="numeric">Volume</th><th class="numeric">KD</th><th class="numeric">intitle 数</th><th class="numeric">竞争度 / Volume</th><th>建站状态</th><th>建站时间</th><th>关键词批次</th><th></th></tr></thead><tbody>${slice.map(s=>`<tr><td><button class="term" data-site="${s.id}">${esc(s.name)}</button><small>${esc(sitePrimary(s)?.term||'未关联关键词')}</small></td><td class="site-links">${urlLink(s.urls.production||s.urls.preview)}<small>${urlLink(s.source.repository,s.source.repository.split('/').at(-1))}</small></td>${metricCells(siteMetrics(s))}<td>${tag(siteStatus(s))}</td><td class="date">${esc(s.createdAt||'未知')}</td><td class="date">${esc(siteBatchDate(s)||'未知')}</td><td><button class="edit-link" data-site="${s.id}">编辑</button></td></tr>`).join('')}</tbody></table>`:'<div class="empty">没有匹配的站点</div>';bindDetails();
}

function openDetail(html){$('dialog-status').textContent='';$('detail-content').innerHTML=html;if(!$('detail').open)$('detail').showModal();}
function evidenceList(refs){return `<div>${refs.map(r=>`<div class="evidence"><code>${esc(r.path)}</code><p>${esc(r.note)}</p>${/^(research|deployments|data|docs)\//.test(r.path)?`<button data-evidence="${esc(r.path)}">读取原始证据</button>`:''}</div>`).join('')}</div>`;}
function bindEvidence(){document.querySelectorAll('[data-evidence]').forEach(b=>b.onclick=async()=>{try{const res=await fetch('/api/evidence?path='+encodeURIComponent(b.dataset.evidence));const text=await res.text();const pre=document.createElement('pre');pre.textContent=text;b.parentElement.append(pre);b.disabled=true;}catch(e){message(e.message,true);}});}

function metricForm(m,prefix){return ['volume','kd','intitle'].map(k=>`<label>${{volume:'Volume',kd:'KD',intitle:'intitle 数（竞争度）'}[k]}<input id="${prefix}-${k}" type="number" min="0" ${k==='kd'?'max="100" step="any"':'step="1"'} value="${esc(m[k]??'')}" placeholder="未知"></label>`).join('');}
function readMetrics(prefix){
  return Object.fromEntries(['volume','kd','intitle'].map(k=>{const input=$(prefix+'-'+k),text=input.value.trim();if(!input.checkValidity())throw Error('请检查 '+k+'：需填写非负数字，KD 范围为 0–100');return[k,text===''?null:Number(text)];}));
}
async function saveKeywordEdit(r,metrics,status,reason){
  const changed=Object.fromEntries(Object.entries(metrics).filter(([key,value])=>value!==(r.metrics[key]??null)));
  const payload={keywordId:r.id,expectedHeads:r.heads,basedOnBatches:r.batches,actorType:'human',actor:$('actor').value||'owner',reason,metrics:changed};
  if(status!==undefined&&status!==r.statusOverride)payload.keywordStatus=status;
  if(!Object.keys(changed).length&&!('keywordStatus' in payload))return false;
  await post('/api/keywords',payload);
  return true;
}
function keywordDetail(id){
  const r=data.keywords.find(r=>r.id===id);
  openDetail(`<h2>${esc(r.term)}</h2><form id="keyword-form"><div class="site-form metric-form">${metricForm(r.metrics,'keyword')}<label>关键词状态<select id="keyword-status" aria-label="关键词状态"><option value="">跟随建站进度</option>${['observing','abandoned','building','live'].map(v=>`<option value="${v}" ${r.statusOverride===v?'selected':''}>${names[v]}</option>`).join('')}</select></label><label class="span-all">修改备注<input id="keyword-reason" placeholder="可选，补充修改依据"></label></div><div class="detail-toolbar"><button type="submit" class="primary">保存关键词</button><span class="muted">当前状态：${esc(names[r.keywordStatus])} · 比值 ${ratio(r.metrics.ratio)}</span></div></form>${r.conflicts.length?`<details><summary>${r.conflicts.length} 项差异</summary>${r.conflicts.map(x=>`<p>${esc(x)}</p>`).join('')}</details>`:''}<h3>站点与页面</h3><div class="linklist">${r.sites.map(s=>`<button data-site="${s.id}">${esc(s.name)} · ${esc(s.page)}</button>`).join('')||'<span class="muted">未关联</span>'}</div><div class="detail-toolbar"><label>关联站点<select id="link-site" aria-label="关联站点">${data.sites.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label><label>页面<input id="link-page" value="/"></label><button id="link-keyword">保存关联</button><button id="new-site">登记新站</button></div><h3>所属批次</h3>${r.batches.map(id=>{const b=data.batches.find(b=>b.id===id);return `<details><summary>${esc(b.date)} · ${esc(b.label||b.id)}</summary><p>${esc(b.device)} · ${esc(names[b.status]||b.status)}</p>${evidenceList(b.sources)}<pre>${esc(JSON.stringify(b,null,2))}</pre></details>`;}).join('')}<details><summary>研究与证据 · ${r.observations.length} 条</summary>${researchSummary(r)}${r.observations.map(o=>`<details><summary>${esc(o.batchId)}</summary>${evidenceList(o.evidence)}<pre>${esc(JSON.stringify(o,null,2))}</pre></details>`).join('')}<h3>当前指标来源</h3><pre>${esc(JSON.stringify(r.metrics.sources,null,2))}</pre></details><details><summary>审核与修改历史 · ${r.history.length} 次</summary><div class="detail-toolbar">${tag(r.reviewState)}${tag(r.decision)}<button id="review-one">选择此词审核</button></div>${r.history.map(e=>`<details><summary>${esc(e.actor)} · ${esc(e.createdAt)} · ${e.kind==='keyword_edit'?'手动修改':esc(names[e.state])}</summary><p>${esc(e.reason)}</p><pre>${esc(JSON.stringify(e,null,2))}</pre></details>`).join('')||'<p>暂无记录</p>'}</details>`);
  $('keyword-form').onsubmit=async e=>{e.preventDefault();const button=e.submitter;button.disabled=true;try{if(!await saveKeywordEdit(r,readMetrics('keyword'),$('keyword-status').value||null,$('keyword-reason').value.trim()||'工作台手动修改关键词'))return message('没有需要保存的修改');await load();keywordDetail(id);message('关键词已保存');}catch(error){message(error.message,true);}finally{button.disabled=false;}};
  $('review-one').onclick=()=>{choose(id,true);$('detail').close();render();$('reason').focus();};
  $('link-keyword').onclick=async()=>{const s=data.sites.find(s=>s.id===$('link-site').value),path=$('link-page').value.trim();if(!s)return message('请先登记站点',true);if(!path.startsWith('/'))return message('页面路径需要以 / 开头',true);const copy=structuredClone(s),revision=copy._revision;delete copy._revision;const mapping={keywordId:r.id,term:r.term,country:r.country,language:r.language,page:path,role:'secondary'};if(!copy.keywordMappings.some(m=>m.keywordId===r.id&&m.page===path))copy.keywordMappings.push(mapping);await postSite(copy,revision);};
  $('new-site').onclick=()=>newSite(r);bindDetails();bindEvidence();
}
function siteDetail(id){
  const site=data.sites.find(s=>s.id===id);currentSite=structuredClone(site);delete currentSite._revision;
  const keyword=siteKeyword(site),primary=sitePrimary(site);
  openDetail(`<h2>${esc(site.name)}</h2><form id="site-form"><div class="site-form"><label>站点名称<input id="site-name" value="${esc(site.name)}" required></label><label>建设阶段<select id="site-stage" aria-label="建设阶段">${['idea','planned','building','awaiting_release','blocked','deployed','abandoned'].map(v=>`<option value="${v}" ${v===site.stage?'selected':''}>${names[v]}</option>`).join('')}</select></label><label>站点 URL<input id="site-production" type="url" value="${esc(site.urls.production)}" placeholder="https://example.com"></label><label>预览 URL<input id="site-preview" type="url" value="${esc(site.urls.preview)}" placeholder="https://example.vercel.app"></label><label class="span-all">GitHub 仓库<input id="site-repository" type="url" value="${esc(site.source.repository)}" required></label><label>源码目录<input id="site-directory" value="${esc(site.source.directory)}" required></label><label>分支<input id="site-branch" value="${esc(site.source.branch)}" required></label><label>建站日期<input id="site-created" type="date" value="${esc(site.createdAt||'')}"></label><label>下一步<input id="site-next" value="${esc(site.nextAction)}" required></label><label class="span-all">阻塞（每行一项）<textarea id="site-blockers">${esc(site.blockers.join('\n'))}</textarea></label></div><div class="detail-toolbar"><button type="submit" class="primary">保存站点</button></div></form>${primary?`<h3>主关键词 · ${esc(primary.term)}</h3><form id="site-metric-form"><div class="site-form metric-form">${metricForm(siteMetrics(site),'site-metric')}</div><div class="detail-toolbar"><button type="submit">保存关键词指标</button>${keyword?`<button type="button" data-keyword="${keyword.id}">编辑关键词状态 / 查看批次</button>`:''}</div></form>`:''}<h3>关键词与页面</h3>${site.keywordMappings.map(m=>`<p>${data.keywords.some(k=>k.id===m.keywordId)?`<button class="edit-link" data-keyword="${m.keywordId}">${esc(m.term)}</button>`:esc(m.term)} → ${esc(m.page)}</p>`).join('')}<details><summary>发布验收与证据</summary><p>玩法：${esc(names[site.release.gameplayAcceptance])} · 索引：${esc(names[site.release.indexingPermission])}</p><p>${esc(site.verification.scope)}</p>${site.notes.map(n=>`<p>${esc(n)}</p>`).join('')}${evidenceList(site.sources)}</details><details><summary>高级登记</summary><textarea id="site-json" aria-label="站点完整 JSON">${esc(JSON.stringify(currentSite,null,2))}</textarea></details><details><summary>修改历史 · ${site.history.length} 次</summary><pre>${esc(JSON.stringify(site.history,null,2))}</pre></details>`);
  function syncForm(){const copy=JSON.parse($('site-json').value);copy.name=$('site-name').value;copy.stage=$('site-stage').value;copy.urls.production=$('site-production').value.trim()||null;copy.urls.preview=$('site-preview').value.trim()||null;copy.source.repository=$('site-repository').value.trim().replace(/\/$/,'');copy.source.directory=$('site-directory').value.trim();copy.source.branch=$('site-branch').value.trim();copy.createdAt=$('site-created').value||null;copy.nextAction=$('site-next').value;copy.blockers=$('site-blockers').value.split('\n').filter(Boolean);$('site-json').value=JSON.stringify(copy,null,2);}
  $('site-form').oninput=()=>{try{syncForm();}catch{message('请先修复高级 JSON',true);}};
  $('site-json').oninput=()=>{try{const copy=JSON.parse($('site-json').value);$('site-name').value=copy.name;$('site-stage').value=copy.stage;$('site-production').value=copy.urls.production||'';$('site-preview').value=copy.urls.preview||'';$('site-repository').value=copy.source.repository;$('site-directory').value=copy.source.directory;$('site-branch').value=copy.source.branch;$('site-created').value=copy.createdAt||'';$('site-next').value=copy.nextAction;$('site-blockers').value=copy.blockers.join('\n');}catch{message('高级 JSON 尚未完整',true);}};
  $('site-form').onsubmit=async e=>{e.preventDefault();try{const copy=JSON.parse($('site-json').value);if(copy.id!==site.id)throw Error('站点编号不可更改');e.submitter.disabled=true;await postSite(copy,site._revision);}catch(error){message(error.message,true);}finally{e.submitter.disabled=false;}};
  if(primary)$('site-metric-form').onsubmit=async e=>{e.preventDefault();e.submitter.disabled=true;try{if(JSON.stringify(JSON.parse($('site-json').value))!==JSON.stringify(currentSite))throw Error('请先保存上方站点修改，再保存关键词指标');const metrics=readMetrics('site-metric');if(keyword){if(!await saveKeywordEdit(keyword,metrics,undefined,'网站目录手动修改主关键词指标'))return message('没有需要保存的修改');await load();siteDetail(id);message('关键词指标已保存');}else{const copy=structuredClone(currentSite);copy.keywordMappings[site.keywordMappings.indexOf(primary)].metrics=metrics;await postSite(copy,site._revision);}}catch(error){message(error.message,true);}finally{e.submitter.disabled=false;}};
  bindDetails();bindEvidence();
}

function newSite(r){
  const template={schemaVersion:1,id:'new-game',name:r.term,source:{repository:'https://github.com/seraseraqqq/REPLACE',directory:'.',branch:'main',frozenSnapshots:[]},createdAt:new Date().toLocaleDateString('sv-SE'),stage:'planned',blockers:['尚未核实源码仓库'],nextAction:'确认唯一源码仓库与产品方案',urls:{production:null,preview:null},keywordMappings:[{keywordId:r.id,term:r.term,country:r.country,language:r.language,page:'/',role:'primary'}],release:{deployment:'unknown',gameplayAcceptance:'unknown',indexingPermission:'unknown'},verification:{recordedAt:null,recheckedAt:null,scope:'新建本地登记；未核实远程或线上状态。'},sources:[],notes:[],history:[]};
  openDetail(`<h2>登记新站点</h2><p>先填写稳定编号和真实 GitHub 源码地址。此操作只保存登记，不创建仓库或部署。</p><textarea id="new-site-json" aria-label="新站点 JSON">${esc(JSON.stringify(template,null,2))}</textarea><button id="create-site" class="primary">保存新站点</button>`);
  $('create-site').onclick=async()=>{try{const s=JSON.parse($('new-site-json').value);if(s.source.repository.endsWith('/REPLACE'))throw Error('请填写实际源码仓库地址');await postSite(s,null);}catch(e){message(e.message,true);}};
}
async function post(path,body){const res=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','X-Hub-Token':data.token},body:JSON.stringify(body)});const result=await res.json();if(!res.ok)throw Error(result.error||result.message||'保存失败');return result;}
async function postSite(site,revision){message('正在保存站点登记…');try{await post('/api/sites',{site,expectedRevision:revision,actor:$('actor').value||'owner'});await load();$('detail').close();message('站点已保存到仓库数据文件。');}catch(e){message(e.message,true);}}
$('save-reviews').onclick=async()=>{
  const reason=$('reason').value.trim();if(!reason)return message('请填写审核原因。',true);
  const button=$('save-reviews');button.disabled=true;
  try{const result=await post('/api/reviews',{actorType:'human',actor:$('actor').value,state:$('bulk-state').value,decision:$('bulk-decision').value,reason,items:[...selected].map(id=>({keywordId:id,expectedHeads:selectedHeads.get(id),basedOnBatches:data.keywords.find(r=>r.id===id).batches}))});selected.clear();selectedHeads.clear();$('reason').value='';await load();message(result.conflicts.length?`已保留 ${result.saved} 条审核，其中 ${result.conflicts.length} 项存在并发冲突，请读取历史后复核。`:`已保存 ${result.saved} 条审核到 data/reviews/。`,!!result.conflicts.length);}catch(e){message(e.message,true);}finally{button.disabled=false;}
};
function clearFilters(){filterIds.forEach(id=>$(id).selectedIndex=0);$('sort').value=view==='sites'?'createdAt':'batchDate';$('search').value='';direction='desc';page=0;}
$('direction').onclick=()=>{direction=direction==='asc'?'desc':'asc';page=0;render();};
$('clear-filters').onclick=()=>{clearFilters();render();};$('deselect').onclick=()=>{selected.clear();selectedHeads.clear();render();};
$('refresh').onclick=load;filterIds.forEach(id=>$(id).onchange=()=>{page=0;render();});$('search').oninput=()=>{page=0;render();};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{view=b.dataset.view;clearFilters();location.hash=view;render();});
document.querySelector('.brand').onclick=e=>{e.preventDefault();view='keywords';clearFilters();location.hash=view;render();};
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1);if(['keywords','builds','sites'].includes(next)&&next!==view){view=next;clearFilters();render();}});
$('close-detail').onclick=()=>$('detail').close();
$('export').onclick=async()=>{const list=rows();if(!list.length)return message('当前筛选无结果。');try{const res=await fetch('/api/export',{method:'POST',headers:{'Content-Type':'application/json','X-Hub-Token':data.token},body:JSON.stringify({ids:list.map(r=>r.id)})});if(!res.ok)throw Error('导出失败');const blob=await res.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gamehubs-keywords.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);message(`已导出 ${list.length} 个关键词（UTF-8 CSV，Excel可打开）。`);}catch(e){message(e.message,true);}};

$('help').onclick=()=>openDetail(`<h2>使用说明</h2>${data.errors.length?'<h3>数据校验问题</h3>'+data.errors.map(e=>`<p>${esc(e.path)}：${esc(e.error)}</p>`).join(''):''}<h3>每天的操作</h3><p>导入整批 JSONL（包含不合格/错误结果），在关键词池筛选并批量审核。审核原因保存在 data/reviews/ 独立文件中。关键词详情可关联已有站点或登记新站。</p><h3>本地命令</h3><pre>python3 scripts/hub.py import batch.json keywords.jsonl\npython3 scripts/hub.py validate\npython3 scripts/hub.py generate\npython3 scripts/hub.py query "poople"\npython3 scripts/hub.py query "coreball" --kind site</pre><h3>换设备前后</h3><p>先检查 git status，保留当前改动，再获取远程更新。每批使用“日期-设备-UUID”独立编号，审核文件也是独立编号。审核冲突会提示复核。generated/ 和 INDEX.md 均可重建。</p><p>本管理页不执行 Git 命令。提交时人工选择 data/ 及本轮必要文件，避免 git add . 将其他会话资料一并纳入。迁移后的旧 JSON 和 Excel 仅作历史来源，后续统一维护 data/。</p><h3>导出格式</h3><p>CSV 为带 UTF-8 BOM 的标准逗号分隔文件，Excel 可直接打开。保留原始观察 JSON 列，不会把未知值变成零。</p><h3>更多说明</h3><p>仓库 docs/USAGE.md 包含导入模板、审核规则、字段解释和恢复步骤。</p>`);
if(['keywords','builds','sites'].includes(location.hash.slice(1)))view=location.hash.slice(1);
load();
