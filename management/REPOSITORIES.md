# 游戏仓库管理

2026-10-24 开始分阶段拆分。机器台账：[仓库映射](data/repositories.json)；当前进度：[部署总表](DEPLOYMENT_STATUS.md)；历史依据：[分仓记录](history/2026-10-24-repository-refactor.md)。

## 已拆分的正式源码入口

| 游戏 | 独立 GitHub 仓库 | 本地工作目录 | 发布状态 |
|---|---|---|---|
| Cluster Rush | [gamehubs-cluster-rush](https://github.com/seraseraqqq/gamehubs-cluster-rush)（私有） | `E:/Projects/game-sites/cluster-rush` | 尚未部署，等待嵌入许可和域名 |
| Acceleration City | [gamehubs-acceleration-city](https://github.com/seraseraqqq/gamehubs-acceleration-city)（私有） | `E:/Projects/game-sites/acceleration-city` | 用户暂缓发布，等待嵌入许可 |

两个仓库均保留原游戏的 Git 历史、对应调研资料和来源说明。GameHubs 内原目录是过渡快照，后续修改只进入独立仓库。旧公共仓库的历史仍然存在；创建私有仓库不会让已有公共历史变成私有。

## 五个独立开发的新项目

另有5个新游戏已创建独立私有仓库，完成本地可玩首版与已测范围；它们单列于下表及`management/data/repositories.json`的`plannedGames`，已有独立运行时但尚未部署，不计入原12游戏的线上导出/部署验收。

| 新游戏 | 独立GitHub仓库（私有） | 本地工作目录 | 当前状态 |
|---|---|---|---|
| Cutle | [gameshub-cutle](https://github.com/seraseraqqq/gameshub-cutle) | `E:/Projects/game-sites/cutle` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |
| Poople | [gameshub-poople](https://github.com/seraseraqqq/gameshub-poople) | `E:/Projects/game-sites/poople` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |
| Colordle | [gameshub-colordle](https://github.com/seraseraqqq/gameshub-colordle) | `E:/Projects/game-sites/colordle` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |
| Metazooa | [gameshub-metazooa](https://github.com/seraseraqqq/gameshub-metazooa) | `E:/Projects/game-sites/metazooa` | 130动物与分类数据审查完成；本地优化及源码已推送，未部署 |
| Travle | [gameshub-travle](https://github.com/seraseraqqq/gameshub-travle) | `E:/Projects/game-sites/travle` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |

新仓库按Owner本轮指定使用`gameshub-`前缀；原有`gamehubs-`仓库不改名。[工作空间与文档索引](NEW_GAME_PROJECTS.md)。2026-10-25五仓完整本地运行时与UI/交互/SEO工具优化均已推送各自main，并回读核对远端SHA；[优化交付与提交号](../research/2026-10-24-five-game-development/optimization-delivery.md)。尚无Vercel项目和已购域名。

## 暂保留在 GameHubs 的 10 个线上游戏

2048 Cupcakes、Block Blast、Coreball、Costcodle、Gulper.io、Head Soccer 2026、Minute Cryptic、Snow Rider 3D、Spacebar Counter、Krillion / STARLING。各自继续使用现有 Vercel 项目和 `games/<slug>` Root Directory。后续逐个迁移 Git 关联并验收，沿用现有 Vercel 项目以保留域名和环境设置。

每个项目的 Ignored Build Step：

```sh
node ../../scripts/vercel-ignore.mjs games/<slug>
```

它比较当前提交与**该项目、该分支上一次成功部署**，不只比较最后一条提交。自己的运行代码、资源、构建脚本或法律声明有变化才构建；管理文档、调研和其他游戏变化则跳过。历史缺失或比较失败时继续构建，避免漏发布。若将来引入共享运行库，将其路径追加到相关项目的命令参数中。

需要修改环境变量后重新导出时，可在 Vercel 对当前成功提交执行 Redeploy（相同 SHA 会构建）；也可以临时设置 `GAMEHUBS_FORCE_BUILD=1` 强制构建，完成后移除。不要依靠空提交强制构建。Vercel 仍可能显示跳过/取消的部署记录；跳过构建不等于完全没有部署事件。

## 后续约定

- 新游戏独立 GitHub 仓库、独立 Vercel 项目、独立域名；仓库默认私有。
- GameHubs 维护游戏台账、调研索引、部署验收和经营记录。
- 共享模板待样式及构建接口稳定后再抽取，不让一个模板改动立即触发全部线上游戏。
- 发布、可玩验收、允许索引、Search Console 和变现分别记录，不把部署成功当作全部完成。
