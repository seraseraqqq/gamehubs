const $ = id => document.getElementById(id);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const names = {qualified:'合格',rejected:'不合格',needs_review:'待复核',unknown:'未知',pending:'未审核',approved:'认可',hold:'暂缓',conflict:'审核冲突',build:'决定建设',defer:'暂缓决定',abandon:'已放弃',unset:'尚未决定',planned:'计划中',building:'建设中',blocked:'有阻塞',awaiting_release:'待验收/待发布',deployed:'已部署（历史）',abandoned:'已放弃',idea:'构想',recorded_deployed:'历史记录已部署',not_deployed:'未部署',recorded_pass:'历史验收通过',recorded_allowed:'历史允许索引',historical:'历史导入',partial:'部分完成',complete:'完成',failed:'失败'};
let data, view = 'keywords', page = 0, selected = new Set(), selectedHeads = new Map(), rendered = [], currentSite;
const size = 40;
const filterIds = ['batch-filter','market-filter','qualification-filter','review-filter','decision-filter','stage-filter','sort'];
function tag(value) {return `<span class="tag ${['qualified','approved','recorded_pass'].includes(value)?'good':['conflict','rejected','abandoned','abandon'].includes(value)?'bad':['unknown','needs_review','hold','blocked','pending'].includes(value)?'warn':'blue'}">${esc(names[value] || value)}</span>`;}
function urlLink(url,label) {try {const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return esc(url);return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label || url)} ↗</a>`;} catch {return esc(url || '待定');}}
function message(text, error=false) {$('status').textContent=text;$('status').className=error?'error':'';if($('detail').open){$('dialog-status').textContent=text;$('dialog-status').className=error?'error':'';}}
async function load() {
  try {const res=await fetch('/api/state');if(!res.ok)throw Error('无法读取本地数据');data=await res.json();
    $('sync-label').textContent='文件已读取 · '+new Date().toLocaleTimeString('zh-CN');
    const old=$('batch-filter').value;$('batch-filter').innerHTML='<option value="">全部批次</option>'+data.batches.map(b=>`<option value="${esc(b.id)}">${esc(b.date)} · ${esc(b.label || b.id.replace(/^legacy-/,''))}</option>`).join('');$('batch-filter').value=old;
    const market=$('market-filter').value;$('market-filter').innerHTML='<option value="">全部市场</option>'+[...new Set([...data.keywords.map(r=>r.country+'/'+r.language),...data.sites.flatMap(s=>s.keywordMappings.map(m=>m.country+'/'+m.language))])].sort().map(m=>`<option>${esc(m)}</option>`).join('');$('market-filter').value=market;
    $('nav-count').textContent=data.counts.keywords;render();
    if(data.errors.length)message(`有 ${data.errors.length} 项数据校验问题。请在挖词批次查看，其他有效记录仍可使用。`,true);
  } catch(e) {message(e.message,true);}
}
function rows() {
  const q=$('search').value.trim().toLowerCase(),batch=$('batch-filter').value,market=$('market-filter').value;
  let list=data.keywords.filter(r=>(!q||JSON.stringify([r.term,r.aliases,r.sites,r.batches]).toLowerCase().includes(q))&&(!batch||r.batches.includes(batch))&&(!market||r.country+'/'+r.language===market)&&
    (!$('qualification-filter').value||r.qualification===$('qualification-filter').value)&&(!$('review-filter').value||r.reviewState===$('review-filter').value)&&(!$('decision-filter').value||r.decision===$('decision-filter').value)&&
    (!$('stage-filter').value||($('stage-filter').value==='unlinked'?!r.sites.length:r.sites.some(s=>s.stage===$('stage-filter').value||($('stage-filter').value==='blocked'&&s.hasBlockers)))));
  if(view==='builds') list=list.filter(r=>r.decision!=='unset'||r.sites.length||data.plans.some(p=>p.seo.primary===r.term));
  const sort=$('sort').value;list.sort((a,b)=>sort==='priority'?(priority(a)-priority(b)||a.term.localeCompare(b.term)):sort==='observations'?b.observations.length-a.observations.length:sort==='conflicts'?b.conflicts.length-a.conflicts.length:sort==='recent'?latest(b).localeCompare(latest(a)):a.term.localeCompare(b.term));return list;
}
function priority(r){return r.observations.find(o=>o.raw?.type==='research')?.raw?.record?.order??999999;}
function latest(r) {return data.batches.find(b=>b.id===r.observations.at(-1)?.batchId)?.date || '';}
function metricPreview(r) {
  const snapshots = new Map();
  for (const o of r.observations) for (const [provider, m] of Object.entries(o.metrics)) {
    const volume=m.volume??m.search_volume, kd=m.kd??m.keyword_difficulty;
    if(volume==null&&kd==null)continue;
    const label=provider.replace('semrush_mirror','Semrush镜像').replace('user_','').replace('legacy_unspecified','旧台账/来源未知').replace('legacy_registry','旧站点登记').replace('dataforseo_raw','dataforseo');
    snapshots.set(label, `${label}: V ${volume??'未知'} / KD ${kd??'未知'}`);
  }
  return [...snapshots.values()].slice(0,3).map(x=>`<span>${esc(x)}</span>`).join('')||'暂无指标';
}

function stats() {
  const values=[['累计关键词',data.counts.keywords,`${data.counts.observations} 条观察 · ${data.counts.batches} 个来源批次`],['等待人工审核',data.keywords.filter(r=>r.reviewState==='pending').length,'研究资格与人工决定分开保存'],['已登记网站',data.counts.sites,`${data.sites.filter(s=>s.source.directory==='.').length} 个独立仓库 · 保留唯一源码入口`],['严格指标达标',data.keywords.filter(r=>r.observations.some(o=>o.raw?.strictMetricMatch)).length,'仅表示 Volume / KD 达标，未代表立项']];
  $('stats').innerHTML=values.map(v=>`<div class="stat"><small>${v[0]}</small><strong>${v[1]}</strong><p>${v[2]}</p></div>`).join('');
}
function render() {
  if(!data)return;stats();
  const labels={keywords:['关键词池','把值得做的词，逐个落成站。','汇总每轮研究，保留全部结果，再由你决定下一步。','全部关键词'],batches:['挖词批次','每轮探索，都留下一份依据。','按日期与来源追溯结果。失败、未通过与未知同样保留。','批次档案'],builds:['建站清单','让决定，对应到下一步。','人工建站决定和当前工程进度分别表达；可从关键词详情创建或关联站点。','建设与决定'],sites:['网站目录','找到站点，也找到唯一源码。','正式与预览入口、仓库、阻塞和发布门禁集中查看。','站点登记']};
  const t=labels[view];$('crumb').textContent=t[0];$('title').textContent=t[1];$('subtitle').textContent=t[2];$('table-title').textContent=t[3];
  document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  $('filters').hidden=view==='batches';$('bulk').hidden=!(selected.size&&['keywords','builds'].includes(view));$('export').hidden=!['keywords','builds'].includes(view);
  if(view==='batches')return renderBatches();
  if(view==='sites')return renderSites();
  if(view==='builds')return renderBuilds();
  rendered=rows();page=Math.min(page,Math.max(0,Math.ceil(rendered.length/size)-1));
  const slice=rendered.slice(page*size,(page+1)*size);
  $('result-count').textContent=`${rendered.length} 个结果`;
  $('selected-count').textContent=`已选 ${selected.size} 个词`;
  $('content').innerHTML=slice.length?`<table><thead><tr><th><input id="select-page" type="checkbox" aria-label="选择当前页" ${slice.every(r=>selected.has(r.id))?'checked':''}></th><th>关键词 / 原始名称</th><th>市场</th><th>指标观察 · V / KD</th><th>研究资格</th><th>人工审核 / 决定</th><th>站点与页面</th><th>证据与差异</th></tr></thead><tbody>${slice.map(r=>`<tr><td><input type="checkbox" data-select="${r.id}" aria-label="选择 ${esc(r.term)} ${esc(r.country)} ${esc(r.language)}" ${selected.has(r.id)?'checked':''}></td><td><button class="term" data-keyword="${r.id}">${esc(r.term)}</button><small>${esc(r.aliases.filter(a=>a!==r.term).join(' · '))}</small></td><td>${esc(r.country)} / ${esc(r.language)}</td><td class="metrics-list">${metricPreview(r)}<small>各来源最近记录 · 详情保留历史</small></td><td>${tag(r.qualification)}</td><td>${tag(r.reviewState)}<small>${esc(names[r.decision])}</small></td><td>${r.sites.length?r.sites.map(s=>`<button class="term" data-site="${s.id}">${esc(s.name)}</button><small>${esc(s.page)} · ${esc(names[s.stage])}</small>`).join(''):'<span class="muted">尚未关联</span>'}</td><td><button class="term" data-keyword="${r.id}">${r.observations.length} 条观察 / ${r.batches.length} 批</button><small>${r.conflicts.length?'⚑ '+r.conflicts.length+' 项差异待复核':'保留原始证据'}</small></td></tr>`).join('')}</tbody></table>`:'<div class="empty">没有匹配结果。可以清除部分筛选条件。</div>';
  $('pagination').innerHTML=`<span>每页 ${size} 条 · 第 ${page+1} / ${Math.max(1,Math.ceil(rendered.length/size))} 页</span><button id="previous" ${page===0?'disabled':''}>上一页</button><button id="next" ${(page+1)*size>=rendered.length?'disabled':''}>下一页</button>`;
  $('previous').onclick=()=>{page--;render();};$('next').onclick=()=>{page++;render();};
  if($('select-page'))$('select-page').onchange=e=>{slice.forEach(r=>choose(r.id,e.target.checked));render();};
  document.querySelectorAll('[data-select]').forEach(c=>c.onchange=()=>{choose(c.dataset.select,c.checked);render();});bindDetails();
}
function choose(id,on){if(on){selected.add(id);selectedHeads.set(id,[...data.keywords.find(r=>r.id===id).heads]);}else{selected.delete(id);selectedHeads.delete(id);}}
function bindDetails(){document.querySelectorAll('[data-keyword]').forEach(b=>b.onclick=()=>keywordDetail(b.dataset.keyword));document.querySelectorAll('[data-site]').forEach(b=>b.onclick=()=>siteDetail(b.dataset.site));}
function researchSummary(r){
  const source=r.observations.find(o=>o.raw?.type==='research')?.raw?.record;
  const disposition=r.observations.find(o=>o.raw?.type==='disposition')?.raw?.record?.disposition;
  if(!source)return '';
  return `<h3>研究摘要</h3><p><strong>${esc(source.verdict)}</strong> · ${esc(source.tier)} · 词簇 ${esc(source.cluster)}</p><p>${esc(source.note)}</p><p>美国月量 ${esc(source.volume??'未知')} / KD ${esc(source.kd??'未知')} · 镜像估值，采集于 ${esc(source.observedAt)}</p>${disposition?`<h3>候选处置</h3><p>${esc(disposition)}</p>`:''}<p>17项严格指标达标为研究筛选，不代表人工批准项目。</p>`;
}
function renderBuilds(){
  const list=rows(),matches=new Set(list.map(r=>r.term));
  const planned=data.plans.filter(p=>matches.has(p.seo.primary));
  const manual=list.filter(r=>r.decision!=='unset'&&!data.plans.some(p=>p.seo.primary===r.term));
  $('result-count').textContent=`${planned.length} 个方案 · ${manual.length} 个人工决定`;$('pagination').innerHTML='';
  $('content').innerHTML=`<div class="queue-note">原研究共11项方案，另106词处置均保留。5个已有独立项目的本地MVP待验收；计划、人工决定和实际发布分别记录。</div>`+planned.map(p=>{
    const s=data.sites.find(s=>s.id===p.slug),r=data.keywords.find(r=>r.term===p.seo.primary&&r.country==='US');
    return `<article class="build-card"><div><small>${esc(p.cohort)} · 原方案顺序 ${p.rank}</small><h3><button class="term" data-keyword="${r.id}">${esc(p.name)}</button></h3>${tag(s?.stage||'planned')} ${tag(r.reviewState)}<p>人工决定：${esc(names[r.decision])}</p></div><div><small>方案与差异假设</small><p>${esc(p.decision)}</p><p>${esc(p.differentiation)}</p></div><div><small>当前阻塞与下一步</small><p>${esc(s?s.blockers.join('；'):'尚未登记独立源码；许可/数据/域名等条件以原方案为准')}</p><p>${esc(s?s.nextAction:p.tasks[0]?.[1]||'继续验证来源与差异')}</p>${s?`<button data-site="${s.id}">查看项目 / 源码</button>`:`<button data-keyword="${r.id}">查看方案与证据 / 登记站点</button>`}</div></article>`;
  }).join('')+manual.map(r=>`<article class="build-card"><div><button class="term" data-keyword="${r.id}">${esc(r.term)}</button>${tag(r.decision)}</div><div>${tag(r.reviewState)}</div><div>${r.sites.map(s=>`<button data-site="${s.id}">${esc(s.name)}</button>`).join('')||'尚未关联站点'}</div></article>`).join('');
  bindDetails();
}
function renderBatches(){
  const q=$('search').value.toLowerCase();const list=data.batches.filter(b=>JSON.stringify(b).toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date));
  $('result-count').textContent=`${list.length} 批`;$('pagination').innerHTML='';
  $('content').innerHTML=(data.errors.length?`<div class="error-list">${data.errors.map(e=>`<p>${esc(e.path)}: ${esc(e.error)}</p>`).join('')}</div>`:'')+`<table><thead><tr><th>批次 / 日期</th><th>市场 / 设备</th><th>状态 / 条数</th><th>来源</th></tr></thead><tbody>${list.map(b=>`<tr><td><button class="term" data-batch="${esc(b.id)}">${esc(b.id)}</button><small>${esc(b.date)}</small></td><td>${esc(b.market.country)} / ${esc(b.market.language)}<small>${esc(b.device)}</small></td><td>${tag(b.status)}<small>${b.acceptedRowCount??0} 条保存 · ${b.rejectedRowCount??0} 条错误</small></td><td>${esc(b.sources.map(s=>s.path).join(' · '))}</td></tr>`).join('')}</tbody></table>`;
  document.querySelectorAll('[data-batch]').forEach(b=>b.onclick=()=>{const batch=data.batches.find(x=>x.id===b.dataset.batch);openDetail(`<h2>${esc(batch.id)}</h2><p>历史来源和执行状态完整保留；不是新的实时验收。</p><div class="detail-toolbar"><button id="batch-keywords" class="primary">查看本批全部关键词</button></div>${evidenceList(batch.sources)}<pre>${esc(JSON.stringify(batch,null,2))}</pre>`);$('batch-keywords').onclick=()=>{$('detail').close();view='keywords';clearFilters();$('batch-filter').value=batch.id;render();};bindEvidence();});
}
function renderSites(){
  const matching=new Set(rows().flatMap(r=>r.sites.map(s=>s.id))),q=$('search').value.toLowerCase();
  const activeFilters=['batch-filter','qualification-filter','review-filter','decision-filter'].some(id=>$(id).value), stage=$('stage-filter').value, market=$('market-filter').value;
  let sites=data.sites.filter(s=>(!q||JSON.stringify(s).toLowerCase().includes(q))&&(!activeFilters||matching.has(s.id))&&(!stage||(stage==='blocked'?s.blockers.length:s.stage===stage))&&(!market||s.keywordMappings.some(m=>m.country+'/'+m.language===market)));
  const sort=$('sort').value;sites.sort((a,b)=>sort==='priority'?((data.plans.find(p=>p.slug===a.id)?.rank??999)-(data.plans.find(p=>p.slug===b.id)?.rank??999)||a.name.localeCompare(b.name)):sort==='recent'?(b.verification.recordedAt||'').localeCompare(a.verification.recordedAt||''):sort==='observations'?b.keywordMappings.length-a.keywordMappings.length:sort==='conflicts'?b.blockers.length-a.blockers.length:a.name.localeCompare(b.name));$('result-count').textContent=`${sites.length} 个站点`;$('pagination').innerHTML='';
  $('content').innerHTML=`<div style="padding:0"></div>`;
  $('content').innerHTML=sites.map(s=>`<article class="build-card"><div><h3><button class="term" data-site="${s.id}">${esc(s.name)}</button></h3>${tag(s.stage)}<p>${s.keywordMappings.length} 个关键词/页面映射</p></div><div><small>访问入口</small><p>${s.urls.production?urlLink(s.urls.production):'正式地址待定'}</p><p>${s.urls.preview?urlLink(s.urls.preview,'预览地址'):''}</p><small>玩法 ${esc(names[s.release.gameplayAcceptance])} · 索引 ${esc(names[s.release.indexingPermission])}</small></div><div><small>唯一有效源码</small><p>${urlLink(s.source.repository,s.source.repository.split('/').at(-1))} <code>${esc(s.source.directory)}</code></p><small>${esc(s.blockers.join('；')||'未登记阻塞')}</small><p>${esc(s.nextAction)}</p></div></article>`).join('')||'<div class="empty">没有匹配站点。</div>';bindDetails();
}
function openDetail(html){$('dialog-status').textContent='';$('detail-content').innerHTML=html;if(!$('detail').open)$('detail').showModal();}
function evidenceList(refs){return `<div>${refs.map(r=>`<div class="evidence"><code>${esc(r.path)}</code><p>${esc(r.note)}</p>${/^(research|deployments|data|docs)\//.test(r.path)?`<button data-evidence="${esc(r.path)}">读取原始证据</button>`:''}</div>`).join('')}</div>`;}
function bindEvidence(){document.querySelectorAll('[data-evidence]').forEach(b=>b.onclick=async()=>{try{const res=await fetch('/api/evidence?path='+encodeURIComponent(b.dataset.evidence));const text=await res.text();const pre=document.createElement('pre');pre.textContent=text;b.parentElement.append(pre);b.disabled=true;}catch(e){message(e.message,true);}});}
function keywordDetail(id){
  const r=data.keywords.find(r=>r.id===id);
  openDetail(`<h2>${esc(r.term)}</h2><p>${esc(r.country)} / ${esc(r.language)} · ${esc(r.id)}</p><div class="detail-toolbar">${tag(r.qualification)}${tag(r.reviewState)}${tag(r.decision)}<button id="review-one">选择此词审核</button></div>${r.conflicts.map(x=>`<p class="error-list">${esc(x)}</p>`).join('')}${researchSummary(r)}<h3>站点与页面</h3><div class="linklist">${r.sites.map(s=>`<button data-site="${s.id}">${esc(s.name)} · ${esc(s.page)}</button>`).join('')||'尚未关联'}</div><div class="detail-toolbar"><label>关联现有站点<select id="link-site">${data.sites.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('')}</select></label><label>页面<input id="link-page" value="/"></label><button id="link-keyword">保存关联</button><button id="new-site">为此词登记新站</button></div><h3>观察与研究证据 · ${r.observations.length} 条</h3>${r.observations.map(o=>`<details><summary>${esc(data.batches.find(b=>b.id===o.batchId)?.date)} · ${esc(o.batchId)} ${esc(names[o.qualification])}</summary>${evidenceList(o.evidence)}<pre>${esc(JSON.stringify(o,null,2))}</pre></details>`).join('')}<h3>审核历史 · ${r.history.length} 次</h3><p>人工决定优先；并发分支保留，重新选择并审核可合并当前全部分支。</p>${r.history.map(e=>`<details><summary>${esc(e.actorType)} / ${esc(e.actor)} · ${esc(e.createdAt)} · ${esc(names[e.state])} / ${esc(names[e.decision])}${e.conflict?' · 并发冲突':''}</summary><p>${esc(e.reason)}</p><pre>${esc(JSON.stringify(e,null,2))}</pre></details>`).join('')||'<p>尚无人工或 AI 审核记录。旧台账建议仅在观察中保存。</p>'}`);
  $('review-one').onclick=()=>{choose(id,true);$('detail').close();render();$('reason').focus();};
  $('link-keyword').onclick=async()=>{const s=data.sites.find(s=>s.id===$('link-site').value),page=$('link-page').value.trim();if(!page.startsWith('/'))return message('页面路径需要以 / 开头',true);const copy=structuredClone(s),revision=copy._revision;delete copy._revision;const mapping={keywordId:r.id,term:r.term,country:r.country,language:r.language,page,role:'secondary'};if(!copy.keywordMappings.some(m=>m.keywordId===r.id&&m.page===page))copy.keywordMappings.push(mapping);await postSite(copy,revision);};
  $('new-site').onclick=()=>newSite(r);bindDetails();bindEvidence();
}
function siteDetail(id){
  const site=data.sites.find(s=>s.id===id);currentSite=structuredClone(site);delete currentSite._revision;
  openDetail(`<h2>${esc(site.name)}</h2><p>${esc(site.id)} · 核实：${esc(site.verification.recheckedAt||site.verification.recordedAt||'日期未知')} · ${esc(site.verification.scope)}</p><h3>站点登记</h3><p>修改会保存到 data/sites/${esc(site.id)}.json，并保留历史。发布验收需依据实际证据手动记录。</p><div class="site-form"><label>建设阶段<select id="site-stage">${['idea','planned','building','awaiting_release','blocked','deployed','abandoned'].map(v=>`<option value="${v}" ${v===site.stage?'selected':''}>${names[v]}</option>`).join('')}</select></label><label>站点名称<input id="site-name" value="${esc(site.name)}"></label><label class="span-all">下一步<input id="site-next" value="${esc(site.nextAction)}"></label><label class="span-all">阻塞（每行一项）<textarea id="site-blockers">${esc(site.blockers.join('\n'))}</textarea></label></div><div class="detail-toolbar"><button id="save-site" class="primary">保存站点登记</button></div><h3>唯一源码与访问地址</h3><p>${urlLink(site.source.repository)} / ${esc(site.source.directory)}</p><div class="linklist">${site.urls.production?urlLink(site.urls.production,'正式地址'):''}${site.urls.preview?urlLink(site.urls.preview,'预览地址'):''}</div><p>冻结副本：${esc(site.source.frozenSnapshots.join('、')||'无')}</p><details><summary>高级登记：源码、地址、关键词/页面、验收及证据</summary><p>此处编辑的是同一份站点记录。未知不能改写为通过；不要用本机路径替代仓库身份。</p><textarea id="site-json" aria-label="站点完整 JSON">${esc(JSON.stringify(currentSite,null,2))}</textarea></details><h3>历史差异与待核实</h3>${site.notes.map(n=>`<p>${esc(n)}</p>`).join('')}${evidenceList(site.sources)}<h3>关键词/页面对应</h3>${site.keywordMappings.map(m=>`<p>${data.keywords.some(k=>k.id===m.keywordId)?`<button data-keyword="${m.keywordId}">${esc(m.term)}</button>`:esc(m.term)+'（站点登记词，未混入主池）'} ${esc(m.country)}/${esc(m.language)} → ${esc(m.page)} (${esc(m.role)})</p>`).join('')}<h3>登记变更历史</h3><pre>${esc(JSON.stringify(site.history,null,2))}</pre>`);
  // Simple fields update the JSON editor; advanced changes remain intact.
  ['site-stage','site-name','site-next','site-blockers'].forEach(id=>$(id).oninput=()=>{try{const s=JSON.parse($('site-json').value);s.stage=$('site-stage').value;s.name=$('site-name').value;s.nextAction=$('site-next').value;s.blockers=$('site-blockers').value.split('\n').filter(Boolean);$('site-json').value=JSON.stringify(s,null,2);}catch{message('请先修复高级 JSON，再修改表单',true);}});
  $('save-site').onclick=async()=>{try{const copy=JSON.parse($('site-json').value);if(copy.id!==site.id)throw Error('站点编号不可在编辑中更改');await postSite(copy,site._revision);}catch(e){message(e.message,true);}};bindDetails();bindEvidence();
}
function newSite(r){
  const template={schemaVersion:1,id:'new-game',name:r.term,source:{repository:'https://github.com/seraseraqqq/REPLACE',directory:'.',branch:'main',frozenSnapshots:[]},stage:'planned',blockers:['尚未核实源码仓库'],nextAction:'确认唯一源码仓库与产品方案',urls:{production:null,preview:null},keywordMappings:[{keywordId:r.id,term:r.term,country:r.country,language:r.language,page:'/',role:'primary'}],release:{deployment:'unknown',gameplayAcceptance:'unknown',indexingPermission:'unknown'},verification:{recordedAt:null,recheckedAt:null,scope:'新建本地登记；未核实远程或线上状态。'},sources:[],notes:[],history:[]};
  openDetail(`<h2>登记新站点</h2><p>先填写稳定编号和真实 GitHub 源码地址。此操作只保存登记，不创建仓库或部署。</p><textarea id="new-site-json" aria-label="新站点 JSON">${esc(JSON.stringify(template,null,2))}</textarea><button id="create-site" class="primary">保存新站点</button>`);
  $('create-site').onclick=async()=>{try{const s=JSON.parse($('new-site-json').value);if(s.source.repository.endsWith('/REPLACE'))throw Error('请填写实际源码仓库地址');await postSite(s,null);}catch(e){message(e.message,true);}};
}
async function post(path,body){const res=await fetch(path,{method:'POST',headers:{'Content-Type':'application/json','X-Hub-Token':data.token},body:JSON.stringify(body)});const result=await res.json();if(!res.ok)throw Error(result.error||result.message||'保存失败');return result;}
async function postSite(site,revision){message('正在保存站点登记…');try{await post('/api/sites',{site,expectedRevision:revision,actor:$('actor').value||'owner'});$('detail').close();message('站点已保存到仓库数据文件。');await load();}catch(e){message(e.message,true);}}
$('save-reviews').onclick=async()=>{
  const reason=$('reason').value.trim();if(!reason)return message('请填写审核原因。',true);
  const button=$('save-reviews');button.disabled=true;
  try{const result=await post('/api/reviews',{actorType:'human',actor:$('actor').value,state:$('bulk-state').value,decision:$('bulk-decision').value,reason,items:[...selected].map(id=>({keywordId:id,expectedHeads:selectedHeads.get(id),basedOnBatches:data.keywords.find(r=>r.id===id).batches}))});selected.clear();selectedHeads.clear();$('reason').value='';await load();message(result.conflicts.length?`已保留 ${result.saved} 条审核，其中 ${result.conflicts.length} 项存在并发冲突，请读取历史后复核。`:`已保存 ${result.saved} 条审核到 data/reviews/。`,!!result.conflicts.length);}catch(e){message(e.message,true);}finally{button.disabled=false;}
};
function clearFilters(){filterIds.forEach(id=>$(id).selectedIndex=0);$('search').value='';page=0;}
$('clear-filters').onclick=()=>{clearFilters();render();};$('deselect').onclick=()=>{selected.clear();selectedHeads.clear();render();};
$('refresh').onclick=load;filterIds.forEach(id=>$(id).onchange=()=>{page=0;render();});$('search').oninput=()=>{page=0;render();};
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{view=b.dataset.view;page=0;location.hash=view;render();});
$('close-detail').onclick=()=>$('detail').close();
$('export').onclick=async()=>{const list=rows();if(!list.length)return message('当前筛选无结果。');try{const res=await fetch('/api/export',{method:'POST',headers:{'Content-Type':'application/json','X-Hub-Token':data.token},body:JSON.stringify({ids:list.map(r=>r.id)})});if(!res.ok)throw Error('导出失败');const blob=await res.blob(),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='gamehubs-keywords.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);message(`已导出 ${list.length} 个关键词（UTF-8 CSV，Excel可打开）。`);}catch(e){message(e.message,true);}};

$('help').onclick=()=>openDetail(`<h2>使用与跨设备同步</h2><h3>每天的操作</h3><p>导入整批 JSONL（包含不合格/错误结果），在关键词池筛选并批量审核。审核原因保存在 data/reviews/ 独立文件中。关键词详情可关联已有站点或登记新站。</p><h3>本地命令</h3><pre>python3 scripts/hub.py import batch.json keywords.jsonl\npython3 scripts/hub.py validate\npython3 scripts/hub.py generate\npython3 scripts/hub.py query "poople"\npython3 scripts/hub.py query "coreball" --kind site</pre><h3>换设备前后</h3><p>先检查 git status，保留当前改动，再获取远程更新。每批使用“日期-设备-UUID”独立编号，审核文件也是独立编号。审核冲突会提示复核。generated/ 和 INDEX.md 均可重建。</p><p>本管理页不执行 Git 命令。提交时人工选择 data/ 及本轮必要文件，避免 git add . 将其他会话资料一并纳入。迁移后的旧 JSON 和 Excel 仅作历史来源，后续统一维护 data/。</p><h3>导出格式</h3><p>CSV 为带 UTF-8 BOM 的标准逗号分隔文件，Excel 可直接打开。保留原始观察 JSON 列，不会把未知值变成零。</p><h3>更多说明</h3><p>仓库 docs/USAGE.md 包含导入模板、审核规则、字段解释和恢复步骤。</p>`);
if(['keywords','batches','builds','sites'].includes(location.hash.slice(1)))view=location.hash.slice(1);
load();
