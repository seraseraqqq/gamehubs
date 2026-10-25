# GameHubs 当前部署状态

更新：2026-10-25（Asia/Shanghai）。用户授权的Vercel限额测试及10站独立仓库迁移已完成。

**当前17个登记游戏均有独立私有仓库和Vercel正式READY部署，首页HTTP200；8站允许索引、9站noindex。原十站迁移保持项目ID、域名和环境；后续两站新建独立项目。允许索引不代表搜索引擎已收录。**

随后用户明确解除 Acceleration City 与 Cluster Rush 的发布暂缓，两站均已从独立仓库 main 完成 Vercel 正式 READY 部署。Acceleration City 的 Spaceship 域名及 HTTPS 已接通；Cluster Rush 已由用户自行接通 playclusterrush.online，本轮DNS/HTTPS/www跳转核验通过。[两站发布记录](../deployments/2026-10-25-two-game-release.md)。17个登记项目均已部署；后续五站默认域发布及验收见[最新记录](../deployments/2026-10-25-five-game-release.md)。

当前17站Vercel Web Analytics均已接入、开启、真实请求200且后台已收数；10个独立域名均为不带www主站/www301，其余7站保留默认域。[本轮完整记录](../deployments/2026-10-25-portfolio-analytics.md)。

| 游戏 | 当前线上地址 | 独立仓库 | 当前索引状态 / 后续事项 |
|---|---|---|---|
| Block Blast Unblocked | [https://playblockblastunblocked.com/](https://playblockblastunblocked.com/) | [gameshub-block-blast-unblocked](https://github.com/seraseraqqq/gameshub-block-blast-unblocked) | 允许索引；GSC/实际收录未核实 |
| Costcodle | [https://costcodle.cc/](https://costcodle.cc/) | [gameshub-costcodle](https://github.com/seraseraqqq/gameshub-costcodle) | 允许索引；GSC/实际收录未核实 |
| Gulper.Io Game | [https://gulperio.com/](https://gulperio.com/) | [gameshub-gulper-io](https://github.com/seraseraqqq/gameshub-gulper-io) | 允许索引；GSC/实际收录未核实 |
| Krillion Unlimited | [https://krilliononline.com/](https://krilliononline.com/) | [gameshub-krillion-unlimited](https://github.com/seraseraqqq/gameshub-krillion-unlimited) | 允许索引；GSC/实际收录未核实 |
| Spacebar Counter | [https://spacebarcounter.xyz/](https://spacebarcounter.xyz/) | [gameshub-spacebar-counter](https://github.com/seraseraqqq/gameshub-spacebar-counter) | 允许索引；GSC/实际收录未核实 |
| 2048 Cupcakes | [https://2048cupcakes.xyz/](https://2048cupcakes.xyz/) | [gameshub-2048-cupcakes](https://github.com/seraseraqqq/gameshub-2048-cupcakes) | 允许索引；GSC/实际收录未核实 |
| Coreball | [https://gamehubs-coreball.vercel.app/](https://gamehubs-coreball.vercel.app/) | [gameshub-coreball](https://github.com/seraseraqqq/gameshub-coreball) | noindex；等待独立域名和验收 |
| Minute Cryptic Unlimited | [https://gamehubs-minute-cryptic-unlimited.vercel.app/](https://gamehubs-minute-cryptic-unlimited.vercel.app/) | [gameshub-minute-cryptic-unlimited](https://github.com/seraseraqqq/gameshub-minute-cryptic-unlimited) | noindex；等待独立域名和验收 |
| Snow Rider 3D Unblocked | [https://snowrider3d.top/](https://snowrider3d.top/) | [gameshub-snow-rider-3d-unblocked](https://github.com/seraseraqqq/gameshub-snow-rider-3d-unblocked) | noindex；等待正式域名完整游玩/重开验收 |
| Head Soccer 2026 | [https://playheadsoccer.com/](https://playheadsoccer.com/) | [gameshub-head-soccer-2026](https://github.com/seraseraqqq/gameshub-head-soccer-2026) | 允许索引；apex canonical与www301已验 |
| Acceleration City | [playaccelerationcity.com](https://playaccelerationcity.com/) | [gamehubs-acceleration-city](https://github.com/seraseraqqq/gamehubs-acceleration-city) | 正式 index；www301已验；菜单/驾驶场景已加载，完整游玩/真机待验 |
| Cluster Rush | [playclusterrush.online](https://playclusterrush.online/) | [gamehubs-cluster-rush](https://github.com/seraseraqqq/gamehubs-cluster-rush) | online域名已接通，仍noindex；关卡启动已测，完整外部验收待完成 |
| Cutle | [gameshub-cutle.vercel.app](https://gameshub-cutle.vercel.app/) | [gameshub-cutle](https://github.com/seraseraqqq/gameshub-cutle) | noindex；本轮部署与冒烟通过，完整外部验收待完成 |
| Poople | [gameshub-poople.vercel.app](https://gameshub-poople.vercel.app/) | [gameshub-poople](https://github.com/seraseraqqq/gameshub-poople) | noindex；本轮部署与冒烟通过，完整外部验收待完成 |
| Colordle | [gameshub-colordle.vercel.app](https://gameshub-colordle.vercel.app/) | [gameshub-colordle](https://github.com/seraseraqqq/gameshub-colordle) | noindex；本轮部署与冒烟通过，完整外部验收待完成 |
| Metazooa | [gameshub-metazooa.vercel.app](https://gameshub-metazooa.vercel.app/) | [gameshub-metazooa](https://github.com/seraseraqqq/gameshub-metazooa) | noindex；本轮部署与冒烟通过，完整外部验收待完成 |
| Travle | [gameshub-travle.vercel.app](https://gameshub-travle.vercel.app/) | [gameshub-travle](https://github.com/seraseraqqq/gameshub-travle) | noindex；本轮部署与冒烟通过，完整外部验收待完成 |

## 十站迁移验收范围（两站后续发布见上方独立记录）

- 新10仓保留子树历史、相关研究和来源说明，main完整SHA已核实。
- 每站从新仓库创建独立预览、验证noindex后，创建正式部署并回读READY、源码SHA、首页title/canonical/robots和自有脚本哈希。受保护预览通过现有账号访问。
- 域名/跳转、环境元数据、保护指纹及其他构建设置与迁移前相同；没有改写环境变量。
- Root Directory为空，旧共享Ignored Build Step已清除；GameHubs内的games/副本已按后续授权移除，旧源码保存在历史提交和仓库外备份。
- 该十站迁移没有重测完整游玩、真机、性能或搜索引擎收录。Snow Rider、Coreball和Minute Cryptic保持noindex；当时另两站未部署的状态，已被本页上方的后续明确发布授权及验收取代。

## 当前证据

[迁移总报告与版本](../deployments/2026-10-25-independent-repositories.md) · [逐站结果](../deployments/evidence/2026-10-25-repository-migration/migration-results.json) · [限额测试](../deployments/evidence/2026-10-25-repository-migration/quota-check.json) · [唯一源码入口](REPOSITORIES.md)。

2026-10-24的限额失败及旧部署仍作为历史保留于deployments/，已不代表本次状态。[旧计划](plans/2026-10-25.md)也按历史阅读；没有将其中游玩、购买或GSC待办自动记为完成。本次管理目录整理、游戏副本清理与台账更新均属于用户随后明确授权的GitHub交付；[清理与恢复记录](history/2026-10-25-management-only-cleanup.json)。本次清理不触发新的游戏部署。
