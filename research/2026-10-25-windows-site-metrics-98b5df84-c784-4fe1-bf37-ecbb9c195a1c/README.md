# 17站指标复核与Gulper主词纠正 · 2026-10-25

本轮目标：用户要求修复17站数据，将 `gulper.io game` 纠正为 `gulper io`、重新查询缺失指标，并把原 `intitle / Volume` 比值列命名为 KGR。默认市场 US/en，保留原研究与人类决定。

## 当前结果与缺口

- 免费Semrush镜像 `sem.3ue.com` US 批量查询完整17词，16词取得Volume/KD；全部原行（含空值和更新时间）见 [原始表](raw/semrush-bulk-us.json)、[逐站结果](results.json)。该值是用户镜像显示估值，非官方独立实时核验。
- `gulper io`：Volume **9,900**，KD **28**；Google `intitle:"gulper io"` 明确显示 **About 3,180 results**，KGR **0.321212…**。新建正确关键词身份并切换站点主词，旧词及旧批次保留，旧词30月量/10页数不会复制到新词。
- `krillion unlimited`：批量Volume/KD为空；单词概览只提示更新指标；在镜像显示1000/1000额度内尝试一次刷新，返回 **Something went wrong**，没有重试。见 [概览](raw/semrush-krillion-overview.json)、[刷新错误](raw/semrush-krillion-refresh-failure.json)。仍保留未知；历史Google intitle=520不代表本次重测。
- Gulper已保存美国过去12个月Trends的可见曲线/相关查询：[趋势证据](raw/trends-gulper-io.json)。归一化指数不当月量。
- Google其余词重测未完成：首轮4次未等待页面就绪而未取得统计值，改为等待真实Google Tools/#result-stats后，2048 Cupcakes查询触发验证码，立即停止。所有失败/未知查询保存于raw；不使用AITDK注入数，不以搜索结果条数代替估算总数。保留历史intitle及原来源日期，不冒充本轮更新。
- OpenSEO仅查看查询界面和选项；默认150结果、可见credits费用说明，没有提交查询。没有直接DataForSEO调用、付费升级或预算扩展。
- 6站缺失建站日期仍未知；搜索日期、部署日期不能证明创建日期。

## 本地回填与验收

独立批次接受17行、拒绝0行；正确Gulper增加一个身份，旧身份保留，当前140词/400观察/9批/17站、0审核事件。站点通过当前revision保存并留history，source、release和development逐字段未变。`hub.py validate`、`generate`均0错误；24项管理回归及两个JS文件语法检查通过。

真实Chrome已确认17行、正确Gulper指标、表头和排序选项KGR；降序首行为Travle，未知Krillion仍在最后。已回到建站日期排序。[看板截图](dashboard-verified.png)。本机4310服务已加载新Python代码；运行中 `/api/export` 返回KGR表头及Gulper的3180/9900，读回验证通过。未commit/push、部署游戏或改变索引权限。

## KGR显示口径

按用户要求将关键词池、网站目录、排序、详情和CSV里的比值统一显示为 **KGR**。公式沿用现有 `intitle:"原词"` 标题匹配页数 / US月搜索量，**并非 `allintitle` 版本**；悬浮说明和使用文档明确该口径，不套用经典KGR阈值或承诺排名。Volume缺失或为0时仍为未知。底层ratio键保留兼容现有排序与历史数据。

## 本机OpenCLI诊断

`b9q8mv8y` 是浏览器profile ID。CLI位于 `C:\Users\Sera\.opencli\node_modules\@jackwener\opencli\dist\src\main.js`，当前PATH没有opencli快捷入口；完整路径调用doctor显示Daemon、Extension、Connectivity均通过。扩展v1.0.26偏旧，窗口隔离语义与Skill当前描述不一致。本轮未修改扩展；实际采集通过已登录Chrome/CUA完成。

## 沉淀的脚本

[scripts/recheck-site-metrics-cua.mjs](../../scripts/recheck-site-metrics-cua.mjs) 提供 `readBulk(tab,out)`、`readGoogle(tab,target,out)`、`collectIntitle(tab,targets,out)`，供CUA运行时传入真实Chrome标签页、明确的词表和证据目录。本轮实际执行 `readBulk(semTab, taskOut)` 取得17行；`collectIntitle(googleTab, targets.slice(0,4), taskOut)` 复现验证码并记录blocked后停止。只读DOM提取，Google等待页面就绪，不处理验证码，缺失保持null。原始研究保留，不改正式来源注册表或发布条件。

## 用户后续选择 · 2026-10-25

用户明确回复“暂不验证，保留已有标题页数”。本轮停止等待Google验证码，不再重试其余16词；已有标题页数及原来源日期保留，Gulper正确主词的新值继续生效。正式批次仍保留partial，以准确表达采集覆盖，不修改历史批次为全量重测通过。此项不改变任何关键词人工决定或发布权限。
