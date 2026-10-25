# 重复项目与 Git Import 提示修复

2026-10-25，用户在审计后明确要求修复，并询问截图是否表示部署错误。

## 已完成

- 使用官方Vercel CLI按固定项目ID解除多余 `web`（`prj_udzq0gqczTg3PIf9vw8S5Mz30Lsc`）的Git关联；保留项目和历史。回读 `link=null`，正式Travle配置及生产部署对象与修复前完全相同。
- 全量回读29项目：没有关联主仓库 `seraseraqqq/gamehubs` 的项目，同仓库重复连接为0。本轮未创建新部署，今日记录仍81条。
- 现场确认Git Import给出 `framework=vite&path=apps/web&project-name=web` 的建议链接；现有正式5项目 Root Directory=null、build=pnpm build、output=apps/web/dist/client。它推荐的是子目录导入，不是既有生产项目的待发布任务。
- 解除多余web后，提示从截图4项变成5项（Travle的apps/web重新成为建议），但正式Travle仍READY。这进一步说明建议不代表正式项目未部署。
- 逐项Dismiss这5条重复目录建议；刷新后提示消失，再展开项目列表确认正式Cutle、Travle、Poople、Metazooa仍存在。没有点入建议链接创建第二批web项目。
- 30页面和20个JS/CSS构建资源全部HTTP200，五个生产版本都READY；不把这些HTTP检查说成完整真机或游戏验收。
- 按revision写回五站development.vercelWiringAudit、说明与证据，保留history与原noindex/验收条件。

## 原有站点与待发布版本分开

| 站点 | 线上状态 | 本轮准备的SEO提交在线 |
|---|---|---|
| [colordle](https://gameshub-colordle.vercel.app/) | READY，6页面+4资源正常 | 是 |
| [cutle](https://gameshub-cutle.vercel.app/) | READY，6页面+4资源正常 | 否；线上仍为此前成功版本 |
| [metazooa](https://gameshub-metazooa.vercel.app/) | READY，6页面+4资源正常 | 否；线上仍为此前成功版本 |
| [poople](https://gameshub-poople.vercel.app/) | READY，6页面+4资源正常 | 否；线上仍为此前成功版本 |
| [travle](https://gameshub-travle.vercel.app/) | READY，6页面+4资源正常 | 否；线上仍为此前成功版本 |

Git Import建议本身不是部署错误；未上线的新SEO提交是此前平台限额造成的版本滞后，不能为此重复导入项目。本轮没有更改构建根目录、域名或索引门禁，也未重试批量部署。

## 防止重现

- 管理规则和AGENTS增加全团队Git关联查重，正式清单之外的额外项目也必须检查。
- 发布记录优先回管理仓库，小修复先本地验收合并后推送，避免仅为记进度再次触发游戏构建。

## 证据

- [断开前后](web-disconnect.json) · [29项目修复后快照](after-disconnect/audit.json)
- [5站30页面与20资源](five-existing-projects.json) · [导入建议原链接](import-candidates-before.json)
- [逐项消除](import-suggestions-dismissed.json) · [刷新后状态](import-suggestions-after.json)
- [修复后截图](vercel-after-fix.png) · [五站工作台写回](workbench-writeback.json)

## 沉淀的脚本

`scripts/disconnect-duplicate-vercel-project.mjs` 已按真实项目执行：核对duplicate/canonical固定ID、仓库一致、正式部署READY后，仅断开web；回读验证正式项目不变。`scripts/audit-vercel-deployment-history.mjs`全量再验没有同仓库重复关联。

[Vercel官方Git断开说明](https://vercel.com/docs/cli/git)。历史额度审计仍保留原快照，不覆盖为修复后的配置。
