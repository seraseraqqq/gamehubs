# GameHubs 当前接力

本轮GitHub交付范围（2026-10-25，用户明确授权）：提交关键词补采/分级、KGR显示与缺项原因、全部依赖批次及已完成的17站发布/Analytics/域名正式记录、相应证据和默认管理规则；推送结果以本轮Git历史为准。仍在进行的portfolio-seo-review目录及其专用审查/修复脚本保留本地，不纳入这次交付，也不宣称其修复已全部上线。当前17站均部署、10站有自定义域名、7站仍用Vercel域；下一步先完成版本与完整游玩/手机验收，再为通过验收且决定长期运营的站点分批定域名，随后核对搜索接入与实际收录。现有索引门禁和第三方许可状态不变，328PV含测试流量，不能据此购买域名。

流量咨询（2026-10-25北京时间19:23快照）：只读查询正式17站Vercel Analytics，合计328PV、Google网站/应用来源16PV、未归因302PV；85项PV对账通过。部分旧站23日起已有统计，新站验收访问明显混入，不能将流量总计当自然玩家增长或据此购买域名。逐站数据/完整查询/复算见[流量分析](research/2026-10-25-vercel-traffic-analysis/README.md)。未修改部署、域名、索引或正式站点记录，未commit/push或创建自动化。

更新：2026-10-25。GameHubs现为站群管理仓库，根目录采用dashboard/data/generated/scripts/docs/research/deployments，不再保留management/或games/。用户已在查看分仓验收和删除影响后明确授权清理游戏副本并将管理仓库推送GitHub。

补采继续（2026-10-25，已回填与验收）：用户授权使用免费Semrush并完成一次Google人机验证；原150词全量查过Volume/KD，120词有完整值，33个量/KD过线词的KGR全取得，150词均尝试Trends/149词有效，6个四门槛过线词完成真实Google SERP与页面核查。新分级A1（duotrigordle）/B2（tradle、ragdoll drop）/未达标117/待验证30，无已确认S档，推荐均中确定性。全池Volume/KD缺项100降至37（新30/历史7），剩余镜像无缓存且刷新接口报错；不再把来源缺值与未采集混为一谈。新增100条指标补录及150条分级观察，当前290词/800观察/12批/17站、0审核事件、0校验错误。27项管理回归、重复导入unchanged、运行中API/CSV与真实Chrome词池截图验收通过。已按研究分级排序，缺项悬浮显示原因。旧批次与来源日期保留，17站、人工决定及发布权限未变。[本轮完整结果/证据/脚本](research/2026-10-25-windows-keyword-recheck-f112093a-400e-4e4b-98f7-fd0f8c102a13/README.md)。下一条动作：后续若立项，重新核实当前SERP、具体版本、许可/数据依赖和可实施差异；研究推荐不等同建设批准。未commit/push、部署、购买或创建自动化。

新一轮150词发现的首次中断快照已由上方补采取代；原150行批次及当时49未达标/101待验证的历史结果继续保留，不能冒充当前分级。[原始发现与中断记录](research/2026-10-25-windows-keyword-mining-58163185-bd51-4b3a-9d54-6cd2795556a5/README.md)。

17站指标纠正（2026-10-25，已回填，用户选择保留其余历史标题页数）：Gulper主词改为 `gulper io`，US镜像Volume9900/KD28、Google精确短语intitle3180，KGR约0.3212。17词Volume/KD均已批量复查，16词有值；Krillion单词概览与一次现有镜像额度刷新仍无值/报错，保持未知。原比值列在表格、排序、详情及CSV统一命名KGR，沿用intitle/Volume公式并明确非allintitle口径。原研究及旧Gulper身份保留，现140词/400观察/9批/17站、0审核事件、0校验错误；24项管理回归、JS语法、真实Chrome看板及运行中CSV导出通过。其余Google标题页数因验证码未完成重测，保留旧数及旧来源日期；未补造6站创建日期。OpenCLI profile `b9q8mv8y`三项连接正常，只是CLI不在当前PATH，扩展v1.0.26偏旧。见[本轮报告](research/2026-10-25-windows-site-metrics-98b5df84-c784-4fe1-bf37-ecbb9c195a1c/README.md)。用户随后明确选择“暂不验证，保留已有标题页数”，本轮Google重测按此收口，不再等待验证码或重试。下一条动作：后续只有用户重新要求重测时再启动独立批次；尚未获准commit/push本轮改动，无游戏部署或索引权限变更。

