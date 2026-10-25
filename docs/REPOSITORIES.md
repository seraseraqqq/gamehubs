# 游戏仓库管理

当前唯一维护入口为`data/sites/*.json`，下表为便于阅读的源码指引；原设备路径不是本机可用路径。2026-10-24开始分阶段拆分。生成兼容台账：[仓库映射](../data/repositories.json)；当前进度：[部署总表](DEPLOYMENT_STATUS.md)；历史依据：[分仓记录](history/2026-10-24-repository-refactor.md)。

## 已拆分的正式源码入口

| 游戏 | 独立 GitHub 仓库 | 原设备目录（历史） | 发布状态 |
|---|---|---|---|
| Cluster Rush | [gamehubs-cluster-rush](https://github.com/seraseraqqq/gamehubs-cluster-rush)（私有） | `E:/Projects/game-sites/cluster-rush` | 尚未部署，等待嵌入许可和域名 |
| Acceleration City | [gamehubs-acceleration-city](https://github.com/seraseraqqq/gamehubs-acceleration-city)（私有） | `E:/Projects/game-sites/acceleration-city` | 用户暂缓发布，等待嵌入许可 |

两个仓库均保留原游戏的 Git 历史、对应调研资料和来源说明。GameHubs内原目录已在2026-10-25后续授权清理中移除；后续修改只进入独立仓库。旧公共仓库的历史仍然存在；创建私有仓库不会让已有公共历史变成私有。

## 五个独立开发的新项目

另有5个新游戏已创建独立私有仓库，完成本地可玩首版与已测范围；它们单列于下表及`data/repositories.json`的`plannedGames`，已有独立运行时但尚未部署，不计入原12游戏的线上导出/部署验收。

| 新游戏 | 独立GitHub仓库（私有） | 原设备目录（历史） | 当前状态 |
|---|---|---|---|
| Cutle | [gameshub-cutle](https://github.com/seraseraqqq/gameshub-cutle) | `E:/Projects/game-sites/cutle` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |
| Poople | [gameshub-poople](https://github.com/seraseraqqq/gameshub-poople) | `E:/Projects/game-sites/poople` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |
| Colordle | [gameshub-colordle](https://github.com/seraseraqqq/gameshub-colordle) | `E:/Projects/game-sites/colordle` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |
| Metazooa | [gameshub-metazooa](https://github.com/seraseraqqq/gameshub-metazooa) | `E:/Projects/game-sites/metazooa` | 130动物与分类数据审查完成；本地优化及源码已推送，未部署 |
| Travle | [gameshub-travle](https://github.com/seraseraqqq/gameshub-travle) | `E:/Projects/game-sites/travle` | 本地优化与Chrome回归完成，源码已推送；实体设备/玩家待验收，未部署 |

新仓库按Owner本轮指定使用`gameshub-`前缀；原有`gamehubs-`仓库不改名。[工作空间与文档索引](NEW_GAME_PROJECTS.md)。2026-10-25五仓完整本地运行时与UI/交互/SEO工具优化均已推送各自main，并回读核对远端SHA；[优化交付与提交号](../research/2026-10-24-five-game-development/optimization-delivery.md)。尚无Vercel项目和已购域名。

## 2026-10-25 已迁移的10个线上游戏

全部使用独立私有仓库，沿用原Vercel项目与域名。各项目Root Directory为空（仓库根目录），旧共享Ignored Build Step已清除。下表本机检出位于`/Users/xg/Projects/SEO-Projects/game-sites/<siteId>`；跨设备按正式站点记录重新定位。

| 游戏 | 独立仓库 | Vercel项目 |
|---|---|---|
| Block Blast Unblocked | [gameshub-block-blast-unblocked](https://github.com/seraseraqqq/gameshub-block-blast-unblocked) | `block-blast-unblocked` |
| Costcodle | [gameshub-costcodle](https://github.com/seraseraqqq/gameshub-costcodle) | `costcodle-unlimited` |
| Gulper.Io Game | [gameshub-gulper-io](https://github.com/seraseraqqq/gameshub-gulper-io) | `gulperio-game` |
| Krillion Unlimited | [gameshub-krillion-unlimited](https://github.com/seraseraqqq/gameshub-krillion-unlimited) | `gamehubs-summit-unlimited` |
| Spacebar Counter | [gameshub-spacebar-counter](https://github.com/seraseraqqq/gameshub-spacebar-counter) | `gamehubs-spacebar-counter` |
| 2048 Cupcakes | [gameshub-2048-cupcakes](https://github.com/seraseraqqq/gameshub-2048-cupcakes) | `gamehubs-2048-cupcakes` |
| Coreball | [gameshub-coreball](https://github.com/seraseraqqq/gameshub-coreball) | `gamehubs-coreball` |
| Minute Cryptic Unlimited | [gameshub-minute-cryptic-unlimited](https://github.com/seraseraqqq/gameshub-minute-cryptic-unlimited) | `gamehubs-minute-cryptic-unlimited` |
| Snow Rider 3D Unblocked | [gameshub-snow-rider-3d-unblocked](https://github.com/seraseraqqq/gameshub-snow-rider-3d-unblocked) | `gamehubs-snow-rider-3d` |
| Head Soccer 2026 | [gameshub-head-soccer-2026](https://github.com/seraseraqqq/gameshub-head-soccer-2026) | `gamehubs-head-soccer-2026` |

全部12个原games/目录已按用户授权移出管理仓库；本机文件有仓库外备份，旧代码保留在Git提交dc5994e61228e028c068137a5d69bce08b172fd0。仅在独立仓库继续开发；source.archivedSnapshots记录恢复来源。旧共享忽略、分仓准备和portfolio导出检查三项工具已退役。私有新仓库不改变旧公共历史可见性。

[完整来源、SHA、部署及验收证据](../deployments/2026-10-25-independent-repositories.md)。预览/正式构建及公开页面通过不替代完整游玩、真机与索引权限验收。

## 后续约定

- 新游戏独立 GitHub 仓库、独立 Vercel 项目、独立域名；仓库默认私有。
- GameHubs 维护游戏台账、调研索引、部署验收和经营记录。
- 共享模板待样式及构建接口稳定后再抽取，不让一个模板改动立即触发全部线上游戏。
- 发布、可玩验收、允许索引、Search Console 和变现分别记录，不把部署成功当作全部完成。
