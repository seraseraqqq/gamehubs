# 本地关键词与站群管理

## 现行选词口径（2026-10-29）

站主指定[附件SOP](KEYWORD_SELECTION_SOP_SOURCE.md)为主，[KEYWORD_WORKFLOW](KEYWORD_WORKFLOW.md)为执行口径：老词／竞品词为主，指标初筛后看真实SERP，最后确认趋势持续性和建站条件。初筛Volume≥15,000、KD≤25；主候选Volume≥15,000、KD≤20，优先Volume≥20,000、KD≤18；KD21–22条件候选、23–25观察。KGR保持原公式与显示，仅作辅助；稳定需求不要求上涨。搜索机会、游玩意图、许可／实施和具体改善均需证据，研究通过不替代人工立项。

当前290词／800观察／12批／17站未因本次文档更新重新分级。看板旧资格、S/A/B/C及下方历史门槛按所示批次解释，不能视为已通过新标准；下一轮复评追加批次、注明SOP版本与criteria，不改旧记录或自动停站。原11项方案不再是默认新开发队列。

## 启动

从 GameHubs 仓库根目录运行，要求 Python 3.10+，无需安装依赖：

```sh
python3 scripts/hub.py serve --port 4310
```

打开 <http://127.0.0.1:4310/>。服务仅监听本机，Ctrl+C 停止。端口被占用时换一个端口；重启服务后刷新页面。本程序不执行 Git、部署、域名购买、付费研究或自动化。

## 三个入口

| 入口 | 日常操作 |
|---|---|
| 关键词池 | 搜索关键词、站点或页面；按观察中/已放弃/开发中/已上线及站点关联筛选；按研究批次时间、Volume、KD、intitle/allintitle 数、KGR、allintitle对照比值和研究分级升降序排列；查看分级/确定性，详情手动编辑指标与关键词状态、查看所属批次 |
| 建站清单 | 查看11项历史方案及当前项目进度、阻塞；另列后续人工决定，点击查看研究、关联站点或登记新项目 |
| 网站目录 | 按建站日期、主关键词研究批次时间及上述指标升降序排列；详情直接编辑 URL、GitHub 仓库、目录/分支、建站日期、阶段与指标，并保存历史 |

**本工作台主KGR = `intitle:"关键词"` 精确短语标题匹配页数 / 同市场月搜索量**，沿用用户已明确指定的口径，底层兼容键仍为 `metrics.ratio`。表格主列、KGR排序、详情主值及CSV主KGR均使用这一公式；缺失或Volume为0时为未知，不能以0代替。数量是Google页面估值，不是去重竞品数，也不保证排名。

`allintitle` 与 `intitle` 独立保存，不相互代填。`metrics.allintitle` 和 `metrics.kgr=allintitle/volume` 仅作为另一口径的对照；详情及CSV分别标为“allintitle KGR（对照）”，排序也单列，不替代用户本轮KGR门槛。详情保留采集来源中的真实查询式及queryMode；例如带引号的allintitle精确短语查询，不能声称是任意词序的查询。原始观察和来源均保留。

排序缺失值始终在最后。原始117词研究未采集 intitle；2026-10-25已追加Google浏览器补采批次，完整查询及原始证据见[补采记录](../research/2026-10-25-mac-intitle-e22912c8df39/README.md)。研究批次时间取最近 `kind=research` 的日期，项目登记/方案/处置快照不改变排序日期。站点未明确记录建站日期时保留未知，不拿导入、核验或部署时间代替。

新研究可用 `raw.metricAvailability` 逐字段说明缺项。词池将实际查询但来源无值显示为“暂无数据”，未进入采集阶段显示为“未采集”，其余缺项仍为“未知”；悬浮可看具体原因。它们的底层值均为null，排序仍在末尾，不能当0或通过。未采集可能是该词已被搜索量/KD排除，无需继续消耗标题查询，并不代表整轮研究没有执行。

