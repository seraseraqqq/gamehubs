# GameHubs · SEO 游戏站群管理

这里集中保存关键词研究、人工建站决定、项目进度、网站地址和唯一 GitHub 源码入口，供本人审查及 AI 接手。当前主资产为117词研究、11项建站方案与106词处置；词池另补录12个既有站点主词，并保留本机10词截图鱼类研究。Gulper主词已纠正为 `gulper io`，旧词保留历史独立身份。加上最新150个发现词，当前合计290词；最新150词已补采，120词有完整Volume/KD、33个数值过线词均有KGR、149词有趋势曲线，研究分级为A1/B2/未达标117/待验证30，未确认S档。[完整结果与来源缺项](research/2026-10-25-windows-keyword-recheck-f112093a-400e-4e4b-98f7-fd0f8c102a13/README.md)。已登记12个既有游戏和5个独立新项目，17个主词均与词池关联。

## 打开本地管理页

需要 Python 3.10+，无需安装依赖。从仓库根运行：

```sh
python3 scripts/hub.py serve --port 4310
```

打开 <http://127.0.0.1:4310/>。三个入口为**关键词池、建站清单、网站目录**；批次与证据收在关键词详情中。支持按研究批次日期、Volume、KD、intitle 数、KGR及研究分级升降序排序，以及状态、站点/页面筛选。研究分级与证据确定性单独显示，缺项保留待验证，不替代人工建设决定。网站目录另支持建站日期排序。关键词指标和状态、站点 URL 与仓库地址均可在详情手动编辑，保存时保留历史。服务仅监听本机。

## 快速入口

| 需要查看 | 入口 |
|---|---|
| 当前进度与本轮审查边界 | [HANDOFF.md](HANDOFF.md) |
| 自动站群摘要 | [INDEX.md](INDEX.md) |
| 使用、导入、审核、同步与恢复 | [使用说明](docs/USAGE.md) |
| 后续挖词与全量回填约定 | [研究工作流与手动预设指令](docs/KEYWORD_WORKFLOW.md) |
| 研究来源、凭据、域名与默认统计接入 | [游戏开发与发布默认规则](docs/GAME_MANAGEMENT_RULES.md) |
| 117词研究与完整证据 | [优先榜](research/2026-10-24-keyword-opportunities/SHORTLIST.md) · [全量台账](research/2026-10-24-keyword-opportunities/keyword-ledger.json) |
| 建站优先级、任务与其余词处置 | [11项方案](research/2026-10-24-game-build-plan/README.md) · [106词处置](research/2026-10-24-game-build-plan/dispositions.json) |
| 唯一源码入口及5个新项目 | [源码索引](docs/REPOSITORIES.md) · [新项目](docs/NEW_GAME_PROJECTS.md) |
| 发布状态与验收 | [部署总表](docs/DEPLOYMENT_STATUS.md) · [发布证据](deployments/) |
| 正式数据与校验记录 | [数据规则](data/README.md) · [导入记录](generated/import-report.json) · [游戏副本清理记录](docs/history/2026-10-25-management-only-cleanup.json) |

## 目录

```text
GameHubs/
├── README.md / INDEX.md / AGENTS.md / HANDOFF.md
├── dashboard/                    本地管理页
├── data/
│   ├── batches/                  每轮完整观察和证据引用
│   ├── reviews/                  追加的人工/AI审核
│   ├── sites/                    唯一维护的项目与源码登记
│   ├── schemas/                  校验规则
│   └── migration/                原始登记快照和版本来源
├── generated/                    可重建的词池和查询索引
├── scripts/                      导入、校验、汇总、启动及复用工具
├── docs/                         使用、维护、计划与历史
├── research/                     保留研究和原始证据
└── deployments/                  保留发布验收记录
```

正式维护仅进入 `data/batches`、`data/reviews`、`data/sites`。`INDEX.md`、`generated/` 以及 `data/repositories.json`、`data/matrix-sites.json` 是生成索引/兼容视图，不重复手填。旧本地122词池已备份，未自动混入117词主池。

严格指标达标、研究推荐、人工决定、建设阶段和发布验收分别记录。五个新项目的完整源码已在各自 GitHub 主分支，并按用户后续明确授权完成 Vercel READY 部署；默认 noindex，完整外部验收仍待完成。历史核验不冒充实时可玩验收；另一设备的 E 盘路径及 localhost 不作为本机入口。

2026-10-25已完成10站独立仓库与原Vercel项目迁移；[迁移验收](deployments/2026-10-25-independent-repositories.md)。随后按用户明确授权，将原games/及三项旧工具移出管理仓库，连同管理目录整理、正式台账和部署证据纳入本次GitHub交付。当前仓库只维护站群管理与研究资料；17个项目的游戏代码均在各自独立仓库。旧游戏可从历史提交恢复，本机未跟踪文件有仓库外备份；[清理与恢复记录](docs/history/2026-10-25-management-only-cleanup.json)。后续两站与五个新项目的明确发布授权及实际验收，以当前站点记录和部署总表为准；Snow Rider 的 noindex 验收条件保持。

2026-10-25后续已按明确授权为17站完成Vercel Web Analytics接入、开启及真实发送/后台收数验证，并将10个独立域名统一apex主站/www301；工作台与最新源码/发布已回填。[逐站结果](deployments/2026-10-25-portfolio-analytics.md)。
