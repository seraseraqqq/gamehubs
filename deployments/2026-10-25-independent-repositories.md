# 2026-10-25 独立仓库与 Vercel 迁移验收

> 本文保留当时阶段结果。用户随后已明确授权移除games/并推送管理仓库；[后续清理与恢复记录](../docs/history/2026-10-25-management-only-cleanup.json)，当前状态以根HANDOFF和正式站点记录为准。

用户本轮明确授权：测试部署限额，恢复可用后，为 games 中尚未分仓的游戏创建 gameshub-* 仓库，并逐个切换原 Vercel 项目的 Git 关联。本轮范围为10个已有线上游戏。

限额实测：新预览部署 `dpl_9iBN3hxkZ7SHAhEH5kAbhEyUM2uF` 为 READY，随后10个独立仓库的预览和正式部署均成功。证明当时可继续部署；未查询到精确剩余次数，不把成功构建表述为无限余量。未升级套餐、购买域名或创建自动化。

## 完成结果

- 10个新私有仓库，各自 main 已推送并回读验证完整SHA。原游戏子树Git历史和相关已跟踪研究均保留。
- 沿用10个现有Vercel项目；Git关联改为独立仓库，Root Directory清空为仓库根，移除旧共享Ignored Build Step。
- 每站独立预览和正式部署READY；预览均noindex，正式首页均200，页面引用的自有脚本逐文件哈希与准备构建一致。
- 域名、跳转、环境变量键/类型/目标/ID元数据、访问保护指纹、其他构建设置前后相同；没有改写环境变量。
- 正式站7个允许索引，Coreball、Minute Cryptic、Snow Rider仍noindex；许可、真机、完整游玩和Google收录未据此记为通过。
- 按原gamehubs仓库ID查询本团队Vercel项目，结果为0；以后推送GameHubs管理文档不会触发这些游戏的Git部署。

## 仓库和部署

| 游戏 | 独立私有仓库 | main SHA | 原Vercel项目 | 正式地址 / robots |
|---|---|---|---|---|
| Block Blast Unblocked | [gameshub-block-blast-unblocked](https://github.com/seraseraqqq/gameshub-block-blast-unblocked) | `07cf140be88943ee8516a6f21c1cfbd902bb3c4d` | `block-blast-unblocked` | [https://playblockblastunblocked.com/](https://playblockblastunblocked.com/) · index |
| Costcodle | [gameshub-costcodle](https://github.com/seraseraqqq/gameshub-costcodle) | `a2af21d0e74622a8a35098ea29b4700dd20f848d` | `costcodle-unlimited` | [https://costcodle.cc/](https://costcodle.cc/) · index |
| Gulper.Io Game | [gameshub-gulper-io](https://github.com/seraseraqqq/gameshub-gulper-io) | `1d94e2c8d17f6e6c39dbcfa91237371fbb1c907e` | `gulperio-game` | [https://gulperio.com/](https://gulperio.com/) · index |
| Krillion Unlimited | [gameshub-krillion-unlimited](https://github.com/seraseraqqq/gameshub-krillion-unlimited) | `b602921f27aa53df7a8db37b7f13d89031575835` | `gamehubs-summit-unlimited` | [https://krilliononline.com/](https://krilliononline.com/) · index |
| Spacebar Counter | [gameshub-spacebar-counter](https://github.com/seraseraqqq/gameshub-spacebar-counter) | `34f02d435684c22fd53fa8f8102f6d75b242f30c` | `gamehubs-spacebar-counter` | [https://www.spacebarcounter.xyz/](https://www.spacebarcounter.xyz/) · index |
| 2048 Cupcakes | [gameshub-2048-cupcakes](https://github.com/seraseraqqq/gameshub-2048-cupcakes) | `c26b71c763101186775aa3613562a48adc6f0918` | `gamehubs-2048-cupcakes` | [https://www.2048cupcakes.xyz/](https://www.2048cupcakes.xyz/) · index |
| Coreball | [gameshub-coreball](https://github.com/seraseraqqq/gameshub-coreball) | `2793a39f4c3417d16b746e758153a97fa8c07113` | `gamehubs-coreball` | [https://gamehubs-coreball.vercel.app/](https://gamehubs-coreball.vercel.app/) · noindex |
| Minute Cryptic Unlimited | [gameshub-minute-cryptic-unlimited](https://github.com/seraseraqqq/gameshub-minute-cryptic-unlimited) | `b5d18ddb0a0f7bf057037b7860f18b255da6af84` | `gamehubs-minute-cryptic-unlimited` | [https://gamehubs-minute-cryptic-unlimited.vercel.app/](https://gamehubs-minute-cryptic-unlimited.vercel.app/) · noindex |
| Snow Rider 3D Unblocked | [gameshub-snow-rider-3d-unblocked](https://github.com/seraseraqqq/gameshub-snow-rider-3d-unblocked) | `d86a93bf1fa2f726aae71d0447c73b592a7ed3d3` | `gamehubs-snow-rider-3d` | [https://snowrider3d.top/](https://snowrider3d.top/) · noindex |
| Head Soccer 2026 | [gameshub-head-soccer-2026](https://github.com/seraseraqqq/gameshub-head-soccer-2026) | `849cb11b14bef244156853ec1e8be5e3f4c855d1` | `gamehubs-head-soccer-2026` | [https://www.playheadsoccer.com/](https://www.playheadsoccer.com/) · index |

逐站正式部署ID、完整项目ID及域名/设置回读见[结果汇总](evidence/2026-10-25-repository-migration/migration-results.json)、[发布仓库](evidence/2026-10-25-repository-migration/published-repositories.json)与各站 `*-final.json`。

## 来源与后续入口

拆分来源为管理仓库已提交版本 `dc5994e61228e028c068137a5d69bce08b172fd0`；没有把父仓库尚未审查的目录改造或未跟踪研究混入独立源码。每个新仓库的 ORIGIN.md、MIGRATION.json 记录来源及适配。独立检出位于本机 `/Users/xg/Projects/SEO-Projects/game-sites/<siteId>`；跨设备以 `data/sites/<id>.json` 的 repository + directory + branch 为唯一身份。

全部12个原 `games/` 子目录现为冻结快照；不删除，以保留旧来源和历史QA用途。不要在其中继续开发；运行时文件和 `scripts/vercel-ignore.mjs` 未改动，该共享脚本已不再用于这10个线上项目。

Cluster Rush、Acceleration City已有独立私有仓库，本轮未重复创建、未改名、未部署；原许可与域名限制保留。另5个新游戏仓库保持尚未部署。Head Soccer现有canonical仍需另行修复；本轮保持原站SEO状态，没有将迁移当作SEO修复验收。

GameHubs管理仓库的本地目录整理、台账与本报告仍未提交/推送。仅10个独立源码仓库及已授权Vercel迁移发生远端写入。

## 可核验依据

- [限额试部署](evidence/2026-10-25-repository-migration/quota-check.json)
- [迁移前项目配置](evidence/2026-10-25-repository-migration/project-settings-before.json) · [域名](evidence/2026-10-25-repository-migration/domains-before.json) · [公开页面](evidence/2026-10-25-repository-migration/public-before.json)
- [迁移后已无GameHubs关联项目](evidence/2026-10-25-repository-migration/monorepo-links-after.json)
- [最终源码及父仓库校验](evidence/2026-10-25-repository-migration/final-source-verification.json)
- 每站预览/正式部署READY、HTTP/脚本哈希和最终关联分别保存在同目录的 `*-deployment-ready.json`、`*-http.json`、`*-final.json`。Costcodle等受保护预览使用现有Vercel账号经CLI访问，未关闭保护。