研究分级与确定性来自研究观察的 `raw.assessment`（tier、certainty、reasons，可附criteria），池中独立显示为一列。采用最近一条有分级的研究观察，并保留分级批次与原因；未分级显示“未分级”。S/A/B/C与待验证/未达标是研究结论，不会覆盖人工审核、建站决定或发布状态。后续无分级的指标补录、项目登记不会抹去上一轮分级；分级不随手动指标修改自动重新认证，应按所示批次核对证据。CSV分别导出主KGR（intitle/Volume）、allintitle页数与对照KGR、主KGR口径、分级、确定性与分级批次。

关键词详情点击“保存关键词”会追加 `kind=keyword_edit` 的 human 事件至 `data/reviews/`，不改写原始批次。指标留空保存为 null（未知），0 是有效值；手动修订优先于后续研究导入。关键词状态默认跟随关联站点和人工建站决定，也可手动指定四种状态，选择“跟随建站进度”可恢复自动状态。此状态不更改部署、游玩或索引验收。传统审核保留在折叠历史及勾选后的批量工具中，指标编辑不会替代审核决定。

目录指标使用第一条 primary 映射（没有 primary 时取首条）。当前17站主词已全部进入同一词池；缺失表示来源未给值，不能以相近词或0代替。11站建站日期按旧登记的createdAt恢复，其余6站显示未记录，不从研究/部署时间推测。已入关键词池的主词与词池共用同一指标，目录编辑也追加到该词历史；未入池的登记主词指标保存在对应 `keywordMappings[].metrics`，不混入词池。站点字段和关键词指标分别保存；指标表单不会提交上方尚未保存的站点字段。所有手动修订均有并发保护，过期页面拒绝覆盖。合并后出现指标修订分支冲突时，该指标显示未知，重新读取并保存该词可合并当前分支。

勾选不会因为搜索或翻页而自动清空，保存前检查“已选”数量。“取消选择”清空。审核原因必填。选择时记住的是当时的审核版本，刷新页面后仍用旧选择提交可能产生冲突，系统会提示保留双方记录。详情可查看研究摘要、指标原始快照、计划、处置、历史审核与站点/页面关联。

“导出 CSV”导出所有匹配结果，不只当前页。格式是**带 UTF-8 BOM 的 CSV，Excel 可直接打开**，不是 xlsx。保留原始观察 JSON，未知值保留 null；以公式起始符开头的文本加单引号。下载不修改数据。

## 本次主数据口径

- 主研究：`research/2026-10-24-keyword-opportunities/keyword-ledger.json`，117原词、US/en、99词簇；完整证据在原 research 目录保留。
- 原117词研究的严格指标达标17项使用当时Volume>10,000、KD<30，**不等于17个人工批准项目，也不是2026-10-29后的默认选词门槛**。
- 原117词批次的研究资格“合格”对应9个“优先验证/小试假设”；2个明确排除词标不合格，106个其他结果待复核。后续独立批次按各自criteria记录研究资格与分级，不自动套用原阈值；这些都不是人工建设决定。
- 11项方案来自 `research/2026-10-24-game-build-plan/plan.json`；其余106词处置全部保留，没有丢掉未立项词。
- 历史139词快照＝117词原研究＋12个已登记旧站主词专项补录＋10个本机截图鱼类研究词；当时8批、383条观察 = 117条原始研究＋11条方案＋106条处置＋5条初始项目登记＋5条源码版本更新＋117条Google intitle补采＋12条旧站主词指标补录＋10条截图鱼类研究。后续纠正Gulper身份并新增150词，当前290词／800观察／12批，以正式批次和生成索引为准。鱼类独立研究及原批次均保留，不是将旧122身份池自动混入，也不是新增人工立项。
- 17个站点/项目 = 12个既有游戏＋Cutle、Poople、Colordle、Metazooa、Travle 5个新项目。五个新项目及另外两站已按后续明确授权完成Vercel部署，目前17站均有部署；完整外部玩法/索引验收仍分别保留，详见正式站点记录。
- 旧本地17批/191观察/122身份未混入主池。原型代码、数据和修改版Excel保存在工作区外的可恢复备份，位置见本轮交付说明。已有三批未跟踪 research 资料继续原位保留。

