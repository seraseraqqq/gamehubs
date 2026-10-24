# 管理工具

从GameHubs仓库根执行。仅保留与站群管理直接相关、仍有用途的工具。

- `node management/tools/check-portfolio-seo.mjs --public`：只读复核原12游戏已有dist的SEO/发布hold；不会构建或部署。
- `node management/tools/prepare-standalone.mjs <slug> <fresh-sibling-checkout> <research/path>`：后续10游戏迁移准备工具，会写目标新仓库，须按迁移授权使用。
- 项目初始化和台账登记工具仍在[.rankup/scripts](../../.rankup/scripts/)，使用入口见[新项目总览](../NEW_GAME_PROJECTS.md)。只显式启用的创建/推送模式会操作GitHub。

五个新游戏的本地开发验收工具（已用实际参数执行，完整范围见[交付记录](../../research/2026-10-24-five-game-development/STATUS.md)）：

- `node management/tools/qa-five-games.mjs --profile <profile>`：Chrome页面操作与桌面/手机宽度截图；支持`--game`、`--skip-capture`和`--capture-only`。
- `node management/tools/qa-game-state.mjs --profile <profile>`：键盘、进度存储与UTC边界。
- `node management/tools/qa-review-states.mjs --profile <profile> --game colordle|travle`：结果状态修复回归。
- `node management/tools/qa-game-hover.mjs --profile <profile>`：真实悬停对比度。
- `node management/tools/check-five-games-http.mjs`：静态SEO、资产/许可和404。浏览器工具要求对应本地预览运行；不会部署或购买资源。

现役Vercel仍依赖[../../scripts/vercel-ignore.mjs](../../scripts/vercel-ignore.mjs)，保留原地址；根scripts不再存放开发临时测试。
