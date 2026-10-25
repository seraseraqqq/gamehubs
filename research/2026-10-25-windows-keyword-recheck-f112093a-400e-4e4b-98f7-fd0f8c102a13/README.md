# 150词补采与确定性分级 · 2026-10-25

用户明确要求继续使用其免费Semrush入口补充数据，并愿协助人机验证。本轮恢复已有批量结果、查询其余缺项，并补齐必要的Google标题数、趋势和SERP。**免费镜像可用；上一轮大量未知主要是查询中断和未完成，并非镜像整体不可用。**

## 本轮结果

| 项目 | 补采前 | 补采后 |
|---|---:|---:|
| 新150词中Volume/KD都有值 | 57 | 120 |
| 新150词Volume/KD已查询尝试 | 60 | 150 |
| 通过Volume>3000、KD<=30 | 18 | 33 |
| 上述33词的有效intitle/KGR | 不完整 | 33/33 |
| 新150词Trends已尝试 | 100 | 150 |
| 有效Trends曲线 | 88 | 149 |
| 通过量/KD/趋势/KGR后普通Google SERP实勘 | 0 | 6 |
| 完成全部本轮门槛的研究候选 | 0 | 3 |

全池290词中Volume/KD仍有缺项的词从100降至37：其中30个来自本次150词、7个为既有历史词。现存缺项都已查询过；免费镜像显示无缓存，现有1000额度内的一次批量刷新返回 `Something went wrong`，不是等待用户点击的验证码，也不代表搜索量为0。证据：[缺项范围](metric-missing-scope.json)、[59词结果](raw/semrush-missing-59-us.json)、[刷新错误](raw/semrush-refresh-failure.json)、[已提前写回的100条指标观察](metrics-writeback.json)。未直接调用付费API或扩展计费范围。

## 当前推荐分档

| 档位 | 关键词 | US月量 | KD | intitle页数 | KGR | 确定性 |
|---|---|---:|---:|---:|---:|---|
| A | duotrigordle | 49500 | 24 | 4150 | 0.08384 | 中 |
| B | tradle | 49500 | 30 | 1060 | 0.02141 | 中 |
| B | ragdoll drop | 3600 | 14 | 523 | 0.14528 | 中 |

三词均有本轮条件下明确的近期上升曲线、过线量/KD/KGR，以及普通Google与实际页面核对。**研究推荐不代表已验证排名结果、产品差异、源码可复用、许可或建设批准。** 所有阈值/理由在 [criteria.json](criteria.json)、[逐词结果](results.json)、[主线SERP裁决](serp-assessments.json) 中可查。

本轮无S档。`phoodle` 和 `dordle` 虽满足最优档数值，但近期趋势没有同时通过上升判据；不因量大/KD低而强行入选。`countryle`、`actorle`、`orbit kick` 已通过量/KD/趋势/KGR，但版本一致性、品牌主导或拥挤竞争入口仍有关键疑点，继续PENDING。最终150词为 **A1/B2/未达标117/待验证30**；S、C均为0。

## “合理SERP”的判断边界

真实Google分别取得Duotrigordle 7条、Tradle 8条、Countryle 7条、Orbit Kick 10条、Actorle 7条、Ragdoll Drop 7条可见自然结果；不足十条的按实际数量保留。Google参数US/en/pws=0不证明物理美国位置。

- Duotrigordle：原站之外有.org、Wordle Global、WordlePlay等同意图入口。Chrome已核对原站Daily/Practice/Sequence/Jumble及.org版32面板、37次猜词和键盘。主线判为中等可争取的关键词入口，A档/中确定性。原站已有多模式，不把“增加unlimited”当空白；现版源码不能假设开源。
- Tradle：OEC原站与多个可玩网页并存，已核对原站国家输入及tradle.world出口品类、6次猜测、Daily/Practice。KD30在门槛边缘，又有同名金融软件结果，列B档；49,500是整个关键词量，不全部归给游戏。出口数据正确性/年份/许可及产品差异另验。
- Ragdoll Drop：Google有专门游戏域、Poki和应用商店。Poki页面及.io页明确物理抛掷、陷阱/伤害计分玩法，列低量B档。首位.com有Cloudflare ASN访问限制，未绕过；依据可用独立发布平台和.io核对大类玩法，未声称完整游玩通过。Poki自动中文化页面的玩法观察与US/en搜索数据分开。
- Countryle：同名页面提示指标不同、原站为iframe，目标版本未统一；Actorle原站/姐妹站/原作App占据前排，未证实独立切口；Orbit Kick前十几乎都是专门游戏页面、竞争较密，未证明具体差异切口。三者保持待验证。