初始导入不伪造人工审核，正式 `data/reviews/` 起初没有审核JSON。历史状态均保留来源时间，`verification.recheckedAt=null` 表示没有在本轮重新进行线上实测。

## 唯一维护入口

| 路径（相对仓库根） | 用途 |
|---|---|
| `data/batches/<id>/batch.json`、`keywords.jsonl` | 独立追加每批全部观察及证据；错误行保存到 errors.jsonl |
| `data/reviews/<uuid>.json` | 不可变审核事件，记录人工/AI角色、原因、所据批次与父版本 |
| `data/sites/<id>.json` | 唯一可维护的站点登记，含源码、地址、关键词/页面、阶段、阻塞和历史 |
| `data/schemas/` | 校验规则 |
| `data/migration/source-*.json` | 按版本保留的远端原始登记快照，不继续手填；registry-sources.json指向当前兼容模板 |
| `generated/hub.json`、`INDEX.md` | 可重建的关键词池/查询索引与摘要 |
| `data/repositories.json`、`matrix-sites.json` | 为现有工具生成的兼容视图，不再手填 |

兼容视图保留现有12游戏与plannedGames分组和旧工具所需字段；源码、地址、页面映射与当前管理阶段从正式站点记录生成。游戏路径相对各自独立仓库，兼容表pathScope明确该范围，不相对GameHubs。source.frozenSnapshots仅登记仍存在的副本，当前为空；source.archivedSnapshots保留已移除目录的仓库/提交/时间，不能用作本地路径。实际开发源码以 `sites/*.json` 的 source 为准。旧字段的发布记录属于历史信息，新增 `managementRecord` 指向当前记录。旧登记脚本发现兼容视图会拒绝覆盖，避免把新进度回填成旧“文档阶段”。

一个站可关联多个词和页面，一个词也可关联多个站/页面。站点中的旧主词或尚未独立研究的SEO长尾可以保留为 `poolLinked:false` 的站点登记信息，不因此混入117词主池。后续真的采集这些词时再正常导入。不要把主词指标复制给长尾。

身份按 NFKC、大小写和空格规范化后的**词＋国家＋语言**计算，原始拼写保留。US/en 与 GB/en 分开，未知市场不猜成US。近义词可通过 clusterId 归簇，原词和各自证据不丢、不叠加搜索量。

`qualification` 为研究筛选；人工 `state` 为认可/不认可/暂缓；人工 `decision` 为 build/defer/abandon/unset。AI只保留建议，不会替代人工决定。建设阶段与部署、实际游玩验收、允许索引分别表达。HTTP200不是完整游玩通过，也不等于被搜索引擎收录。

## 导入未来批次

每轮使用日期＋设备名＋UUID的独立ID，避免不同设备覆盖。保存全量结果，包括不合格、失败与未知。设备或市场缺失时明确填 unknown。

`batch.json`：

```json
{
  "schemaVersion": 1,
  "id": "2026-10-25-mac-a-example",
  "date": "2026-10-25",
  "device": "mac-a",
  "market": {"country":"US","language":"en"},
  "status": "partial",
  "seeds": ["example game"],
  "competitors": [],
  "sources": [{"path":"research/example/evidence.json","note":"真实证据"}],
  "notes": ["趋势请求失败，缺失不能当零"]
}
```

`keywords.jsonl`，每行一个JSON：

```jsonl
{"schemaVersion":1,"term":"example game","qualification":"needs_review","metrics":{"provider":{"volume":null,"kd":null}},"evidence":[{"path":"research/example/evidence.json","note":"待补证据"}]}
{"schemaVersion":1,"term":"example game download","qualification":"rejected","metrics":{},"evidence":[{"path":"research/example/evidence.json","note":"下载意图不符合本轮范围"}],"raw":{"reason":"intent mismatch"}}
```

