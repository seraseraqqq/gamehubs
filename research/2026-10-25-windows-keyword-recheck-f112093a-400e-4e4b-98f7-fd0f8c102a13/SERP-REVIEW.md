# 独立SERP与版本复核建议 · 2026-10-25

仅向主线提供独立意见，不修改 `serp-assessments.json` 或正式数据。[结构化建议](serp-review-suggestions.json) 保存逐词事实、来源、反证、假设及复测条件。Volume/KD/Trends/KGR硬门槛由主线负责，本复核不重算、不补造。

## 证据边界与建议

主线在用户完成人机验证后保存了真实普通Google搜索：duotrigordle可见7条自然结果、tradle8条、countryle7条；均 `queryVerified=true`、`completeTopTen=false`。这些是实际看到的自然标题链接，不是完整前十、美国物理位置证明或全市场竞争样本。此前被拦的 `google-serp-duotrigordle.json` 不作为普通SERP证据。

本子任务没有使用Chrome或共享Semrush，只读上述证据并公开读取其中出现的原站/替代页。公开HTTP能看到控件、说明或Practice链接，不等于已经实际玩通；JS占位、403或数据仍在加载也不等于游戏不可用。AITDK注入值不参与判断。Semrush缓存估值与本轮真实Google观察是不同证据。

| 词 | reasonable建议 | 确定性 | 关键支持 | 当前不能直接通过的原因 |
|---|---|---|---|---|
| duotrigordle | null（待判断） | medium | 原站之外存在多家匹配32盘/37猜的游戏入口，原站不是唯一可见页面 | 原站与现有替代页已有Practice/历史/统计等常见能力，尚无具体已验证差异 |
| tradle | null（待判断） | medium | 多个出口猜国游戏页在真实样本可见，并有独立实现界面 | 既有Unlimited/Practice已存在；原站功能及独立页贸易数据准确性/加载尚未实测 |
| countryle | null（待判断） | medium | 多个同意图地理猜国入口，包含不同规则实现 | 不同指标/同名变体需核对；原站能力未完整读取，常见存档/无限切口已有对手自述 |

这里的null不是REJECT，也不是断言市场不可做。medium仅指对本次有限证据和“还不足以作肯定/否定判断”的把握，不是排名成功概率。不能仅因独立域名、论坛或视频出现就判低竞争；也不能因有原站或许可未核实就自动判不可争。

## Duotrigordle

