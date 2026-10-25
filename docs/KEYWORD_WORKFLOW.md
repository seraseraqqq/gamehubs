# 下一轮挖词：执行与回填约定

本页是用户手动发起研究时的执行约定和可复制指令。它不创建定时任务、挖词按钮或新的付费服务。本次仓库收尾只保存约定，没有运行新研究。

## 固定口径与顺序

1. **Google Trends发现需求。** 沿用美国、英文、Web Search。先保存种子、相关/飙升查询和过去12个月曲线；必要时再补90天或5年。记录原词、时间窗口、采集时间和来源。归一化指数不是月搜量；不同图的绝对指数不能直接比较。失败/无数据保留错误和unknown，不写成0。
2. **真实Google SERP核对。** 用浏览器逐词查看美国英文参数下的Google结果，沿用`gl=us`、`hl=en`、`pws=0`。记录实际可见自然结果、位置、URL、页面形态和具体游戏版本；广告/视频/AI模块单列。参数不证明物理位置在美国；实际未见完整前十就如实记录，不能用镜像SERP冒充本次Google结果。
3. **补充指标优先使用免费Semrush镜像。** 使用站主提供的[镜像入口](https://sem.3ue.com/analytics/keywordoverview/)与现有登录会话；访问凭据不写入仓库。沿用US/en，记录Volume、KD、地区、采集日期及原始返回。站主自部署OpenSEO和DataForSEO也可作为补充来源，按docs/GAME_MANAGEMENT_RULES.md记录来源、凭据存储和付费调用授权范围；旧“禁止OpenSEO”约定已被本轮授权替代。未知不作0，不将模型指标当作实际Google SERP。
4. **综合可行性判断。** 结合搜索意图、真实版本、竞品已具备能力、可实现差异、来源/许可、数据/素材依赖和开发维护成本。Volume>10,000且KD<30只是严格指标标记，不是人工立项。原词、长尾和同义词可归簇，但不丢词、不叠加搜索量、不按每个变体重复建站。收入测算不回填本系统。
5. **全量落盘并生成查询数据。** 每轮使用日期＋设备＋UUID独立批次，保留合格、不合格、暂缓、未知、失败结果。证据先保存到`research/<date>-<batch-topic>/`，再导入data/batches；不得只保存短名单。更新必要的站点关联，人工决定保持独立，最后validate和generate。

历史117词及其完整证据是本轮去重和来源参考，不可将旧指标自动当成新采集。每个词用“原词＋国家＋语言”识别。跨设备使用Git手动同步；未获明确授权时不commit/push、部署、购买资源或联系他人。

## 交付和回填格式

- `batch.json`：日期、设备、市场、种子/竞品、执行状态、来源与缺口。
- `keywords.jsonl`：本轮全部观察，保留原词、国家/语言、各来源指标、qualification、clusterId、evidence、raw和错误/待补原因。格式见[使用说明](USAGE.md)。严格指标标记与研究推荐必须能从原始数值/理由追溯，不能等同人工批准。
- `research/`：保存本轮实际取得的Trends、Google结果、镜像/OpenSEO/API证据；逐来源标明市场、时间与缺项，不保存登录态、凭证、授权头或访问令牌。DataForSEO跨设备可用性采用GitHub Secrets/单独管理解密密钥的密文方案，禁止明文入库；见[凭据规则](GAME_MANAGEMENT_RULES.md#跨设备凭据)。
- AI追加审核时使用actorType=ai、当前expectedHeads和包含该词的basedOnBatches。人工批准/放弃不可被新的AI观察覆盖。未明确批准建设，不自动创建站点或仓库。
- 通过现有命令导入和汇总，不改写历史批次：

```sh
python3 scripts/hub.py import /path/to/batch.json /path/to/keywords.jsonl
python3 scripts/hub.py validate
python3 scripts/hub.py generate
```

相同ID不同内容会拒绝覆盖；修正数据应使用新批次并引用原批次。单条坏行保留errors.jsonl，其余正常行照常入池。若校验报错，记录问题并修正可修部分，不把缺失结果改成通过。

## 可复制到Codex的手动预设指令

```text
请在GameHubs按README、AGENTS和docs/KEYWORD_WORKFLOW.md执行一轮新的游戏关键词研究。

市场为美国英文，范围/种子/竞品由我在本条指令末尾填写。先读取现有词池、117词研究、11项建站计划和站点源码登记，避免把已有项目和同意图变体重复计作新机会。

按Google Trends发现需求→真实Google SERP核对→补充指标（优先sem.3ue.com免费镜像，也可使用站主自部署OpenSEO和DataForSEO API）→综合可行性判断的顺序执行。按docs/GAME_MANAGEMENT_RULES.md管理来源、计费范围和跨设备凭据；缺失数据为未知，不伪造排名、趋势、数值或许可。各指标来源与真实Google观察分别保留市场、时间和证据。严格指标达标不等于人工立项，不做收入测算。

将实际取得的完整证据保存到research/下的新批次目录。以日期-设备-UUID保存全量批次，包括不合格、待复核、失败和未知结果，按词+国家+语言识别，归簇但保留原词。使用现有导入、校验、汇总命令，使结果进入本地管理页；AI结论使用actorType=ai，不能覆盖人工决定，不自动创建或开发新站点。

本轮只做研究和本地回填；不commit、push、部署、买域名、创建自动化或联系他人。结束时报告已查词数、资格分布、证据与缺项、导入数量和可查看入口，不只给短名单。

本轮范围/种子/竞品：由我填写。
```
