# 正式数据与兼容视图

- `batches/`：独立批次及全量观察，包含不合格和待复核。
- `reviews/`：独立追加的人工/AI审核事件，以及 `kind=keyword_edit` 的手动指标/关键词状态修订；原始观察不覆盖，修订带父版本和所属批次。
- `sites/`：唯一维护的17个站点/项目记录，含源码、地址、映射、阶段、门禁和历史。
- `schemas/`：可执行校验规则。
- `migration/source-*.json`：远端原始台账快照，保留来源，后续不手填。
- [repositories.json](repositories.json) / [matrix-sites.json](matrix-sites.json)：**生成的兼容视图，禁止重复手填**，供现有管理工具使用；games保留12项、plannedGames保留5项，实际维护进入sites/。

`python3 scripts/hub.py generate` 从正式数据重建兼容视图和索引。2026-10-25迁移的10站在sites/的development.deploymentMigration记录已验证Vercel关联和证据，生成兼容视图会据此覆盖旧快照中的Root Directory及忽略命令；不手填兼容表。games/已移出管理仓库；source.frozenSnapshots当前为空，source.archivedSnapshots保留旧目录的Git提交、移除时间和清理依据。兼容matrix的path相对对应独立仓库，pathScope明确该语义，不能拼到管理仓库本地路径。源码身份为仓库＋子目录＋分支；兼容视图中的localPath仅供原设备旧工具，localPathScope标记适用范围；不用于本机定位或源码身份。[完整说明](../docs/USAGE.md)。

网站目录17个主词现均关联统一词池；两份生成兼容视图的keywordMetrics及matrix指标/createdAt也从词池/正式站点读取，不沿用旧模板数值。缺失的原始指标与建站日期保持null。