GitHub同步（2026-10-25，完成）：main已快进至8a42a11（data: enrich keyword metrics and unify site references）。远端129词及主词/日期补录与本机保留的10词鱼类独立批次共同保留，当前139词/383观察/8批/17站、0审核事件、0校验错误。12站重叠记录按字段合并，保留双方history/sources/notes，并追加AI同步历史；本机17站部署与Analytics信息未回退。24项管理回归、Node前端检查通过，索引按正式来源重建。本机其他未提交改动和756个原未跟踪文件均已备份并保留；恢复副本位于 E:\Projects\.gamehubs-sync-backups\2026-10-25-d08da9a086，Git另保留c7b9f9de0ef16ea3fcd432f468aa562a1897f648作为拉取前恢复点。本轮只拉取和本地合并，未提交/推送这些本地变更。

工作台简化与手动编辑（2026-10-25，完成，已获准GitHub交付）：保留关键词池/建站清单/网站目录三个入口，批次移入关键词详情；移除标语、重复解释、市场/资格等日常筛选。关键词和目录支持研究批次日期、Volume/KD/intitle/比值升降序，目录另支持真实建站日期；缺失始终最后。支持四种关键词状态、URL/仓库/目录/分支/建站日期与指标编辑。池内主词指标共用追加修订事件，池外登记词不混入主池；只改状态不冻结原指标。站点保存先完成回读再关闭，避免重排时点到其他行。23项Python回归、Node排序/筛选/增量修订检查及隔离Chrome保存/刷新/关联指标验证通过；1440×900和390×844截图无页面溢出。验证时本机数据为127词/254观察/6批/17站、0审核事件、0校验错误；测试决定未写入正式数据。4310本地服务已正常重启并加载最新接口；CLI generate已同步。使用规则见docs/USAGE.md，验收记录见docs/history/dashboard-refresh-2026-10-25.json。工作台改造验收时尚未采集intitle，后续采集见下文；未明确的建站日期仍为未知；未执行游戏发布。此前工作台交付只纳入工作台及读取/保存依赖修复；本次数据补录另见下文。其他会话研究批次和部署台账保留本地，生成视图以本次提交的正式数据重建。

## intitle数据补采 · 2026-10-25

现有117个US/en关键词已逐词读取Google `intitle:"原词"` 的Tools结果数并追加独立研究批次，117条均取得明确数值。数量是匹配页面估值，不是去重网站数；gl=us/hl=en/pws=0不证明物理美国位置。Volume/KD、研究资格、人工状态/决定和站点记录未改；[117词intitle补采与证据](research/2026-10-25-mac-intitle-e22912c8df39/README.md)。本轮采集没有部署或创建定时任务；数据和证据纳入用户随后明确授权的GitHub交付。

## 网站目录与词池一致性 · 2026-10-25

12个旧站主词已以US/en独立批次补录并关联，现在17站的主词均通过keywordId读取词池，同一入口编辑会共同生效。Volume/KD按用户截图读取，intitle使用本轮已取得的12条证据；保留原117词批次与指标，不自动合并旧122词池。截图缺少gulper.io game的KD及krillion unlimited的Volume/KD，三项保持未知。旧登记明确的11个createdAt已恢复，其他6站仍未记录；导入器已修复日期遗漏。兼容视图的主词指标/日期也由正式来源生成，避免旧快照继续显示过时值。[完整核对](research/2026-10-25-mac-site-keyword-consistency-004351b6cfaf/README.md)。本轮修复未部署或修改发布holds；用户随后明确授权将新数据与修复推送GitHub。

指标名称更正：intitle为标题匹配页面估算数，并非独立竞品网站数；原“竞争度/Volume”后改为“标题页数/Volume”，本轮又按用户要求统一显示KGR。沿用精确短语intitle/Volume公式，非allintitle版本，只作粗筛，不代表排名难度或成功率。

截图大鱼吃小鱼调研（2026-10-25，完成当前识别/KD范围）：新增10个US/en词，免费Semrush镜像主词fish eat fish月量2400/KD47、game词590/KD45；截图具体版本/英文正式名尚未确认，3词KD未知，全量10词均待复核。原117词主研究保留，该轮当时合计127词/254观察/6批次；validate/generate错误0。[完整报告](research/2026-10-25-fish-keywords-7b91d5a4/README.md)。后续若立项先核实版本、官方指标及来源许可；未作建设决定或付费调用。

本机看板修复（2026-10-25）：管理脚本与导入器已显式使用 UTF-8，修复 Windows GBK 默认编码导致的 22 项读取错误。validate、generate 与重启后 /api/state 均确认 117 词、244 条观察、5 批次、17 站点、11 项方案，校验错误为 0；18 项回归覆盖 GBK 默认读取、中文审核保存及站点持久化。业务记录未改，修复尚未提交/推送。

早先 Acceleration City 的本地嵌入核验保留在[记录](research/2026-10-25-acceleration-city-embedding/README.md)；其中未发布状态已被下方本轮明确发布授权和正式验收取代。

## 当前资产

