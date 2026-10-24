# Head Soccer 2026：竞品调研与实现交付

观察日期：2026-10-24，中国时间。默认市场：美国、英语、浏览器游戏。执行范围：调研、截图、开发难度评估、本地独立站实现、域名核验；没有购买域名或发布新站。

## 结论

**采用与直接对手相同的技术方案：静态网页 + GamePix 官方 iframe，而不是重写整套游戏。** `headsoccer2026.com` 在点击 Play Now 后加载 `https://play.gamepix.com/head-soccer-2026/embed?sid=7378M`。本实现使用官方公开 Feed 返回的 `sid=1`，没有挪用对手的发布商 ID。它是一款 Construct 导出的 HTML5 游戏，站点开发和游戏开发应分别判断。

已完成 `games/head-soccer-2026/` 的本地实现，入口为 `index.html`，预览端口 4201。实际进入单人比赛、发送移动/跳跃/射门输入并观察比分；完成桌面和 390px 窄屏布局检查。**没有证据证明已超过对手排名、真实玩家留存或核心游戏质量。** iframe 内的 AI、物理、资源和远程联机不在我们的控制范围。

## 入口环节与市场判断

- 已否决对照：仓库根无 `.rankup/`，现有 HANDOFF/README 未记录该词的否决；本次单独立项研究。
- GT：Google Trends 美国过去12个月，`head soccer 2026`、`head soccer`、`gpts` 同框。页面可见均值约 9、38、13；目标词在 2026-06-28 周达到 26，近期完整周约 5–8。`gpts` 只是比较基线，本报告不据此声称精确月搜索量。末周可能是未完结周；网页表格未导出 partial 标志，末周不作增长判断。截图及可见表格在 `screenshots/trends.jpg`、`raw/trends-tables.json`。
- Google：真实 Chrome 打开 `q=head soccer 2026&hl=en&gl=us`，前部可见 Math Playground、CBC Kids、Hooda Math、Orbit Kick、VIVERSE、BubbleBox 等。登录态与出口地区仍可能影响排序；不是无个性化的美国排名报告。`raw/google-serp.txt` 与 `screenshots/google-serp.jpg` 保存证据。补充公开搜索发现完全匹配域名独立站及双人/键位意图。
- GEO：未运行符合“临时聊天＋关闭个性化”的独立 ChatGPT 自然推荐采样，结论为未知；Google AI Overview 不当作 ChatGPT 推荐证据。
- SEO 路线：存在明确“立即游玩、双人、controls、mobile”的任务。可争切口是正确版本、准确操作、低干扰页面与恢复路径。大站竞争和已过年中峰值都是实质挑战，不是 KD=0 机会。没有使用付费关键词接口，没有编造 KD、搜索量、CPC 或收入。
- 页面移交：首页承接游玩；`how-to-play.html` 合并单人/双人/手机/加载故障意图；About 与 Privacy 解释真实来源。没有为同意图创建多个年份、拼写或 unblocked 门页。

## 对手技术证据

