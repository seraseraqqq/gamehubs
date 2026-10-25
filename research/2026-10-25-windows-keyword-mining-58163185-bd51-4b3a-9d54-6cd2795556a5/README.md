# 游戏词挖掘 · 2026-10-25 · 未完成全部门槛验收

用户要求：US/en，月搜索量超过3000，Google Trends处于上升趋势，KD不超过30，KGR不超过0.25，真实Google SERP竞争合理；最优档另要求Volume超过10000、KD小于20、KGR小于0.2。最终进入关键词池。本轮没有建设、购买、发布或自动化授权。

**本轮没有已确认全部达标的词。** 浏览器查询中途超时，随后Computer Use安全检查无法可靠确认Windows当前页面URL，强制中止浏览器操作。停止后只整理本地已取得证据，不重试浏览器、不改权限或扩展。已经发现的150词均保留，49词有明确未过线证据，101词待验证；不能把后者称为101个合格机会。

## 实际覆盖

| 阶段 | 实际结果 |
|---|---:|
| 有公开平台/原作来源、未入原140词池的候选 | 150 |
| US过去12个月Trends尝试 | 100词 / 25组 |
| 取得有效时间序列 | 88词 / 22组 |
| Trends组未取得时间序列 | 12词 / 3组 |
| 尚未查询Trends | 50词 |
| 免费Semrush US批量查询并保存 | 60词 |
| Volume/KD均有实际值 | 57词 |
| Volume >3000 且 KD <=30 | 18词 |
| 本轮启发式确认近期上升 | 13词（不代表其余门槛通过） |
| 同时通过Volume/KD与明确上升 | 2词 |
| 取得主口径intitle页数 | 1词；未过KGR门槛 |
| 普通Google SERP竞争完整验收 | 0词 |
| 全部门槛已确认 / S、A、B、C推荐 | 0 |

逐词数值、趋势、缺项、未达标原因和公开来源见 [results.json](results.json)；机器汇总见 [coverage.json](coverage.json)。完整候选来源见 [candidates.json](candidates.json)，独立发现记录见 [公开源发现报告](../2026-10-25-keyword-mining-discovery/README.md)。失败和空值保留，不写成0。

## 口径与来源

- Volume/KD：用户免费镜像 `sem.3ue.com` US数据库，实际读取批量表所有行和Updated列。镜像显示估值，非官方独立核验；两份完整表在raw/semrush-bulk-01-us.json及02。第三批40词已经填入查询框，Analyze按键发生CDP超时，随后无法回读，**提交是否成功未知**，不重复提交、不回填臆测值。锚点gpts另取得5400/KD54，仅作当轮校准背景，不作为游戏新词入池。
- Trends：每组4候选+gpts，US、Web Search、过去12个月；保存原始DOM表格、URL、日期及相关查询。每组独立归一化，指数不折成月量。最后一周因DOM未暴露partial标记而保守排除，通常保留53个完整周。4周/8周环比和12周斜率是本轮透明启发式，不是Google官方定义；低分辨率、近期回撤和混合形状保留待验证，不硬判上涨。
- 真实Google：gl=us、hl=en、pws=0；不声称物理位置在美国。只接受Google Tools/#result-stats，不使用AITDK或Surfer注入指标。初始无引号allintitle及部分带引号查询出现 `Missing: allintitle:`，对应数值不采纳。少量有效allintitle只保存为额外对照。
- **本轮KGR沿用用户前文明确指定的 `intitle:"原词" / US月Volume`，不是allintitle版本**。根代理最初自行改用标准allintitle的假设已撤回，已向用户说明；看板主列、排序、CSV及分级采用用户口径，对照字段单独保留。Escape Road 3实际intitle6320 / Volume12100 = **0.522314…**，超过0.25；虽然其额外allintitle对照为1790，也绝不据此放行。
- [离线趋势分析](offline-analysis.json) 与 [版本/SERP补查说明](SERP-NOTES.md) 是较早52词快照及公开网页线索，不冒充本轮真实Google普通搜索前十。Ragdoll Playground等存在同名版本，Orbit Kick/Bucket Smash部分同名站描述不同玩法；授权、准确版本和实际可交付切口均待核实。

## 分级与确定性

完整规则见 [criteria.json](criteria.json)。最终S/A/B/C档均要求基础五门槛全部有证据通过，再按指标余量、趋势稳定性、SERP可争切口分级；人类建站决定仍独立。

- **S**：全部基础门槛通过，Volume >10000、KD <20、KGR <0.2，且不存在未解决的关键趋势/意图缺项。
- **A**：全部基础门槛通过，Volume >10000/KD <=25，或Volume >=5000/KD <20/KGR <0.2，具有明确可验证切口。
- **B**：其余全部基础门槛通过的词；**C**只用于全部基础门槛通过但有季节性/混合意图等需小规模验证的情况。
- **PENDING**：缺少任一必需证据；即使Volume/KD很好，也不列为S/A/B/C。**REJECT**：有明确数值或下降趋势触犯本轮门槛，只表示本轮研究未过线，不替用户作永久放弃决定。
- 确定性单列high/medium/low/unknown，是证据完整性和一致性，不是排名或收入概率。当前没有high或已确认推荐档。

目前优先补测的两词仅通过Volume/KD与近期上涨，**尚未通过KGR和SERP**：

| 待验证词 | US Volume | KD | 当前明确缺项 |
|---|---:|---:|---|
| rocket soccer derby | 14800 | 25 | intitle/KGR、普通Google SERP与实际版本切口 |
| plonky | 6600 | 25 | intitle/KGR、普通Google SERP与实际版本切口 |

## 关键词池交付与边界

独立日期/Windows/UUID研究批次包含全部150条观察，保存原词、同义簇、原始证据和 `raw.assessment`。看板新增研究分级/确定性和分级排序；详情可看原因及本轮门槛。原始研究、人类审核和17站发布状态不改。此批次status=partial，不将查询中断包装为完整研究完成。待用户之后继续时，从这两词的KGR/普通Google SERP开始，不能把旧快照当新验收。

已实际通过正式导入器接受150条、拒绝0条，当前290词/550观察/10批/17站、0审核事件。validate/generate均0错误，27项Python管理回归和JS语法检查通过。已验证未知不当通过、intitle与allintitle对照不互相替代、人类决定不变。本机4310服务已加载新代码，`/api/state`读回150条本批观察及49/101分级，CSV21列与主KGR列读回通过；[最终验证](final-verification.json)。因浏览器安全中止，本轮新增分级界面未完成真实Chrome视觉验收，不能将接口验证当视觉验收。没有commit/push。

## 沉淀的脚本

- [mine-keywords-cua.mjs](../../scripts/mine-keywords-cua.mjs)：参数化US/en Trends、Google intitle与allintitle对照采集，保存完整成功/未知/失败；本轮在真实Chrome验证25组趋势与查询。
- [finalize-keyword-mining.py](../../scripts/finalize-keyword-mining.py)：只消费本地证据、生成门槛/分级与独立批次；`--research <本目录>`生成，附 `--import`通过hub导入。脚本不查询服务，不把unknown当0，不写人类review。
- `hub.py validate`/`generate`与针对性管理回归用于正式写回检查；不运行无关游戏测试，不commit/push。
