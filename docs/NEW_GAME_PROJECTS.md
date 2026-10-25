# 五个新游戏开发工作空间

更新2026-10-25。按Owner要求，前五个候选已分别建立文件夹及**私有GitHub仓库**，统一前缀gameshub-。初始化文档已推送；2026-10-24 Owner随后授权全部PRD开发，本地MVP已完成并验证，完整本地运行时与本轮优化已分别推送并核对远端SHA，未部署；[提交与验收范围](../research/2026-10-24-five-game-development/optimization-delivery.md)。

| 项目 | 唯一GitHub源码（私有） | 开发资料 | 当前状态 |
|---|---|---|---|
| Cutle | [gameshub-cutle](https://github.com/seraseraqqq/gameshub-cutle) | [仓库文档](https://github.com/seraseraqqq/gameshub-cutle/tree/main/docs) | 源码已推送，未部署，实际设备/玩家待验收 |
| Poople | [gameshub-poople](https://github.com/seraseraqqq/gameshub-poople) | [仓库文档](https://github.com/seraseraqqq/gameshub-poople/tree/main/docs) | 源码已推送，未部署，实际设备/玩家待验收 |
| Colordle | [gameshub-colordle](https://github.com/seraseraqqq/gameshub-colordle) | [仓库文档](https://github.com/seraseraqqq/gameshub-colordle/tree/main/docs) | 源码已推送，未部署，实际设备/玩家待验收 |
| Metazooa | [gameshub-metazooa](https://github.com/seraseraqqq/gameshub-metazooa) | [仓库文档](https://github.com/seraseraqqq/gameshub-metazooa/tree/main/docs) | 源码已推送，未部署，实际设备/玩家待验收 |
| Travle | [gameshub-travle](https://github.com/seraseraqqq/gameshub-travle) | [仓库文档](https://github.com/seraseraqqq/gameshub-travle/tree/main/docs) | 源码已推送，未部署，实际设备/玩家待验收 |

初始化时每项目29个文件，包含PRODUCT、PRD、设计简报/候选tokens、竞品参考、许可登记、独立研究快照和Rankup接力/计划/词表/基线/接入看板。设计简报未冒充已验收的DESIGN.md；参考样例区分实际观察、SERP摘要与待实玩。离开GameHubs也能独立阅读主要资料，未复制游戏包或登录态。

## 下一步

五个游戏已有本地可玩首版；各自docs/QA.md和.rankup/INDEX.md记录证据与下一步。接下来补实体手机/软键盘/缩放/跨浏览器和5名目标玩家对照，名称/域名及生产体检按发布前门槛执行。Metazooa已锁定130动物并核对30组LCA。其余条件候选本轮没有建仓，以免把暂缓项误当已启动。

新项目都没有Vercel项目、域名所有权或部署；不写成上线/可索引/变现已通过。现有12游戏映射与发布holds原样保留。生成兼容台账[data/repositories.json](../data/repositories.json)将这5项单列plannedGames；games数组仍登记原有12个游戏，但运行时代码都在独立仓库；原管理仓库导出检查随旧副本清理而退役。现阶段仍单列plannedGames，developmentState已更新为本地优化验证，完整源码已推送，不能晋升为线上已部署。

## 验证与维护

- [逐仓API/远端HEAD/工作树核验](../research/2026-10-24-game-project-init/verification.json)；每项目29文件、52个本地Markdown链接通过检查（合计260）。
- 5个Rankup目录文档检查断链/超限均为0；索引包含阶段、上一关卡、下一动作、阻塞与接力。
- [原始研究计划](../research/2026-10-24-game-build-plan/README.md)与[本轮接力](../.rankup/research/game-project-initialization-2026-10-24.md)。

## 沉淀的脚本

- [.rankup/scripts/init-game-projects.mjs](../.rankup/scripts/init-game-projects.mjs)：prepare仅创建新文件夹；publish-private需显式启用，校验gh账号、拒绝未知已有仓库、显式路径提交；finalize-records补记已验证推送；verify只读核对。需要本机gh/Git身份，无令牌进入文件。
- [.rankup/scripts/register-game-projects.mjs](../.rankup/scripts/register-game-projects.mjs)：从已验证结果登记plannedGames，断言原12个games条目不变，不推送GameHubs。

管理仓库的其他未提交修改保留。初始化文档曾各自提交推送；后续完整实现及优化已在各自仓库推送；用户已于2026-10-25随后明确授权将GameHubs管理目录整理和游戏副本清理提交推送；这不扩展为新的游戏部署授权。


## 本地开发交付

[五站实现与验收记录](../research/2026-10-24-five-game-development/STATUS.md)。五站合计21项引擎测试、Chrome50局、键盘/存储/UTC、本地六页面SEO与截图审查已验证；实体设备、玩家、生产指标、域名与上线仍单列。复用工具已归入scripts/，没有恢复退休的根目录台账路径。

当前正式登记为 [data/sites](../data/sites/)。另一设备E盘工作目录和预览端口保留在来源快照中，仅作历史参照；本机接手应检出上表仓库。
