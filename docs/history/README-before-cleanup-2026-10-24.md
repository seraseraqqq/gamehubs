# GameHubs 游戏项目管理

GameHubs 用于管理游戏项目、调研、域名、部署和后续工作。新的管理方式是：**一个游戏一个独立 GitHub 仓库、一个 Vercel 项目；GameHubs 维护统一台账。**

当前处于分阶段迁移中：**2 个游戏已拆成独立私有仓库，10 个线上游戏仍以 GameHubs 子目录作为正式源码。尚未全部拆分。**

另已初始化 **5 个新游戏独立私有仓库**：Cutle、Poople、Colordle、Metazooa、Travle，当前只有开发文档，未开发/未部署。见[新游戏工作空间与需求/设计/竞品入口](../NEW_GAME_PROJECTS.md)；不计入原12游戏上线数量。

## 从这里开始

| 要了解什么 | 入口 |
|---|---|
| 12 个游戏现在各做到哪一步 | [management/DEPLOYMENT_STATUS.md](../DEPLOYMENT_STATUS.md) |
| 明天先做哪些事 | [2026-10-25 工作安排](../plans/2026-10-25.md) |
| 下一次会话如何继续 | [HANDOFF.md](../../HANDOFF.md) |
| 正式源码仓库与本地入口 | [management/REPOSITORIES.md](../REPOSITORIES.md) |
| 五个新游戏的开发工作空间与资料 | [management/NEW_GAME_PROJECTS.md](../NEW_GAME_PROJECTS.md) |
| 机器可读的仓库映射 | [management/data/repositories.json](../data/repositories.json) |
| 游戏、域名和发布状态台账 | [management/data/matrix-sites.json](../data/matrix-sites.json) |
| 此次分仓与构建过滤的验收证据 | [management/history/2026-10-24-repository-refactor.md](2026-10-24-repository-refactor.md) |

开发前先查正式源码入口，完成后同步台账和交接。当前状态以部署总表为准，研究记录和历史发布记录保留当时的事实。

## 新管理方式的职责

| 位置 | 负责什么 |
|---|---|
| GameHubs 管理仓库 | 项目清单、调研索引、域名与部署映射、工作计划、验收和经营记录 |
| 每个游戏的独立仓库 | 该游戏的源码、资源、构建配置、测试、README 和相关研究资料 |
| 每个游戏的 Vercel 项目 | 连接对应源码仓库，管理构建、环境变量、域名及生产部署 |
| 游戏自己的域名 | 对外访问与 SEO；与代码仓库名称、内部项目 ID 分开记录 |

新增游戏默认创建独立私有仓库，放在 GameHubs 的同级工作目录中；不在 GameHubs 内嵌套新的 Git 仓库。新站准备发布时再创建或关联自己的 Vercel 项目。共享模板待接口稳定后抽取，模板更新由各游戏按需采用。

## 已拆分：2 个游戏

