# 本地关键词与站群管理

## 启动

从 GameHubs 仓库根目录运行，要求 Python 3.10+，无需安装依赖：

```sh
python3 scripts/hub.py serve --port 4310
```

打开 <http://127.0.0.1:4310/>。服务仅监听本机，Ctrl+C 停止。端口被占用时换一个端口；重启服务后刷新页面。本程序不执行 Git、部署、域名购买、付费研究或自动化。

## 三个入口

| 入口 | 日常操作 |
|---|---|
| 关键词池 | 搜索关键词、站点或页面；按观察中/已放弃/开发中/已上线及站点关联筛选；按研究批次时间、Volume、KD、intitle 数、竞争度/Volume 升降序排列；详情手动编辑指标与关键词状态、查看所属批次 |
| 建站清单 | 查看11项历史方案及当前项目进度、阻塞；另列后续人工决定，点击查看研究、关联站点或登记新项目 |
| 网站目录 | 按建站日期、主关键词研究批次时间及上述指标升降序排列；详情直接编辑 URL、GitHub 仓库、目录/分支、建站日期、阶段与指标，并保存历史 |

排序缺失值始终在最后；Volume 为 0 或缺失时，竞争度/Volume 显示未知。intitle 指 `intitle:"关键词"` 的结果数，不用 allintitle 或广告竞争度代替。当前原始研究未采集 intitle，显示未知，可手动补录。研究批次时间取最近 `kind=research` 的日期（未指定 kind 的普通导入也视作研究），项目登记/方案/处置快照不改变该排序日期。站点没有明确建站日期时保留未知，可在详情补录；不拿导入、核验或部署时间代替。

关键词详情点击“保存关键词”会追加 `kind=keyword_edit` 的 human 事件至 `data/reviews/`，不改写原始批次。指标留空保存为 null（未知），0 是有效值；手动修订优先于后续研究导入。关键词状态默认跟随关联站点和人工建站决定，也可手动指定四种状态，选择“跟随建站进度”可恢复自动状态。此状态不更改部署、游玩或索引验收。传统审核保留在折叠历史及勾选后的批量工具中，指标编辑不会替代审核决定。

目录指标使用第一条 primary 映射（没有 primary 时取首条）。已入关键词池的主词与词池共用同一指标，目录编辑也追加到该词历史；未入池的登记主词指标保存在对应 `keywordMappings[].metrics`，不混入词池。站点字段和关键词指标分别保存；指标表单不会提交上方尚未保存的站点字段。所有手动修订均有并发保护，过期页面拒绝覆盖。合并后出现指标修订分支冲突时，该指标显示未知，重新读取并保存该词可合并当前分支。

勾选不会因为搜索或翻页而自动清空，保存前检查“已选”数量。“取消选择”清空。审核原因必填。选择时记住的是当时的审核版本，刷新页面后仍用旧选择提交可能产生冲突，系统会提示保留双方记录。详情可查看研究摘要、指标原始快照、计划、处置、历史审核与站点/页面关联。

“导出 CSV”导出所有匹配结果，不只当前页。格式是**带 UTF-8 BOM 的 CSV，Excel 可直接打开**，不是 xlsx。保留原始观察 JSON，未知值保留 null；以公式起始符开头的文本加单引号。下载不修改数据。

## 本次主数据口径

- 主研究：`research/2026-10-24-keyword-opportunities/keyword-ledger.json`，117原词、US/en、99词簇；完整证据在原 research 目录保留。
- 严格指标达标17项是 Volume >10,000 且 KD <30，**不等于17个人工批准项目**。
- 研究资格“合格”对应原研究9个“优先验证/小试假设”；2个明确排除词标不合格，106个其他结果待复核。这些都不是新的人工决定。
- 11项方案来自 `research/2026-10-24-game-build-plan/plan.json`；其余106词处置全部保留，没有丢掉未立项词。
- 当前5个来源批次、244条观察 = 117条研究＋11条方案＋106条处置＋5条初始项目登记＋5条2026-10-25源码版本更新。它们是1轮研究及其后续计划/项目快照，不能算成5轮独立市场研究。
- 17个站点/项目 = 12个既有游戏＋Cutle、Poople、Colordle、Metazooa、Travle 5个新项目。5个本地MVP待验收/待发布，未计作上线。五个独立仓库主分支SHA已在本机只读核对一致，完整实现已推送；这仍不代表已部署。
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
