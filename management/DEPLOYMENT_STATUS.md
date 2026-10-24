# GameHubs 当前部署状态

更新：2026-10-24（Asia/Shanghai），SEO批次推送及自动部署后复查。范围：本工作区12个游戏。明天执行入口：[2026-10-25工作安排](plans/2026-10-25.md)。

**10个游戏已有线上版本，本次公开首页复查均HTTP200；2个尚未部署。7个页面允许索引，3个noindex。本轮7站新版本已上线；Block Blast、Head Soccer和Snow Rider受Vercel24小时部署限额影响，仍使用旧线上版本。**

GitHub main：`0bfd15323d64b1556813af448d107688f837b6d5`。12站28页SEO导出检查零失败；独立仓库Cluster Rush `73a4148`、Acceleration City `ba82e93`均已推送，继续暂缓发布。7个自动部署成功的站点已回读验证首页title/description与已验构建一致，分享图HTTP200；详见[本轮发布结果](../deployments/2026-10-24-seo-release.md)及[SEO总报告](../deployments/2026-10-24-seo-audit.md)。Costcodle正式域名canonical/地图已更正并上线；Gulperio新版文案也已上线。

| 游戏 | 当前线上地址 | 当前状态 | 下一步 |
|---|---|---|---|
| Block Blast | [playblockblastunblocked.com](https://playblockblastunblocked.com/) | 已上线，允许索引；本轮源码已推送，部署受限 | 配额恢复后发布并回读 |
| 2048 Cupcakes | [www.2048cupcakes.xyz](https://www.2048cupcakes.xyz/) | 已上线，允许索引 | 后续分仓 |
| Spacebar Counter | [www.spacebarcounter.xyz](https://www.spacebarcounter.xyz/) | 已上线，允许索引 | 后续分仓 |
| Gulper.io / Gulperio | [gulperio.com](https://gulperio.com/) | 新版文案已上线，允许索引；标题/描述/分享图已复核 | 后续分仓 |
| Head Soccer 2026 | [www.playheadsoccer.com](https://www.playheadsoccer.com/) | 已上线，允许索引；canonical仍指向裸域 | 统一为www最终域名后部署验收 |
| Krillion / STARLING | [krilliononline.com](https://krilliononline.com/) | 已上线，允许索引；目录为summit-unlimited | 后续分仓 |
| Costcodle | [costcodle.cc](https://costcodle.cc/) | 正式域名元信息修复已上线；canonical为costcodle.cc | Search Console接入/收录仍待确认 |
| Coreball | [gamehubs-coreball.vercel.app](https://gamehubs-coreball.vercel.app/) | 已上线到默认地址，noindex | 确定自有域名、绑定并验收 |
| Minute Cryptic Unlimited | [gamehubs-minute-cryptic-unlimited.vercel.app](https://gamehubs-minute-cryptic-unlimited.vercel.app/) | 已上线到默认地址，noindex | 确定自有域名、绑定并验收 |
| Snow Rider 3D | [snowrider3d.top](https://snowrider3d.top/) | Miniplay播放器已上线，noindex | 正式域名完整游玩/重开验收后开放索引 |
| Acceleration City | 已购playaccelerationcity.com；无公开部署 | 独立私有仓库已推送；用户暂缓发布 | 等待嵌入许可 |
| Cluster Rush | 域名未确认购买；无公开部署 | 独立私有仓库已推送 | 等待嵌入许可、域名及上线验收 |

HTTP200不等于游戏完整流程已验收；允许索引不等于已被Google收录。Search Console、真机性能和变现接入不在这里记作已完成。

## 仓库与构建进度

10个线上游戏仍在GameHubs，分别关联已有Vercel项目。各项目已配置目录构建过滤；实测1个游戏正确构建、8个无关游戏跳过，Gulperio因平台限额还缺实际规则执行验证。最新尝试显示CANCELED/限额不替换原有线上成功版本。

Cluster Rush和Acceleration City已迁到各自独立私有仓库；正式源码入口见[management/REPOSITORIES.md](REPOSITORIES.md)。GameHubs原目录仅保留迁移快照，后续不要在两边同时修改。

## 当前证据

- [15:51公开页面、索引状态、GitHub版本和限额状态](../deployments/evidence/2026-10-24/next-day-status-audit.json)
- [Gulperio待发布文案及21项检查](../deployments/2026-10-24-gulper-copy.md)
- [Costcodle域名修复及24项检查](../deployments/2026-10-24-costcodle-domain.md)
- [构建过滤和分仓记录](history/2026-10-24-repository-refactor.md)
- [Miniplay切换记录](../deployments/2026-10-24-snow-rider-miniplay.md)

历史13:17基线保存在`deployments/evidence/2026-10-24/workspace-vercel-snapshot.json`、`workspace-public-status.json`、`workspace-github-comparison.json`。这些是历史快照，不再代表最新main版本。本轮SEO已推送，实际部署结果以上方当前记录为准。
