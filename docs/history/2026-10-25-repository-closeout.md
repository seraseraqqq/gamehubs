# 仓库目录与知识收尾 · 2026-10-25

> 本文保留当时阶段结果。用户随后已明确授权移除games/并推送管理仓库；[后续清理与恢复记录](2026-10-25-management-only-cleanup.json)，当前状态以根HANDOFF和正式站点记录为准。

## 结果

用户明确选择根目录dashboard/data/generated/scripts/docs形式，优先于此前management集中目录规则。已按此迁移，management目录不再存在。README为人的入口，INDEX为自动摘要，AGENTS为AI规则，HANDOFF为当前状态；原管理文档、计划和历史全部归docs。当前代码及生成视图均使用新路径。

本地已安全快进整合远端`dc5994e61228e028c068137a5d69bce08b172fd0`，没有创建本地提交、推送或部署。五个独立游戏main通过本机只读git ls-remote核对：Cutle cd3d12b、Poople 09a623d、Colordle 0092d9d、Metazooa 2e504e8、Travle 0dde58e。只核实源码版本，不把其他设备验收当作本机游玩或线上验收。

主池117词（99词簇），17个严格指标达标不是人工立项。原11项方案与106词处置保留。244观察、5来源批次，其中新增5条2026-10-25项目版本更新；旧初始登记不覆盖。17个项目为12旧游戏＋5新项目，人工审核事件0条。五项目源码已推送，仍无生产部署；真实设备、玩家、生产性能、域名等条件继续待验收。

## 维护入口

- [使用与数据维护](../USAGE.md)；[后续手动挖词约定与预设](../KEYWORD_WORKFLOW.md)。仅写入文档，没有运行新挖词、付费API或自动化。
- [正式数据规则](../../data/README.md)；data/batches、reviews、sites为唯一维护来源。
- data/repositories.json和matrix-sites.json为生成兼容视图，已逐项核对17个源码入口及五个最新版本。保留旧工具所需元数据，不再手填。
- [自动摘要](../../INDEX.md)；[当前导入记录](../../generated/import-report.json)；[本轮校验](../../generated/closeout-validation.json)。
- 本地服务 <http://127.0.0.1:4310/>，启动命令`python3 scripts/hub.py serve --port 4310`。迁移后重启并检查四入口、数据读取及隔离副本的审核写入路径。

## 保留与清理

迁移前完整管理资料及本地改动已逐字节备份：`/Users/xg/Projects/SEO-Projects/.gamehubs-backups/root-layout-20261025-004823`，119个文件。此前两轮备份仍保留。旧122词池未混入，三批原未跟踪研究保持原位，原修改版Excel和旧程序可以从备份恢复。

原management下本轮生成的Python缓存、锁文件和旧截图已可恢复移入该备份，未永久删除研究、用户文件、程序或证据。当前截图位于generated/previews/（忽略，不作为正式数据）；可复用校验工具保留于scripts。冻结游戏的历史文档不追改，games运行源码与scripts/vercel-ignore.mjs保持382项哈希一致。

## 校验和边界

- 16项数据/持久化/路径相关测试通过；未为文档改动重复执行全套游戏测试。
- 117词研究引用的79个不同证据文件全部存在，原始JSON/采集数据保留。
- 活动管理入口文档链接检查通过。旧Acceleration City研究中的14条raw/文件引用在本机缺失，已在原研究说明中标注为旧设备忽略载荷；没有删引用、伪造文件或声称复核通过，不影响117词主研究。
- 其他设备工作树是否仍干净、实体设备/玩家、生产部署/索引验收均非本轮闭环范围。跨设备数据同步仍由人工Git流程处理。
- 没有编辑全局Skill或记忆，没有新增工作台功能、挖词按钮、收入测算或自动化。复核现场及可恢复备份保留。

下一步由用户审查当前本地目录、数据口径及差异；得到明确同意后才处理commit/push。