| 对手 | 嵌入链与引擎 | 是否自己开发 | 实测问题 / 可改善处 |
|---|---|---|---|
| [headsoccer2026.com](https://headsoccer2026.com/) | Next.js 静态页面；点击后 iframe → GamePix `head-soccer-2026/embed?sid=7378M` | 页面自建；游戏来自第三方，非站方独立原创的证据很强 | 页面宣称50+队伍、空格射门等；本次游戏选队画面仅10个角色，游戏内显示Z/X。部分攻略功能没有验证，不能照抄 |
| [Math Playground](https://www.mathplayground.com/puzzle_head_soccer_2026.html) | iframe → `/head-soccer-2026/index.html`；`generator=Scirra Construct`；作者字段 InfinitGames | 本域托管游戏包，不等于原创；没有证据证明网站自己开发 | 首屏有多个广告区；此次截图时曾黑屏。不能据一次访问断言所有用户都打不开 |
| [Hooda Math](https://www.hoodamath.com/games/headsoccer2026.html) | iframe → `/mobile/games/head-soccer-2026/game.html?nocheckorient=1`；Construct，作者字段 InfinitGames | 本域游戏包，原创归属不能仅靠 iframe 判断 | 多层导航和预加载广告；介绍中的泛用键位与游戏实测不够一致 |
| [CBC Kids](https://www.cbc.ca/kids/games/all/head-soccer-2026) | 介绍页跳 play 页；play 页 iframe → `cbc.ca/kidscbc2/content/games/head-soccer-2026/index.html` | iframe 已证实；未单独确证开发归属 | 强品牌竞争者。介绍页与直接游玩分开，多一步到球场 |
| [Orbit Kick](https://orbitkick.io/head-soccer-2026) | iframe → `/head-soccer-2026.embed` → 点击后 `azgames.io/head-soccer-2024.embed` | 第三方嵌入 | 2026 标题实际接入2024路径。只确证路径错配，不据此断言最终画面版本 |
| [Y8](https://www.y8.com/games/head_soccer_2026_world_cup) | iframe → storage.y8.com，游戏 HTML 明确 Construct | 平台标开发者 Fun Best Games；与其他包的 InfinitGames 作者字段不完全一致，归属仍需权利方确认 | 正常加载出2026菜单，提供单人/本地双人/在线菜单。页面公开的“添加到网站”代码实际为图片链接，不能误当 iframe 授权 |
| [Play-Games](https://www.play-games.com/game/39004/head-soccer-2026.html) | 页面公开 Embed 弹窗给出 `play-games.com/iframe/39004.html` | 平台自称开发者；仅凭文案不足以核实整个开发链 | 该 iframe 在此次浏览器访问中触发安全验证；公开 HTTP 返回403。未绕过验证，未作为主接入源 |

证据：`raw/http-manifest.json`、`raw/game-manifest.json`、公开 HTML、`raw/exact-domain-dom.txt` 及截图。Construct 的 meta 和脚本路径是技术指纹，不是源码许可。未复制、修改或自托管竞品游戏包。

## 截图索引

打开 [截图总览](gallery.html) 可逐张查看。

- [直接竞品首屏](screenshots/exact-domain-before-play.jpg) / [点击后的第三方玩家](screenshots/exact-domain-embedded.jpg)
- [Math Playground](screenshots/mathplayground-page.jpg)
- [Hooda Math](screenshots/hoodamath-page.jpg) / [启动过程](screenshots/hoodamath-started.jpg)
- [Y8 完整游戏菜单](screenshots/y8-game-menu.jpg) / [模式选择](screenshots/y8-mode-select.jpg)
- [Play-Games 官方 Embed 弹窗](screenshots/official-embed-code.jpg)
- [我们的桌面首屏](screenshots/site-desktop.jpg) / [手机首屏](screenshots/site-mobile.jpg) / [真实比赛](screenshots/site-gameplay.jpg)

截图是浏览器实拍，不是设计稿。早期 loading 截图只证明对应中间状态；最终首屏以 site-desktop/site-mobile 为准。

## 开发难度与方案

下列为单名熟悉前端/游戏开发者的工作量估计，不是供应商报价或工期承诺。

| 路线 | 难度 | 估计工作量 | 边界 |
|---|---|---|---|
| 官方发行 iframe + 独立 SEO 页面 | 低至中 | 可用首版约1–2工作日；再预留1–2日做真实设备/正式域名验证 | 与直接对手相同；受外部可用性、广告、隐私界面及版本更新影响 |
| 自建原创新角色的2D单人/本地双人 | 中高 | 约2–4周 | 物理、球员碰撞、AI、选队、动效、音效、手机多点触控及平衡都要完成 |
| 含可靠远程联机、房间和重连的完整原创版本 | 高 | 约6–10周或更长 | 需要后端、状态同步、延迟处理、匹配、滥用防护、持续运营；不能当普通 iframe 换皮成本 |

本轮选择第一条。后续只有当玩家反馈、访问量与收入支持投入时，再评估原创引擎。没有擅自把用户的“同技术方案”替换成简化的 Canvas 假复刻。

## 本轮增强与真实边界

- 游戏优先，标题、游戏、准确键位同一首屏；没有无关游戏墙、额外站点广告或注册门槛。
- 按需加载：点击前没有第三方 iframe、广告 SDK、外部字体或游戏资源请求；点击后才连接 GamePix。游戏自身可显示服务商广告与隐私界面，不能声称全站无广告。
- 单人/本地双人/Touch说明独立切换，不重载游戏。Focus mode 有退出按钮；原生全屏请求失败时回退 Focus mode，本机验证了该回退。
- 失败恢复放入折叠提示，提供直接入口及重载确认；转屏/调整大小时发行方可能需要重载，不能假装能直接修第三方画布。
- 静态正文、独立TDK、单H1、VideoGame结构化数据、OG图、本地图标与字体、真实404、正式域名单一配置。
- 没有虚构星级、获奖、50小时体验、隐含数值、战力排行、解锁条件或在线匹配成功率。FAQ结构存在，但未宣称FAQ富结果资格。
- 原生触摸硬件、跨浏览器、远程联机匹配和正式域名 CWV/收录尚未验证。390px测试是响应式视口测试，不等于真机触控通过。

校验记录见 [export-checks.json](export-checks.json)、[browser-checks.json](browser-checks.json) 和[设计复核](finish-review.md)。复核唯一修正项（箭头改SVG）已获 ship verdict；该 verdict 只覆盖列出的修正。独立设计文档和 token sidecar 已保存在游戏目录。4张本地代码导出的PNG均带来源元数据，扫描无缺项。没有运行线上 PageSpeed，不能声称线上性能评分或排名更高。

## 可注册域名

2026-10-24 10:35:58（中国时间），Vercel公开注册商接口返回以下可用；价格为美元、一年，非 premium。实时结果会变化，未购买。完整返回见 [domain-evidence.json](domain-evidence.json)。

| 域名 | 首年 / 续费 | 建议 |
|---|---|---|
| **playheadsoccer.com** | $11.25 / $11.25 | 长期首选：短、易理解，后续年份放页面；不被2026锁死 |
| **headsoccer2026.net** | $13.50 / $13.50 | 专做该词的优先备选，精确可读；年份过期风险明显 |
| **playheadsoccer2026.com** | $11.25 / $11.25 | 单游戏2026站的.com备选，略长但表达明确 |
| headsoccerplay.com | $11.25 / $11.25 | 同样适合长期主题，语序略弱于首选 |
| headsoccer2026game.com | $11.25 / $11.25 | 关键词明确，长度和冗余略高 |
| headsoccer2026online.com | $11.25 / $11.25 | 更长；online是浏览器游玩表达，不能保证远程匹配 |
| headsoccer2026.org | $9.99 / $10.99 | 可用但不优先，普通游戏站与.org语义契合度较低 |

`headsoccer2026.com` 接口未返回可注册，且实际已有网站。未验证候选历史站点/外链健康和名称权利，不把“可注册”称作“干净历史”。

**SEO优势应理解为用户识别与主题表达，不能理解为域名加词自动获得排名。** Google说明域名关键词本身对排名影响很小，且有精确匹配域名系统限制不当加分：[SEO入门指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)、[排名系统指南](https://developers.google.com/search/docs/appearance/ranking-systems-guide)。若只做2026短期验证选 .net；若经营长期资产更建议 playheadsoccer.com。

## 许可、变现与上线状态

GamePix [官方公开 Feed 页](https://partners.gamepix.com/rss-feed) 提供分发目录，本次返回目标游戏的官方 embed URL。生产变现建议申请自己的发布商身份、核对具体游戏/地域/商业使用条件并替换为自己的 SID；不能把公开默认 SID 当作已开通收入账户。没有注册账户、接受新合同、投放广告或修改生产服务。

正式发布前仍需：用户选定并持有域名、核查历史与名称风险、设置 `SITE_ORIGIN`、真机测试、发行商商业配置确认，再部署并验收正式 URL、PageSpeed、GSC、隐私文案与实际服务一致。当前本地可审阅，不等于已上线或已获得SEO结果。

## 沉淀的脚本

- `fetch-evidence.mjs`：公共HTML/iframe指纹；已运行 `node research/2026-10-24-head-soccer-2026/fetch-evidence.mjs`。
- `trace-games.mjs`：追踪游戏入口及Construct指纹；已运行同名脚本。
- `domains.mjs`：免费公开注册商批量查询，接受域名参数；已运行 `--help` 及默认候选。
- `games/head-soccer-2026/scripts/check.mjs`：真实构建的索引开关、canonical、内部链接/锚点、图标及导出隔离；已运行通过。
- `capture-pages.mjs`：复用当前连接 Chrome 的 CUA API，参数化保存网页截图与可见状态；已在 CUA 中导入并对 `headsoccer2026.com` 实际运行，结果见 `screenshots/replay/capture-manifest.json`。OpenCLI不可用，因此不是OpenCLI脚本，也不是headless浏览器。该脚本只采集到达状态，不把加载页记作游戏验收。

维护：本次结论以此报告为唯一详细来源，交接只保留目录、状态和下一步；没有改变其他游戏或全局设计系统。