[独立审查](SERP-REVIEW.md) 对Duotrigordle/Tradle/Countryle建议SERP切口保留null，主要理由是产品差异尚未证明。主线没有删除该意见；对前两词的不同判断与理由完整保留在serp-assessments.json：本轮用户门槛是关键词SERP竞争合理性，按真实搜索中的可比游戏入口、实际页面及KD判断“中等可争取”，并不宣布新产品需求、建设或排名能力已验证。原站和现有对手功能完善的反证全部保留，因此不标高确定性。

免费镜像的Duotrigordle SERP快照与当前Google差异明显，[镜像快照](raw/semrush-overview-duotrigordle.json)不用于冒充本次Google盘面或证明竞争页面弱。Volume/KD仍注明是用户镜像估值、非官方独立核验。

## 数据完整性与未知原因

1. 关键词身份和全部历史批次保留。补充指标先追加独立100行批次，完整分级再追加150行新研究观察，不修改原150词批次，也不改人工决定或17站状态。
2. KGR严格沿用用户指定的 `intitle:"原词" / US月Volume`，不以allintitle对照替代。Google操作符被忽略的异常结果不采纳。旧Escape Road 3的6320记录含 `Missing: intitle:`；本轮改正格式并验证后取得771，旧证据保留但不再用于当前门槛。
3. Trends逐词保留原始数据和采集日期，旧曲线复用注明原日期，最后周保守排除，归一化指数不折成月量。Unlockle独立查询明确显示样本不足，保持未知；[原始说明](raw/trends-43-ready.json)。其余149词取得曲线。低刻度候选另做隔离查询，不把组内0当零需求。
4. 33个通过量/KD的词均已补标题页数；其余词已因量/KD未过线或数值不可用，不再额外消耗Google标题查询。词池区分“暂无数据”（实际来源无值）、“未采集”（未进入该阶段）与默认未知，悬浮说明可查原因。空值从未记成0或通过。
5. Google人机验证发生一次，用户明确完成后恢复读取；没有代理解验证码。其后SERP/标题查询已完成本轮范围，没有把验证码阻塞保留成空白结果。
6. 综合判读时间固定在assessment-context.json；各指标/曲线内部仍保留真实来源日期，避免把复用证据写成刚采集。重复导入同一批次必须字节一致。

## 沉淀的脚本

- [mine-keywords-cua.mjs](../../scripts/mine-keywords-cua.mjs)：真实Chrome的Trends、intitle/SERP及公共游戏页参数化采集，含操作符忽略检查、错误保留；本轮用33词标题与补采趋势真实验证。
- [finalize-keyword-mining.py](../../scripts/finalize-keyword-mining.py)：支持 `--base`读取原批次证据，配合显式SERP裁决生成新批次；不查询服务、不补造数据、不写人工review。
- 本轮命令：`python3 scripts/finalize-keyword-mining.py --research research/2026-10-25-windows-keyword-recheck-f112093a-400e-4e4b-98f7-fd0f8c102a13 --base research/2026-10-25-windows-keyword-mining-58163185-bd51-4b3a-9d54-6cd2795556a5 --import`。

后续如重新评估，应先复查真实SERP和候选当前曲线，并解决具体版本、许可、数据依赖与差异方案；本轮没有commit/push、游戏部署、购买或自动化。

## 写回与验收

两项独立追加批次分别接受100和150条、拒绝0条；当前290词/800观察/12批/17站、0审核事件。validate/generate均0错误；27项管理回归与JS检查通过；原样重复导入返回unchanged。运行中API已读回150条本批记录及A1/B2/117/30分级，CSV主KGR和等级通过，未知不当0、原人工决定不变。[最终验证](final-verification.json)。真实Chrome已刷新并按研究分级降序，首行A档及两行B档数值/原因、缺项标签均已核对。[关键词池截图](keyword-pool-verified.png)。本轮创建的搜索/趋势/游戏研究标签页已关闭，用户原有Semrush页保持。
