# GameHubs · SEO游戏站群管理

本仓库管理游戏项目、关键词机会、域名、源码入口、发布验收与后续工作。新游戏使用独立私有仓库；当前仍有10个游戏临时从本仓库的games目录构建。

| 需要查看 | 入口 |
|---|---|
| 当前进度与下一步 | [HANDOFF.md](HANDOFF.md) |
| 部署、域名与发布阻塞 | [部署状态](management/DEPLOYMENT_STATUS.md) |
| 正式源码仓库和工作目录 | [仓库入口](management/REPOSITORIES.md) |
| 新游戏需求、设计、竞品与任务 | [5个新项目](management/NEW_GAME_PROJECTS.md) |
| 下一轮安排 | [2026-10-25工作计划](management/plans/2026-10-25.md) |
| 关键词机会与优先开发清单 | [117词机会库](research/2026-10-24-keyword-opportunities/SHORTLIST.md) · [建站计划](research/2026-10-24-game-build-plan/README.md) |
| 历史关键词数据与Excel | [早期研究资料](research/2026-10-23-keyword-discovery/README.md) |
| 机器台账 | [仓库映射](management/data/repositories.json) · [站点台账](management/data/matrix-sites.json) |
| 交付与验收证据 | [发布记录](deployments/) · [调研资料](research/) |

## 目录规则

- `management/`：项目管理文档、工作计划、机器台账、管理工具与整理历史。
- `research/`：关键词、市场/竞品、域名与产品调研，保留来源证据。
- `deployments/`：发布和验收记录，区分源码、部署、真实可玩、索引及接入状态。
- `games/`：10个现役游戏的过渡源码，以及2个冻结迁移快照；后续逐个迁出，不新增游戏。
- `scripts/vercel-ignore.mjs`：现役部署依赖，保持原路径。
- `.rankup/`：项目接力、研究决策和初始化管理工具；`.agents/`为工作规则。

根目录仅保留README、HANDOFF、AGENTS和必要隐藏配置；JSON、Excel、一次性测试和单游戏设计不放根目录。新游戏在`E:/Projects/game-sites/<slug>`独立开发，仓库默认私有。修改前按[AGENTS.md](AGENTS.md)核对正式源码入口。

当前为12个既有游戏＋5个独立本地MVP新项目。5个新项目已开发并完成已测范围，尚未部署；现有发布holds见部署总表。此次整理没有发布线上变更。[整理记录](management/history/2026-10-24-repository-cleanup.md)。