Vercel重复关联与导入提示（2026-10-25，用户授权修复完成）：多余web项目已用官方CLI解除Git连接，正式Travle项目及生产部署保持不变。全29项目复核：主仓库关联0，同仓库重复连接0；未触发新部署。五个新站的根目录pnpm构建、apps/web/dist/client输出与READY版本均正确，30页/20资源HTTP200。Git Import推荐的是apps/web子目录，五条重复建议已逐项Dismiss，刷新确认消失；现有正式项目仍在。已按revision回填五站，工作台完整SEO验收仍未完成。[修复证据](research/2026-10-25-vercel-deployment-history/FIXES.md)。下一步按已有SEO任务处理待发布版本，不能重新导入或把此项验收当完整游玩通过。

Vercel部署额度审计（2026-10-25，修复前历史快照）：全量29项目没有关联seraseraqqq/gamehubs；正式17站均匹配独立仓库。审计时发现额外web项目重复关联gameshub-travle，今日4次ERROR。北京时间今日可见81条（60READY/4ERROR/17CANCELED），近24小时可见98条，平台内部100配额与可见记录差2尚未证实原因。旧主仓来源21条、分仓预览/正式20条、Analytics两轮22条等完整分类见[审计报告](research/2026-10-25-vercel-deployment-history/README.md)。审计时仅查询；其后web重复连接已按上方记录解除，未删除项目或触发新部署。不能把Ignored Build Step取消视为不占部署配额。

SEO审查后续状态（2026-10-25）：17仓本轮修复已推送，5站新版本READY，其余12被平台限流；浏览器安全检查中断后完整游玩验收和正式工作台回填仍未完成。Metazooa另有搜索精确匹配补丁保留本地未提交，见research/2026-10-25-portfolio-seo-review/new-and-embedded/fixes/metazooa-search/。保留9站noindex；当前生产/待发布源码/实际收录分别记录，不把推送当上线。

17站SEO/搜索意图/体验与低质量风险审查（2026-10-25，进行中）：用户要求逐站验证透彻。范围包括线上抓取/索引配置与Search Console实情、真实SERP/对应版本、内容独立价值与准确性、桌面/移动布局/玩法与性能；按证据修复可明确的问题，不将历史放行、脚本分数或无搜索结果冒充已收录/高质量。当前保留既有noindex门禁。17站地址本轮正常TLS/HTTP已重验，付费API预算0。本轮按Rankup明确并行诊断流程派出technical_seo（技术全17）、classic_value（经典8）、new_embed_value（新5+嵌入4），先完成只读诊断，随后按已确认缺陷分配独立源码修复；证据保存在research/2026-10-25-portfolio-seo-review/。主线已完成真实SERP、34份PSI和部分GSC/游玩；当前以本节上方后续状态为准，继续前先处理重复项目与发布限额。

现有17站Analytics与域名统一（2026-10-25，完成）：17独立仓库已推送，原17个Vercel项目生产READY且SHA一致；Analytics接入/开启、真实Chrome view200、后台hasData均通过。10个独立域名apex Production/www301及HTTPS/路径参数/canonical已验；138项HTTP、25引擎测试、284项静态导出回归及18管理回归通过。工作台17站按revision回填，旧记录保留历史；8index/9noindex原有条件不变。[证据](deployments/2026-10-25-portfolio-analytics.md)。下一条动作：后续按用户任务做完整游玩/真机/性能或搜索接入，不能将本轮测试流量当自然增长。

管理规则追加（2026-10-25，完成）：[默认规则](docs/GAME_MANAGEMENT_RULES.md)已同步到AGENTS、研究流程、两个本地SOP与项目初始化模板：免费Semrush优先，自部署OpenSEO/DataForSEO可用；凭据用Secrets或独立解密密钥的密文；apex Production与www301；新开发默认接入并启用Vercel Web Analytics，SDK/项目/pageview/后台分项验收。初始化临时样本30文件/50链接通过，301线上检查8项通过，正式数据校验0错误。未批量迁移现有站点或配置任何密钥；下一条动作：后续授权开发/发布按新规则执行，既有站点接入差距按实际核验记录。

当前任务（2026-10-25，完成）：五个新游戏均已独立 Git/Vercel 生产 READY，25项引擎测试、类型检查、构建、110项HTTP与五站Edge交互冒烟通过，默认noindex。[部署记录](deployments/2026-10-25-five-game-release.md)。六项目域名已完成45个查询及分级推荐，候选回填正式站点记录，[报告](research/2026-10-25-windows-domain-matching-4f7b8e21/README.md)。Cluster Rush 工作台地址已更新为 https://playclusterrush.online/，DNS/正常TLS及www301共12项HTTP通过，仍noindex。域名未代购。下一条动作：按用户选择处理候选域名；真机、玩家、性能与搜索收录另行验收。

