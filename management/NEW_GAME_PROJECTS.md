# 五个新游戏开发工作空间

2026-10-24。按Owner要求，前五个候选已分别建立文件夹及**私有GitHub仓库**，统一前缀gameshub-。初始化文档已推送；2026-10-24 Owner随后授权全部PRD开发，本地MVP已完成并验证，新增实现尚未提交/推送，未部署。

| 优先级 | 游戏 | GitHub私有仓库 | 本地入口 | 开发资料 |
|---|---|---|---|---|
| 1 | Cutle | [gameshub-cutle](https://github.com/seraseraqqq/gameshub-cutle) | [工作目录](E:/Projects/game-sites/cutle/README.md) | [开发需求](E:/Projects/game-sites/cutle/docs/PRD.md) · [设计简报](E:/Projects/game-sites/cutle/docs/DESIGN_BRIEF.md) · [竞品](E:/Projects/game-sites/cutle/docs/COMPETITORS.md) |
| 2 | Poople | [gameshub-poople](https://github.com/seraseraqqq/gameshub-poople) | [工作目录](E:/Projects/game-sites/poople/README.md) | [开发需求](E:/Projects/game-sites/poople/docs/PRD.md) · [设计简报](E:/Projects/game-sites/poople/docs/DESIGN_BRIEF.md) · [竞品](E:/Projects/game-sites/poople/docs/COMPETITORS.md) |
| 3 | Colordle | [gameshub-colordle](https://github.com/seraseraqqq/gameshub-colordle) | [工作目录](E:/Projects/game-sites/colordle/README.md) | [开发需求](E:/Projects/game-sites/colordle/docs/PRD.md) · [设计简报](E:/Projects/game-sites/colordle/docs/DESIGN_BRIEF.md) · [竞品](E:/Projects/game-sites/colordle/docs/COMPETITORS.md) |
| 4 | Metazooa | [gameshub-metazooa](https://github.com/seraseraqqq/gameshub-metazooa) | [工作目录](E:/Projects/game-sites/metazooa/README.md) | [开发需求](E:/Projects/game-sites/metazooa/docs/PRD.md) · [设计简报](E:/Projects/game-sites/metazooa/docs/DESIGN_BRIEF.md) · [竞品](E:/Projects/game-sites/metazooa/docs/COMPETITORS.md) |
| 5 | Travle | [gameshub-travle](https://github.com/seraseraqqq/gameshub-travle) | [工作目录](E:/Projects/game-sites/travle/README.md) | [开发需求](E:/Projects/game-sites/travle/docs/PRD.md) · [设计简报](E:/Projects/game-sites/travle/docs/DESIGN_BRIEF.md) · [竞品](E:/Projects/game-sites/travle/docs/COMPETITORS.md) |

初始化时每项目29个文件，包含PRODUCT、PRD、设计简报/候选tokens、竞品参考、许可登记、独立研究快照和Rankup接力/计划/词表/基线/接入看板。设计简报未冒充已验收的DESIGN.md；参考样例区分实际观察、SERP摘要与待实玩。离开GameHubs也能独立阅读主要资料，未复制游戏包或登录态。

## 下一步

五个游戏已有本地可玩首版；各自docs/QA.md和.rankup/INDEX.md记录证据与下一步。接下来补实体手机/软键盘/缩放/跨浏览器和5名目标玩家对照，名称/域名及生产体检按发布前门槛执行。Metazooa已锁定130动物并核对30组LCA。其余条件候选本轮没有建仓，以免把暂缓项误当已启动。

新项目都没有Vercel项目、域名所有权或部署；不写成上线/可索引/变现已通过。现有12游戏映射与发布holds原样保留。根机器台账[management/data/repositories.json](data/repositories.json)将这5项单列plannedGames；games数组仍是原有12个有运行时游戏，现有线上导出检查不会把未部署新项目混入既有游戏。现阶段仍单列plannedGames，developmentState已更新为本地MVP验证，不能晋升为线上已部署。

## 验证与维护

- [逐仓API/远端HEAD/工作树核验](../research/2026-10-24-game-project-init/verification.json)；每项目29文件、52个本地Markdown链接通过检查（合计260）。
- 5个Rankup目录文档检查断链/超限均为0；索引包含阶段、上一关卡、下一动作、阻塞与接力。
- [原始研究计划](../research/2026-10-24-game-build-plan/README.md)与[本轮接力](../.rankup/research/game-project-initialization-2026-10-24.md)。

## 沉淀的脚本

- [.rankup/scripts/init-game-projects.mjs](../.rankup/scripts/init-game-projects.mjs)：prepare仅创建新文件夹；publish-private需显式启用，校验gh账号、拒绝未知已有仓库、显式路径提交；finalize-records补记已验证推送；verify只读核对。需要本机gh/Git身份，无令牌进入文件。
- [.rankup/scripts/register-game-projects.mjs](../.rankup/scripts/register-game-projects.mjs)：从已验证结果登记plannedGames，断言原12个games条目不变，不推送GameHubs。

管理仓库的其他未提交修改保留。初始化文档曾各自提交推送；本轮新增实现及总台账变更仅保存在本地，未把其他会话改动一起提交/发布。


## 本地开发交付

[五站实现与验收记录](../research/2026-10-24-five-game-development/STATUS.md)。五站合计21项引擎测试、Chrome50局、键盘/存储/UTC、本地六页面SEO与截图审查已验证；实体设备、玩家、生产指标、域名与上线仍单列。复用工具已归入management/tools/，没有恢复退休的根目录台账路径。
