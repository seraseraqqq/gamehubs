# 网站目录与关键词池一致性修复 · 2026-10-25

根因：原117词研究只包含5个新站主词；12个旧站主词仅在站点登记中。另有11个明确的createdAt在旧导入器中遗漏。修复使用同一关键词ID引用，指标不复制到站点表；生成兼容视图也从词池读取。

Volume/KD以[用户截图](semrush-user-screenshot.png)为准，是美国数据库镜像显示估值；真实统计更新时间在截图裁剪中不可见。intitle来自本轮此前完成的Google查询，用户随后要求停止连接浏览器，本次回填未再访问。

| 旧站主词 | Volume | KD | intitle |
|---|---:|---:|---:|
| 2048 cupcakes | 110000 | 28 | 3780 |
| acceleration city | 90500 | 12 | 312 |
| block blast unblocked | 22200 | 21 | 10 |
| cluster rush | 22200 | 8 | 976 |
| coreball | 49500 | 29 | 1510 |
| costcodle | 18100 | 23 | 536 |
| gulper.io game | 30 | 未知 | 10 |
| head soccer 2026 | 18100 | 20 | 1310 |
| krillion unlimited | 未知 | 未知 | 520 |
| minute cryptic unlimited | 2900 | 25 | 8 |
| snow rider 3d unblocked | 49500 | 16 | 2010 |
| spacebar counter | 5400 | 28 | 799 |

Gulper的KD及Krillion的Volume/KD在截图中缺失，保持null；CPC 0不是KD，也不是无竞争证据。Krillion缺Volume时竞争度比值不计算。

新增12词与原117词构成129词，原研究批次和原始记录保留。网站目录17个主词全部通过关键词ID读取同一词池，后续任一入口的主词指标修订仍共享。

11个建站日期从data/migration/source-matrix-sites.json的明确createdAt恢复，详见[日期回填](creation-date-backfill.json)。其余6站未明确登记，保持未记录。

本轮数据和一致性修复按用户后续授权进行GitHub交付，没有部署或修改许可/索引门禁。来源访问参数未保存到数据。
