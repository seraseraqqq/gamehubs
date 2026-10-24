# Cluster Rush：竞品、开发方案与域名

调研日期：2026-10-24（Asia/Shanghai）。完成本地版本，未购买域名、未发布。预览：<http://127.0.0.1:4202/>。源码：`../../games/cluster-rush`。打开 [截图总览](gallery.html) 查看竞品与本站实拍。

## 结论

可核查的直接竞品都采用 **网站页面 + iframe + 已有 Unity 游戏**，没有证据证明这些站方独立开发了游戏本体。本轮沿用这一技术方案，不用简化 Canvas 游戏冒充原作。本站直接接入 clusterrush.io 的 Unity 游戏页，去掉其预览/广告中间层，开发静态页面、真实键位、专注模式、全屏回退、重载确认与独立攻略。

“已经实现更清晰的页面和 SEO 基础”有源码与浏览器证据；“排名、留存或收入已经超过对手”没有数据支持。原游戏的商业嵌入授权未确证，正式域名与真实设备仍待上线前核查。本地原型可以评审，尚不属于可直接商业发布的已授权游戏。

## 竞品实际技术

| 竞品 | 已观察链路 | 可以判断什么 | 体验/内容切口 |
| --- | --- | --- | --- |
| [clusterrush.io](https://clusterrush.io/) | 首页 iframe → `/embed/cluster-rush?pub_id=&preroll=0`；点击后 iframe → `/game/cluster-rush/`；UnityLoader + `NG.data/NG.js/NG.asm.js/NG.mem` 来自 `freegamesonlinee.github.io` | 两层 iframe；游戏是旧 Unity WebGL/asm.js 构建，非页面站方原创的证明；原创作者归属未知 | 首屏有侧栏、广告及额外 Play 层；长文中的双跳等说法未在本轮证实 |
| [clusterrush.net](https://clusterrush.net/) | iframe → `/game/index.html` → 本域 `Release/NG.*` | iframe + 本域托管 Unity 包；**自托管不等于自己开发**。其包大小与 io 不同，不能称二进制完全相同 | 大游戏区已不错；文案承诺手机 tap、学校网络可访问，缺少本轮实测支持；只把 iframe onload 当游戏加载成功也不可靠 |
| [Yoplay](https://yoplay.io/cluster-rush) | iframe → `/cluster-rush.embed` → `w8.snokido.com/games/unity-webgl/cluster-rush/index.html` | 第三方 Unity 嵌入；公开 Embed URL/代码是其提供的技术入口，不自动证明游戏版权链 | 攻略多次称 2D、提在线挑战，但实机为第一人称3D；不照搬这些声明 |
| [Geometry Lite](https://geometrylite.net/arcade/cluster-rush) | iframe 直接指向 `https://clusterrush.io/game/cluster-rush/` | 与本站采用的**同一游戏页 iframe**；站外 Unity 资源链已核查 | 游戏 iframe title 错写 Geometry Lite；导航、推荐、社交控件分散注意；文案称铁路但画面为卡车 |

来源证据：`http-evidence.json`、`asset-evidence.json`；完整公开HTML与原始清单保留本地 `raw/`（不提交第三方整页源码）。HEAD 返回可访问、无 X-Frame-Options/CSP 限制，只说明本次技术请求可行，不构成转载、自托管或商业授权。

io 的 `TOTAL_MEMORY:268435456` 是构建配置，不能解读为实测内存峰值。`NG.asm.js` 是 asm.js 特征，不能笼统称现代 wasm。io 的 NG.data HEAD 为 6,875,659 bytes，net 为 5,976,294 bytes；完整引擎还会请求其他资源，实机 loader 显示约11MB data 过程。未下载、复制或重分发 Unity 二进制。

## 截图与玩法核验

- [io 首屏](screenshots/io-arrival.jpg)、[启动后的页面](screenshots/io-after-play.jpg)、[真实游戏菜单](screenshots/io-game-menu.jpg)。
- [第一关卡车实机](screenshots/io-gameplay.jpg)、[失败界面及键位](screenshots/io-controls-failed.jpg)。`io-level1.jpg` 是早期点击后的菜单中间态，不能当玩法成功证据。
- [net 菜单与页面](screenshots/net-arrival.jpg)、[Yoplay](screenshots/yoplay-page.jpg)、[Geometry Lite](screenshots/geometry-page.jpg)。
- [本站桌面](screenshots/site-desktop.jpg)、[本站实机](screenshots/site-gameplay.jpg)、[手机视口](screenshots/site-mobile.jpg)、[完整页面](screenshots/site-full-page.jpg)、[攻略](screenshots/site-guide.jpg)。

实机确认 Space/J 跳跃、长按攀爬、A/D 或左右箭头移动。进入第一关、跳跃、失败与点击重试已观察；未通关全部关卡、未测所有物理细节。竞品普遍称35关，本轮不将该文案当作全关卡验收。截图为真实 Chrome 抓取，不是生成图。

页面设计参考：play2048.co、0hh1.com、2048game.com，取其游戏主导与简洁控制。hextris.io 在本次出现证书过期拦截，未绕过；clusterrush.online HTTP 采集失败，不能当作该站永久不可用。

## 开发难度评估

以下为一名熟悉前端/Unity 开发者的粗估工作量，不是报价或交付承诺。

| 方案 | 难度 | 初版/验证工作量估计 | 主要成本 |
| --- | --- | --- | --- |
| 现有游戏 iframe + 静态 SEO 外壳（本轮） | 低到中 | 首版约1–2个工作日，再留1–2日做授权、正式域名、设备和性能验证；外部授权等待另算 | 页面体验、失效恢复、SEO、第三方可用性与权利链 |
| 获得许可后自托管既有 Unity 包 | 中 | 约2–5个工作日技术集成，包/许可到位前不能承诺 | 资源、缓存、压缩、跨域、旧引擎兼容、移动端；并非原创开发 |
| 从零做达到相近完成度的独立3D游戏 | 高 | 约4–8周或更长 | 卡车动态碰撞、角色控制/攀爬、相机手感、关卡、音效、性能与设备兼容；触控再增加工作 |

复刻“网页外壳”和复刻“Unity 游戏本体”是不同项目。用户要求与对手同方案，因此已选第一条；没有擅自重写玩法或复制无许可证的二进制。

## 本站的已实现改进

- 直接加载同一个游戏页，少一层预览/Play iframe；无本站广告、推荐侧栏或评论表单。
- 3:2 常规游戏视图、专注模式、原生全屏尝试与回退。顶栏保留明确退出；重载用内联确认，不弹出阻塞自动化的原生 confirm。
- 键位来自第一关实机；明确区分重试一局与重载整个 Unity；没有虚假静音、暂停、进度百分比或跨域存档控制。
- 手机页面不横向溢出，按钮44px；在游戏前明确键盘建议与触控未验证。旧 Unity 运行中改尺寸曾出现白屏，重新加载可恢复菜单，已记录，不能宣传手机完美可玩。
- 首页主攻 `cluster rush` / `cluster rush online` / `play cluster rush`；`how-to-play.html` 回答操作/攀爬，`not-loading.html` 回答加载、键盘、手机及 unblocked 的真实边界。没有机械重复主词或虚构攻略。
- 五个静态页面 + 独立404；每页唯一标题、描述、H1、OG 与结构化数据；正式构建从 SITE_ORIGIN 统一生成 canonical 与 sitemap。预览默认 noindex，不写未购买域名为正式 canonical。

检验：`export-checks.json` 92项通过；`http-checks.json` 10个响应/404检查通过；`browser-checks.json` 保存桌面、手机、重载与模式证据。原生全屏请求在受控浏览器被拒，专注回退可进入和退出，**没有宣称原生全屏进出已验收通过**。本站约5.3KB首页HTML和独立小CSS/JS不能代表第三方 Unity 在3G上2秒内可玩，未作此性能承诺。没有线上 PageSpeed/CWV、搜索量、KD、GEO自然推荐或排名数据。

独立视觉复核后已修复字体与图标，复核者确认这两项 resolved。设计流程未执行概念随机种子与用户概念选择，已如实记录为 FORM 流程缺项，未追认批准，因此不称“完整 Impeccable 流程通过”。最终复核原文见 `finish-review.md`。

## 可注册域名

Vercel 公共注册查询于2026-10-24核查，币种USD，均为1年，以下 available=true 且 premium=false。购买前价格和可用性可能变化。完整返回：`domain-evidence.json`。

| 顺序 | 域名 | 首年 | 续费/年 | 选择理由 |
| --- | --- | --- | --- | --- |
| 1 | **playclusterrush.com** | $11.25 | $11.25 | 完整主词+play，直观表达游玩意图，优先推荐 |
| 2 | **clusterrushonline.com** | $11.25 | $11.25 | 完整主词+online，符合在线游戏入口 |
| 3 | **clusterrushplay.com** | $11.25 | $11.25 | 短、完整主词、便于记忆 |
| 4 | **clusterrush.org** | $9.99 | $10.99 | 更短；后缀不自动带来排名优势 |
| 5 | **clusterrush.games** | $14.99 | $31.82 | 游戏语义直接，但续费高 |

`clusterrush.gg` 也显示可注册，但$129.99/年，不建议为后缀支付这笔溢价。`clusterrush.com`、`clusterrushgame.com`、`clusterrush.io`、`cluster-rush.com` 返回 available=false，不列为可购；false也可能是未确认，不能据此断言注册人或在售价格。未完成历史外链、商标或历史垃圾内容核查，不称“干净老域名”。

域名的优势主要是可读性、相关性与用户识别，不能承诺排名加成。Google 明确指出域名中的关键词本身几乎没有排名作用，并用 exact-match-domain 系统避免过度加分。[Google SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)、[Ranking systems guide](https://developers.google.com/search/docs/appearance/ranking-systems-guide)。

## 沉淀的脚本

均在本目录，不改全局 Skill。

- `node research/2026-10-24-cluster-rush/fetch-evidence.mjs`：公开页面、iframe、脚本、canonical取证，已跑。
- `node research/2026-10-24-cluster-rush/trace-games.mjs`：逐层读取实际游戏HTML与引擎指纹，已跑。
- `node research/2026-10-24-cluster-rush/probe-assets.mjs`：资源HEAD及CSS/游戏页边界检查，已跑。
- `node research/2026-10-24-cluster-rush/domains.mjs`：精确候选域名的注册商可用性/价格，已跑。
- `capture-pages.mjs`：真实Chrome/CUA参数化截图，已通过 `capturePages({cua,outputDir,pages,sessionName})` 采集2048game参考，竞品同函数链已采集；需要当前CUA权限，不使用无头浏览器。
- `node games/cluster-rush/scripts/check.mjs` 与 `node research/2026-10-24-cluster-rush/http-checks.mjs`：导出与HTTP回归，已跑。
- `node research/2026-10-24-cluster-rush/make-gallery.mjs`：生成本次截图总览。

## 当前交接

本地版本可评审。发布前需要确认外部游戏的商业嵌入许可、选定并拥有域名、验证实际生产域名/外部资源、真实设备与加载性能，再接入 Search Console 和分析。当前未发布、不购买、不声明SEO排名已超过竞品。项目接力保存在 `games/cluster-rush/.rankup/`。
