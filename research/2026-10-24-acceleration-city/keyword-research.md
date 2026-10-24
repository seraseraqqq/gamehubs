# Acceleration City：关键词与需求证据

> 主代理随后补齐了真实Chrome的Trends同框数据与SERP观察；当前合并结论以[主报告](README.md)为准。本分报告中的“GT未采集”仅指该并行分支执行范围，绝对搜索量与GEO仍未知。

日期：2026-10-24（Asia/Shanghai）。默认市场：US，语言：English。范围：公开文本、官方资料与无登录 autocomplete；竞品截图、实机取证与域名注册可用性由主报告负责。

## 入口卡

| 字段 | 本轮结论 |
| --- | --- |
| 主词与任务 | `acceleration city`；寻找并游玩已有同名游戏，同时存在操作、CoBot 编程、Hour of Code、移动端适配的辅助任务。 |
| ① GT 趋势与量 | **未知**。普通 `python` 是 Windows Store stub；现有 `gt.py` 实为 `gt-browser.mjs` 的包装，必须通过 OpenCLI Chrome 取数。按本子任务不操作浏览器的约束未运行；没有 12m / gpts 有效读数，不能给月量、涨幅或低竞争结论。主任务如取得 GT 证据可覆盖此缺项。 |
| ② ChatGPT 问法链路 | **未知**。未采集干净账号、关闭记忆并重复采样的真实 ChatGPT 自然回答；本次 web search 不冒充 GEO 采样。 |
| ③ 公开搜索与补漏 | 找到同名专站 `accelerationcity.io`、`.cc`、`.net` 及多家游戏门户。公开搜索返回“可玩游戏页”为主；这不是地理锁定的 Google 第一页排名记录。Google/Bing/DDG autocomplete 分别成功返回 10/18/8 项。 |
| ④ 两路结论 | **SEO 路线可进入实现规划，需求量待验证；GEO 未知**。理由是存在可验证的导航/游玩意图与多个在营承接页；切口在更准确的操作说明、CoBot 示例、启动体验与设备说明，不能仅凭域名或换文案断言能超越。 |
| 背景 | CMU 官方在 2025-11-07 文章中报告该游戏过去一年吸引近 400 万 active users；该数字是官方自述、定义和审计方法未披露，**不是关键词月搜索量，也不是现时竞品站流量**。[来源](https://www.cmu.edu/roboticsacademy/news/cmra-news-2025/2025_robotics_discovery_day.html) |
| 移交 | 下方页面映射可作为初版；首页须承接真实同名游戏，避免用普通赛车替代后仍声称是原作。 |

## 游戏来源与品牌意图

CMU 官方 CoBox 目录将 Acceleration City 列在合作设计的 P3G 游戏中，链接至 CS-STEM Network。CMU P3G 项目说明其由 Carnegie Mellon 研究者与 Boys and Girls Clubs of Western Pennsylvania 学生共同设计。因此这是**有明确来源的既有游戏专名**，不能视作可随意更名的通用玩法。[CMU CoBox](https://www.cmu.edu/cobox/games/)、[CMU P3G](https://www.cmu.edu/roboticsacademy/Research/p3g.html)

官方 Hour of Code 介绍的核心机制是开放世界赛车、车辆选择、收集 Minanimals，以及用 CoBot 生成坡道/平台。CoBot 可响应探索时的按键与赛车时的彩色触发区域。网页发布早于本轮发现的多个 2026 门户上架日期，后者不能当游戏首次发布日期。[CMU Hour of Code](https://www.cmu.edu/roboticsacademy/programs/outreach/hour_of_code.html)、[2023 官方活动报道](https://www.cmu.edu/roboticsacademy/news/cmra-news-2023/remake_learning2023.html)

官方入口链：

- [CMU CoBox](https://www.cmu.edu/cobox/games/) → `https://www.cs2n.org/u/mp/badge_pages/2859`。
- [CS2N P3G 页面](https://www.cs2n.org/badges/player-programmed-partner-games) → 新的 [CS2N Games](https://games.cs2n.org/)；旧游戏页重定向目标为 `https://cobots.cs2n.org/games/acceleration-city`。
- [activities.cs2n.org 原作入口](https://activities.cs2n.org/acceleration-city/) 在搜索索引中可见版本 `1.0.3`；该版本号仅为索引观察，未作浏览器内确认。

## 原始 autocomplete

验证命令：

```powershell
node C:/Users/Sera/.agents/skills/rankup/scripts/demand/suggest.mjs 'acceleration city' --engine google,bing,ddg --hl en --gl us --json --out research/2026-10-24-acceleration-city/raw/keyword-suggest.json --evidence-dir research/2026-10-24-acceleration-city/raw/keyword-suggest-evidence --timeout 12000
```

原始输出：[keyword-suggest.json](raw/keyword-suggest.json)。采集状态：[manifest.json](raw/keyword-suggest-evidence/manifest.json)，三源均为 `ok`。这批候选串是搜索联想，不含搜索量、转化率或竞争难度；Bing 与 DDG 结果并非三个完全独立的需求样本。

| 来源 | 未改变顺序的原始候选 |
| --- | --- |
| Google en/us | acceleration city；acceleration city game；acceleration city 2；acceleration city - play；acceleration city hour of code；acceleration city 3；acceleration city mobile；acceleration city car game；acceleration city code.org；acceleration city hour of code free |
| Bing en-US | acceleration city；acceleration city game；acceleration city 2；acceleration city hour of code；acceleration city game free；acceleration city car game；acceleration city unblocked；acceleration city free play；acceleration city game hour of code；acceleration city sign in；acceleration city download；acceleration city cs-stem network；acceleration city game free play；acceleration city free；acceleration city game 2 player；acceleration city game 2；acceleration city game online；acceleration city search |
| DDG us-en | acceleration city；acceleration city game；acceleration city 2；acceleration city hour of code；acceleration city game free；acceleration city car game；acceleration city unblocked；acceleration city free play |

## 关键词与页面映射

主词：**acceleration city**。初版三个次级词：**acceleration city game**、**acceleration city free play**、**acceleration city hour of code**。`online` 可在标题/description 自然使用，当前采样来自 Bing 的 `acceleration city game online`。

| 问法簇 / 关键词 | 意图与来源 | 建议页面 | 真正需要提供的能力 |
| --- | --- | --- | --- |
| K1 acceleration city / game / free play / online | 直达游玩；autocomplete+在营专站 | `/` | 同名原作、显眼可玩区域、全屏、明确加载反馈、失败恢复、输入焦点指引。只用一个页面承接同意图变体。 |
| K2 acceleration city controls / how to play | 操作帮助；竞品页面反查 | 首页 `#controls` 或 `/how-to-play/` | 浏览器实测、版本日期、操作截图；不能互抄未证实键位。初版内容不足时保留首页段落。 |
| K3 acceleration city hour of code / CoBot programming | 教育与 CoBot 入门；Google/Bing 联想+CMU | 首页教学段，后续 `/cobot-guide/` | 一项真实可复现的事件→动作示例、原作来源、原始截图。不可声称 Code.org 官方或 CMU 官方站。 |
| K4 acceleration city mobile / download / sign in | 兼容性与入口疑问；autocomplete | 首页 FAQ / 帮助段 | 测试后写设备边界、是否需要账号、存档范围；不能因为 iframe 响应式就称支持触屏。 |
| K5 acceleration city unblocked | 特定网络可访问性；Bing/DDG | 首页 FAQ | 说明网络限制因学校/机构而异，不保证 unblocked；无需建立重复 doorway 页面。 |
| K6 acceleration city 2 / 3 / 2 player | 续作或多人期待；autocomplete | FAQ 仅作核实后的释疑 | 未核实正式续作与当前多人能力，不建虚假续作页，不通过标题许诺不存在功能。 |

## 可争缺口与 SEO 限制

1. **准确性**：公开竞品键位不一致。例如 [.cc](https://accelerationcity.cc/) 写 `Shift+Enter` 重置，Playnados 写 `R`，另有站写 `Enter`；竞品文案只能证明信息冲突，不能作为正确操作依据。通过亲测原作并给截图，可提供独立价值。
2. **真正的增量**：相同 iframe 并不自动带来相同 SEO 表现。可增加经验证的 CoBot 入门、无干扰游戏舞台、加载与失败状态、稳定全屏、正确设备说明。Google 的垃圾内容政策把没有实质附加价值的嵌入/汇编站列为滥用抓取例子之一；游戏壳需要有可见的原创价值。[Google Spam Policies](https://developers.google.com/search/docs/essentials/spam-policies)
3. **域名**：含 `accelerationcity` 有识别和意图传达作用，不能声称天然排名加权。Google 明确解释域名中的关键词本身几乎不产生排名效果，并有 exact-match-domain 系统避免过度奖励完全匹配域名。[SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)、[Ranking Systems Guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide)
4. **规模与性能**：目标可设为静态外壳快速显示、无布局跳动和尽快可交互；不能把轻量外壳的首屏速度等同 Unity/WebGL 游戏完成加载时间。是否比对手更快必须以同设备/网络实际测量。
5. **事实与标记**：不复制虚构的评分、投票数、上架日期或“我玩了很多小时”的体验口吻。结构化数据只写可验证字段，避免编造 AggregateRating。

## GEO 三清单状态

- 竞对清单：本次为公开搜索发现，并非 ChatGPT 自然推荐；可核对的候选为 `.io`、`.cc`、`.net`、Playnados、Gamesfree、SlopeGamePlay，具体技术核验回主报告。
- 关键词清单：K1–K6，来源均已标明；没有模型采样顺位与出现率。
- 页面清单：首页+可选操作/CoBot 教学；页面规划只依赖已观察的 SEO/原作任务，GEO 支持仍未知。

## 沉淀的脚本

复用既有 `C:/Users/Sera/.agents/skills/rankup/scripts/demand/suggest.mjs`，以上真实参数运行通过；未新增重复脚本。未执行任何浏览器操作、部署、域名购买或对外联系。
