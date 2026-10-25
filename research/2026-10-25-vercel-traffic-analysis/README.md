# Vercel已上线游戏流量快照

2026-10-25北京时间19:23左右，从已连接的Vercel团队读取正式登记17个游戏的Web Analytics生产数据。仅分析，未访问游戏页面以制造测试流量，未修改项目、域名、部署、索引权限或正式站点记录。

## 范围与方法

请求窗口2026-09-25T00:00:00Z至2026-10-26T00:00:00Z，实际数据截至本次查询。有数的UTC日期仅10月23日至25日，25日未结束。接口将计数日期向UTC日边界截断，因此查询使用次日边界以纳入今天；不能把未接入前的空白当作实际零访问。来源与设备等聚合默认只包含production。6个旧站从23日已有记录，其他11站首个有数日期为25日；不按相同运营时长比较。

权威数据为[evidence.json](evidence.json)，每项保留项目、请求与完整返回。脚本[analyze.py](analyze.py)可离线复算，[checked-summary.json](checked-summary.json)记录85项PV总计与日/来源/国家/设备/路径对账，全部一致；稍后读取的小时数据也一致。最初31天小时查询超过168小时限制，已缩小至4天成功读取。

## 逐站数据

Visitors为Vercel返回指标，不表示长期去重玩家，不能跨站相加为总人数。Google来源PV合并google.com及Google Android应用，不代表已核实自然搜索点击或独立玩家。

| 游戏 | Visitors | PV | Google来源PV |
|---|---:|---:|---:|
| Costcodle | 55 | 81 | 5 |
| Krillion Unlimited | 31 | 40 | 5 |
| Block Blast Unblocked | 21 | 34 | 1 |
| 2048 Cupcakes | 26 | 32 | 0 |
| Cluster Rush | 10 | 25 | 0 |
| Spacebar Counter | 21 | 24 | 0 |
| Gulper.io | 17 | 23 | 5 |
| Head Soccer 2026 | 10 | 14 | 0 |
| Acceleration City | 8 | 11 | 0 |
| Travle | 1 | 8 | 0 |
| Colordle | 1 | 6 | 0 |
| Poople | 1 | 6 | 0 |
| Cutle | 1 | 5 | 0 |
| Metazooa | 1 | 5 | 0 |
| Snow Rider 3D | 2 | 5 | 0 |
| Minute Cryptic Unlimited | 1 | 5 | 0 |
| Coreball | 1 | 4 | 0 |

## 发现与判断

- 17站PV合计328；来源未归因302（92.1%）、Google相关16（4.9%）、vercel.com为9、站内组合的另一站引荐1。未归因不能全部当直接访问或自然玩家。站点访客指标合计208仅是算术和，不作为总人数发布。
- Costcodle总PV81、Visitors55最高；其中UTC24日PV56，占本网站快照69.1%。Google来源PV5，仍不足以证明稳定增长，峰值原因未知。
- Krillion总PV40、Visitors31，Google来源PV5出现在UTC23日及25日；Gulper总PV23、Visitors17，Google网站/应用来源PV5出现在23/24日。两站存在跨日期来源信号，但可能含站主/代理搜索验收。
- Block Blast总PV34、Visitors21，Google来源仅1，发生于25日；2048 Cupcakes为PV32、Visitors26，Spacebar Counter为PV24、Visitors21，两站Google来源均0。此处0仅指该快照已记录Google来源为0，不表示实际从无搜索访问。
- Colordle、Cutle、Metazooa、Poople、Travle、Coreball、Minute Cryptic均为Visitors1、桌面设备、日本出口；首批流量集中在北京时间13–15点，符合已记录Analytics/SEO验收时段。推断测试流量占比可能很高，但不能仅依据国家排除访问或精确扣减。今天验证记录独立见[接入验收](../../deployments/2026-10-25-portfolio-analytics.md)。
- 桌面PV263，移动65（19.8%）。美国IP位置PV112（34.1%）、日本94（28.7%）；包括代理/测试出口，不能认定真实玩家国籍或市场份额。327次PV是首页，仅1次为Head Soccer玩法页；首页游戏停留不会持续增加PV，无法据此认定留存或跳出。
- UTC逐日PV为23日28、24日118、25日182。接入覆盖变动、上线时长和验收影响显著，不能将该序列当作可比自然流量增长趋势。
- 当前统计没有提供本分析所需的游戏开始、有效游玩时长、完成或回访证据。本轮未读取GSC，所以Google来源不能替代GSC自然点击与查询/排名证据；现有9站noindex条件继续保持。

## 建议

现阶段优先观察Costcodle、Krillion、Gulper，Block Blast作次级观察；现有域名保留。7个Vercel默认域项目暂不因这份数据购买域名或迁去GitHub Pages。先完成既有验收条件；在允许索引的站点，将后续7–14天作为观察窗口，标注测试时段并结合Search Console点击和查询判断自然获客。需要判断玩家质量时，另行在明确开发范围接入游戏开始与有效游玩等事件；本次未实施或建立自动化。

来源定义：[Vercel隐私与24小时访客识别说明](https://vercel.com/docs/analytics/privacy-policy)。