| 游戏 | 正式 GitHub 仓库 | 本地正式源码 | 当前发布状态 |
|---|---|---|---|
| Cluster Rush | [gamehubs-cluster-rush](https://github.com/seraseraqqq/gamehubs-cluster-rush)（私有） | `E:/Projects/game-sites/cluster-rush` | 未部署；等待嵌入许可、域名及上线验收 |
| Acceleration City | [gamehubs-acceleration-city](https://github.com/seraseraqqq/gamehubs-acceleration-city)（私有） | `E:/Projects/game-sites/acceleration-city` | 未部署；已购 playaccelerationcity.com，用户暂缓发布，等待嵌入许可 |

两者的 Git 历史和对应调研已保留。GameHubs 内 `games/cluster-rush`、`games/acceleration-city` 是迁移快照，后续代码只在独立仓库修改。旧公共仓库的已有历史仍然存在，创建私有仓库不会改变旧历史的可见性。

## 过渡阶段：10 个游戏仍在 GameHubs 开发

这些游戏当前继续从下列目录开发和发布。逐个完成源码拆分、Vercel 关联切换和正式域名验收后，再标注原目录为迁移快照。

| 游戏 | 当前正式源码目录 | 现有 Vercel 项目 |
|---|---|---|
| Block Blast | `games/block-blast-unblocked` | `block-blast-unblocked` |
| 2048 Cupcakes | `games/2048-cupcakes` | `gamehubs-2048-cupcakes` |
| Spacebar Counter | `games/spacebar-counter` | `gamehubs-spacebar-counter` |
| Gulper.io / Gulperio | `games/gulperio` | `gulperio-game` |
| Head Soccer 2026 | `games/head-soccer-2026` | `gamehubs-head-soccer-2026` |
| Krillion / STARLING | `games/summit-unlimited` | `gamehubs-summit-unlimited` |
| Costcodle | `games/costcodle` | `costcodle-unlimited` |
| Coreball | `games/coreball` | `gamehubs-coreball` |
| Minute Cryptic Unlimited | `games/minute-cryptic-unlimited` | `gamehubs-minute-cryptic-unlimited` |
| Snow Rider 3D | `games/snow-rider-3d-unblocked` | `gamehubs-snow-rider-3d` |

Gulper.io 是游戏名称，正式网站域名为 **[gulperio.com](https://gulperio.com/)**。Krillion / STARLING 对应 `summit-unlimited` 目录；内部历史命名不代表另一个站点。

## 工作区布局

```text
E:/Projects/
├── gamesHub/                         # 管理仓库 + 过渡期仍在此开发的10个游戏
│   ├── README.md
│   ├── HANDOFF.md
│   ├── management/DEPLOYMENT_STATUS.md
│   ├── management/REPOSITORIES.md
│   ├── management/data/repositories.json
│   ├── management/data/matrix-sites.json
│   ├── research/
│   ├── deployments/
│   ├── scripts/vercel-ignore.mjs
│   └── games/
│       ├── gulperio/                 # 仍是正式源码
│       ├── ...                      # 其余仍未迁移的游戏
│       ├── cluster-rush/             # 已迁移快照
│       └── acceleration-city/        # 已迁移快照
└── game-sites/
    ├── cluster-rush/                 # 独立Git仓库，正式源码
    ├── acceleration-city/            # 独立Git仓库，正式源码
    └── <new-game>/                   # 后续新游戏的独立仓库
```

## 开发与交付流程

1. **定位源码**：查看仓库台账，再进入该游戏当前的正式源码目录。已迁移游戏不在两边重复修改。
2. **开发与验证**：按该游戏 README 执行本地构建和必要检查，确认玩法、页面与导出符合本次改动。
3. **提交 GitHub**：提交到该游戏当前所属的仓库；只暂存本次相关文件，保留其他会话的修改，不提交凭据、`.env`、`.vercel` 或生成的 `dist`。
4. **发布 Vercel**：部署包含本次改动的提交，单独检查生产状态、正式域名和实际页面。重新部署旧成功提交不会自动包含尚未上线的新代码。
5. **更新记录**：同步部署总表、仓库/域名映射及 HANDOFF，分别记录“源码已推送”“生产部署成功”“实际可玩”“允许索引”和“已收录”。

页面文案围绕游戏名称、玩法和操作，避免重复使用模仿或 Inspired 表述；功能说明与实际一致，并保留必要的来源署名和许可。

## Vercel 配置分两种情况

### 尚未迁移的 GameHubs 子目录

每个游戏继续使用已有 Vercel 项目，Root Directory 为 `games/<slug>`，例如 `games/gulperio`。构建及输出目录遵循该游戏自己的 `vercel.json`，GameHubs 根目录不作为游戏站点部署。

现有 10 个项目的 Ignored Build Step 已配置为：

```sh
node ../../scripts/vercel-ignore.mjs games/<slug>
```

脚本比较当前提交与该项目、该分支上一次成功部署：本游戏运行文件变化则构建，管理文档和无关游戏变化则跳过；比较失败或历史缺失时继续构建。新增共享运行依赖时，将其路径加入相关项目的命令参数。

实测已有 1 个正确构建、8 个正确跳过；Gulperio 的实际规则执行被平台限额拦截，仍待验证。跳过可能仍产生部署记录并占用平台配额，不能将目录过滤理解为完全没有跨项目部署事件。

### 独立游戏仓库

连接该游戏自己的 GitHub 仓库，Root Directory 使用仓库根目录 `.`（控制台可能显示为空），使用本仓库的构建命令及输出目录。不要沿用上面的 `../../scripts/vercel-ignore.mjs` 命令；该路径属于 GameHubs 的过渡配置。

现有游戏迁移时沿用原 Vercel 项目，保留域名、环境变量和部署保护；切换 Git 关联、Root Directory 及构建过滤配置后，逐站验收。独立仓库中的提交只关联该仓库对应的游戏项目。

## 当前发布进度与暂停安排

最近核对时间：2026-10-24 15:51（北京时间）。10 个站点公开首页均 HTTP200，其中 7 个页面允许索引、3 个仍 noindex；另 2 个游戏未发布。

- **Gulperio**：新文案已推送 GitHub，尚未部署，线上仍是旧版。
- **Snow Rider**：当前已部署 Miniplay iframe；正式域名完整游玩和重开尚待验收，继续 noindex。旧 GameDistribution 直连方案已替换。
- **Coreball / Minute Cryptic**：默认 Vercel 地址已上线，自有域名待确定与验收，继续 noindex。
- **Head Soccer**：已上线；www 最终访问地址与裸域 canonical 仍需统一。
- **Costcodle**：已绑定 [costcodle.cc](https://costcodle.cc/)，线上仍有旧域名元信息；本地一致性修复及24项检查已完成，待推送、部署后向GSC提交。[修复记录](../../deployments/2026-10-24-costcodle-domain.md)。
- **Acceleration City / Cluster Rush**：已建立独立仓库，发布条件仍待完成。

Vercel 当前提示部署限额，用户安排明天再部署。**今天的文档修订仅保存在工作区，不自动推送触发新部署。** 后续按[明日计划](../plans/2026-10-25.md)继续，先核对配额恢复，再处理待发布改动。

## 研究与历史记录

- [现有游戏审查与截图](../../research/2026-10-23-existing-games/report.html)
- [Coreball / Minute Cryptic 构建与域名候选](../../research/2026-10-23-two-new-games/README.md)
- [关键词与页面调整记录](../../research/2026-10-23-keyword-seo/README.md)
- [Head Soccer 调研](../../research/2026-10-24-head-soccer-2026/README.md)
- [Cluster Rush 迁移前调研](../../research/2026-10-24-cluster-rush/README.md)
- [Acceleration City 迁移前调研](../../research/2026-10-24-acceleration-city/README.md)
- [Gulperio 待发布文案记录](../../deployments/2026-10-24-gulper-copy.md)
- [Snow Rider 当前 Miniplay 发布记录](../../deployments/2026-10-24-snow-rider-miniplay.md)
- [Vercel Analytics 历史接入记录](../../deployments/2026-10-23-analytics.md)

历史记录中的预览端口、关键词指标和当时未部署的描述，仅代表记录时状态；当前域名、部署与后续工作以部署总表和仓库台账为准。
