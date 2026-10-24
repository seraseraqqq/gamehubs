# GameHubs 部署状态

仓库改造补充：Cluster Rush 与 Acceleration City 已迁入各自独立私有仓库，仍未部署；本仓库原目录保留为快照。正式源码和构建策略见 [REPOSITORIES.md](REPOSITORIES.md)。以下为改造前 13:17 的部署基线，后续构建验证单独记录在 [REPOSITORY_REFACTOR.md](REPOSITORY_REFACTOR.md)。

核对时间：2026-10-24 13:17（Asia/Shanghai）。范围：本工作区12个游戏目录、GitHub `seraseraqqq/gamehubs` 的 main，以及当前 Vercel 团队。Vercel 其他11个非本仓库项目不计入。

**12个游戏目录均已推送 GitHub；10个已在 Vercel 成功部署；2个尚未部署。**

GitHub 已推送版本：`144f269628a5f564fa1f9418e0e6747c8e91ed01`。10个部署对应的游戏目录树均与这个版本一致；部分部署提交较早，但对应游戏代码没有落后。

## 已部署到 Vercel：10个

以下项目均为 production / READY，公开首页在本次检查中均返回 HTTPS200。页面可访问不等于完整游戏流程已验收，也不等于已被搜索引擎收录。

| 游戏 | 工作区目录 | 访问地址 | 当前状态 |
|---|---|---|---|
| 2048 Cupcakes | games/2048-cupcakes | https://www.2048cupcakes.xyz/ | 已部署，页面可访问，未设 noindex |
| Block Blast Unblocked | games/block-blast-unblocked | https://playblockblastunblocked.com/ | 已部署，页面可访问，未设 noindex |
| Costcodle | games/costcodle | https://costcodle-unlimited.vercel.app/ | 已部署到 Vercel 默认域名，页面可访问，未设 noindex |
| Gulper.io | games/gulperio | https://gulperio.com/ | 已部署，页面可访问，未设 noindex |
| Head Soccer 2026 | games/head-soccer-2026 | https://www.playheadsoccer.com/ | 已部署；裸域301到www，但HTML canonical仍指向裸域，需要统一 |
| Spacebar Counter | games/spacebar-counter | https://www.spacebarcounter.xyz/ | 已部署，页面可访问，未设 noindex |
| Krillion / STARLING | games/summit-unlimited | https://krilliononline.com/ | 已部署；目录与产品显示名称不同，属于同一站 |
| Coreball | games/coreball | https://gamehubs-coreball.vercel.app/ | 已部署、页面可访问；尚未绑定独立域名，仍为 noindex |
| Minute Cryptic Unlimited | games/minute-cryptic-unlimited | https://gamehubs-minute-cryptic-unlimited.vercel.app/ | 已部署、页面可访问；尚未绑定独立域名，仍为 noindex |
| Snow Rider 3D | games/snow-rider-3d-unblocked | https://snowrider3d.top/ | Miniplay替换已部署；正式域名完整游玩待验收，仍为 noindex |

Coreball 和 Minute Cryptic 并非“只推送、未部署”；旧记录只写等待域名，不能用它判断 Vercel 部署是否存在。默认域名本次均可匿名访问，没有遇到登录拦截。

## 已推送 GitHub、尚未部署：2个

| 游戏 | 工作区目录 | 域名情况 | 当前待办 |
|---|---|---|---|
| Acceleration City | games/acceleration-city | 已购 playaccelerationcity.com | 当前团队无项目；用户明确暂缓发布，等待游戏嵌入许可 |
| Cluster Rush | games/cluster-rush | 项目记录中尚未购买域名；候选 playclusterrush.com | 当前团队无项目；等待嵌入许可确认、域名定稿与部署 |

本次没有发现“整个游戏目录仍未推送 GitHub”的项目。未跟踪的部署验收证据文件属于记录，不是未推送的新游戏。

## Snow Rider 的准确进度

已部署提交 `c6034dc0f5e6fafbee20e2a3514c29e98baa5b0a`，Vercel部署 `dpl_AJ7j1EWmkwdfAgegzcnexGQywtW3` 为 READY。线上 player.js 使用 https://www.miniplay.com/embed/snow-rider-3d ，已不再直接嵌入原来的 GameDistribution 地址。

仍需按用户要求完成正式域名上的进入游戏、实际滑行与按键、结束和重开等验收，之后才将 PUBLISHER_DOMAIN_STATUS 设为 verified 并开放索引。上轮电脑操作因无法可靠识别 Windows 浏览器当前网址而中断，没有完成该验收，也没有开放索引。

## 核对证据

- [Vercel项目、域名及部署快照](deployments/evidence/2026-10-24/workspace-vercel-snapshot.json)
- [公开页面HTTP与Snow Rider实际播放器地址](deployments/evidence/2026-10-24/workspace-public-status.json)
- [GitHub目录与部署版本比较](deployments/evidence/2026-10-24/workspace-github-comparison.json)
- [Miniplay替换发布记录](deployments/2026-10-24-snow-rider-miniplay.md)

本次只整理核对记录，未创建新部署、调整域名或开放索引。
