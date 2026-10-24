/** Rebuild the US keyword ledger from observed Trends and Semrush DOM exports.
 * node research/2026-10-24-keyword-opportunities/analyze-research.mjs
 * No network, credentials, paid APIs, or source-game changes. 2026-10-24.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const raw = path.join(root, 'raw');
const clean = value => {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,clean(v)]));
  if (typeof value === 'string') return value.replace(/([?&])__gmitm=[^&#\s"]+/g,'$1').replace(/\?&/g,'?').replace(/[?&]$/,'');
  return value;
};
const files = await fs.readdir(raw);
const docs = new Map();
for (const name of files.filter(f=>f.endsWith('.json'))) {
  const original = await fs.readFile(path.join(raw,name),'utf8');
  const d = clean(JSON.parse(original));
  docs.set(name,d);
  await fs.writeFile(path.join(raw,name),JSON.stringify(d,null,2)+'\n');
}
const number = value => {
  if (!value || /^(n\/a|—|-|Loading…)$/i.test(value.trim())) return null;
  const m = value.trim().replaceAll(',','').match(/^(\d+(?:\.\d+)?)([KM])?%?$/i);
  return m ? Number(m[1]) * ({K:1000,M:1000000}[m[2]?.toUpperCase()]||1) : null;
};
const mean = a => a.length ? +(a.reduce((x,y)=>x+y,0)/a.length).toFixed(2) : null;
const series = new Map();
const related = new Map();
for (const [name,d] of docs) {
  if (!name.startsWith('trends-related-') || !d.pages) continue;
  for (const p of d.pages) {
    const re=/\n(\d{1,2})\n([^\n]+)\n(Breakout|\+?[\d,.]+%?)\nmore_vert/g;
    for (const m of p.text.matchAll(re)) {
      if (!related.has(m[2])) related.set(m[2],[]);
      related.get(m[2]).push({signal:m[3],file:'raw/'+name,sourceTerms:[p.sourceKeyword||d.sourceKeyword],url:d.url});
    }
  }
}
for (const [name,d] of docs) {
  if (!/^trends-\d+\.json$/.test(name) || !d.terms) continue;
  const t = d.tables?.find(t=>t[0]?.[0]==='x' && t[0]?.[1]==='y1');
  if (t && t.length>40) for (let i=0;i<d.terms.length;i++) {
    const points=t.slice(1).map((r,j)=>({date:r[0].replace(/[\u202a-\u202e]/g,''),index:number(r[i+1]),partial:j===t.length-2?'unknown; conservatively excluded':null}));
    const complete=points.slice(0,-1).map(p=>p.index).filter(n=>n!==null);
    const stats={first4:mean(complete.slice(0,4)),last4:mean(complete.slice(-4)),last8:mean(complete.slice(-8)),nonZeroPeriods:complete.filter(n=>n>0).length};
    series.set(d.terms[i],{file:'raw/'+name,url:d.url,period:'US · Past 12 months',partialFlagsExposed:false,finalWeekExcluded:true,points,...stats});
  }
  const regex=/\n(\d{1,2})\n([^\n]+)\n(Breakout|\+?[\d,.]+%?)\nmore_vert/g;
  for(const m of (d.text||'').matchAll(regex)){
    const k=m[2];if(!related.has(k))related.set(k,[]);
    related.get(k).push({signal:m[3],file:'raw/'+name,sourceTerms:d.terms,url:d.url});
  }
}
const metrics=new Map();
for(const [name,d] of docs){
  if(!/^semrush-bulk-\d+\.json$/.test(name))continue;
  const h=d.rows?.find(r=>r.cells.includes('KD %'))?.cells;
  if(!h)continue;
  const idx=Object.fromEntries(h.map((v,i)=>[v,i]));
  for(const r of d.rows){
    const kw=r.cells[idx.Keyword];
    const volume=number(r.cells[idx.Volume]);
    if(!kw || kw==='Keyword' || volume===null)continue;
    metrics.set(kw,{keyword:kw,volume,kd:number(r.cells[idx['KD %']]),intent:r.cells[idx.Intent],cpc:number(r.cells[idx['CPC (USD)']]),updated:r.cells[idx.Updated],metricFile:'raw/'+name,observedAt:d.collectedAt,market:'US',source:'User-provided Semrush mirror; modeled estimates'});
  }
}
const serp=new Map();
for(const [name,d] of docs){
  if(!name.startsWith('semrush-serp-'))continue;
  const renderedKeyword=d.text?.match(/Keyword Overview:\s*\n([^\n]+)/)?.[1];
  if(d.keyword && renderedKeyword && d.keyword!==renderedKeyword)throw Error('SERP keyword identity mismatch in '+name);
  const keyword=d.keyword||renderedKeyword;
  if(!keyword)continue;
  const rows=(d.rows||[]).filter(r=>/^\d+$/.test(r.cells[0])&&r.cells.length>=7&&/^https?:/.test(r.cells[1]||'')).map(r=>({position:+r.cells[0],url:r.cells[1].match(/https?:\/\/[^\s]+/)?.[0],pageAS:number(r.cells[2]),refDomains:number(r.cells[3]),backlinks:number(r.cells[4]),modeledTraffic:number(r.cells[5])}));
  serp.set(keyword,{file:'raw/'+name,rows});
  if(!metrics.has(keyword)){
    const v=d.text.match(/Keyword summary\s*\nVolume\s*\n([^\n]+)/);
    const kd=d.text.match(/Keyword Difficulty\s*\n(\d+)%/);
    if(v&&number(v[1])!==null)metrics.set(keyword,{keyword,volume:number(v[1]),kd:kd?+kd[1]:null,metricFile:'raw/'+name,market:'US',observedAt:d.collectedAt,source:'User-provided Semrush mirror; modeled estimates'});
  }
}
const priorities=['poople','cutle','spotle','songless','metazooa','scrandle','colordle','traffic road','maptap','travle','2v2io','horsle','wave rider','x trench run','dashmetry','bracket city','baseball bros','electron dash','puppet hockey','planet clicker','boxing random','time shooter 3','time shooter 2','geodle','flagpie','color rush game','curve rush 2','soflo wheelie life','ragdoll hit','getaway shootout','basket bros','rooftop snipers','soccer random','candy clicker','run 3 unblocked','curve rush','stickman clash','volley random','football bros','slope rider 3d','murdle','weddle','contexto',"low's adventures 3",'tap road beat','tap road','kart bros','rodha','bike hero','poor bunny','67 clicker','brainrot clicker','dinosaur game','poetl','boxing bros','bullseye game'];
const notes={
  'x trench run':'第一档；游戏意图明确。头部有大型门户和独立域名，后排有少引用域页面。优先验证授权及实际游戏差异；不是零外链保证。',
  dashmetry:'第一档；新词线索来自 Trends Breakout，但独立曲线显示春季高峰后回落。头名有数千引用域，优先争取长尾及前十实验。',
  'tap road':'第一档指标达标；重新打开后独立曲线已恢复，最近完整4周指数38.5，起始4周74.5，需求转弱，降级条件观察。SERP 第2位为 AZGames，约5个页面引用域；头部另有强独立站。',
  'traffic road':'第一档优先候选：独立趋势起始4周37.5、末4完整周33.5，相对平稳。SERP 大部分为可玩游戏，前十有少页面引用域结果；先核验分发许可和具体体验差异。',
  'wave rider':'第一档增长候选：独立趋势起始4周4.5、末4完整周30.75。SERP 多数为游戏，但混入跑鞋、冲浪设施和百科，12,100 不能全部当成游戏量。优先验证精确游戏长尾。',
  'kart bros':'第一档指标达标，但独立趋势起始4周42、末4完整周10.25，明显转弱。前三有成熟独立站；列为观察，不因165,000年均月量优先立项。',
  'curve rush 2':'第一档指标达标；独立曲线近期弱于起始阶段，SERP 混有视频和无关页面，版本/官方关系未核实。可深查真实玩法需求，不能把搜索结果稀少当成已确认缺口。',
  'slope rider 3d':'月量过万、KD39；Trends 精确相关查询 +160%。需与 Slope Rider 原版区分玩法/版本，不能只加3D修饰重复做站。',
  'tap road beat':'小量低 KD，Trends +70%；先核实是独立节奏版本还是 Tap Road 的同意图变体。',
  'rocket goal':'Trends 有 Breakout，但 Semrush KD56，暂不列为第一批新站。',
  'top road':'疑似拼写/其他含义，Volume720、KD56，非本轮优先对象。',
  'dinosaur game':'镜像SERP与带美国英文参数的实时Google结果差异很大；实时结果有多个成熟T-Rex/Dino游戏站和门户。673,000/KD32只是镜像估值，当前不列低竞争优先对象。',
  poople:'优先验证：近期新兴需求，独立序列前段为0、最近4完整周63.25；不是无限增长预测。SERP 第4/6位有低页面引用域的游戏入口，第9位已有 unlimited，不能把无限版当成独有差异。',
  cutle:'优先验证：近期增长、KD8；原作是每日一刀将图形等分的几何游戏，不是猜单词。SERP 第2/4位有少引用域入口；可研究原创图形训练需求，代码/品牌许可仍未核验。',
  spotle:'优先验证：独立趋势起始4周5.25、末4完整周21，游戏意图明确。原作是10次猜测/1000位歌手范围的音乐益智；已有成熟原站及多个同名站，需先核验数据与素材。',
  songless:'优先验证：独立趋势起始4周4、末4完整周18.5；SERP 有多个成熟游戏站，且已有 unlimited 页。不能把提供无限模式视为未被满足的缺口；音频来源需核验。',
  metazooa:'优先验证：持续非零且近期增长，KD23；原作是按动物分类关系逐步猜答案的每日游戏。原站强，第2位有少引用域入口；需评估题库、分类数据与实际差异。',
  scrandle:'第二梯队：KD15、全年有信号，起始/末4周指数同为3.5；不属于近期爆发增长。SERP 第2位 Playlin 只有1个工具观测页面引用域，但原站与其他成熟站已满足基本玩法。',
  colordle:'第二梯队：KD25、持续需求；SERP 同时出现 Colordle、Colorfle 和 Colourdle，不可把不同玩法/名称混为一个原作。先核验玩家要找的具体版本。',
  horsle:'轻量梗游戏观察：KD10且增长，但原作明确答案始终是 horse。不是已验证的长期题库型产品；先验证停留、复玩和传播价值，避免按常规Wordle投入。',
  maptap:'放宽档优先：KD31，独立序列由很低基线到近期高位。SERP 游戏意图明确，原站/应用与媒体占前列，第6位有少引用域游戏入口；地图数据、题库和授权需评估。',
  'map tap':'合并 Maptap 词簇，不与40,500搜索量相加，也不另建一个站。',
  travle:'放宽档优先：40,500、KD31，持续需求且近期较起始阶段增加。SERP 原站与既有实现占前列，目录型入口也进入前十；不是 travel 旅游泛词。',
  'bracket city':'放宽档候选：135,000、KD38，Trends相关查询+300%。Atlantic游戏、社区和提示答案页占前列，玩法/品牌和题库边界需核验；独立曲线待补。',
  murdle:'放宽档条件候选：49,500、KD46。已查SERP同时出现原游戏、Amazon书籍和社区，不能把所有量归给在线游戏。',
  weddle:'放宽档条件候选：60,500、KD45。已查SERP混合NFL猜谜游戏与Eric Weddle人物资料；球队/人物数据与素材需核验。',
  contexto:'高量较难档：450,000、KD50。成熟原站及门户已提供游戏，语义相似度词库/语言实现成本也需评估，非首批轻量优先。',
  poetl:'指标达标但排除独立立项：SERP主要是Jakob Poeltl球员资讯，仅少量猜球员游戏结果。规范的Poeltl game词簇需另行过Trends与指标验证，不把27,100都归给游戏。',
  geodle:'小量低KD候选：2,400、KD15，Trends相关查询+90%；已查SERP。需确认具体游戏，而不是直接当作Globle拼写变体。',
  flagpie:'小量待验证：1,300、KD28，Trends Breakout，但SERP前列是视频且混入国旗派食谱。独立曲线未补，暂不按国旗游戏机会直接采用。',
  elementle:'早期观察：Trends Breakout及+1,400%，但镜像月量仅210、KD5。可能有估值滞后或很小的基数；独立序列/SERP未齐，既不记为无需求，也不直接立项。',
  flagle:'74,000、KD60，成熟主词竞争高，不作为本轮低难度首批。',
  globle:'246,000、KD52，成熟原站与游戏名竞争，低于高量仍不能当低难度词。',
  worldle:'450,000、KD90，主词成熟且竞争很强；与Wordle是不同游戏，不混用名称。',
  'word hurdle':'110,000、KD89，竞争强；答案/提示与可玩游戏意图分开，不作为低难度首批。',
  'worldle unlimited':'18,100但KD71，合并Worldle方向观察；unlimited修饰不自动使词容易。',
  quordle:'1,830,000、KD68，成熟品牌主词，不列低竞争机会。',
  pips:'550,000、KD70，且有多种同名含义，不能只用大词数字推断网页小游戏机会。',
  worldguessr:'110,000、KD63，成熟地理游戏方向，主词难度高。',
  'geography games':'27,100、KD71，游戏集合/分类意图，不是一个新单游戏主词。',
  'daily games':'14,800、KD62，聚合意图，非低难度单游戏主词。',
  'globle game':'12,100、KD32，合并Globle词簇；不能把变体指标当成另一个独立游戏的量。',
  rodha:'第一档指标达标；实时 Google 美国参数搜索确认游戏与教育培训混合，游戏门户占前两位。镜像排名不同，60,500 不能全部归因游戏，降级观察。',
  '2v2io':'仅差 KD 1 点；独立趋势起始4周1.25、末4完整周11.25，且相关查询 +1,000%。SERP 游戏意图清楚；优先核验联网服务/授权，不能用单机替代后宣传多人。',
  'electron dash':'大词次级候选；门户占前列，页面级引用域较少。需完整可玩体验、输入和进度等具体改进。',
  'baseball bros':'量大且 KD 接近门槛；多人/联网功能不能用单机替代后照抄宣传，先确认授权和网络依赖。',
  'bike hero':'Trends 相关查询 +140%；KD 38。SERP 同时出现游戏、Hero 摩托车和自行车商品，量不能全部归给游戏，降级观察。',
  'puppet hockey':'次级体育候选；已见 Math Playground、CBC、独立游戏域名等可玩结果。实际分发许可待核验。',
  'planet clicker':'可作为点击放置类候选；已有多个成熟可玩页面，差异必须落到功能或体验。',
  'boxing random':'月量 9,900，严格不属于 >10,000 档；低 KD 的小量实验候选。',
  'time shooter 2':'小量低 KD；与第三代是不同游戏意图，避免互相混用内容。',
  'time shooter 3':'小量低 KD；SWAT 修饰词合并为同一游戏词簇，不重复建站。',
  'color rush game':'SERP 前十以可玩游戏为主，低 KD；但独立 Trends 曲线当前回落且相关榜混入 NFL，先复测当前游戏需求再小量试验。',
  'boxing bros':'小量低 KD，但 SERP 主要映射 Wrestle Bros，混入拳馆、音乐和社交账号；不是已确认的新游戏名称，降级观察。',
  'bullseye game':'KD12是假阳性：SERP 主要是实体桌游商品、桌游评测及 Switch 商店，当前不符合网页小游戏意图，排除。',
  'dashmetry.io':'域名导航变体，合并 Dashmetry；不作为新的独立游戏。',
  fnf:'大词但 KD91，成熟游戏/品牌竞争；本轮不优先。',
  'geometry dash free':'KD73，成熟品牌词；本轮不优先。',
  'best browser game':'评测列表意图且量小，不适合当作一个单游戏站的主词。',
  'rocket league browser game':'量仅210且 KD63；不能靠品牌词替代授权或真实游戏。',
  'halo browser game':'Volume20、KD未知；仅线索，不纳入推荐。',
  "low's adventures 3":'小量低 KD；当前比较图被大词压至零，属于精度/样本不足，不能断言零需求。拼写变体须聚类。',
  '67 clicker':'12 个月曲线早期高、最近明显回落。列观察，不能拿历史平均量推断当前流量。',
  'brainrot clicker':'12 个月曲线显示明显衰退；暂缓。',
  'poor bunny':'美国年均月量高，但独立曲线后段明显弱于起始阶段，降级观察；阶段比较不是严格同比。',
  'geometry game':'泛意图混杂；不作为一个具体游戏的独立需求直接采用。',
  'football random':'先验证是否为 Soccer Random 的同意图变体；默认合并，避免拆出重复站。',
  'mathplayground electron dash':'门户导航长尾；可在游戏说明中自然承接，不冒充 Math Playground。',
  'electron dash math playground game':'小量门户导航词，合并 Electron Dash；不单独建页。',
  'duck life 4 mathplayground':'小量门户导航词，合并 Duck Life 4。',
  'mathplayground duck life':'镜像明确显示 Volume 0；不是缺失值。',
  'drift hunters unblock':'拼写/修饰变体，不单独建页。',
  'idle breakout strategy':'攻略意图、量小；仅适合已有游戏页的有效攻略支持。',
  'idle breakout mobile':'设备修饰长尾，不能以搜索需求证明现有游戏支持触屏。',
  'time shooter 3 swat':'合并 Time Shooter 3，不重复算一个独立游戏。',
  'poor bunny poki':'Poki 导航词，合并 Poor Bunny，不能冒充门户。',
  'color run game':'小量且易混淆；需 SERP 解释任务，暂缓。',
  'boxing random game':'合并 Boxing Random，不单独建页。',
  'drift boss game':'合并 Drift Boss；主词 KD 高，暂不优先。',
  'rooftop snipers game':'合并 Rooftop Snipers，不单独建页。',
  'tunnel rush game':'合并 Tunnel Rush，不单独建页。'
};
const clusterMap={'map tap':'maptap','globle game':'globle','worldle unlimited':'worldle','dashmetry.io':'dashmetry','time shooter 3 swat':'time shooter 3','poor bunny poki':'poor bunny','boxing random game':'boxing random','drift boss game':'drift boss','rooftop snipers game':'rooftop snipers','tunnel rush game':'tunnel rush','mathplayground electron dash':'electron dash','electron dash math playground game':'electron dash','duck life 4 mathplayground':'duck life 4','mathplayground duck life':'duck life 4','drift hunters unblock':'drift hunters','idle breakout mobile':'idle breakout','idle breakout strategy':'idle breakout','football random':'soccer random'};
const tier = x => x.kd===null?'U · KD 未知':x.volume>10000&&x.kd<30?'A · >10k / KD<30':x.volume>10000&&x.kd<=40?'B1 · >10k / KD30–40':x.volume>10000&&x.kd<=50?'B2 · >10k / KD41–50':x.volume>=1000&&x.kd<30?'C · 1k–10k / KD<30':x.volume>=1000&&x.kd<=40?'C2 · 1k–10k / KD30–40':x.kd>50?'H · 高难度':'L · 小量/合并观察';
const rows=[...metrics.values()].map(x=>({...x,tier:tier(x),cluster:clusterMap[x.keyword]||x.keyword,trends:series.get(x.keyword)||null,relatedTrends:related.get(x.keyword)||[],serp:serp.get(x.keyword)||null,note:notes[x.keyword]||(x.kd>50?'当前难度高；不列为本轮优先新站目标。':'机会假设；需补齐独立趋势、SERP 与可实施差异。')}));
const firstCheck = new Set(['poople','cutle','spotle','songless','metazooa','traffic road','maptap','travle','2v2io']);
const hold = new Set(['kart bros','tap road','curve rush 2','rodha','bike hero','poor bunny','67 clicker','brainrot clicker','dinosaur game','boxing bros','geometry game']);
for(const x of rows){x.verdict=x.keyword==='poetl'?'不作游戏主词：人名主导':x.keyword==='bullseye game'?'排除：实体桌游意图':x.cluster!==x.keyword?'合并词簇/长尾':firstCheck.has(x.keyword)?'优先验证/小试假设':x.keyword==='horsle'?'轻量梗游戏观察':hold.has(x.keyword)?'暂缓或条件观察':x.kd>50?'高难度，暂不优先':x.serp?.rows.length?'次级/条件候选':'待补SERP，不作立项结论';}
rows.sort((a,b)=>{const ai=priorities.indexOf(a.keyword),bi=priorities.indexOf(b.keyword);return (ai<0?1000:ai)-(bi<0?1000:bi)||b.volume-a.volume;});
rows.forEach((x,i)=>x.order=i+1);
const result={date:'2026-10-24',market:'US',language:'English',strictGate:'volume > 10000 && KD < 30',sourceOrder:'Google Trends series or exact related-query signal before Semrush query',warnings:['Trends indices are normalized, not monthly volume.','First versus last four complete weeks is a directional screen, not a strict year-on-year comparison or a volume conversion.','Final chart week is conservatively excluded; original partial flags are not exposed in DOM.','Trends service/recaptcha connectivity errors are saved as missing evidence; Tap Road was subsequently recovered.','The mirror is not the official Semrush domain; metrics are estimates and SERP can be mixed/stale.','Page-level referring domains are not domain authority; a displayed zero means none observed by the provider, not proof that no backlinks exist.','Duplicate same-intent keywords are not additive traffic or separate site opportunities.','No implementation/distribution license was cleared by this research.'],counts:{keywords:rows.length,clusters:new Set(rows.map(x=>x.cluster)).size,strictMetricMatches:rows.filter(x=>x.tier.startsWith('A')).length,individualSeries:rows.filter(x=>x.trends).length,relatedOnly:rows.filter(x=>!x.trends&&x.relatedTrends.length).length,serpInspected:rows.filter(x=>x.serp?.rows.length).length},keywords:rows};
for(const x of rows){if(!x.trends&&!x.relatedTrends.length)throw Error('No prior Trends evidence for '+x.keyword);if(x.kd!==null&&(x.kd<0||x.kd>100))throw Error('Invalid KD');if(x.tier.startsWith('A')&&(!x.trends||!x.serp?.rows.length))throw Error('Strict candidate missing full Trends or SERP: '+x.keyword);}
await fs.writeFile(path.join(root,'keyword-ledger.json'),JSON.stringify(result,null,2)+'\n');
const link = (kw,src) => src==='gt'?`https://trends.google.com/trends/explore?geo=US&date=today%2012-m&q=${encodeURIComponent(kw)}`:`https://sem.3ue.com/analytics/keywordoverview/?db=us&q=${encodeURIComponent(kw)}`;
const evidenceText=x=>x.trends?`${x.trends.nonZeroPeriods}/52 周有非零值；首4周 ${x.trends.first4} → 末4个完整周 ${x.trends.last4}（阶段方向筛查，不是严格同比或月量换算）`:x.relatedTrends.map(r=>r.signal).join(' / ')+'（相关查询信号；独立曲线待补）';
const lines=['# 美国英文游戏关键词机会调研 · 2026-10-24','',`本轮查询 **${rows.length} 个关键词**；严格指标达标 **${result.counts.strictMetricMatches} 个**。数量包含同一游戏的变体，不等于独立项目数。完整原始数据见 [keyword-ledger.json](keyword-ledger.json) 与 [raw/](raw/)。`,'','## 口径与边界','','- 用户标准：美国英文，优先现有 12 个游戏之外的新游戏；第一档严格 **Volume >10,000 且 KD <30**。KD 30、Volume 10,000 都不计入第一档。','- 按 Google Trends → Semrush 月量/KD → SERP 执行。Trends 的精确相关查询/上升榜只证明有搜索信号，独立曲线缺失的候选会明确标注。','- Google Trends：美国、网页搜索、过去 12 个月；保存图表 DOM 的完整周序列。归一化指数不是月量，也不比较不同图的绝对规模。最后一周一律保守排除；DOM 未提供原始 partial 标记。','- Volume/KD 来自用户提供的 sem.3ue.com 镜像页面，不是官方 Semrush API；大多显示约 1 个月前更新。查询日期不代表估值刚更新。SERP 是镜像展示的快照，不能等同实时 Google 排名。','- **A 是量和 KD 达标，不是自动立项**。排名是研究/试验优先级。机会仍需实际可玩差异、授权和上线后观测验证。','- 同意图修饰词合并为一个游戏词簇；不累加搜索量，不按每个变体建立站点。CPC 不等于广告收入。','','## 第一档：严格指标达标','','| 优先顺序 | 词 | 美国月量 | KD | Trends 与裁决 |','|---:|---|---:|---:|---|'];
for(const x of rows.filter(x=>x.tier.startsWith('A')))lines.push(`| ${x.order} | [${x.keyword}](${link(x.keyword,'sem')}) | ${x.volume.toLocaleString('en-US')} | ${x.kd} | ${x.note} |`);
lines.push('','## 证据质量与反例','','- 共保留 **'+result.counts.individualSeries+' 个独立周序列**、**'+result.counts.relatedOnly+' 个仅相关榜信号**，以及 **'+result.counts.serpInspected+' 个重点词的镜像SERP**。严格指标达标词均有独立序列与SERP；其余词缺项明列，不假装已全部过闸。','- [Dinosaur Game 实时Google证据](raw/google-serp-dinosaur-game.json)与[镜像快照](raw/semrush-serp-dinosaur-game.json)的结果集合差异很大。[Rodha 实时Google](raw/google-serp-rodha.json)也与镜像不同。实时核验使用 gl=us、hl=en、pws=0 参数，仍受IP/账号影响；镜像快照不能作为当前真实美国排名的证明。','- 页面显示的Volume和KD尚未用官方Semrush账户或独立供应商交叉验证。本报告准确记录的是该镜像的显示估值，不保证镜像数据的上游真实性/新鲜度。','- 引用域是页面维度，不是全域权威。0表示工具未发现，不证明无外链，更不证明能轻易抢到第一。','- 首4周与末4完整周只作同一曲线内的阶段方向筛查，不是严格同比；不把比例直接乘到月量上。','- [Cutle 原作](https://pfiffel.com/cutle/)显示它是每日把图形一刀等分的几何游戏；[Horsle 原作](https://cabletwo.net/horsle/)明确答案固定为horse，是梗式玩法。两者不能当成普通每日单词题库。[Spotle](https://spotle.io/)是歌手范围竞猜；[Metazooa](https://metazooa.com/)按动物分类关系提供线索。原作规则已核验不等于代码、素材或品牌授权已核验。','','## 统一实施边界','','这是关键词筛选，不是批量建站批准单。所有建议都是待验证的小试假设，尚未证明具体竞品缺少哪项功能，也未完成分发/代码/素材/名称授权审查。已有unlimited页面的词，不能把“做无限版”视为独有价值。低KD和少引用域页面只用于发现值得继续验证的竞争入口，不能作为排名/收入承诺。','');
lines.push('','## 全部关键词：按研究优先级排序','','| 顺序 | 关键词 | 美国月量 | KD | 档位 | 趋势证据 | SERP | 建议 |','|---:|---|---:|---:|---|---|---|---|');
for(const x of rows)lines.push(`| ${x.order} | [${x.keyword}](${link(x.keyword,'sem')}) | ${x.volume.toLocaleString('en-US')} | ${x.kd??'未知'} | ${x.tier} | [${x.trends?'独立序列':'相关榜'}](${x.trends?.url||x.relatedTrends[0]?.url||link(x.keyword,'gt')}) | ${x.serp?.rows.length?'[已查]('+x.serp.file+')':'待逐词复核'} | ${x.note} |`);
lines.push('','## 独立趋势与 SERP 证据明细','');
for(const x of rows.filter(x=>priorities.includes(x.keyword))){lines.push(`### ${x.order}. ${x.keyword}`, '',`- 美国 Volume **${x.volume.toLocaleString('en-US')}**，KD **${x.kd??'未知'}**；[指标原始文件](${x.metricFile})。`,`- Trends：${evidenceText(x)}。${x.trends?'[原始序列]('+x.trends.file+')':''}`,`- ${x.note}`);if(x.serp?.rows.length)lines.push(...x.serp.rows.slice(0,10).map(r=>`- SERP ${r.position}：[${r.url}](${r.url})；页面 AS ${r.pageAS??'未知'}，页面引用域 ${r.refDomains??'未知'}。`));else lines.push('- 尚未逐词打开 SERP，不作已验证竞争缺口判断。');lines.push('');}
lines.push('## 未完成验证的线索','','[seed-groups.json](seed-groups.json) 保存了扩展种子。未进入本台账的种子没有齐备 Trends → Semrush 证据，不能借用旧台账数字当本轮发现。Trends 多次返回图表服务错误和 reCAPTCHA 服务连接错误，详见 raw 中的 error 文件；不以 0 代替缺失。Tap Road重新打开后已恢复，后续完整序列见trends-11.json。其余57个仅相关榜信号词仍缺独立曲线，63个未深查词的SERP仍未逐一打开；这些都是明确的待验证项，不属于已完成机会验收。','','## 沉淀的脚本','','- [collect-trends-browser.mjs](collect-trends-browser.mjs)：使用已连接的 CUA Chrome 标签页和五个比较输入框采集真实图表；本轮以 Slope/OvO/Eggy Car/Space Waves/Run 3 一组及后续组实际执行成功。','- [read-semrush-browser.mjs](read-semrush-browser.mjs)、[scrape-semrush-overview.mjs](scrape-semrush-overview.mjs)：读取批量行、按可见搜索框进入 SERP；单标签页串行使用，不点击 Update metrics。','- [collect-serp-batch.mjs](collect-serp-batch.mjs)：每词立即落盘回调，按12.5秒间隔串行采集。Cua REPL中导入模块后，以`collectSerpBatch(sem, ["poople"], 12500, saveResult)`调用；已用真实关键词验证。','- [analyze-research.mjs](analyze-research.mjs)：离线清除访问查询参数、校验口径、重建台账与两份报告。验证命令：`node research/2026-10-24-keyword-opportunities/analyze-research.mjs`。','','## 本轮维护','','只新增调研数据、报告和可复用采集函数；未改游戏源码、未部署、未花费付费 API、未购买域名，也未改动其他聊天的工作。');
const pendingIndex=lines.findIndex(l=>l.startsWith('[seed-groups.json]'));
if(pendingIndex>=0)lines[pendingIndex]=lines[pendingIndex].replace(/其余\d+个仅相关榜信号词/,`其余${result.counts.relatedOnly}个仅相关榜信号词`).replace(/\d+个未深查词的SERP/,`${rows.length-result.counts.serpInspected}个未深查词的SERP`);
lines.splice(4,0,'[简版优先榜](SHORTLIST.md) · [离线校验记录](validation.json) · [采集模块实跑记录](script-validation.json) · [Poople指标页面截图](raw/poople-semrush.png)','','已否决对照：根目录无既有rejected.md；现有12个游戏只用于去重，历史台账的旧Volume/KD未作为本轮数值。','');
lines.push('','校验脚本：[verify-research.mjs](verify-research.mjs)，运行 `node research/2026-10-24-keyword-opportunities/verify-research.mjs`；校验国家/关键词身份、批量与概览数值一致性、严格档证据齐备、访问参数清除和本地证据链接。');
await fs.writeFile(path.join(root,'README.md'),lines.join('\n')+'\n');
const short=['# 游戏关键词优先榜 · 美国英文 · 2026-10-24','',`实查${rows.length}个词；${result.counts.strictMetricMatches}个满足 **Volume >10,000、KD <30**。${result.counts.serpInspected}个重点词查了SERP。完整数据、反例、来源和待验证项见[完整报告](README.md)。`,'','**月量/KD均为用户提供的免费Semrush镜像显示估值，未独立核验其上游数据。排名是继续验证/小试优先级，达标不等于推荐立项。**','','## A · 严格指标达标，按综合优先级排列','','| 顺序 | 关键词 | 美国月量 | KD | 判断 |','|---:|---|---:|---:|---|'];
for(const x of rows.filter(x=>x.tier.startsWith('A')))short.push(`| ${x.order} | [${x.keyword}](${link(x.keyword,'sem')}) | ${x.volume.toLocaleString('en-US')} | ${x.kd} | ${x.verdict}；${x.note} |`);
short.push('','## B1 · 放宽到 KD 30–40，月量仍过万','','| 顺序 | 关键词 | 美国月量 | KD | 判断 |','|---:|---|---:|---:|---|');
for(const x of rows.filter(x=>x.tier.startsWith('B1')&&x.cluster===x.keyword))short.push(`| ${x.order} | ${x.keyword} | ${x.volume.toLocaleString('en-US')} | ${x.kd} | ${x.note} |`);
short.push('','## B2 · KD 41–50，有条件的第二批','','| 顺序 | 关键词 | 美国月量 | KD | 判断 |','|---:|---|---:|---:|---|');
for(const x of rows.filter(x=>x.tier.startsWith('B2')&&x.cluster===x.keyword))short.push(`| ${x.order} | ${x.keyword} | ${x.volume.toLocaleString('en-US')} | ${x.kd} | ${x.note} |`);
short.push('','## C · 月量 1,000–10,000，KD <30','','| 顺序 | 关键词 | 美国月量 | KD | 判断 |','|---:|---|---:|---:|---|');
for(const x of rows.filter(x=>x.tier.startsWith('C ·')&&x.cluster===x.keyword))short.push(`| ${x.order} | ${x.keyword} | ${x.volume.toLocaleString('en-US')} | ${x.kd} | ${x.note} |`);
short.push('','Elementle另列早期观察：210 / KD5；Trends有Breakout及+1,400%，但独立序列和SERP未齐。数据缺项不能写成0，也不能拿Breakout推断大规模需求。','','## 最先关注的方向','','优先继续验证 Poople、Cutle、Spotle、Songless、Metazooa、Traffic Road；放宽一档优先 Maptap、Travle、2v2io。Scrandle、Colordle是持续需求的第二梯队；Horsle只作轻量梗玩法试验。','','Tap Road、Kart Bros近期弱于早期阶段；Wave Rider、Rodha有同名混杂；Curve Rush 2的具体版本/官方关系待核实；Poetl主要是运动员资讯，应排除独立游戏主词用法。','','上述均需完成实际可玩差异与授权验证后再决定实施。完整117词（含暂不优先、同意图合并、假阳性和缺项）都保留在[完整报告](README.md)，不把它们包装成117个能做的项目。');
await fs.writeFile(path.join(root,'SHORTLIST.md'),short.join('\n')+'\n');
console.log(JSON.stringify(result.counts));
