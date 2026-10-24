# 可执行任务清单

所有条目均为计划，尚未执行。首批先后顺序：Cutle → Poople → Colordle。实施与公开上线分开验收。每站只能在通过数据/名称/授权门槛后发布。

## 共用任务与依赖

- [ ] **G01 采购前复核名称与域名**：逐站核验名称/商标、域名历史/垃圾内容、最终价格和本人所有权；当前可注册报价不代表名称可自由使用。未通过则更名并重做搜索意图判断。
- [ ] **G02 独立项目初始化**：执行建站获授权后，在E:/Projects/game-sites/<slug>建立独立私有仓库、锁依赖和许可清单；不在GameHubs新增games目录/嵌套Git。尚无外部资源则不写成已创建。
- [ ] **G03 静态站与索引配置**：游戏和主要文字可直接访问；唯一H1、准确title/description、最终域名canonical、OG、可见内容对应的schema、robots/sitemap、真实404；预览noindex，最终域名验收后再开放。
- [ ] **G04 逐站验收**：桌面Chrome/Edge与实际触屏设备完成开始/输入/得分/胜负/重玩；键盘焦点、窄屏、刷新/跨日/存储禁用、无控制台错误和意外外部请求；不能把未测设备记为通过。
- [ ] **G05 发布与记录**：另行获得域名购买/部署授权后，确认预算和平台限额；每站独立Vercel项目。最终域名HTTPS、www跳转、canonical、索引、完整游戏再验收；把实际repo/project/domain登记到GameHubs，不动现有游戏holds。
- [ ] **G06 量化观察**：获准后配置GSC与必要统计，记录game_start/complete/replay和自然搜索曝光/点击；无数据标未知。开发中广告关闭，网络批准和政策/隐私/控件距离核验后才启用。

资源结构：每站计划目录为E:/Projects/game-sites/<slug>；静态HTML/CSS + TypeScript（Vite可选），玩法在本地模块，SEO说明静态输出，无必要不加数据库/登录/外部运行时。不同站保持独立视觉与内容；共用构建经验，不批量复刻同一空壳。除非实际需求验证，不引入付费API。

<a id="cutle"></a>

## 1. Cutle · P0 · 首批

**路线：自研。** 先做几何切割练习站。KD低、规则清楚、无需外部图片或实时API，是首个成本可控的实验。

- 指标：US Volume 12,100 / KD 8；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-08.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-15.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-cutle.json)。
- 开发可控性：高；SEO证据：中。估算3–4人日。
- SERP判断：镜像前十以原站及游戏目录为主；实际Google本次先出现cutle.org，再出现pfiffel原站，排名与镜像不同。cutle.org已有无限模式、归档、自定义形状和生成工具。因此只把按难度训练/练习记录作为待测差异，不能称无限版有空位。
- 方式：静态页面 + TypeScript + SVG。独立实现直线/半平面裁剪和多边形面积，MVP只生成凸多边形；图形、随机种子、UI全部自行制作。无需iframe，不复制原站每日形状或代码。
- 产品假设：验证“按形状/难度反复训练 + 切线误差解释”是否比只玩每日题更有用。此为产品假设，不声称原站没有练习。
- 首选域名：**cutleunlimited.com**；备选：playcutle.com、cutlepractice.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 三角形、矩形及5–8顶点凸形；拖动预览切线，提交后显示两侧百分比
- Unlimited练习、难度选择、自有UTC每日题；首刀成绩与最佳成绩分开
- 本地统计、重玩、结果分享、触屏与键盘切线控制；无登录

SEO关键词与URL：主词 **cutle**；变体 `cutle game`、`cutle unlimited`、`cutle practice`、`play cutle`、`cutle online`（变体未独立测量）。建议标题：Cutle Unlimited – Play the Shape Cutting Game。

| URL | 页面实际用途 |
|---|---|
| / | 可玩主词页，承接game/unlimited/practice/online，默认可立即练习 |
| /how-to-play/ | 直线切割、比例判定与实际操作示例 |
| /strategy/ | 用自绘形状讲切线与面积；有实质示例才发布 |

任务及完成定义：

