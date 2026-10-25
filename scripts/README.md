# 管理工具

- `python3 scripts/hub.py serve --port 4310`：启动只监听本机的管理页，审核和站点修改实际持久化。
- `hub.py validate` / `generate` / `query "词"` / `query "站点" --kind site` / `import batch.json keywords.jsonl` / `export result.csv`：正式数据维护与查询（使用上面的完整脚本路径）。
- `python3 scripts/import_portfolio.py`：从本轮远端117词、方案和项目快照幂等初始化；不导入旧122词池，不访问网络。
- `python3 -m unittest discover -s scripts -p test_hub.py -v`：在临时数据根运行持久化、导入和冲突回归测试。

当前两份旧台账为生成兼容视图，日常登记进入data/sites/；旧register-game-projects工具会拒绝覆盖生成视图，避免回填旧状态。[详细说明](../docs/USAGE.md)。

从GameHubs仓库根执行。仅保留与站群管理直接相关、仍有用途的工具。

- 项目初始化和台账登记工具仍在[.rankup/scripts](../.rankup/scripts)，使用入口见[新项目总览](../docs/NEW_GAME_PROJECTS.md)。只显式启用的创建/推送模式会操作GitHub。

五个新游戏的本地开发验收工具（已用实际参数执行，完整范围见[交付记录](../research/2026-10-24-five-game-development/STATUS.md)）：

- `node scripts/qa-five-games.mjs --profile <profile>`：Chrome页面操作与桌面/手机宽度截图；支持`--game`、`--skip-capture`和`--capture-only`。
- `node scripts/qa-game-state.mjs --profile <profile>`：键盘、进度存储与UTC边界。
- `node scripts/qa-review-states.mjs --profile <profile> --game colordle|travle`：结果状态修复回归。
- `node scripts/qa-game-hover.mjs --profile <profile>`：真实悬停对比度。
- `node scripts/check-five-games-http.mjs`：静态SEO、资产/许可和404。浏览器工具要求对应本地预览运行；不会部署或购买资源。

原portfolio导出检查、分仓准备、共享Ignored Build Step工具已随games/移除；历史实现可从Git查阅。现役构建和验收在各独立游戏仓库执行。这里保留的五游戏QA工具面向兄弟目录game-sites/，不依赖GameHubs内的游戏副本。HTTP检查默认同级game-sites/，可用GAMEHUBS_PROJECTS_ROOT指定本机检出根；运行前按实际设备确认预览端口，旧设备地址不是可用性证明。
