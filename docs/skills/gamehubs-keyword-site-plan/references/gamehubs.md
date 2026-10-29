# GameHubs集成

本skill不含个人电脑绝对路径、密钥或必须存在的付费工具。先在当前工作区向上定位包含AGENTS.md、scripts/hub.py、data/batches和data/sites的GameHubs根目录；找不到时可先完成独立研究／方案，询问必要的仓库位置后再回填，不另造GameHubs副本台账。

读当前README.md、HANDOFF.md、INDEX.md、AGENTS.md、docs/KEYWORD_WORKFLOW.md、docs/USAGE.md、docs/GAME_MANAGEMENT_RULES.md及实际schemas。当前仓库新规则／用户指令优先；skill是2026-10-29.1快照，未来发生变化时说明差异而非覆盖新规则。

## 查重与正式来源

```sh
python3 scripts/hub.py query "term"
python3 scripts/hub.py query "site" --kind site
```

词身份按原词＋国家＋语言，不将旧122身份池自动合并，不把同义词量相加。站点开发前读data/sites/<id>.json，以source.repository＋directory＋branch为唯一活跃源码；在本设备定位／克隆对应独立仓库，旧Windows路径、另一设备localhost及archivedSnapshots均不是本机活跃路径。新检出为兄弟仓库，不建嵌套Git或恢复已退休的games/／management/布局。

## 保存观察与决定

- 正式写入只有data/batches、data/reviews、data/sites。INDEX.md、generated/、data/repositories.json、data/matrix-sites.json均生成，不独立维护。
- 每轮日期＋设备＋UUID新批次，完整保留已知不合格、条件候选、观察、失败和unknown，原始证据先进入research/<batch-topic>/。复用证据保留来源日期，本次判断时间另列；修正用新批次引用旧批次，不覆盖旧结果。
- batch.schema.json当前没有任意metadata顶层字段。SOP版本、criteria及来源规划可存研究证据文件，用batch.notes／sources引用；逐词判断用现有raw.assessment／reasons等结构，先核实本机schema／读取逻辑再写。
- qualification的qualified／rejected／unknown与优先／主／条件／观察的研究分档不同。主候选必须证据齐全才能qualified；条件／观察／缺证不伪装成主候选通过。在raw及理由保留新分档和criteria；看板若仅支持旧S/A/B/C就明确展示限制，不因本次研究擅加dashboard功能或把旧A档当新认证。
- AI审核追加actorType=ai、当前expectedHeads和相关basedOnBatches，不覆盖人工决定。站点写入使用当前revision并保留history；仅研究或方案不自动登记新项目或改变已上线状态。
- frozenSnapshots仅登记现存本地副本；archivedSnapshots仅历史 provenance。现有站验收／索引条件不因新门槛改变。

```sh
python3 scripts/hub.py import /path/to/batch.json /path/to/keywords.jsonl
python3 scripts/hub.py validate
python3 scripts/hub.py generate
```

导入实际路径以本轮产物为准；坏行保留errors.jsonl。写入后回读结果和数量／错误，不把命令执行当业务条件通过；没有正式数据变更时不为文档编辑重生成视图。持久化／路径代码变更才跑相应管理回归，不重跑无关游戏测试。

scripts/finalize-keyword-mining.py内置旧批次门槛、日期和来源，仅用于历史复现，不能原样用于本skill的新标准分级。

跨设备保留其他会话的未提交及未跟踪研究，commit／push仅在用户授权范围内操作并stage显式路径。遵守付费范围与脱敏要求；DataForSEO使用运行时DATAFORSEO_LOGIN／DATAFORSEO_PASSWORD或独立密钥解密的密文，不保存明文、Basic授权头、可逆Base64、浏览器登录态或.vercel凭证。GitHub Actions Secrets不能下载成另一台设备的本机凭据。