真实Google样本：[原站](https://duotrigordle.com/)、[duotrigordle.org](https://duotrigordle.org/)、Google Play、[Wordle Global](https://wordle.global/en/duotrigordle)、Reddit、[WordlePlay](https://wordleplay.com/duotrigordle)、YouTube。由 `raw/google-serp-duotrigordle-verified.json` 提供实际可见顺序；不把7条包装成前十比例，也不据第三方流量注入值推断强弱。

主线保存的 `primary-duotrigordle.json` 和 `primary-duotrigordle-practice.json` 已见原站Daily/Practice标签，以及Sequence、Jumble、Historic、Perfect Challenge、Stats、Leaderboard等入口。后一个快照虽然显示Practice为active，本子任务仍没有玩通该模式，不能额外保证它任意次数正常运行；但原站已有这些入口足以反驳“原站只有一天一题，增加Practice/历史就是空白”的说法。

公开读取的duotrigordle.org明确自述32词/37猜及可反复Practice，其说明又混入“四词/四棋盘”的措辞，存在文案准确性检查点；该矛盾不自动证明它排名弱。Wordle Global显示32盘与键盘，并提供Custom/friends链接；其“更快”、玩家数与语言数均为该站自述，本复核未采信为性能或需求事实。

潜在切口只能作为待验证假设：实测32盘在小屏幕上的导航/焦点障碍，或可解释的开局策略训练，比既有说明提供更清楚的反馈。必须先验证对手是否已经满足该任务、是否存在可复现缺陷及可实施改善；不能简单再做一个无差异的无限版。

实施/许可与SERP分开：原站链接的[作者GitHub仓库](https://github.com/thesilican/duotrigordle)当前README说明仓库主要用于问题追踪、项目处于维护状态；旧前端在main分支，现行后续开发因后端及广告转为闭源。这不证明SERP不可争，也不授权复制现版。旧前端具体license、词表、品牌和素材权利本次未核实。

## Tradle

真实Google样本见 `raw/google-serp-tradle.json`。结果包括[OEC原站](https://games.oec.world/en/tradle/)、[tradle.net](https://tradle.net/)、[tradle.world](https://tradle.world/)、Playlin、TripMemo、同名金融风险管理网站、Marketplace新闻及LikeWordle。金融公司tradle.io是混合意图反例，不能算成同款小游戏竞争者；新闻存在也不等于游戏页无法进入。

原站公开读取返回403，本复核只能结合真实Google片段确认它是OEC出口猜国家游戏，不能据此判断原站是否缺Practice或可玩性异常。tradle.net有国家输入、六次猜测说明及[Unlimited入口](https://tradle.net/unlimited/)；tradle.world有出口图区域、猜测输入及[Practice页面](https://tradle.world/unlimited.html)，明确自述可无限练习。公开文本能确认这些功能入口已经存在，不能声称“加无限版”是未被满足的差异。

数据证据仍欠：部分静态文本显示金额为0或图表Loading，未实际操作其图表/猜测循环，不能判断题库/数据加载是否正确，更不能推断它们故障。独立页自述使用真实出口统计，不等于本次已核实数据年份、HS/SITC分类、国家覆盖和授权。

可实施假设是来源/年份透明的经济教学、产品类目解释、错题复盘或限定地区训练，但是否构成切口要与现有原站和两家独立实现逐项比较。先验证数据口径及至少一轮Daily/Practice，再将具体支持或反证交给主线裁决；不是用许可未知来替代SERP判断。

## Countryle

真实Google样本见 `raw/google-serp-countryle.json`，包括[原站](https://countryle.com/)、[GeoWorldle](https://geoworldle.com/countryle)、TripMemo、[MapGuesser](https://mapguesser.fr/en/game/countryle)、原站X账号、LikeWordle和Food-le。原站之外确有多个游戏页，但仅这些事实不足以推出新站竞争容易。

GeoWorldle版公开说明以大陆、面积、温度、边界数、方向等指标提供反馈，并自述已经具备unlimited、统计、localStorage及导入导出。MapGuesser同名页则列人口、面积、GDP、大陆提示，以及Daily Challenge与排行榜。这是同一大类意图下的规则变体，不能把各站字段拼成“原版Countryle必有的规则”，也不能拿一种变体的内容冒充用户所找的另一种。

原站HTTP只见iframe；本复核继续读取其iframe的index.html仅获取到推广文字，不能凭静态抓取推断原站停服、改成商店或不可玩，真实浏览器需要另核。TripMemo公开读取失败，其Google片段不能当完整功能清单。

可供后续检验的假设：数据年份可追溯的提示解释、地区限定、可配置线索或可访问性改进。现有对手已经自述无限模式与存档迁移，所以这些不能不经比较就当创新。应先实际玩原站和至少一种变体，确认国家/地区范围、日期/统计口径与玩家期望，再决定具体入口合理性。

## 主线裁决建议

保留三词的匹配需求支持和上述反证，不因未验证具体差异就直接市场REJECT，也不为交付凑reasonable=true。真实可见7/8条可以形成部分盘面证据，但必须带覆盖范围。若主线已有额外玩法/用户任务/实现能力证据，可独立作最终判断，并记录为何采纳或不采纳本建议。

只有在确认同意图版本、现有能力、一个可实施且未被充分满足的具体任务后，才把reasonable从null改成有理由的true；若实测证明当前提案无法满足意图或其所谓差异完全不存在，可对该提案作false。任一结论都不代替建设批准、许可核验、源码获取或发布授权。
