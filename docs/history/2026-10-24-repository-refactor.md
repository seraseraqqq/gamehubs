# GitHub / Vercel 仓库改造 — 2026-10-24

用户授权按分阶段方案开始改造。当前范围：10个现有Vercel项目按各自游戏目录选择性构建；Cluster Rush / Acceleration City创建独立私有代码仓库，保留发布许可和域名待办。已上线项目暂保留仓库关联，后续逐个迁移。不得删除原仓库、覆盖其他会话改动或擅自发布暂缓的游戏。

## 当前接力

- 状态：第一阶段代码与平台配置已交付并推送；单游戏改动的实际部署验证得到1个READY、8个正确跳过、1个限额拦截。Gulper.io的实际命令执行待限额恢复后验证，不能计为已验收。
- 验收：游戏运行文件变更只影响自己的项目；根目录文档/调研不构建游戏；多提交推送不会漏掉较早的代码变更；历史不足时安全地继续构建；手动重发可以明确强制构建。
- 独立仓库验收：只复制已跟踪的游戏源码和对应研究记录，包含来源说明；默认私有；运行默认noindex导出及原有检查；原目录作为过渡快照，台账指向独立仓库作为后续修改入口。两个游戏本轮不部署。
- 线上域名、部署保护与Snow Rider的noindex验收门禁保持现有设置。
- 本地构建过滤测试已通过，覆盖多提交、删除文件、相同提交重发、强制构建及历史不足。独立 Cluster Rush 检查92项通过；Acceleration City检查68项通过，默认导出仍为noindex。
- 下一步：本轮仅追加一次管理记录推送并回读状态；不反复重试受限部署。之后优先补Gulper.io线上规则验证，再逐个迁移剩余10个已部署游戏的仓库与Git关联，每次验收现有域名。

## 已完成的源码拆分

- [gamehubs-cluster-rush](https://github.com/seraseraqqq/gamehubs-cluster-rush)（私有），本地 `E:/Projects/game-sites/cluster-rush`；历史拆分提交 `f7205783b2a370fb70f14d9140446fedbcf3b9c1`；迁移提交 `69e0068c166e28f3ecf21992ae3ce59c0c445e76`。
- [gamehubs-acceleration-city](https://github.com/seraseraqqq/gamehubs-acceleration-city)（私有），本地 `E:/Projects/game-sites/acceleration-city`；历史拆分提交 `b9735e264ca0a9768d12b86509ad29c56e48eaa5`；迁移提交 `04ee594d9c9a8c1b41c6be1603269951e0d8ef22`。
- 原目录保留并标注迁移；台账指向独立仓库。两个游戏本轮没有部署。

## 验证设计

本次只改动 Snow Rider `player.js` 的一条准确注释，用于验证单游戏运行文件的路径匹配，没有改变游戏行为或索引门禁。其余改动是管理脚本、台账、调研证据和文档。

平台设置前快照：`deployments/evidence/2026-10-24/selective-build-before.json`；成功更新请求：`selective-build-settings.json`。连接器的精简项目响应不回显忽略命令，因此必须以实际构建日志和状态作为生效证据，不能只凭更新请求宣告验证通过。

## 实际结果

GameHubs发布提交：[772f407](https://github.com/seraseraqqq/gamehubs/commit/772f40768c82f76519ed6c03e641976864d71f5f)。Snow Rider `dpl_5ktwCiTCH7nzAg75kg9k3eYZNDkz`为READY；日志显示与上次成功版本c6034dc比较后选择构建。其余8个进入构建环境的项目均记录`build:false`并由Ignored Build Step取消，没有执行游戏导出。

Gulper.io的GitHub状态为`Deployment rate limited — retry in 24 hours.`，在创建部署前被拦截；忽略命令更新已成功，但本轮无法取得该项目实际执行日志。没有升级付费计划或绕过限制。跳过构建仍可能产生部署记录并占用平台配额；彻底避免跨游戏部署事件需要继续完成独立仓库迁移。

10个现有公开首页再次检查均为HTTPS200；绑定域名均仍verified，重定向和部署保护保留。Snow Rider播放器文件确认本次提交已上线、仍使用Miniplay且noindex，未把HTTP检查当作游戏游玩验收。两个独立仓库均为private/main、本地与远端一致、工作目录干净，拆分历史为当前提交祖先。最新文档提交分别为Cluster Rush `1bcc09648737f68009a64fe0a11653183814a764`、Acceleration City `d554f04b044fabcd97c19b770b8bb4fe41793c6e`。

证据目录`deployments/evidence/2026-10-24/`：

- `selective-build-live.json`：9个部署的实际日志、命令和状态，另列Gulper限额。
- `selective-build-github-status.json`：GitHub对全部10个项目的最终状态。
- `selective-build-public-after.json`：10个公开地址HTTP及索引门禁检查。
- `selective-build-domains-after.json`：域名绑定和重定向回读。
- `independent-repositories.json`：新仓库远端、源码历史与工作区一致性。

本轮没有迁移剩余10个线上项目的Git关联，没有删除旧源码，也没有发布两个暂缓游戏。GameHubs现为“管理台账+10个过渡源码目录”，最终纯管理仓库的迁移仍是后续阶段。
