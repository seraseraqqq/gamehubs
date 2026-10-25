# GameHubs 当前部署状态

更新：2026-10-25（Asia/Shanghai）。用户授权的Vercel限额测试及10站独立仓库迁移已完成。

**部署容量已实测恢复可用；10个线上游戏均从各自独立私有仓库完成预览及正式READY部署，首页HTTP200。7站允许索引、3站noindex。原Vercel项目ID、域名、环境配置与访问保护保持。**

原GameHubs仓库ID在本团队的关联Vercel项目查询结果为0。17个登记项目均有独立源码入口；其中原12游戏为10个已部署、2个继续暂缓，另5个新项目仍未部署。

| 游戏 | 当前线上地址 | 独立仓库 | 当前索引状态 / 后续事项 |
|---|---|---|---|
| Block Blast Unblocked | [https://playblockblastunblocked.com/](https://playblockblastunblocked.com/) | [gameshub-block-blast-unblocked](https://github.com/seraseraqqq/gameshub-block-blast-unblocked) | 允许索引；GSC/实际收录未核实 |
| Costcodle | [https://costcodle.cc/](https://costcodle.cc/) | [gameshub-costcodle](https://github.com/seraseraqqq/gameshub-costcodle) | 允许索引；GSC/实际收录未核实 |
| Gulper.Io Game | [https://gulperio.com/](https://gulperio.com/) | [gameshub-gulper-io](https://github.com/seraseraqqq/gameshub-gulper-io) | 允许索引；GSC/实际收录未核实 |
| Krillion Unlimited | [https://krilliononline.com/](https://krilliononline.com/) | [gameshub-krillion-unlimited](https://github.com/seraseraqqq/gameshub-krillion-unlimited) | 允许索引；GSC/实际收录未核实 |
| Spacebar Counter | [https://www.spacebarcounter.xyz/](https://www.spacebarcounter.xyz/) | [gameshub-spacebar-counter](https://github.com/seraseraqqq/gameshub-spacebar-counter) | 允许索引；GSC/实际收录未核实 |
| 2048 Cupcakes | [https://www.2048cupcakes.xyz/](https://www.2048cupcakes.xyz/) | [gameshub-2048-cupcakes](https://github.com/seraseraqqq/gameshub-2048-cupcakes) | 允许索引；GSC/实际收录未核实 |
| Coreball | [https://gamehubs-coreball.vercel.app/](https://gamehubs-coreball.vercel.app/) | [gameshub-coreball](https://github.com/seraseraqqq/gameshub-coreball) | noindex；等待独立域名和验收 |
| Minute Cryptic Unlimited | [https://gamehubs-minute-cryptic-unlimited.vercel.app/](https://gamehubs-minute-cryptic-unlimited.vercel.app/) | [gameshub-minute-cryptic-unlimited](https://github.com/seraseraqqq/gameshub-minute-cryptic-unlimited) | noindex；等待独立域名和验收 |
| Snow Rider 3D Unblocked | [https://snowrider3d.top/](https://snowrider3d.top/) | [gameshub-snow-rider-3d-unblocked](https://github.com/seraseraqqq/gameshub-snow-rider-3d-unblocked) | noindex；等待正式域名完整游玩/重开验收 |
| Head Soccer 2026 | [https://www.playheadsoccer.com/](https://www.playheadsoccer.com/) | [gameshub-head-soccer-2026](https://github.com/seraseraqqq/gameshub-head-soccer-2026) | 允许索引；沿用原canonical，www一致性另待修复 |
| Acceleration City | 无公开部署 | [gamehubs-acceleration-city](https://github.com/seraseraqqq/gamehubs-acceleration-city) | 用户暂缓，等待嵌入许可 |
| Cluster Rush | 无公开部署 | [gamehubs-cluster-rush](https://github.com/seraseraqqq/gamehubs-cluster-rush) | 等待嵌入许可与域名 |

## 本轮验收范围

- 新10仓保留子树历史、相关研究和来源说明，main完整SHA已核实。
- 每站从新仓库创建独立预览、验证noindex后，创建正式部署并回读READY、源码SHA、首页title/canonical/robots和自有脚本哈希。受保护预览通过现有账号访问。
- 域名/跳转、环境元数据、保护指纹及其他构建设置与迁移前相同；没有改写环境变量。
- Root Directory为空，旧共享Ignored Build Step已清除；GameHubs内的games/副本已按后续授权移除，旧源码保存在历史提交和仓库外备份。
- 没有重测完整游玩、真机、性能或搜索引擎收录。Snow Rider、Coreball和Minute Cryptic保持noindex；两款许可受限游戏保持未部署。

## 当前证据

[迁移总报告与版本](../deployments/2026-10-25-independent-repositories.md) · [逐站结果](../deployments/evidence/2026-10-25-repository-migration/migration-results.json) · [限额测试](../deployments/evidence/2026-10-25-repository-migration/quota-check.json) · [唯一源码入口](REPOSITORIES.md)。

2026-10-24的限额失败及旧部署仍作为历史保留于deployments/，已不代表本次状态。[旧计划](plans/2026-10-25.md)也按历史阅读；没有将其中游玩、购买或GSC待办自动记为完成。本次管理目录整理、游戏副本清理与台账更新均属于用户随后明确授权的GitHub交付；[清理与恢复记录](history/2026-10-25-management-only-cleanup.json)。本次清理不触发新的游戏部署。
