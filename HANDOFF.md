# GameHubs 当前接力

更新：2026-10-25。GameHubs现为站群管理仓库，根目录采用dashboard/data/generated/scripts/docs/research/deployments，不再保留management/或games/。用户已在查看分仓验收和删除影响后明确授权清理游戏副本并将管理仓库推送GitHub。

工作台简化与手动编辑（2026-10-25，完成，已获准GitHub交付）：保留关键词池/建站清单/网站目录三个入口，批次移入关键词详情；移除标语、重复解释、市场/资格等日常筛选。关键词和目录支持研究批次日期、Volume/KD/intitle/比值升降序，目录另支持真实建站日期；缺失始终最后。支持四种关键词状态、URL/仓库/目录/分支/建站日期与指标编辑。池内主词指标共用追加修订事件，池外登记词不混入主池；只改状态不冻结原指标。站点保存先完成回读再关闭，避免重排时点到其他行。23项Python回归、Node排序/筛选/增量修订检查及隔离Chrome保存/刷新/关联指标验证通过；1440×900和390×844截图无页面溢出。验证时本机数据为127词/254观察/6批/17站、0审核事件、0校验错误；测试决定未写入正式数据。4310本地服务已正常重启并加载最新接口；CLI generate已同步。使用规则见docs/USAGE.md，验收记录见docs/history/dashboard-refresh-2026-10-25.json。工作台改造验收时尚未采集intitle，后续采集见下文；未明确的建站日期仍为未知；未执行游戏发布。此前工作台交付只纳入工作台及读取/保存依赖修复；本次数据补录另见下文。其他会话研究批次和部署台账保留本地，生成视图以本次提交的正式数据重建。

## intitle数据补采 · 2026-10-25

现有117个US/en关键词已逐词读取Google `intitle:"原词"` 的Tools结果数并追加独立研究批次，117条均取得明确数值。数量是匹配页面估值，不是去重网站数；gl=us/hl=en/pws=0不证明物理美国位置。Volume/KD、研究资格、人工状态/决定和站点记录未改；[117词intitle补采与证据](research/2026-10-25-mac-intitle-e22912c8df39/README.md)。本轮采集没有部署或创建定时任务；数据和证据纳入用户随后明确授权的GitHub交付。

## 网站目录与词池一致性 · 2026-10-25

12个旧站主词已以US/en独立批次补录并关联，现在17站的主词均通过keywordId读取词池，同一入口编辑会共同生效。Volume/KD按用户截图读取，intitle使用本轮已取得的12条证据；保留原117词批次与指标，不自动合并旧122词池。截图缺少gulper.io game的KD及krillion unlimited的Volume/KD，三项保持未知。旧登记明确的11个createdAt已恢复，其他6站仍未记录；导入器已修复日期遗漏。兼容视图的主词指标/日期也由正式来源生成，避免旧快照继续显示过时值。[完整核对](research/2026-10-25-mac-site-keyword-consistency-004351b6cfaf/README.md)。本轮修复未部署或修改发布holds；用户随后明确授权将新数据与修复推送GitHub。

指标名称更正：intitle为标题匹配页面估算数，并非独立竞品网站数；原“竞争度/Volume”现标为“标题页数/Volume”，只是自定义粗筛比值，不代表排名难度或成功率。原数值与公式未改。

## 当前资产

- 117个US/en研究词、99词簇；17项严格指标达标不等于人工批准。11项建站方案、106词处置和原始证据保留。
- 129词＝117词原研究＋12个旧站主词专项补录；7个来源批次、373条观察，人工审核事件仍为0；研究、人工决定、项目阶段和发布验收分开记录。
- 17个项目均有独立源码仓库。12个既有游戏中10个已有线上部署，另外2个受许可等条件限制；Cutle等5个新项目源码已推送但尚未部署。
- 10站在2026-10-25完成原Vercel项目Git源切换、预览和正式READY验收；域名、环境配置和访问保护一致，7站index、3站noindex。随后只清理管理仓库，没有再次部署游戏。

## 接手入口

[自动摘要](INDEX.md) · [使用与数据维护](docs/USAGE.md) · [手动研究工作流](docs/KEYWORD_WORKFLOW.md) · [唯一源码](docs/REPOSITORIES.md) · [部署状态](docs/DEPLOYMENT_STATUS.md) · [分仓验收](deployments/2026-10-25-independent-repositories.md) · [本次清理记录](docs/history/2026-10-25-management-only-cleanup.json)。

正式维护入口为data/batches、data/reviews、data/sites。INDEX.md、generated/和两份兼容JSON由generate生成。开发前读取站点source.repository + directory + branch，再在当前设备定位或克隆独立仓库；另一设备E盘或localhost只作历史记录。

管理页启动：`python3 scripts/hub.py serve --port 4310`，打开 <http://127.0.0.1:4310/>。本次保留既有功能，没有增加挖词按钮、自动化或收入预测。

## 游戏副本与工具

原games/全部文件（含未跟踪配置、构建产物和旧别名残留）已校验哈希并移入仓库外备份，位置见清理记录。旧代码也保留在Git提交dc5994e61228e028c068137a5d69bce08b172fd0中。source.frozenSnapshots已清空；source.archivedSnapshots记录原仓库、目录、提交和移除时间，不是可用本地路径。

旧portfolio SEO检查、分仓准备和共享Ignored Build Step三项工具已退役。游戏构建/验收在各自仓库执行；仍保留的五游戏QA工具使用独立兄弟检出，需要先在本机启动相应预览。

## 边界与待办

Acceleration City继续等待嵌入许可，Cluster Rush继续等待许可及域名，Snow Rider在正式域名完整游玩验收前保持noindex；Coreball和Minute Cryptic仍等待独立域名验收。Head Soccer的canonical一致性另待修复。源码推送、部署、完整游玩、允许索引与Google收录不得混写。

三批原未跟踪研究继续原位保留，不混入本次提交；旧122词池及修改版Excel等既有备份保留。14条Acceleration City旧raw引用在本机缺失，原研究已标注，未伪造复核。

本次授权涵盖管理清理及GitHub推送，不扩展到新游戏、购买、其他游戏发布或定时任务。后续研究仍由用户手动发起，按KEYWORD_WORKFLOW执行。下一次会话以实际git status、远端main和正式站点记录为准，不沿用历史收尾文件中的“待推送”描述。
