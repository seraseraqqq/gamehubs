# Vercel 部署额度审计 · 2026-10-25

后续已按用户要求修复web重复Git关联，并消除已部署项目的重复导入建议；见[修复与线上复核](FIXES.md)。下文是修复前审计快照。

北京时间截至 2026-10-25 14:58:40，范围为团队 `gx03410-8651s-projects`；本轮只读，未部署、断开关联、删除项目或升级套餐。

## 当前关联

- 全量核对 29 个项目，当前关联主仓库 `seraseraqqq/gamehubs` 的项目为 **0**。
- 正式 17 站均与登记的独立仓库匹配，全部校验通过。
- 发现额外 `web` 项目（`prj_udzq0gqczTg3PIf9vw8S5Mz30Lsc`）与正式 `gameshub-travle` 同时关联 `seraseraqqq/gameshub-travle`。`web` Root Directory 为 `apps/web`，当前仍关联；今天四次部署均 ERROR，无用户自定义域名，尚未解除连接。

## 今天的可见部署

共 **81** 条：READY 60、ERROR 4、CANCELED 17；production 70、preview 11。

| 来源 | 次数 |
|---|---:|
| SEO 本轮已发布修复 | 5 |
| 5 站 Analytics 后续修复 | 5 |
| 重复 web 项目失败 | 4 |
| 17 站 Analytics 首轮 | 17 |
| 新站首次发布与发布记录 | 9 |
| 10 站迁移：预览与正式 | 20 |
| 旧主仓库来源部署 | 21 |

旧主仓库 21 条细分：00:00:40 的 `62defcb9` 同时触发 10 项；00:41:29 的 `dc5994e6` 同时触发 10 项；10:17:24 Block Blast 另有一次同旧提交的预览部署。不能把 21 条误写成两次 push 自动触发了 21 项。

迁移 20 条为 10 站每站预览/正式各一次；Analytics 的 17+5 是两轮实际源码变更；另一个 `web` 复制触发了 Travle 的提交：12:22:00、12:26:34、13:17:11、13:23:27，均失败。

## 限额解释与证据边界

今天北京时间自然日可见 81 条；截至采集时回看24小时可见 98 条，其中昨日 17 条。14:41:17 起 GitHub Vercel 状态报告 `Deployment rate limited — retry in 24 hours.`。可见记录与平台内部100配额差2，未证实原因，不能冒充已将内部计数逐笔对平。

[Vercel 官方限额](https://vercel.com/docs/limits#deployments-per-day-hobby)：Hobby 为100次/86400秒，owner范围；不能按北京时间00:00清零理解。[Ignored Build Step 官方说明](https://vercel.com/docs/project-configuration/project-settings#ignored-build-step)：进入该步骤后被取消的部署仍占部署配额，因此 CANCELED 不能直接忽略。

前一轮只核对正式17个项目，遗漏了额外web项目；这是部署核查遗漏。当前主仓库联动已消除，但web的重复连接仍在。恢复时间不能仅凭文案断言为明天某刻，也未创建部署探测额度。

## 完整记录

- [今日81条CSV](today-deployments.csv) · [汇总与17站映射](summary.json) · [两天193条脱敏API记录和全29项目配置](audit.json)
- 限流状态历史：`../2026-10-25-portfolio-seo-review/release/github-deployment-statuses.json`。

## 沉淀的脚本

`scripts/audit-vercel-deployment-history.mjs`：已真实执行，按时间分页读取团队全量部署、检查当前Git关联与重复项目，只保存白名单字段，不保存环境变量、令牌或凭据。

后续处理：优先解除多余web项目的Git连接（保留项目和历史）；只核对17站不足以发现重复项目。发布记录尽量回填管理仓库，游戏源码修复先本地验证后合并推送，避免仅为记录结果重复触发生产发布。当前为查询范围，未实施配置变更。