本轮发布（2026-10-25）：用户明确解除两站发布暂缓，均已在 gx03410-8651s-projects 完成独立 Git 生产 READY 部署，正式记录为 deployed。Acceleration City 的 playaccelerationcity.com / www DNS、HTTPS、308 与 canonical 验收通过；Cluster Rush 公开默认域可用、保持 noindex。两站游戏均已加载，完整游玩/真机/性能仍待验。[发布记录](deployments/2026-10-25-two-game-release.md)。用户后续明确暂不购买 playclusterrush.com，保留 Vercel 地址；未付款/注册，用户要求保留购物车自行处理，代理已停止操作；购物车移除未确认成功。域名购买不再作为当前阻塞。下一条动作是按后续明确任务处理完整游玩/真机/性能验收。站主批准与第三方授权分开记录。

- 117个US/en研究词、99词簇；17项严格指标达标不等于人工批准。11项建站方案、106词处置和原始证据保留。
- 290词＝原140词（117原研究＋12旧站主词＋10鱼类词＋Gulper正确词）＋最新150发现词；12个来源批次、800条观察，人工审核事件仍为0；最新150分级A1/B2/未达标117/待验证30，未确认S档。旧错误拼写及历史分级保留，研究、人工决定、项目阶段和发布验收分开记录。
- 17个项目均有独立源码仓库。12个既有游戏现均有线上部署，Cluster Rush 已使用用户自行接通的 playclusterrush.online；Cutle等5个新项目也已完成独立Vercel部署，现17个登记项目均有部署。
- 10站在2026-10-25完成原Vercel项目Git源切换、预览和正式READY验收；域名、环境配置和访问保护一致，7站index、3站noindex。随后只清理管理仓库，没有再次部署游戏。

## 接手入口

本轮17站回填的AnalyticsVerified=17、独立域名www301=10继续保留。后续工作台优化已正常重启4310服务，最新vercelRelease兼容视图修复和手动编辑接口均已加载；原先“常驻旧进程等待重启”的限制已解除。最新管理回归23项通过，正式数据校验0错误。

[自动摘要](INDEX.md) · [使用与数据维护](docs/USAGE.md) · [手动研究工作流](docs/KEYWORD_WORKFLOW.md) · [唯一源码](docs/REPOSITORIES.md) · [部署状态](docs/DEPLOYMENT_STATUS.md) · [分仓验收](deployments/2026-10-25-independent-repositories.md) · [本次清理记录](docs/history/2026-10-25-management-only-cleanup.json)。

正式维护入口为data/batches、data/reviews、data/sites。INDEX.md、generated/和两份兼容JSON由generate生成。开发前读取站点source.repository + directory + branch，再在当前设备定位或克隆独立仓库；另一设备E盘或localhost只作历史记录。

管理页启动：`python3 scripts/hub.py serve --port 4310`，打开 <http://127.0.0.1:4310/>。本次保留既有功能，没有增加挖词按钮、自动化或收入预测。

## 游戏副本与工具

原games/全部文件（含未跟踪配置、构建产物和旧别名残留）已校验哈希并移入仓库外备份，位置见清理记录。旧代码也保留在Git提交dc5994e61228e028c068137a5d69bce08b172fd0中。source.frozenSnapshots已清空；source.archivedSnapshots记录原仓库、目录、提交和移除时间，不是可用本地路径。

旧portfolio SEO检查、分仓准备和共享Ignored Build Step三项工具已退役。游戏构建/验收在各自仓库执行；仍保留的五游戏QA工具使用独立兄弟检出，需要先在本机启动相应预览。

## 边界与待办

Acceleration City 与 Cluster Rush 的站主发布暂缓已按本轮明确授权解除，第三方许可仍未确认；Cluster Rush 原.com购买由用户暂缓，后续自行接通的.online已核实并回填，当前仍noindex且无正式canonical。Snow Rider在正式域名完整游玩验收前保持noindex；Coreball和Minute Cryptic仍等待独立域名验收。Head Soccer的apex canonical与www301已在后续本轮修复并验证。源码推送、部署、完整游玩、允许索引与Google收录不得混写。

三批原未跟踪研究继续原位保留，不混入本次提交；旧122词池及修改版Excel等既有备份保留。14条Acceleration City旧raw引用在本机缺失，原研究已标注，未伪造复核。

原管理清理授权随后已明确扩展到上述两游戏的发布和已有域名绑定；Cluster Rush 后续已由用户自行接通online域名；用户还明确授权五个新项目Vercel部署。六项目候选域名仅调研，购买未授权；定时任务不在范围。后续研究仍由用户手动发起，按KEYWORD_WORKFLOW执行。下一次会话以实际git status、远端main和正式站点记录为准。
