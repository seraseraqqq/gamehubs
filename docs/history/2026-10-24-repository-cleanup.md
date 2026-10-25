# 管理仓库整理 · 2026-10-24

按Owner要求，GameHubs根目录只保留README、HANDOFF、AGENTS和必要隐藏配置，资料按管理/调研/发布职责归位。本轮只改本地文件，未提交/推送/部署，保留整理前已有改动。

## 归位

| 原位置 | 新位置 | 处理 |
|---|---|---|
| repositories.json、matrix-sites.json | management/data/ | 两份机器台账原字节保留；原12游戏、5个准备项目、12站点均未增删 |
| REPOSITORIES、DEPLOYMENT_STATUS、NEW_GAME_PROJECTS | management/ | 当前管理入口，修复相对链接 |
| WORK_PLAN_2026-10-25.md | management/plans/2026-10-25.md | 下一轮工作计划保留 |
| REPOSITORY_REFACTOR.md | management/history/2026-10-24-repository-refactor.md | 保留迁移历史 |
| 四份关键词JSON与游戏关键词台账.xlsx | research/2026-10-23-keyword-discovery/ | 数据和Excel原样保留，补资料索引 |
| PRODUCT、DESIGN及Coreball的Impeccable记录 | games/coreball/ | 单游戏设计归游戏，避免被新项目误继承；未改玩法 |
| 两个仍有效的管理工具 | management/tools/ | 更新根路径与台账读取位置 |
| 原README与长HANDOFF | management/history/*-before-cleanup-2026-10-24.md | 保留此前完整管理上下文，根入口精简 |

最新117词研究、11个建站方案、5项目文档与全部关键词/竞品/许可证据保留；未删除研究数据或Excel。原数据证据在[逐文件收据](2026-10-24-cleanup-receipt.json)。

## 移除的临时文件

- 13个已结束的一次性测试、旧浏览器QA、静态检查/报告生成及旧Snow Rider同步脚本。旧同步会回写过时站点状态，不再留作当前管理入口。
- 10张Coreball忽略目录下的临时评审截图；正式代表图和评审结果仍在research内。
- 文件移出Git工作目录，恢复位置在用户本机`.rankup/trash/gameshub-cleanup-2026-10-24T14-54-05-914Z/`；每个文件的原路径、哈希与恢复路径均写入收据。没有永久销毁未提交版本。
- 历史报告保留当时验证结论，顶部注明旧脚本已退役，旧命令是历史记录；当前检查使用management/tools或游戏自己的README。

## 保留的必要内容

- `games/`中10个现役源码和2个冻结快照，等待逐个迁仓；本次不做新的源码迁移。
- `scripts/vercel-ignore.mjs`原路径、原内容保留，仍是现役Vercel忽略构建入口。
- `.agents/`与`.agent`保留，避免丢失工作规则。
- `.rankup/scripts/`只保留项目初始化和已验证登记等可复用管理工具，已更新输出路径，不再生成根目录台账。

## 验证与维护

- 根目录JSON数量：0；根目录Excel数量：0；普通Markdown仅README、HANDOFF、AGENTS。
- 303个游戏运行文件/冻结快照/忽略构建入口内容哈希一致；没有修改游戏玩法、运行资源或发布holds。
- 两份台账移动前后字节相同，早期四份关键词JSON和Excel字节相同；仅移动了位置。
- `node management/tools/check-portfolio-seo.mjs --public`：12个游戏、28个导出HTML、0失败；这是本地导出检查，不是本轮线上可玩验收。
- 当前管理链接、脚本语法与引用检查见[最终验证](2026-10-24-cleanup-validation.json)。冻结快照中的历史路径不追改；后续编辑应进入其独立正式仓库。

本轮没有新增仓库内一次性清理/测试脚本。新的目录规则已写进根AGENTS；后续JSON归management/data或对应research，跟进事项归management/plans与HANDOFF。整理清单属于项目记录，没有修改全局Skill。
