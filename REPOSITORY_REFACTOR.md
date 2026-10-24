# GitHub / Vercel 仓库改造 — 2026-10-24

用户授权按分阶段方案开始改造。当前范围：10个现有Vercel项目按各自游戏目录选择性构建；Cluster Rush / Acceleration City创建独立私有代码仓库，保留发布许可和域名待办。已上线项目暂保留仓库关联，后续逐个迁移。不得删除原仓库、覆盖其他会话改动或擅自发布暂缓的游戏。

## 当前接力

- 状态：两个独立私有仓库已推送；10个目标项目的 Ignored Build Step 更新请求均成功。正在执行 Git 推送的线上验证。
- 验收：游戏运行文件变更只影响自己的项目；根目录文档/调研不构建游戏；多提交推送不会漏掉较早的代码变更；历史不足时安全地继续构建；手动重发可以明确强制构建。
- 独立仓库验收：只复制已跟踪的游戏源码和对应研究记录，包含来源说明；默认私有；运行默认noindex导出及原有检查；原目录作为过渡快照，台账指向独立仓库作为后续修改入口。两个游戏本轮不部署。
- 线上域名、部署保护与Snow Rider的noindex验收门禁保持现有设置。
- 本地构建过滤测试已通过，覆盖多提交、删除文件、相同提交重发、强制构建及历史不足。独立 Cluster Rush 检查92项通过；Acceleration City检查68项通过，默认导出仍为noindex。
- 下一条要执行的动作：推送本轮改造，确认 Snow Rider 单个运行文件的注释变更只构建 Snow Rider，其余9个跳过；随后仅推送验收记录，确认10个全部跳过。

## 已完成的源码拆分

- [gamehubs-cluster-rush](https://github.com/seraseraqqq/gamehubs-cluster-rush)（私有），本地 `E:/Projects/game-sites/cluster-rush`；历史拆分提交 `f7205783b2a370fb70f14d9140446fedbcf3b9c1`；迁移提交 `69e0068c166e28f3ecf21992ae3ce59c0c445e76`。
- [gamehubs-acceleration-city](https://github.com/seraseraqqq/gamehubs-acceleration-city)（私有），本地 `E:/Projects/game-sites/acceleration-city`；历史拆分提交 `b9735e264ca0a9768d12b86509ad29c56e48eaa5`；迁移提交 `04ee594d9c9a8c1b41c6be1603269951e0d8ef22`。
- 原目录保留并标注迁移；台账指向独立仓库。两个游戏本轮没有部署。

## 验证设计

本次只改动 Snow Rider `player.js` 的一条准确注释，用于验证单游戏运行文件的路径匹配，没有改变游戏行为或索引门禁。其余改动是管理脚本、台账、调研证据和文档。

平台设置前快照：`deployments/evidence/2026-10-24/selective-build-before.json`；成功更新请求：`selective-build-settings.json`。连接器的精简项目响应不回显忽略命令，因此必须以实际构建日志和状态作为生效证据，不能只凭更新请求宣告验证通过。