- [ ] **CUT-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **CUT-ENGINE 完成凸形生成、裁剪和比例计算**：随机样本两侧面积守恒；50:50及48:52边界、切过顶点、未穿过图形、零长度拖动均正确。
- [ ] **CUT-PLAY 完成练习/每日/统计与输入**：连续玩10局；重置、刷新、UTC跨日、触屏和键盘操作有效；首刀与最佳值不混淆。
- [ ] **CUT-CONTENT 完成规则与策略示例**：说明本网站题目与规则版本；不输出原站今日答案或抄原图。
- [ ] **CUT-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **CUT-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **CUT-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站规则](https://pfiffel.com/cutle/)：拖动直线分割形状，以接近50:50为目标；48:52及以内算赢，原站每日UTC更新。HTTP检查曾失败，规则随后由网页读取确认。未核验到原游戏可商用开源代码。
- [当前前列竞品](https://cutle.org/)：页面明示Infinite、Archive、自定义形状和生成工具；无限模式不保存进度，不能把无限本身当作独家差异。

<a id="poople"></a>

## 2. Poople · P0 · 首批

**路线：自研 + 公有领域词库。** 增长信号强、玩法可独立实现；先验证词库体验，避免把未授权第三方仓库当开源成品。

- 指标：US Volume 33,100 / KD 26；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-08.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-14.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-poople.json)。
- 开发可控性：高；SEO证据：中。估算4–5人日。
- SERP判断：实际Google确认原站和pooplegame.com在前列，也有playdaily的Unlimited入口。pooplegame.com/unlimited页面已有练习、最短路par和Solver链接，且称无限练习不保存。本站只把按难度训练、本地练习历史及分层提示作为待测差异，不宣称Unlimited/Solver为空位。
- 方式：TypeScript词图 + BFS求最短路径，词库离线打包。独立整理常见四字母词、建立连通分量，只抽取能到POOP的起点。自有每日seed，与原站题库无同步关系。
- 产品假设：核心是“可解释的字梯训练”，不是复制官方每日答案。上线前人工检查常用词、冷僻词、敏感词和误收词。
- 首选域名：**pooplepractice.com**；备选：pooplegameplay.com、playpoople.net。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 四字母输入、一字母合法替换、已用词和非法词反馈
- 无限练习、自有每日题、按最短步数分难度、本地练习历史与错题重练
- 分层提示（先给可改字母位置，再按需给下一词）；终局显示本词库的一条最短路径

SEO关键词与URL：主词 **poople**；变体 `poople game`、`poople unlimited`、`poople practice`、`poople hints`、`poople solver`（变体未独立测量）。建议标题：Poople Practice – Play Unlimited Word Ladder Puzzles。

| URL | 页面实际用途 |
|---|---|
| / | 可玩主词页，整合game/unlimited/practice |
| /how-to-play/ | 用自行生成的字梯示例说明规则 |
| /solver/ | 第二阶段真正可用的BFS工具；标明只适用于本站词库，不宣称能还原官方今日答案 |

任务及完成定义：

- [ ] **POO-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **POO-WORDS 整理可用词库和许可清单**：固定词库版本；仅四字母；POOP在词表；每个选中起点可达；抽样人工复查至少100个入选词。
- [ ] **POO-ENGINE 实现图搜索与挑战状态**：合法步Hamming距离=1；非法词不推进；BFS最短步数已知样例正确；不可达起点被剔除。
- [ ] **POO-PLAY 完成难度/提示/每日与结果**：10局完整流程、连续重复输入、提示与最短路径一致；UTC跨日和刷新不重复计数。
- [ ] **POO-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **POO-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **POO-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站玩法](https://poople.io/)：浏览器规则确认：四字母英文词，每次只换一个字母，向POOP转换，追求少步数。
- [当前练习竞品](https://pooplegame.com/unlimited)：已存在无限练习及Solver入口；页面称练习不保存，本地练习历史仅作拟验证差异。
- [第三方参考仓库](https://github.com/poople-game/poople-game)：README仅称源码供参考，游戏内容归Poople；没有确认可商用开源许可，不能直接部署。
- [候选词库许可](https://github.com/dwyl/english-words/blob/master/LICENSE.md)：Unlicense，公有领域献出文本；商业使用可行。锁定版本、保留许可记录并另行清洗词表。

<a id="colordle"></a>

## 3. Colordle · P0 · 首批

**路线：自研 + MIT颜色数据。** 零图片/音频依赖，许可明确的数据可用，适合低成本补充实验；同名玩法混杂使SEO确定性弱于开发确定性。

- 指标：US Volume 74,000 / KD 25；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-08.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-14.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-colordle.json)。
- 开发可控性：高；SEO证据：中偏低。估算3–4人日。
- SERP判断：实际Google确认Ryan颜色名原站和colordle.com十六进制版在前列，也混入Colorfle/MATLAB及其他颜色游戏。必须围绕颜色名猜测意图，不把74,000全部算作这一玩法可争取份额。
- 方式：独立颜色匹配逻辑 + MIT颜色名快照。MVP用明确公开的RGB距离归一化分数；相同颜色100%，越接近分数越高。它是本站评分，不能声称复现原站算法。颜色名别名和重复色值先规范化。
- 产品假设：测试“颜色名可搜索 + 训练难度 + 终局解释颜色关系”，并明确本站独立题目。原站既有功能不能当作未经核实的缺口。
- 首选域名：**colordleunlimited.com**；备选：playcolordle.com、colordlepractice.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 颜色名搜索、输入与猜测历史；本网站百分比评分
- Unlimited、自有每日色、本地统计与结果分享
- 文字分数、可见焦点、文字状态反馈；不只靠色块区分结果

SEO关键词与URL：主词 **colordle**；变体 `colordle game`、`colordle unlimited`、`colordle practice`、`color guessing game`、`colordle color names`（变体未独立测量）。建议标题：Colordle Unlimited – Guess the Color by Name。

| URL | 页面实际用途 |
|---|---|
| / | 明确Guess the color by name，承接主词和无限练习 |
| /how-to-play/ | 本站评分方法、颜色名与操作 |
| /color-guide/ | 第二阶段提供真实可用的颜色名/色值查询，避免无内容的一色一页 |

任务及完成定义：

- [ ] **COL-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **COL-DATA 处理MIT颜色数据**：锁定版本与许可；处理别名/重复RGB/无效值；候选目标能被有效输入。
- [ ] **COL-ENGINE 实现评分与独立题目**：相同颜色100%；分数有界且确定；每日跨时区一致；不虚称原版百分比兼容。
- [ ] **COL-PLAY 完成输入、反馈与无障碍**：键盘搜索选色、猜测、重玩；色块和文字共同反馈；10局完整流程无状态错误。
- [ ] **COL-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **COL-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **COL-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [本次目标原站](https://colordle.ryantanen.com/)：浏览器帮助确认颜色名输入、百分比反馈、每日颜色，数据链接meodai/color-names。未确认原游戏代码许可。
- [颜色名数据MIT许可](https://github.com/meodai/color-names/blob/master/LICENSE)：MIT，David Aerne；可使用数据，保留版权及许可。
- [另一个MIT版本](https://github.com/hobgoblina/colordle)：README/LICENSE可用，但React17/旧CRA，玩法是另一类Wordle式输入；App含反嵌入检查。不是目标原版直接部署包。
- [BSD版差异](https://github.com/weber1158/colordle)：BSD-3-Clause已见，但为MATLAB十六进制猜色应用，不是网页可直接部署源。

<a id="metazooa"></a>

## 4. Metazooa · P1 · 第二批

**路线：条件自研：先完成分类数据审查。** 需求方向较好；主要成本在可信分类树与动物别名，不是页面。数据包通过审查后才进入开发。

- 指标：US Volume 12,100 / KD 23；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-09.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-15.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-metazooa.json)。
- 开发可控性：中；SEO证据：中。估算6–9人日。
- SERP判断：原站引用域多、前列也有目录和解释页；可以测试练习/学习意图，但不能按KD23推定能替代原站每日游戏。
- 方式：自建精选动物列表+taxon ID映射+最近共同祖先LCA；优先核查NCBI taxonomy包，再固定版本。若使用Wikidata CC0自行整理，需独立校验分类一致性。MVP无动物照片、不抓取原站私有题库。
- 产品假设：用清楚的分类树解释每一步为什么更近，试验教育练习价值；没有授权的数据包则保持待办。
- 首选域名：**metazooapractice.com**；备选：playmetazooa.com、metazooaunlimited.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 先100–200种常见动物和英文别名，经人工抽样检查
- 20次猜测、共同分类节点提示、可解释的分类路径
- Unlimited、自有每日题、本地进度；不承诺同步原站答案

SEO关键词与URL：主词 **metazooa**；变体 `metazooa game`、`metazooa unlimited`、`metazooa practice`、`metazooa hints`、`animal taxonomy game`（变体未独立测量）。建议标题：Metazooa Practice – Animal Taxonomy Guessing Game。

| URL | 页面实际用途 |
|---|---|
| / | 练习玩法，显著说明本站数据/规则版本 |
| /how-to-play/ | 分类关系与20次猜测规则 |
| /taxonomy-guide/ | 真实数据对应的分类树和策略，不铺空动物详情页 |

任务及完成定义：

- [ ] **MET-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **MET-DATA 通过数据许可和分类样本门槛**：保存包声明/版本/来源；100–200动物无缺失父节点、无环；别名唯一映射；人工复核至少30组LCA。
- [ ] **MET-ENGINE 实现LCA、提示与猜测规则**：已知分类对结果正确；同种、重复、无效输入、20次上限、跨日可恢复。
- [ ] **MET-PLAY 完成树解释与练习**：在无需图片/API的情况下完整玩10局；不把本站每日解答写成官方答案。
- [ ] **MET-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **MET-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **MET-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站FAQ](https://metazooa.com/faq)：确认基于NCBI分类，并非直接使用Wikipedia树。
- [官方翻译仓库](https://github.com/the-abe-train/metazooa-translations)：公开翻译不等于完整游戏代码。LICENSE和其引用的twl-monorepo源码请求未取得可用文件；不推断仓库私有或授予分发权。
- [MIT工具而非网页游戏](https://github.com/harrison-barnes/metazooa)：Python分析/抓取/模拟工具；不是开源网页成品，不继承其抓取的原站清单。
- [NCBI政策](https://www.ncbi.nlm.nih.gov/home/about/policies/)：政府制作信息有公有领域说明，同时提示第三方内容和数据限制；具体taxonomy下载包声明仍需核验，不能一概宣布全部NCBI数据无约束。
- [可替代结构化数据许可](https://www.wikidata.org/wiki/Wikidata:Licensing)：Wikidata结构化命名空间为CC0；其他文字及图片不自动CC0。如改用此数据，应以自有分类规则说明，不声称原站一致。

<a id="travle"></a>

## 5. Travle · P1 · 第二批

**路线：自研 + 公有领域地图。** KD31属于放宽档；玩法和本地地图均可掌控，可在首批表现合格后做，不受第三方iframe持续供给影响。

- 指标：US Volume 40,500 / KD 31；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-07.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-13.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-travle.json)。
- 开发可控性：中偏高；SEO证据：中。估算5–7人日。
- SERP判断：原站及旧版页面在前列，也存在travle拼写带来的非游戏内容；聚焦国家连线路径游戏，避免把travel旅游词作为变体铺页。
- 方式：本地简化SVG地图+自建国家邻接图+BFS最短路；使用Natural Earth数据快照。陆地边界、飞地、海峡/岛屿连接须写明自己的规则，不能仅靠多边形相交自动认定。
- 产品假设：按地区/步数训练和清楚的边界规则是待验证价值；不把unlimited当作已证明竞争空位。
- 首选域名：**travleunlimited.com**；备选：playtravle.com、travlepractice.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 给定起终点，输入相邻国家完成路径；国名搜索/英文别名
- 可达难度分组、Unlimited与自有每日题
- 终局最短路解释和地图高亮；无地图服务账号与计费依赖

SEO关键词与URL：主词 **travle**；变体 `travle game`、`travle unlimited`、`travle practice`、`travle geography game`、`travle hints`（变体未独立测量）。建议标题：Travle Unlimited – Play the Country Path Game。

| URL | 页面实际用途 |
|---|---|
| / | 可玩的国家路径游戏，合并unlimited/practice |
| /how-to-play/ | 陆地邻接、岛屿和特殊连接规则 |
| /strategy/ | 用本地图的真实路线解释；不伪造官方每日解答 |

任务及完成定义：

- [ ] **TRA-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **TRA-MAP 整理地图与邻接规则**：锁定Natural Earth版本；邻接无意外单向边；特殊连接清单可见；抽样50对边界人工核验。
- [ ] **TRA-ENGINE 完成BFS与出题**：起终点可达且不同；最短距离正确；非法边不推进；有多条最短路时均接受。
- [ ] **TRA-PLAY 完成SVG交互与国名输入**：小屏搜索不遮挡状态；键盘完成一局；结果路线与图一致；10局完整流程。
- [ ] **TRA-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **TRA-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **TRA-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站](https://travle.earth/)：国家路径猜谜；原站每日题不复制。
- [旧版入口](https://imois.in/games/travle/)：作为玩法核验入口；未确认可直接部署的完整开源许可。
- [Natural Earth官方使用条款](https://www.naturalearthdata.com/about/terms-of-use/)：矢量/栅格地图公有领域，可商用修改；适合离线SVG底图。国家邻接仍需单独整理。

<a id="spotle"></a>

## 6. Spotle · P2 · 条件队列

**路线：条件自研：音乐人元数据先行。** 量和趋势均值得保留；先解决可长期维护的艺人属性数据。不是直接下载Spotify内容后上线。

- 指标：US Volume 110,000 / KD 23；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-09.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-14.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-spotle.json)。
- 开发可控性：中偏低；SEO证据：中。授权/数据/范围未定，暂不估开发工期。
- SERP判断：原站、提示答案媒体和同名不同玩法并存；先明确音乐人猜测意图，unlimited并非自动空位。
- 方式：拟自研艺人属性猜谜，先验证合法可用的元数据来源/更新方式；MVP可不含音频与头像。若无法满足玩家识别需求则暂缓，不抓取受限服务。
- 产品假设：数据许可、覆盖度、更新成本及小样本试玩通过后再估工期。
- 首选域名：**spotlepractice.com**；备选：playspotle.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 定义字段与缺失值处理
- 小规模艺人集验证可玩性
- 真实字段反馈与自有每日题

SEO关键词与URL：主词 **spotle**；变体 `spotle game`、`spotle unlimited`、`spotle practice`、`music artist guessing game`（变体未独立测量）。建议标题：Spotle Practice – Music Artist Guessing Game。

| URL | 页面实际用途 |
|---|---|
| / | 音乐人猜测；不混入电影或其他Spotle |
| /how-to-play/ | 只解释实际实现的字段 |

任务及完成定义：

- [ ] **SPO-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **SPO-GATE 核查数据与产品可行性**：字段/数据/头像分别有来源与许可；完成可玩原型；原站名称使用范围完成审查后再排开发。
- [ ] **SPO-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **SPO-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **SPO-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站](https://spotle.io/)：艺人猜测玩法；代码、照片及数据集的商用来源仍待核验。

<a id="traffic-road"></a>

## 7. Traffic Road · P2 · 授权后可前移

**路线：授权iframe。** 若取得适用本站域名和变现方式的嵌入许可，可提前；目前未取得，不算随时可上的站。

- 指标：US Volume 14,800 / KD 29；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-06.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-12.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-traffic-road.json)。
- 开发可控性：取决于授权及触屏；SEO证据：中。授权/数据/范围未定，暂不估开发工期。
- SERP判断：镜像中门户/分站较多，也混入通用traffic内容；真实产品是3D第一人称摩托，不以简易2D自研替代承接同一搜索意图。
- 方式：只考虑权利方允许的iframe/feed；确认域名、广告、分成、退出/下架及可用性约束，再验证frame/CSP、保存、重启、横竖屏和触屏。授权未到位不镜像包、不替换广告。
- 产品假设：授权条件成立后再做稳定加载、清晰控制和移动体验；并不保证学校/公司网络可访问。
- 首选域名：**playtrafficroad.com**；备选：trafficroadunblocked.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 原版完整游戏嵌入
- 准确的控制/模式说明
- 加载失败/全屏/焦点与返回处理

SEO关键词与URL：主词 **traffic road**；变体 `traffic road game`、`traffic road online`、`play traffic road`、`traffic road unblocked`（变体未独立测量）。建议标题：Traffic Road – Play the Motorcycle Driving Game。

| URL | 页面实际用途 |
|---|---|
| / | 主词及online整合一个真实可玩入口；unblocked不另开重复页 |
| /controls/ | 按获授权版本实际验证的控制与模式 |

任务及完成定义：

- [ ] **ROA-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **ROA-RIGHTS 获取适用域名和变现方式的许可**：保存明确授权范围与条款；不以iframe地址可访问代替授权；本轮未联系/发信。
- [ ] **ROA-FRAME 许可后验证完整游戏**：真实最终域名可加载；桌面/触屏各完整游玩；CSP/广告/失败状态与条款一致。
- [ ] **ROA-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **ROA-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **ROA-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [游戏说明](https://azgames.io/traffic-road)：四模式3D摩托游戏；HTTP页面出现traffic-road.embed地址，仅证明技术入口。
- [AZ条款](https://azgames.io/term-of-use)：只明示个人非商业材料访问，复制/修改/分发等需事先书面许可；未找到可覆盖本站商业嵌入的授权。

<a id="maptap"></a>

## 8. Maptap · P2 · 待差异化验证

**路线：条件自研地图定位。** 增长强但开发/内容成本较高，原站产品也成熟；先做区别于现有Practice的具体题型验证。

- 指标：US Volume 40,500 / KD 31；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-08.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-15.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-maptap.json)。
- 开发可控性：中偏低；SEO证据：中。授权/数据/范围未定，暂不估开发工期。
- SERP判断：原站、应用商店和媒体占据较强位置；浏览器已确认原站有Practice/Prior Days/Player-Made Levels，不能以这些功能作为缺口。
- 方式：拟自研地图定位与距离评分；离线地图+独立整理地点事实。地图精度、地点命名、移动缩放和题目成本先做小样。没有获准iframe源。
- 产品假设：只有完成玩家对照试玩、证明具体题型价值后才排期。
- 首选域名：**playmaptap.com**；备选：maptappractice.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 先定义一种可验证的定位题型
- 用自行整理的少量题测定位/距离分数
- 不包含未实现的全球对战/UGC

SEO关键词与URL：主词 **maptap**；变体 `maptap game`、`map tap`、`maptap practice`、`maptap geography game`（变体未独立测量）。建议标题：Maptap Practice – Geography Location Challenges。

| URL | 页面实际用途 |
|---|---|
| / | maptap与map tap同一意图归一页，不叠加量 |
| /how-to-play/ | 实际定位/评分规则 |

任务及完成定义：

- [ ] **MAP-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **MAP-GATE 验证题型与数据成本**：记录原站已有功能；完成自有题小样与地图移动体验；找不到实质差异则不建站。
- [ ] **MAP-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **MAP-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **MAP-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站菜单](https://maptap.gg/)：Chrome核验Practice Levels、Prior Days、玩家关卡、Atlas、Groups、Versus等。
- [地图底图候选](https://www.naturalearthdata.com/about/terms-of-use/)：仅解决底图，不等于地点题库/图片/原站游戏代码许可。

<a id="scrandle"></a>

## 9. Scrandle · P2 · 待玩法/素材审计

**路线：待核验：授权iframe优先，或合规素材自研。** KD15不足以抵消规则、素材和长期内容来源未核验的问题；只保留审计任务。

- 指标：US Volume 90,500 / KD 15；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-09.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-14.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-scrandle.json)。
- 开发可控性：低；SEO证据：中偏低。授权/数据/范围未定，暂不估开发工期。
- SERP判断：原站、多个成熟分站及视频并存；趋势首末四周相近，不能称为近期爆发。
- 方式：先完成真实玩法与每类素材的权利来源清单。可授权feed则iframe；有独立可商用数据/素材才评估自研。没有条件前不指定为开源部署。
- 产品假设：尚未证明可实施差异，域名仅候选。
- 首选域名：**playscrandle.com**；备选：未推荐其他名称。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 先做实际玩法审计
- 确认持续出题/素材来源
- 再选iframe或自研

SEO关键词与URL：主词 **scrandle**；变体 `scrandle game`、`play scrandle`、`scrandle practice`（变体未独立测量）。标题待实际产品范围确定后再写。

| URL | 页面实际用途 |
|---|---|
| / | 待实际玩法与来源确认后决定定位 |

任务及完成定义：

- [ ] **SCR-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **SCR-GATE 审计实际玩法、内容及许可**：完成一局记录、资产/数据清单、授权范围和成本，再决定是否开发。
- [ ] **SCR-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **SCR-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **SCR-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站入口](https://scrandle.com/)：HTTP入口可访问，未完成完整实际游戏和素材来源核验。

<a id="songless"></a>

## 10. Songless · P2 · 音频许可阻塞

**路线：授权iframe或取得音频许可后自研。** 需求不错，但音频的长期分发/播放许可是先决条件；不从流媒体提取短片段当免费素材。

- 指标：US Volume 74,000 / KD 21；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-09.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-14.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-songless.json)。
- 开发可控性：低；SEO证据：中。授权/数据/范围未定，暂不估开发工期。
- SERP判断：官方、成熟分站、应用以及现有unlimited页面已存在；仅加无限模式不是已验证的优势。
- 方式：首先核查权利方是否提供可商用嵌入/音频方案。若没有授权内容，降为观察，不以陌生开源壳套商业录音。
- 产品假设：成本和许可确定后才估工期，暂不开发。
- 首选域名：**songlesspractice.com**；备选：未推荐其他名称。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 许可内容/地区/时长/广告范围先明确
- 获得许可后再实现播放和判题
- 处理触屏自动播放限制与无声错误

SEO关键词与URL：主词 **songless**；变体 `songless game`、`songless unlimited`、`songless practice`（变体未独立测量）。标题待实际产品范围确定后再写。

| URL | 页面实际用途 |
|---|---|
| / | 获准后才建真实歌曲猜测页，不发布空内容站 |

任务及完成定义：

- [ ] **SON-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **SON-RIGHTS 确认音频或嵌入许可**：内容、地区、再分发/播放、广告和费用均有证据；无许可则持续暂缓。
- [ ] **SON-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **SON-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **SON-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [原站](https://lessgames.com/songless)：歌曲识别方向；音频许可、具体供给与嵌入授权未核验。

<a id="x-trench-run"></a>

## 11. X Trench Run · HOLD · 不进低成本首批

**路线：商业授权成品自托管；订阅iframe另询价。** KD9但官方标价5,999美元，趋势也较早期弱；与低成本试站目标不匹配，不购买、不抓包。

- 指标：US Volume 49,500 / KD 9；[指标原始文件](../2026-10-24-keyword-opportunities/raw/semrush-bulk-03.json)、[Trends序列](../2026-10-24-keyword-opportunities/raw/trends-09.json)、[SERP记录](../2026-10-24-keyword-opportunities/raw/semrush-serp-x-trench-run.json)。
- 开发可控性：合同及预算未定；SEO证据：中偏低。授权/数据/范围未定，暂不估开发工期。
- SERP判断：MathPlayground、CrazyGames及其他游戏站已占位。页面级引用域少不等于竞争弱或可免费分发。
- 方式：只有预算和合同通过后才按授权部署编译成品或订阅iframe；这不是“开源部署”。原开发商游戏演示/CDN不等于免费发行许可。
- 产品假设：若未来合法供给明显降价或组合成本合理，再重新评估。
- 首选域名：**playxtrenchrun.com**；备选：xtrenchrununblocked.com。价格/状态见[域名表](DOMAINS.md)；仅在名称/历史复核后择一购买。

MVP范围：

- 暂不安排实现

SEO关键词与URL：主词 **x trench run**；变体 `x trench run game`、`x-trench run`、`x trench run online`、`x trench run unblocked`（变体未独立测量）。标题待实际产品范围确定后再写。

| URL | 页面实际用途 |
|---|---|
| / | 未来获准时主词/拼写归一页，不做重复unblocked入口 |

任务及完成定义：

- [ ] **XTR-00**：先完成G01和相应数据/授权门槛；验证首要变体Trends→Semrush→Google当前SERP，若意图/名称使用不可行则重排，不直接铺站。
- [ ] **XTR-GATE 仅在有预算时复核商业授权**：明确合同、交付、域名/广告、总费用后重新决策；本轮不购买/联系供应商。
- [ ] **XTR-SEO**：按上表提供真实可见内容，主词自然覆盖；同义词不拆重复页；完成G03。
- [ ] **XTR-QA**：逐站完成G04；来源/许可与输入/错误/结束状态均有证据。
- [ ] **XTR-RELEASE**：只有获得实施及发布授权、完成G05后才记录上线；按G06建立观察，不预设收入。

来源：

- [官方许可产品页](https://www.marketjs.com/item/x-trench-run/)：页面列VIP Prime 5999 USD、编译成品、单项目/单域名、原样不含定制。
- [官方买家FAQ](https://www.marketjs.com/buyer-faq/)：固定费通常交编译文件自托管，订阅交iframe链接；不交原始源码。不能把5999当作已包含订阅iframe的价格。
