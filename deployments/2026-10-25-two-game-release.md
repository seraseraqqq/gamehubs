# Acceleration City 与 Cluster Rush 发布

日期：2026-10-25（Asia/Shanghai）。用户明确要求解除两站此前的发布暂缓、部署到 Vercel 并连接 Spaceship 匹配域名。此授权是站主的发布决定，不是第三方游戏授权证明。

| 游戏 | Vercel 项目 / 生产部署 | Git 源码版本 | 访问地址与状态 |
|---|---|---|---|
| Acceleration City | `prj_9Xu3Dk2dZKyougmAWZyddtI1TsEz` / `dpl_CKb6dzPxG7nx1ih78wkeBmvWtSAG`，READY | `3ca08244e464ee03ed3ba5e87e642500fe66b159` | https://playaccelerationcity.com/，HTTPS 200；www 308 到根域，保留路径/查询参数 |
| Cluster Rush | `prj_S11s0HbRdKMAiWjAdOkKE438olI8` / `dpl_9XrPiveMryPL1FjjVB4gaw2TWdyt`，READY | `3ee20ab4330e785b2c3e642d805b4295a5f90757` | https://gamehubs-cluster-rush.vercel.app/，公开 HTTPS 200，默认 noindex；独立域名尚未购买 |

两项目均属于 `gx03410-8651s-projects`，关联各自同名独立私有 GitHub 仓库、main 生产分支；仓库根构建 `node scripts/build.mjs`，输出 `dist`。推送后由 Git 集成自动部署，回读的生产版本与上述 SHA 一致。

## 域名

Spaceship 已登录账户中有 `playaccelerationcity.com`；Advanced DNS 原来没有自定义记录。本次按 Vercel 对该项目返回的推荐值新增两条记录：

- `@ A 216.198.79.1`，TTL 30 分钟。
- `www CNAME cf9798771acac180.vercel-dns-017.com.`，TTL 30 分钟。

保留 Spaceship 名称服务器 `launch1.spaceship.net`、`launch2.spaceship.net`；未购买、转移、改动其他域名或邮件记录。Vercel 回读两个域名 `misconfigured=false`，HTTPS 与 www 跳转均已实测通过。最初 www 证书尚在签发时出现 TLS 名称不匹配；未绕过证书验证，签发生效后重测通过。

Spaceship 中搜索 `cluster` 为 0 结果。用户选择先查价再确认购买。`playclusterrush.com` 实时报价：可注册，1 年 US$8.88 + ICANN US$0.20 = US$9.08，含免费隐私保护，无附加产品；页面续费基础价 US$9.98/年，可能另计 ICANN 等费用。报价时订单停在“立即支付”前，尚未付款/注册。随后用户明确暂不购买并保留 Vercel 地址，已退出结账；移除购物车时 Spaceship 报错，刷新后出现安全验证，未确认移除成功。用户随后要求保留现场、由其自行处理，已停止操作；不能将报价或购物车当作所有权。

## 代码与验收

- Acceleration City 原有生产 gate 只接受“许可确认”。本次新增独立 `OWNER_DEPLOYMENT_APPROVED` 分支，响应站主明确的发布指令，报告为 `owner-approved-unconfirmed-rights`，不设置 `GAME_EMBED_LICENSE_CONFIRMED`。无审批时仍拒绝生产导出，预览始终 noindex。91 项构建与交互检查通过。
- Cluster Rush 原有导出支持 `SITE_ORIGIN`。107 项检查通过，当前没有选定已购独立域名，因此 Vercel 默认域保留 noindex；未把候选域名硬编码为 canonical。
- [Acceleration City HTTP 验收](evidence/2026-10-25-two-game-release/acceleration-city-http.json)：10 项通过，包括三条页面、资源、robots、sitemap、真实 404、www 跳转。
- [Cluster Rush HTTP 验收](evidence/2026-10-25-two-game-release/cluster-rush-http.json)：11 项通过，包括五条页面、资源、预览 sitemap 缺席及真实 404。
- 使用本机已登录 Edge 实测生产页面。Acceleration City 点击 Play 加载菜单，Continue 进入车辆驾驶场景；Cluster Rush 首次 iframe 加载较慢，重载后显示关卡菜单、能启动第一关并进入失败/重试状态。未宣称全关卡通过、手机触控、原生全屏或性能达标。
- 初始浏览器检测发现 OpenCLI 扩展为 1.0.26，缺少当前 Skill 要求的隔离行为；未擅自安装/升级扩展，改用内置浏览器工具操作现有 Edge。Spaceship API 脚本依赖另一设备的 macOS Keychain，本设备未获得相关 API 凭据，DNS 因此通过已登录 UI 完成。

截图：[Acceleration City 驾驶场景](evidence/2026-10-25-two-game-release/acceleration-city-play.png)、[Cluster Rush 运行状态](evidence/2026-10-25-two-game-release/cluster-rush-play.png)、[域名订单报价](evidence/2026-10-25-two-game-release/playclusterrush-quote.png)。

## 当前决定与后续

用户后续明确选择“暂不购买，保留 Vercel 地址”。订单未付款、域名未注册；保留 https://gamehubs-cluster-rush.vercel.app/ 及当前 noindex 状态，独立域名购买/绑定不再作为当前阻塞或等待确认的任务。实际收录、GSC、真机与完整游玩仍单独验收。

只读验收工具已保存为 `scripts/check-game-release.mjs`，支持 origin、页面列表、www 跳转和报告路径参数；本轮上述两个正式地址已实际运行。

两仓发布验收接力已提交并推送；仅文档收尾触发的最后生产部署也已回读 READY，表中 SHA 为最终生产版本。初次发布的版本与部署 ID 保留在 manifest 的 initialRelease。
