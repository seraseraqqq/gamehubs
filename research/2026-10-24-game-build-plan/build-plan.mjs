/** Local-only planning artifact builder. No network, purchases, deployment or game edits. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const dir=path.dirname(fileURLToPath(import.meta.url));
const ledger=JSON.parse(await fs.readFile(path.join(dir,'../2026-10-24-keyword-opportunities/keyword-ledger.json'),'utf8'));
const quotes=JSON.parse(await fs.readFile(path.join(dir,'evidence/domain-quotes.json'),'utf8'));
const domainResults=JSON.parse(quotes.response.content.find(c=>c.type==='text').text).result.results;
const byDomain=new Map(domainResults.map(d=>[d.domain,d]));
const source=(title,url,note)=>({title,url,note});
const sites=[
 {id:'CUT',slug:'cutle',name:'Cutle',rank:1,cohort:'P0 · 首批',route:'自研',buildConfidence:'高',seoConfidence:'中',days:[3,4],domain:'cutleunlimited.com',alternatives:['playcutle.com','cutlepractice.com'],
  decision:'先做几何切割练习站。KD低、规则清楚、无需外部图片或实时API，是首个成本可控的实验。',
  serp:'镜像前十以原站及游戏目录为主；实际Google本次先出现cutle.org，再出现pfiffel原站，排名与镜像不同。cutle.org已有无限模式、归档、自定义形状和生成工具。因此只把按难度训练/练习记录作为待测差异，不能称无限版有空位。',
  sources:[source('原站规则','https://pfiffel.com/cutle/','拖动直线分割形状，以接近50:50为目标；48:52及以内算赢，原站每日UTC更新。HTTP检查曾失败，规则随后由网页读取确认。未核验到原游戏可商用开源代码。'),source('当前前列竞品','https://cutle.org/','页面明示Infinite、Archive、自定义形状和生成工具；无限模式不保存进度，不能把无限本身当作独家差异。')],
  implementation:'静态页面 + TypeScript + SVG。独立实现直线/半平面裁剪和多边形面积，MVP只生成凸多边形；图形、随机种子、UI全部自行制作。无需iframe，不复制原站每日形状或代码。',
  mvp:['三角形、矩形及5–8顶点凸形；拖动预览切线，提交后显示两侧百分比','Unlimited练习、难度选择、自有UTC每日题；首刀成绩与最佳成绩分开','本地统计、重玩、结果分享、触屏与键盘切线控制；无登录'],
  differentiation:'验证“按形状/难度反复训练 + 切线误差解释”是否比只玩每日题更有用。此为产品假设，不声称原站没有练习。',
  seo:{primary:'cutle',variants:['cutle game','cutle unlimited','cutle practice','play cutle','cutle online'],title:'Cutle Unlimited – Play the Shape Cutting Game',pages:[['/','可玩主词页，承接game/unlimited/practice/online，默认可立即练习'],['/how-to-play/','直线切割、比例判定与实际操作示例'],['/strategy/','用自绘形状讲切线与面积；有实质示例才发布']]},
  tasks:[['ENGINE','完成凸形生成、裁剪和比例计算','随机样本两侧面积守恒；50:50及48:52边界、切过顶点、未穿过图形、零长度拖动均正确'],['PLAY','完成练习/每日/统计与输入','连续玩10局；重置、刷新、UTC跨日、触屏和键盘操作有效；首刀与最佳值不混淆'],['CONTENT','完成规则与策略示例','说明本网站题目与规则版本；不输出原站今日答案或抄原图']]},
 {id:'POO',slug:'poople',name:'Poople',rank:2,cohort:'P0 · 首批',route:'自研 + 公有领域词库',buildConfidence:'高',seoConfidence:'中',days:[4,5],domain:'pooplepractice.com',alternatives:['pooplegameplay.com','playpoople.net'],
  decision:'增长信号强、玩法可独立实现；先验证词库体验，避免把未授权第三方仓库当开源成品。',
  serp:'实际Google确认原站和pooplegame.com在前列，也有playdaily的Unlimited入口。pooplegame.com/unlimited页面已有练习、最短路par和Solver链接，且称无限练习不保存。本站只把按难度训练、本地练习历史及分层提示作为待测差异，不宣称Unlimited/Solver为空位。',
  sources:[source('原站玩法','https://poople.io/','浏览器规则确认：四字母英文词，每次只换一个字母，向POOP转换，追求少步数。'),source('当前练习竞品','https://pooplegame.com/unlimited','已存在无限练习及Solver入口；页面称练习不保存，本地练习历史仅作拟验证差异。'),source('第三方参考仓库','https://github.com/poople-game/poople-game','README仅称源码供参考，游戏内容归Poople；没有确认可商用开源许可，不能直接部署。'),source('候选词库许可','https://github.com/dwyl/english-words/blob/master/LICENSE.md','Unlicense，公有领域献出文本；商业使用可行。锁定版本、保留许可记录并另行清洗词表。')],
  implementation:'TypeScript词图 + BFS求最短路径，词库离线打包。独立整理常见四字母词、建立连通分量，只抽取能到POOP的起点。自有每日seed，与原站题库无同步关系。',
  mvp:['四字母输入、一字母合法替换、已用词和非法词反馈','无限练习、自有每日题、按最短步数分难度、本地练习历史与错题重练','分层提示（先给可改字母位置，再按需给下一词）；终局显示本词库的一条最短路径'],
  differentiation:'核心是“可解释的字梯训练”，不是复制官方每日答案。上线前人工检查常用词、冷僻词、敏感词和误收词。',
  seo:{primary:'poople',variants:['poople game','poople unlimited','poople practice','poople hints','poople solver'],title:'Poople Practice – Play Unlimited Word Ladder Puzzles',pages:[['/','可玩主词页，整合game/unlimited/practice'],['/how-to-play/','用自行生成的字梯示例说明规则'],['/solver/','第二阶段真正可用的BFS工具；标明只适用于本站词库，不宣称能还原官方今日答案']]},
  tasks:[['WORDS','整理可用词库和许可清单','固定词库版本；仅四字母；POOP在词表；每个选中起点可达；抽样人工复查至少100个入选词'],['ENGINE','实现图搜索与挑战状态','合法步Hamming距离=1；非法词不推进；BFS最短步数已知样例正确；不可达起点被剔除'],['PLAY','完成难度/提示/每日与结果','10局完整流程、连续重复输入、提示与最短路径一致；UTC跨日和刷新不重复计数']]},
 {id:'COL',slug:'colordle',name:'Colordle',rank:3,cohort:'P0 · 首批',route:'自研 + MIT颜色数据',buildConfidence:'高',seoConfidence:'中偏低',days:[3,4],domain:'colordleunlimited.com',alternatives:['playcolordle.com','colordlepractice.com'],
  decision:'零图片/音频依赖，许可明确的数据可用，适合低成本补充实验；同名玩法混杂使SEO确定性弱于开发确定性。',
  serp:'实际Google确认Ryan颜色名原站和colordle.com十六进制版在前列，也混入Colorfle/MATLAB及其他颜色游戏。必须围绕颜色名猜测意图，不把74,000全部算作这一玩法可争取份额。',
  sources:[source('本次目标原站','https://colordle.ryantanen.com/','浏览器帮助确认颜色名输入、百分比反馈、每日颜色，数据链接meodai/color-names。未确认原游戏代码许可。'),source('颜色名数据MIT许可','https://github.com/meodai/color-names/blob/master/LICENSE','MIT，David Aerne；可使用数据，保留版权及许可。'),source('另一个MIT版本','https://github.com/hobgoblina/colordle','README/LICENSE可用，但React17/旧CRA，玩法是另一类Wordle式输入；App含反嵌入检查。不是目标原版直接部署包。'),source('BSD版差异','https://github.com/weber1158/colordle','BSD-3-Clause已见，但为MATLAB十六进制猜色应用，不是网页可直接部署源。')],
  implementation:'独立颜色匹配逻辑 + MIT颜色名快照。MVP用明确公开的RGB距离归一化分数；相同颜色100%，越接近分数越高。它是本站评分，不能声称复现原站算法。颜色名别名和重复色值先规范化。',
  mvp:['颜色名搜索、输入与猜测历史；本网站百分比评分','Unlimited、自有每日色、本地统计与结果分享','文字分数、可见焦点、文字状态反馈；不只靠色块区分结果'],
  differentiation:'测试“颜色名可搜索 + 训练难度 + 终局解释颜色关系”，并明确本站独立题目。原站既有功能不能当作未经核实的缺口。',
  seo:{primary:'colordle',variants:['colordle game','colordle unlimited','colordle practice','color guessing game','colordle color names'],title:'Colordle Unlimited – Guess the Color by Name',pages:[['/','明确Guess the color by name，承接主词和无限练习'],['/how-to-play/','本站评分方法、颜色名与操作'],['/color-guide/','第二阶段提供真实可用的颜色名/色值查询，避免无内容的一色一页']]},
  tasks:[['DATA','处理MIT颜色数据','锁定版本与许可；处理别名/重复RGB/无效值；候选目标能被有效输入'],['ENGINE','实现评分与独立题目','相同颜色100%；分数有界且确定；每日跨时区一致；不虚称原版百分比兼容'],['PLAY','完成输入、反馈与无障碍','键盘搜索选色、猜测、重玩；色块和文字共同反馈；10局完整流程无状态错误']]},
 {id:'MET',slug:'metazooa',name:'Metazooa',rank:4,cohort:'P1 · 第二批',route:'条件自研：先完成分类数据审查',buildConfidence:'中',seoConfidence:'中',days:[6,9],domain:'metazooapractice.com',alternatives:['playmetazooa.com','metazooaunlimited.com'],
  decision:'需求方向较好；主要成本在可信分类树与动物别名，不是页面。数据包通过审查后才进入开发。',
  serp:'原站引用域多、前列也有目录和解释页；可以测试练习/学习意图，但不能按KD23推定能替代原站每日游戏。',
  sources:[source('原站FAQ','https://metazooa.com/faq','确认基于NCBI分类，并非直接使用Wikipedia树。'),source('官方翻译仓库','https://github.com/the-abe-train/metazooa-translations','公开翻译不等于完整游戏代码。LICENSE和其引用的twl-monorepo源码请求未取得可用文件；不推断仓库私有或授予分发权。'),source('MIT工具而非网页游戏','https://github.com/harrison-barnes/metazooa','Python分析/抓取/模拟工具；不是开源网页成品，不继承其抓取的原站清单。'),source('NCBI政策','https://www.ncbi.nlm.nih.gov/home/about/policies/','政府制作信息有公有领域说明，同时提示第三方内容和数据限制；具体taxonomy下载包声明仍需核验，不能一概宣布全部NCBI数据无约束。'),source('可替代结构化数据许可','https://www.wikidata.org/wiki/Wikidata:Licensing','Wikidata结构化命名空间为CC0；其他文字及图片不自动CC0。如改用此数据，应以自有分类规则说明，不声称原站一致。')],
  implementation:'自建精选动物列表+taxon ID映射+最近共同祖先LCA；优先核查NCBI taxonomy包，再固定版本。若使用Wikidata CC0自行整理，需独立校验分类一致性。MVP无动物照片、不抓取原站私有题库。',
  mvp:['先100–200种常见动物和英文别名，经人工抽样检查','20次猜测、共同分类节点提示、可解释的分类路径','Unlimited、自有每日题、本地进度；不承诺同步原站答案'],
  differentiation:'用清楚的分类树解释每一步为什么更近，试验教育练习价值；没有授权的数据包则保持待办。',
  seo:{primary:'metazooa',variants:['metazooa game','metazooa unlimited','metazooa practice','metazooa hints','animal taxonomy game'],title:'Metazooa Practice – Animal Taxonomy Guessing Game',pages:[['/','练习玩法，显著说明本站数据/规则版本'],['/how-to-play/','分类关系与20次猜测规则'],['/taxonomy-guide/','真实数据对应的分类树和策略，不铺空动物详情页']]},
  tasks:[['DATA','通过数据许可和分类样本门槛','保存包声明/版本/来源；100–200动物无缺失父节点、无环；别名唯一映射；人工复核至少30组LCA'],['ENGINE','实现LCA、提示与猜测规则','已知分类对结果正确；同种、重复、无效输入、20次上限、跨日可恢复'],['PLAY','完成树解释与练习','在无需图片/API的情况下完整玩10局；不把本站每日解答写成官方答案']]},
 {id:'TRA',slug:'travle',name:'Travle',rank:5,cohort:'P1 · 第二批',route:'自研 + 公有领域地图',buildConfidence:'中偏高',seoConfidence:'中',days:[5,7],domain:'travleunlimited.com',alternatives:['playtravle.com','travlepractice.com'],
  decision:'KD31属于放宽档；玩法和本地地图均可掌控，可在首批表现合格后做，不受第三方iframe持续供给影响。',
  serp:'原站及旧版页面在前列，也存在travle拼写带来的非游戏内容；聚焦国家连线路径游戏，避免把travel旅游词作为变体铺页。',
  sources:[source('原站','https://travle.earth/','国家路径猜谜；原站每日题不复制。'),source('旧版入口','https://imois.in/games/travle/','作为玩法核验入口；未确认可直接部署的完整开源许可。'),source('Natural Earth官方使用条款','https://www.naturalearthdata.com/about/terms-of-use/','矢量/栅格地图公有领域，可商用修改；适合离线SVG底图。国家邻接仍需单独整理。')],
  implementation:'本地简化SVG地图+自建国家邻接图+BFS最短路；使用Natural Earth数据快照。陆地边界、飞地、海峡/岛屿连接须写明自己的规则，不能仅靠多边形相交自动认定。',
  mvp:['给定起终点，输入相邻国家完成路径；国名搜索/英文别名','可达难度分组、Unlimited与自有每日题','终局最短路解释和地图高亮；无地图服务账号与计费依赖'],
  differentiation:'按地区/步数训练和清楚的边界规则是待验证价值；不把unlimited当作已证明竞争空位。',
  seo:{primary:'travle',variants:['travle game','travle unlimited','travle practice','travle geography game','travle hints'],title:'Travle Unlimited – Play the Country Path Game',pages:[['/','可玩的国家路径游戏，合并unlimited/practice'],['/how-to-play/','陆地邻接、岛屿和特殊连接规则'],['/strategy/','用本地图的真实路线解释；不伪造官方每日解答']]},
  tasks:[['MAP','整理地图与邻接规则','锁定Natural Earth版本；邻接无意外单向边；特殊连接清单可见；抽样50对边界人工核验'],['ENGINE','完成BFS与出题','起终点可达且不同；最短距离正确；非法边不推进；有多条最短路时均接受'],['PLAY','完成SVG交互与国名输入','小屏搜索不遮挡状态；键盘完成一局；结果路线与图一致；10局完整流程']]},
 {id:'SPO',slug:'spotle',name:'Spotle',rank:6,cohort:'P2 · 条件队列',route:'条件自研：音乐人元数据先行',buildConfidence:'中偏低',seoConfidence:'中',days:null,domain:'spotlepractice.com',alternatives:['playspotle.com'],
  decision:'量和趋势均值得保留；先解决可长期维护的艺人属性数据。不是直接下载Spotify内容后上线。',serp:'原站、提示答案媒体和同名不同玩法并存；先明确音乐人猜测意图，unlimited并非自动空位。',
  sources:[source('原站','https://spotle.io/','艺人猜测玩法；代码、照片及数据集的商用来源仍待核验。')],implementation:'拟自研艺人属性猜谜，先验证合法可用的元数据来源/更新方式；MVP可不含音频与头像。若无法满足玩家识别需求则暂缓，不抓取受限服务。',mvp:['定义字段与缺失值处理','小规模艺人集验证可玩性','真实字段反馈与自有每日题'],differentiation:'数据许可、覆盖度、更新成本及小样本试玩通过后再估工期。',
  seo:{primary:'spotle',variants:['spotle game','spotle unlimited','spotle practice','music artist guessing game'],title:'Spotle Practice – Music Artist Guessing Game',pages:[['/','音乐人猜测；不混入电影或其他Spotle'],['/how-to-play/','只解释实际实现的字段']]},tasks:[['GATE','核查数据与产品可行性','字段/数据/头像分别有来源与许可；完成可玩原型；原站名称使用范围完成审查后再排开发']]},
 {id:'ROA',slug:'traffic-road',name:'Traffic Road',rank:7,cohort:'P2 · 授权后可前移',route:'授权iframe',buildConfidence:'取决于授权及触屏',seoConfidence:'中',days:null,domain:'playtrafficroad.com',alternatives:['trafficroadunblocked.com'],
  decision:'若取得适用本站域名和变现方式的嵌入许可，可提前；目前未取得，不算随时可上的站。',serp:'镜像中门户/分站较多，也混入通用traffic内容；真实产品是3D第一人称摩托，不以简易2D自研替代承接同一搜索意图。',
  sources:[source('游戏说明','https://azgames.io/traffic-road','四模式3D摩托游戏；HTTP页面出现traffic-road.embed地址，仅证明技术入口。'),source('AZ条款','https://azgames.io/term-of-use','只明示个人非商业材料访问，复制/修改/分发等需事先书面许可；未找到可覆盖本站商业嵌入的授权。')],implementation:'只考虑权利方允许的iframe/feed；确认域名、广告、分成、退出/下架及可用性约束，再验证frame/CSP、保存、重启、横竖屏和触屏。授权未到位不镜像包、不替换广告。',mvp:['原版完整游戏嵌入','准确的控制/模式说明','加载失败/全屏/焦点与返回处理'],differentiation:'授权条件成立后再做稳定加载、清晰控制和移动体验；并不保证学校/公司网络可访问。',
  seo:{primary:'traffic road',variants:['traffic road game','traffic road online','play traffic road','traffic road unblocked'],title:'Traffic Road – Play the Motorcycle Driving Game',pages:[['/','主词及online整合一个真实可玩入口；unblocked不另开重复页'],['/controls/','按获授权版本实际验证的控制与模式']]},tasks:[['RIGHTS','获取适用域名和变现方式的许可','保存明确授权范围与条款；不以iframe地址可访问代替授权；本轮未联系/发信'],['FRAME','许可后验证完整游戏','真实最终域名可加载；桌面/触屏各完整游玩；CSP/广告/失败状态与条款一致']]},
 {id:'MAP',slug:'maptap',name:'Maptap',rank:8,cohort:'P2 · 待差异化验证',route:'条件自研地图定位',buildConfidence:'中偏低',seoConfidence:'中',days:null,domain:'playmaptap.com',alternatives:['maptappractice.com'],
  decision:'增长强但开发/内容成本较高，原站产品也成熟；先做区别于现有Practice的具体题型验证。',serp:'原站、应用商店和媒体占据较强位置；浏览器已确认原站有Practice/Prior Days/Player-Made Levels，不能以这些功能作为缺口。',
  sources:[source('原站菜单','https://maptap.gg/','Chrome核验Practice Levels、Prior Days、玩家关卡、Atlas、Groups、Versus等。'),source('地图底图候选','https://www.naturalearthdata.com/about/terms-of-use/','仅解决底图，不等于地点题库/图片/原站游戏代码许可。')],implementation:'拟自研地图定位与距离评分；离线地图+独立整理地点事实。地图精度、地点命名、移动缩放和题目成本先做小样。没有获准iframe源。',mvp:['先定义一种可验证的定位题型','用自行整理的少量题测定位/距离分数','不包含未实现的全球对战/UGC'],differentiation:'只有完成玩家对照试玩、证明具体题型价值后才排期。',
  seo:{primary:'maptap',variants:['maptap game','map tap','maptap practice','maptap geography game'],title:'Maptap Practice – Geography Location Challenges',pages:[['/','maptap与map tap同一意图归一页，不叠加量'],['/how-to-play/','实际定位/评分规则']]},tasks:[['GATE','验证题型与数据成本','记录原站已有功能；完成自有题小样与地图移动体验；找不到实质差异则不建站']]},
 {id:'SCR',slug:'scrandle',name:'Scrandle',rank:9,cohort:'P2 · 待玩法/素材审计',route:'待核验：授权iframe优先，或合规素材自研',buildConfidence:'低',seoConfidence:'中偏低',days:null,domain:'playscrandle.com',alternatives:[],
  decision:'KD15不足以抵消规则、素材和长期内容来源未核验的问题；只保留审计任务。',serp:'原站、多个成熟分站及视频并存；趋势首末四周相近，不能称为近期爆发。',sources:[source('原站入口','https://scrandle.com/','HTTP入口可访问，未完成完整实际游戏和素材来源核验。')],implementation:'先完成真实玩法与每类素材的权利来源清单。可授权feed则iframe；有独立可商用数据/素材才评估自研。没有条件前不指定为开源部署。',mvp:['先做实际玩法审计','确认持续出题/素材来源','再选iframe或自研'],differentiation:'尚未证明可实施差异，域名仅候选。',
  seo:{primary:'scrandle',variants:['scrandle game','play scrandle','scrandle practice'],title:null,pages:[['/','待实际玩法与来源确认后决定定位']]},tasks:[['GATE','审计实际玩法、内容及许可','完成一局记录、资产/数据清单、授权范围和成本，再决定是否开发']]},
 {id:'SON',slug:'songless',name:'Songless',rank:10,cohort:'P2 · 音频许可阻塞',route:'授权iframe或取得音频许可后自研',buildConfidence:'低',seoConfidence:'中',days:null,domain:'songlesspractice.com',alternatives:[],
  decision:'需求不错，但音频的长期分发/播放许可是先决条件；不从流媒体提取短片段当免费素材。',serp:'官方、成熟分站、应用以及现有unlimited页面已存在；仅加无限模式不是已验证的优势。',sources:[source('原站','https://lessgames.com/songless','歌曲识别方向；音频许可、具体供给与嵌入授权未核验。')],implementation:'首先核查权利方是否提供可商用嵌入/音频方案。若没有授权内容，降为观察，不以陌生开源壳套商业录音。',mvp:['许可内容/地区/时长/广告范围先明确','获得许可后再实现播放和判题','处理触屏自动播放限制与无声错误'],differentiation:'成本和许可确定后才估工期，暂不开发。',
  seo:{primary:'songless',variants:['songless game','songless unlimited','songless practice'],title:null,pages:[['/','获准后才建真实歌曲猜测页，不发布空内容站']]},tasks:[['RIGHTS','确认音频或嵌入许可','内容、地区、再分发/播放、广告和费用均有证据；无许可则持续暂缓']]},
 {id:'XTR',slug:'x-trench-run',name:'X Trench Run',rank:11,cohort:'HOLD · 不进低成本首批',route:'商业授权成品自托管；订阅iframe另询价',buildConfidence:'合同及预算未定',seoConfidence:'中偏低',days:null,domain:'playxtrenchrun.com',alternatives:['xtrenchrununblocked.com'],
  decision:'KD9但官方标价5,999美元，趋势也较早期弱；与低成本试站目标不匹配，不购买、不抓包。',serp:'MathPlayground、CrazyGames及其他游戏站已占位。页面级引用域少不等于竞争弱或可免费分发。',sources:[source('官方许可产品页','https://www.marketjs.com/item/x-trench-run/','页面列VIP Prime 5999 USD、编译成品、单项目/单域名、原样不含定制。'),source('官方买家FAQ','https://www.marketjs.com/buyer-faq/','固定费通常交编译文件自托管，订阅交iframe链接；不交原始源码。不能把5999当作已包含订阅iframe的价格。')],implementation:'只有预算和合同通过后才按授权部署编译成品或订阅iframe；这不是“开源部署”。原开发商游戏演示/CDN不等于免费发行许可。',mvp:['暂不安排实现'],differentiation:'若未来合法供给明显降价或组合成本合理，再重新评估。',
  seo:{primary:'x trench run',variants:['x trench run game','x-trench run','x trench run online','x trench run unblocked'],title:null,pages:[['/','未来获准时主词/拼写归一页，不做重复unblocked入口']]},tasks:[['GATE','仅在有预算时复核商业授权','明确合同、交付、域名/广告、总费用后重新决策；本轮不购买/联系供应商']]}
];
const commonTasks=[
 ['G01','采购前复核名称与域名','逐站核验名称/商标、域名历史/垃圾内容、最终价格和本人所有权；当前可注册报价不代表名称可自由使用。未通过则更名并重做搜索意图判断。'],
 ['G02','独立项目初始化','执行建站获授权后，在E:/Projects/game-sites/<slug>建立独立私有仓库、锁依赖和许可清单；不在GameHubs新增games目录/嵌套Git。尚无外部资源则不写成已创建。'],
 ['G03','静态站与索引配置','游戏和主要文字可直接访问；唯一H1、准确title/description、最终域名canonical、OG、可见内容对应的schema、robots/sitemap、真实404；预览noindex，最终域名验收后再开放。'],
 ['G04','逐站验收','桌面Chrome/Edge与实际触屏设备完成开始/输入/得分/胜负/重玩；键盘焦点、窄屏、刷新/跨日/存储禁用、无控制台错误和意外外部请求；不能把未测设备记为通过。'],
 ['G05','发布与记录','另行获得域名购买/部署授权后，确认预算和平台限额；每站独立Vercel项目。最终域名HTTPS、www跳转、canonical、索引、完整游戏再验收；把实际repo/project/domain登记到GameHubs，不动现有游戏holds。'],
 ['G06','量化观察','获准后配置GSC与必要统计，记录game_start/complete/replay和自然搜索曝光/点击；无数据标未知。开发中广告关闭，网络批准和政策/隐私/控件距离核验后才启用。']
];
const enriched=sites.map(s=>{
 const k=ledger.keywords.find(k=>k.keyword===s.seo.primary); if(!k)throw Error(s.name+' missing ledger');
 return {...s,status:'planned; not built, bought or deployed',metric:{keyword:k.keyword,volume:k.volume,kd:k.kd,market:'US',source:'User-provided Semrush mirror; modeled, not independently official-verified',observedAt:k.observedAt,file:'../2026-10-24-keyword-opportunities/'+k.metricFile},trend:{first4:k.trends?.first4,last4:k.trends?.last4,file:'../2026-10-24-keyword-opportunities/'+k.trends?.file,url:k.trends?.url},serpFile:k.serp?.file?'../2026-10-24-keyword-opportunities/'+k.serp.file:null,domains:[s.domain,...s.alternatives].map(d=>{const q=byDomain.get(d);if(!q?.available)throw Error('Unquoted domain '+d);return q;})};
});
const plan={date:'2026-10-24',scope:'US/English research and task plan only',rankingBasis:'Implementation control, licensing/data certainty, demand direction, SERP intent and cost; not KD-only and not a probability forecast',domainQueriedAt:quotes.queriedAt,sites:enriched,commonTasks:commonTasks.map(([id,name,acceptance])=>({id,name,acceptance})),warnings:['Mirror metrics are unverified estimates, not guaranteed current official Semrush values','Trends are normalized; first/last4 complete weeks are directional only; cross-chart values are not comparable','Proposed keyword variants lack separate Trends/Volume/KD validation unless explicitly noted','Names/assets are not licensed by an MIT data license or by self-writing code','Domains were queried, not purchased; quotes are not history/trademark clearance','No paid provider contacted; no game built or production changed']};
await fs.writeFile(path.join(dir,'plan.json'),JSON.stringify(plan,null,2)+'\n');
const fmt=n=>n?.toLocaleString('en-US')??'未知';
const link=s=>`[${s.name}](TASKS.md#${s.slug})`;
const table=enriched.map(s=>`| ${s.rank} | ${link(s)} | ${s.cohort} | ${fmt(s.metric.volume)} / ${s.metric.kd} | ${s.trend.first4} → ${s.trend.last4} | ${s.route} | ${s.buildConfidence} / ${s.seoConfidence} | ${s.domain} |`).join('\n');
const main=`# 新游戏建站优先级与执行计划\n\n更新：2026-10-24。美国 / 英文。基于[117词台账](../2026-10-24-keyword-opportunities/keyword-ledger.json)收敛，不重复计算同义词搜索量。\n\n**建议依次开发 Cutle → Poople → Colordle，首批最多3站；第二批 Metazooa → Travle。** 首批的“确定性”主要指玩法可做、数据可控和成本可界定；名称使用仍需发布前核验，SEO排名与收益尚未证实。先做完并观察首批，再决定第二批，不把11项全部启动。\n\n## 1. 排队结果\n\nVolume/KD为2026-10-24免费Semrush镜像显示估值，未取得官方Semrush独立认证；Trends为美国过去12个月的首4/末4个完整周均值，仅作方向筛查，最后一周剔除。不同对比图的指数不能直接比大小，0也不代表完全无搜索需求。\n\n| 顺序 | 游戏 | 队列 | 月Volume / KD | Trends首4→末4 | 建站方式 | 开发可控性 / SEO证据 | 首选域名 |\n|---|---|---|---:|---:|---|---|---|\n${table}\n\nColordle虽开发可控，但词义混杂、头部较强，仍属小额试验。Travle的KD31超出严格档，因此排第二批；不偷偷放宽原来的Volume>10,000、KD<30条件。\n\n## 2. 为什么首批采用自研\n\n- Cutle核心是几何计算；不依赖原站的代码、形状或素材。\n- Poople第三方仓库声明源码供参考，不能当作已获商用许可的开源成品；改用独立字梯引擎和Unlicense词库。\n- Colordle核验到MIT颜色数据；找到的同名开源游戏有玩法/技术差异，直接部署会承接错误意图。独立实现最简单。\n- 本次**没有选出“目标玩法一致、代码+素材许可完整、可直接商用部署”的开源成品**。Metazooa工具/翻译仓库不等于完整游戏；iframe技术可嵌入也不等于获得授权。\n\n详见[逐站来源与许可审计](SOURCE-AUDIT.md)，不是强行让三种建站方式各凑一个。\n\n## 3. 预算与工期假设\n\n按一名熟悉静态前端的开发者估算，包含玩法、基础SEO和人工QA，不含等待授权、商标/域名历史调查、公开发布等待和后续内容维护。Cutle3–4人日、Poople4–5人日、Colordle3–4人日，首批合计约10–13人日；第二批Metazooa6–9、Travle5–7人日。需要真实触屏验收，不能用缩小桌面窗口代替。未通过数据/授权门槛的站不报虚假的固定工期。\n\n首选三个.com当前报价合计首年 **33.75美元**，单价11.25美元/年，当前续费报价亦11.25美元/年；不含可能税费、未来调价、托管/分析费用。此为报价，不是已经购买。具体时间与原始返回见[域名清单](DOMAINS.md)。\n\n## 4. 关键词与页面策略\n\n- 主词、game、play、online、free、unlimited、practice通常先在一个可玩主页自然承接；不要一变体一站、一词一页。每站只选一个主域名，不同时购买上线三份同内容站。\n- 只有独立实用功能才加/solver/、/how-to-play/或真实策略页。首批不铺日期答案页；本站自有每日题不能伪称原站今日答案。自有archive须真的存在并能游玩。\n- 各站新增变体是待验证的页面定位，**没有分别跑过Trends、Volume/KD**，不能套用主词量、相加或据此预测流量。开发前再按“Trends→同市场Semrush→当前Google SERP”验证unlimited/practice/solver等关键意图。Poople此前镜像还显示archive2,900/KD3、hints1,900/KD4、game1,600/KD15、answer720/KD9；仅补充候选，尚未逐词完成Trends核验。\n- 首词已有原站主导，不能靠近似域名推断能拿走主词流量。新页面从有用的练习/教学意图试验，标题以游戏名、玩法和实际控制为主，不虚称官方、同步原版答案、联机或网络绕过。\n\n## 5. 执行与扩张门槛\n\n[完整任务清单](TASKS.md)含共用门槛、每站具体实现、SEO映射、验收标准和依赖。所有复选框是未执行的未来工作。首批顺序为G01→G02→逐站数据/引擎/玩法→G03/G04→获授权后G05→G06。第二批先做数据原型，首批质量和观察通过后再公开扩张。\n\n建议公开后D+7查抓取/索引/错误，D+28看查询匹配和完整游玩率，D+56决定扩张/修正/暂停。此为复盘安排，不是到期应获得排名的承诺。先有GSC曝光/查询与实际开玩、完成/重玩数据，且无许可/质量阻塞，再考虑扩张；若只有部署数，没有效果数据，保持首批规模。数据太少先诊断曝光和抓取，缺失记未知，不因“0记录”立即断言没有需求。收入/广告审批均未测，不能据此给ROI结论。\n\n## 6. 其他候选如何处理\n\n[其余106词处置表](REMAINDER.md)保留全部上一轮候选，不因没有排进首批而丢失。KD小于30也不等于优先：Horsle重复游玩价值待测；Wave Rider混合鞋/冲浪意图；Curve Rush 2真实版本未定；Tap Road/Kart Bros走弱；Rodha混合教育意图；Poetl是球员拼写混淆。2v2io、Baseball Bros等多人游戏先做供应商授权和实时服务审计。\n\n## 7. 证据与交付边界\n\n- [原始域名查询](evidence/domain-quotes.json)：30个精确名称，25个返回可注册；available=false只表示本渠道未确认可注册，不推断一定已注册。\n- [公开网页元数据](evidence/public-sources.json)、[仓库初查](evidence/github-source-search.json)、[许可与政策补查](evidence/source-checks.json)、[浏览器玩法核验](evidence/browser-rule-checks.json)。\n- [结构化计划](plan.json)直接引用上一轮指标/Trends/SERP证据文件；[验证结果](validation.json)只验证文件和计划一致性，不替代官方量级或授权证明。\n- 本轮只形成计划和只读核验；未购买、联系作者/供应商、建仓、建站、部署或修改现有游戏，未更改既有发布holds。\n`;
const crossCheck='本轮另外用Chrome直接核对首批3个主词的[Google结果](evidence/google-cross-check.json)，请求gl=us/hl=en/pws=0；这不等于固定美国本地IP排名。Cutle实际前列出现镜像未列出的cutle.org；Poople已有练习竞品；Colordle确认同名混合玩法。[竞品功能核验](evidence/competitor-checks.json)已写回任务，不以镜像次序代替当前Google结果。其他8项本轮没有新增Google实查，沿用原台账并保持条件状态。\n\n首批达到可玩预览后，应做至少5名目标玩家的对照试玩（需后续执行时安排）：任务完成、是否理解玩法、是否会再次使用及相对原站/竞品的具体原因。样本只作方向信号；若无法证明练习差异，先改产品，不采购并公开同质站。单站超过估算上限仍无可玩核心，则停下重估范围。\n\n';
await fs.writeFile(path.join(dir,'README.md'),main.replace('## 3. 预算与工期假设',crossCheck+'## 3. 预算与工期假设'));
let tasks='# 可执行任务清单\n\n所有条目均为计划，尚未执行。首批先后顺序：Cutle → Poople → Colordle。实施与公开上线分开验收。每站只能在通过数据/名称/授权门槛后发布。\n\n## 共用任务与依赖\n\n';
for(const [id,name,acceptance] of commonTasks)tasks+=`- [ ] **${id} ${name}**：${acceptance}\n`;
tasks+='\n资源结构：每站计划目录为E:/Projects/game-sites/<slug>；静态HTML/CSS + TypeScript（Vite可选），玩法在本地模块，SEO说明静态输出，无必要不加数据库/登录/外部运行时。不同站保持独立视觉与内容；共用构建经验，不批量复刻同一空壳。除非实际需求验证，不引入付费API。\n\n';
for(const s of enriched){
 tasks+=`<a id="${s.slug}"></a>\n\n## ${s.rank}. ${s.name} · ${s.cohort}\n\n**路线：${s.route}。** ${s.decision}\n\n- 指标：US Volume ${fmt(s.metric.volume)} / KD ${s.metric.kd}；[指标原始文件](${s.metric.file})、[Trends序列](${s.trend.file})、[SERP记录](${s.serpFile})。\n- 开发可控性：${s.buildConfidence}；SEO证据：${s.seoConfidence}。${s.days?`估算${s.days[0]}–${s.days[1]}人日。`:'授权/数据/范围未定，暂不估开发工期。'}\n- SERP判断：${s.serp}\n- 方式：${s.implementation}\n- 产品假设：${s.differentiation}\n- 首选域名：**${s.domain}**；备选：${s.alternatives.join('、')||'未推荐其他名称'}。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。\n\nMVP范围：\n\n${s.mvp.map(x=>'- '+x).join('\n')}\n\nSEO关键词与URL：主词 **${s.seo.primary}**；变体 ${s.seo.variants.map(v=>'\`'+v+'\`').join('、')}（变体未独立测量）。${s.seo.title?'建议标题：'+s.seo.title+'。':'标题待实际产品范围确定后再写。'}\n\n| URL | 页面实际用途 |\n|---|---|\n${s.seo.pages.map(([u,t])=>`| ${u} | ${t} |`).join('\n')}\n\n任务及完成定义：\n\n- [ ] **${s.id}-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。\n${s.tasks.map(([id,n,a])=>`- [ ] **${s.id}-${id} ${n}**：${a}。`).join('\n')}\n- [ ] **${s.id}-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。\n- [ ] **${s.id}-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。\n- [ ] **${s.id}-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。\n\n来源：\n\n${s.sources.map(x=>`- [${x.title}](${x.url})：${x.note}`).join('\n')}\n\n`;
}
await fs.writeFile(path.join(dir,'TASKS.md'),tasks);
let dm=`# 域名候选与报价\n\n查询时间：${quotes.queriedAt}（UTC；北京时间+8小时）。来源：Vercel公开精确域名搜索，1年，美元。30个名称，${domainResults.filter(x=>x.available).length}个available=true，全部非premium。查询没有购买、锁定或保留域名。价格和可注册状态会变，购买当时重查；税费未确认。\n\n**“可入手”在此仅指查询返回可注册报价。** 尚未完成商标/名称使用审查、Wayback/历史垃圾内容或争议检查、DNS所有权验证。含游戏名称的域名也不授予官方身份。通过G01后每站择一，不买一堆近似域名做相同内容站。\n\n| 队列 | 首选 | 备选及当前报价（注册/续费，USD/年） |\n|---|---|---|\n`;
for(const s of enriched)dm+=`| ${s.rank}. ${s.name} | ${s.domain} · $${byDomain.get(s.domain).price}/$${byDomain.get(s.domain).renewalPrice} | ${s.alternatives.map(d=>`${d} · $${byDomain.get(d).price}/$${byDomain.get(d).renewalPrice}`).join('<br>')||'—'} |\n`;
dm+='\n不使用本渠道未确认可注册的名称：'+domainResults.filter(d=>!d.available).map(d=>'`'+d.domain+'`').join('、')+'。available=false不区分注册占用、渠道限制或其他未确认原因。\n\n首批3个首选.com当前注册总额$33.75，当前续费报价总额$33.75/年；加第二批两个首选为$56.25。不是支出授权，也不含托管、授权或其他开销。\n\n[原始返回](evidence/domain-quotes.json)保留全部请求与顺序；未核验域名历史，不应在后续交接中写成“干净新域名”。\n';
await fs.writeFile(path.join(dir,'DOMAINS.md'),dm);
let audit='# 玩法、源码与许可判断\n\n核验日2026-10-24。公开可读、能够iframe、GitHub仓库存在、LICENSE允许复用，是四件不同的事。代码/数据许可不代替名称、商标、音乐/图片及服务条款审查。以下只据已取到的文件与公开政策作实施判断，没有联系权利方，也没有获得新增授权。\n\n';
for(const s of enriched)audit+=`## ${s.name}\n\n结论：**${s.route}**。${s.implementation}\n\n${s.sources.map(x=>`- [${x.title}](${x.url})：${x.note}`).join('\n')}\n\n`;
audit+='## 额外排除的误用\n\n- osmanyo/colordle的LICENSE请求404，不能把仓库公开等同允许商用。\n- hobgoblina/colordle的MIT代码与目标原版玩法不一致；页面还明确阻止外站嵌入，不擅自iframe该站。需要复用任何组件时仍保留通知并审查依赖。\n- AEFeinstein/metazooa-solver有MIT代码，但README是本地求解工具并包含从原站提取物种的流程。其代码许可不自动证明原站数据可重新分发，本计划不用原站提取名单。\n- NCBI数据政策不是对所有第三方内容的无条件许可；taxonomy包声明和具体字段仍是MET-DATA的验收前提。\n- Natural Earth公有领域底图不自动提供准确的游戏邻接表/城市题库，地图事实也要检验。\n\n原始取证：[HTTP元数据](evidence/public-sources.json)、[首轮仓库文件](evidence/github-source-search.json)、[补充文件与政策](evidence/source-checks.json)、[浏览器观察](evidence/browser-rule-checks.json)。GitHub请求404只代表该路径/访问未取得文件，不推断作者恶意或仓库一定私有。\n';
await fs.writeFile(path.join(dir,'SOURCE-AUDIT.md'),audit);
const selected=new Set(enriched.map(s=>s.metric.keyword));
const overrides={
 'horsle':'观察：原站玩法含固定HORSE答案梗；复玩/长期需求价值待测，不因KD10单独建站',
 'wave rider':'条件：鞋/冲浪/游戏混合意图，须先确认游戏SERP与准确版本、许可',
 'curve rush 2':'暂缓：真实续作/版本和SERP一致性未定',
 'dashmetry':'观察：曾有高峰，近期弱于高峰；版本、分发许可待审',
 'tap road':'暂缓：Trends近期弱于早期；供应商/许可待审',
 'kart bros':'暂缓：需求走弱且多人/供应商依赖，先不自研替代',
 'rodha':'暂缓：教育培训与游戏混合；先验证纯游戏需求',
 'poetl':'排除当前拼写：球员Jakob Poeltl相关；实际Poeltl游戏需单独研究',
 '2v2io':'条件：实时多人服务/供应商授权是前提，不当作廉价单机自研',
 'baseball bros':'条件：多人/游戏供应商/商用嵌入范围待审',
 'bracket city':'暂缓：官方媒体/谜题内容依赖，不能复制每日内容',
 'boxing random':'下一轮授权核验：9,900/KD19，不满足严格>10k；非首批已选',
 'time shooter 3':'下一轮授权核验：5,400/KD20，低于量级门槛；不开源假设',
 'time shooter 2':'下一轮授权核验：5,400/KD22，低于量级门槛；不开源假设',
 'geodle':'小额观察：2,400/KD15；数据、玩法及与Travle区别待审',
 'tap road beat':'小额观察：1,300/KD8；需明确真实版本和分发权',
 'flagpie':'观察：意图混杂、独立Trends证据不足，不当作确定游戏',
 'elementle':'早期观察：210/KD5，related Breakout不是绝对搜索量',
 'bullseye game':'排除当前意图：实体桌游/商业产品占位，不直接建浏览器游戏承接',
 'boxing bros':'排除独立游戏假设：混入WrestleBros/拳馆/音乐',
 'map tap':'并入Maptap主词，同站同页，不叠加量，不另建域名',
 'contexto':'后排：KD50、既有成熟语义引擎和竞品，非首批',
 'murdle':'后排：KD46，图书/游戏混合及谜题内容供给待核验',
 'weddle':'后排：KD45，球员/游戏混合与运动员数据维护待核验'
};
const rest=ledger.keywords.filter(k=>!selected.has(k.keyword));
const disposition=k=>overrides[k.keyword]||`保留研究库：${k.verdict||'未选首批'}；本轮未核验可用源码/素材/iframe许可，不能标记可直接开发`;
const rem='# 其余关键词的处置\n\n上一轮117词，本计划11个主词，余下106词。下面保留原始Volume/KD与后续处理，不声称每词均已完成本轮源码/域名/真实Google审查。变体并入主词，不能按词数等同站点数。现有12游戏相关词仍按原台账处理，不为其重复新建站。\n\n| 关键词 | 镜像Volume / KD | 后续处理 |\n|---|---:|---|\n'+rest.map(k=>`| ${k.keyword} | ${fmt(k.volume)} / ${k.kd} | ${disposition(k)} |`).join('\n')+'\n';
await fs.writeFile(path.join(dir,'REMAINDER.md'),rem);
await fs.writeFile(path.join(dir,'dispositions.json'),JSON.stringify(rest.map(k=>({keyword:k.keyword,volume:k.volume,kd:k.kd,disposition:disposition(k)})),null,2)+'\n');
console.log(JSON.stringify({planned:enriched.length,remainder:rest.length,domains:domainResults.length,available:domainResults.filter(x=>x.available).length,p0Days:[10,13],p0DomainCost:enriched.slice(0,3).reduce((a,s)=>a+byDomain.get(s.domain).price,0)},null,2));
