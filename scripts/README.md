# 管理工具

- `python3 scripts/hub.py serve --port 4310`：启动只监听本机的管理页，审核和站点修改实际持久化。
- `hub.py validate` / `generate` / `query "词"` / `query "站点" --kind site` / `import batch.json keywords.jsonl` / `export result.csv`：正式数据维护与查询（使用上面的完整脚本路径）。
- `python3 scripts/import_portfolio.py`：从本轮远端117词、方案和项目快照幂等初始化；不导入旧122词池，不访问网络。
- `python3 -m unittest discover -s scripts -p test_hub.py -v`：在临时数据根运行持久化、导入和冲突回归测试。
- `node scripts/check-game-release.mjs --origin https://example.com --routes /,/guide.html --www www.example.com --report deployments/evidence/<release>/http.json`：只读核验选定正式站点的页面、资源、canonical、robots/sitemap、真实 404 及可选 www 跳转；不代表完整游戏或搜索引擎收录通过。
- 对使用哈希资源名的构建追加 `--discover-assets`，检查所选页面实际引用的 JS/CSS/图标；默认检查 `/app.js`、`/style.css`、`/favicon.svg`。
- `--www` 默认严格要求301到不带www的origin，并保留路径与查询参数；旧站仅做历史308核验时可显式传 `--www-status 308`，不代表满足新的301默认规则。发布仍须按[管理默认规则](../docs/GAME_MANAGEMENT_RULES.md)另验Analytics实际数据发送。
- `node scripts/vercel-portfolio-settings.mjs --manifest <json> --cli <本机vercel入口.js> --action inspect|analytics|domains --report <json>`：按显式项目清单读取配置、开启普通Web Analytics或统一已验证域名；后两种模式会修改线上配置，需对应发布范围授权。使用CLI已有登录态，不读取/输出令牌。
- `node scripts/audit-vercel-deployment-history.mjs --cli <本机vercel入口.js> --scope <团队> --from <ISO时间> --until <ISO时间> --out <证据目录>`：只读分页核对团队所有项目的Git关联和部署历史，识别主仓库联动及重复项目；仅保存白名单字段。实际记录数与平台内部配额计数分别报告。[2026-10-25审计](../research/2026-10-25-vercel-deployment-history/README.md)。
- `node scripts/disconnect-duplicate-vercel-project.mjs --cli <入口> --scope <团队> --duplicate <项目ID> --canonical <正式项目ID> --repo <owner/repo> --report <json> [--apply]`：默认只预检；apply仅用于已核实的web/Travle重复连接，保留项目和部署历史，回读正式项目不变。需要对应配置修复授权。[已验证修复](../research/2026-10-25-vercel-deployment-history/FIXES.md)。
- `node scripts/check-portfolio-analytics.mjs --manifest <json> --report <json>`：只读检查每站页面、实际bootstrap、统计脚本、robots/sitemap、apex canonical与www301；Windows/Git换行先归一化再比对。
- `node scripts/check-browser-analytics.mjs --manifest <json> --opencli <本机OpenCLI入口.js> --session gamehubs-analytics-<唯一名> --report <json> [--slugs a,b]`：使用用户已连接的真实Chrome访问正式页，核验统计脚本与真实view请求返回2xx，结束归还会话；不伪造POST或把脚本存在当收数成功。[17站实际验证](../deployments/2026-10-25-portfolio-analytics.md)。

管理脚本固定按 UTF-8 读取和生成文本文件，不依赖 Windows 的默认 GBK 编码；回归测试包含 GBK 默认环境下的完整导入和中文审核保存。

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

关键词研究证据工具（2026-10-25）：

- `mine-keywords-cua.mjs`：在CUA中传入已授权Chrome标签页、明确词表与研究目录，采集US/en Trends及Google标题查询。只取真实页面数据，异常和未知均保存，不处理验证码或调用付费API。
- `python3 scripts/finalize-keyword-mining.py --research research/<批次目录> [--base research/<原批次目录>] [--import]`：把已落盘的候选、Trends、镜像与Google证据整理为逐词结果和独立批次；可复用原始证据且保留来源日期，仅显式`--import`调用正式导入器。SERP裁决显式读取serp-assessments.json；综合判读时间固定在assessment-context.json，重复导入字节一致。KGR沿用用户指定intitle/Volume，缺失不当通过；分级独立于人工决定。[补采参数与验证](../research/2026-10-25-windows-keyword-recheck-f112093a-400e-4e4b-98f7-fd0f8c102a13/README.md)。