每行可覆盖country/language，keywordId、batchId和观察id由导入器补齐。坏行保存原始内容和原因，其余正常行照常导入。修正时使用新批次引用旧批次；不改写历史。

```sh
python3 scripts/hub.py import /path/to/batch.json /path/to/keywords.jsonl
python3 scripts/hub.py validate
python3 scripts/hub.py generate
```

相同ID＋相同输入重复导入保持不变；相同ID＋不同输入拒绝覆盖。无结果的失败轮次也可以保存空批次并明确status=failed。`import_portfolio.py` 是本轮远端资料的初始化导入器，可幂等重跑，不应被用作自动挖词或覆盖日常审核。

## AI查询与回填

```sh
python3 scripts/hub.py query "poople"
python3 scripts/hub.py query "cutle" --kind site
python3 scripts/hub.py export /path/to/keywords.csv
```

开发前读取站点source.repository、source.directory、branch和发布holds，再在当前设备定位或检出该唯一仓库。E盘目录与另一台机器localhost只作为历史来源，不能自动作为Mac可用路径/地址。

审核CLI为 `hub.py review request.json`，请求示例：

```json
{
  "actorType":"ai",
  "actor":"research-agent",
  "state":"hold",
  "decision":"defer",
  "reason":"新证据与旧结论有差异，需人工复核",
  "items":[{"keywordId":"查询返回的真实ID","expectedHeads":[],"basedOnBatches":["包含该词的真实批次ID"]}]
}
```

expectedHeads必须使用读取时返回的全部当前头节点，不能总写空。AI不得伪装human。`basedOnBatches` 必须包含该词。人工结论不会被后续AI建议、指标筛选或来源重新导入覆盖。

站点CLI为 `hub.py site request.json`，请求包含完整site、actor和expectedRevision。新增expectedRevision=null；已有记录通过管理页维护最方便。过期revision会拒绝覆盖，要求读取新版本。每次成功保存自动保留上一版内容于history。

## 并发、同步与恢复

本机文件锁串行写入，批次先写临时目录再发布，JSON原子替换。审核独立UUID追加，适合多设备通过Git合并。

两个会话从同一个旧版本审核时，后保存的记录作为冲突分支保留并提示。Git合并两个没有互相见过的审核文件也会检测多头。阅读双方历史后，以当前全部heads再审核即可合并分支。误审通过新审核修正，不删除旧事件。

站点同一ID在本机有revision保护；跨设备同时改同一站点时，Git文件冲突仍须人工保留双方history、sources和映射后合并，不能整文件丢弃一方。

跨设备开始前先检查git status并保护已有改动。每轮独立批次和审核，只选择本轮正式数据与必要证据；禁止无条件git add .把其他会话资料或凭证一起纳入。2026-10-25用户已明确授权本轮管理目录整理、游戏副本清理及GitHub推送；其他会话未跟踪研究仍单列保留，后续变更按实际授权提交。

generated/、INDEX.md和两份兼容视图都可在合并正式数据后重新generate；它们不是另一套手填真相。误改站点可从history恢复内容，再按当前revision保存。原始研究证据保留原位；工作区外备份用于恢复本轮更新前的本地版本。

## 验证

```sh
python3 scripts/hub.py validate
python3 scripts/hub.py generate
python3 -m unittest discover -s scripts -p test_hub.py -v
```

Schema校验执行本项目使用的type/required/properties/items/enum/pattern/minLength/additionalProperties子集，另检查身份、市场、日期、来源目录、映射和审核引用。无效行会报告，其他合法记录仍可读；validate非零表示需要处理。

本轮浏览器审核、并发、页面关联和站点编辑在隔离数据副本验证，正式词库不写入测试决定。迁移前工作台验收见docs/history/dashboard-validation-before-root-layout-2026-10-25.json，本轮目录和数据核对见generated/closeout-validation.json。收入预测不属于本系统功能。

历史批次保留原始证据路径；其中management/data/旧前缀对应当前data/，本地服务读取证据时兼容该前缀。原记录不为目录改名而重写。
