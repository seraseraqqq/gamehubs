# 五个游戏本地首版交付

2026-10-24。Owner授权开始五个游戏开发，并明确“按现有PRD全部推进”。本轮在五个既有独立私有仓库实现可玩本地首版；没有购买域名、创建Vercel项目、推送实现或部署公网。

| 游戏 | 本地预览 | 核心实现 | 引擎测试 |
|---|---|---|---|
| Cutle | [试玩](http://127.0.0.1:4311) | 自研几何裁剪、三角形/矩形及凸多边形、首刀/最佳成绩、真实拖动与键盘切线 | 5 |
| Poople | [试玩](http://127.0.0.1:4312) | 1,028词、字梯BFS、分层提示、难度/错题重练、实际Solver | 4 |
| Colordle | [试玩](http://127.0.0.1:4313) | 184个RGB颜色、别名/搜索、公开评分、结果对色及颜色名指南 | 3 |
| Metazooa | [试玩](http://127.0.0.1:4314) | 130动物、固定ENA分类快照、30组LCA核对、20次猜测与分类路径 | 4 |
| Travle | [试玩](http://127.0.0.1:4315) | 本地Natural Earth地图、151个连通国家单元、BFS路径、明确连接例外、50组独立地图边界核验 | 5 |

各站均含Unlimited练习、自有UTC每日题、难度、本地进度、最近50局记录和结果/重玩。六个实际HTML页面各有唯一标题、H1和描述；规则/策略或工具内容静态可读。域名只通过SITE_ORIGIN统一配置；当前预览noindex，不声称拥有候选域名，也不输出未拥有域名的canonical。

## 证据与独立审查

- 五仓的`pnpm check`通过：TypeScript、合计21项引擎测试、生产静态预渲染构建。
- Owner真实Chrome：每站10局，共50局页面操作；重复/非法输入不误计数，键盘、损坏/不可用存储、UTC日期重建与刷新路径已测。
- 1440px、390px与当前1266px截图已检查。这是视口验收，不冒充实体手机触屏或软键盘结果。
- [独立审查](finish-review.md)：Cutle的SVG留白坐标、Colordle双颜色结果、Travle手机输入位置及揭晓标签四项修复均resolved；额外悬停对比度问题也在五站修复并经Chrome实测确认，最终处置ship，范围限本地原型及所评分项目。
- 实现派生的`DESIGN.md`和`.impeccable/design.json`已分别落在五仓。50个PNG有嵌入式来源记录，SVG原稿保留；运行库和数据许可文本保留。
- 本机原始验收在各仓`.rankup/evidence/`，截图在`.impeccable/review/`，均不提交原始测试/浏览器载荷。各仓`docs/QA.md`记录通过范围与未完成项。

## 实体设备与发布门槛

实体手机触屏/软键盘、200%缩放、跨浏览器专项、至少5名目标玩家竞品对照、逐词市场与名称/域名历史复核、生产PageSpeed/CWV、正式域名游玩和索引/分析/广告接入仍未验收。未安排外部人员联系，未建立自动化。关键词Volume/KD沿用已有研究估值，不将本地实现解释为流量、排名或收入成果。

2026-10-25续更：完整运行时和优化已推送五仓，提交与当前验收见[优化交付](optimization-delivery.md)；其余内容保留2026-10-24首版验收范围。原有游戏的发布holds、Vercel项目、忽略构建逻辑和迁移快照保持不变。管理仓库整理后的台账路径为`data/repositories.json`，五项仍在plannedGames，developmentState已单独反映本地MVP状态。

## 沉淀的脚本

从GameHubs根目录执行，要求五个生产预览端口4311–4315可用，并传入已连接的OpenCLI profile；脚本释放自己创建的浏览器会话。

- `node scripts/qa-five-games.mjs --profile <profile>`：真实页面10局/站、非法输入、模式/进度及截图。`--game <slug>`限定一站，`--skip-capture`只做玩法，`--capture-only`仅更新截图。
- `node scripts/qa-game-state.mjs --profile <profile>`：键盘、损坏与不可用存储、刷新及UTC旧存档重建；`--game`可限定。
- `node scripts/qa-review-states.mjs --profile <profile> --game colordle|travle`：结果比较与揭晓路线的语义和截图回归。
- `node scripts/qa-game-hover.mjs --profile <profile>`：实际悬停状态的选中模式/主按钮对比度；本轮最小6.25:1。
- `node scripts/check-five-games-http.mjs`：六个静态页面、标题/H1/描述/Schema、预览noindex、资产、许可证和真实404。
- Cutle仓库：`node scripts/browser-drag.mjs --profile <profile>`，真实鼠标拖动校验被留白的SVG坐标，不把它当真实触屏测试。

截图显式传递open返回的标签页ID，兼容本轮旧版扩展的会话行为。没有恢复已退休的根目录管理台账路径。

## 本地预览服务

绑定127.0.0.1，Node进程：Cutle 28604、Poople 10188、Colordle 28436、Metazooa 30160、Travle 52476。服务仍运行，便于Owner直接试玩；重启使用对应仓库的`PORT=<端口> pnpm preview`（PowerShell中先设置`$env:PORT`）。不存在未收回的构建、浏览器验收或子代理任务。


维护完成：五仓接力、计划、检查表、架构、许可、关键词页面状态、实际设计规范与管理台账已同步。五仓文档检查均无断链，旧“没有代码/文档阶段”当前状态残留为0。临时脚手架的删除被自动审批拦截，已改为可恢复归档至E:/Projects/game-sites/.development-cache-2026-10-24，未删除任何游戏仓库。
