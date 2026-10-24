# 新游戏建站优先级与执行计划

更新：2026-10-24。美国 / 英文。基于[117词台账](../2026-10-24-keyword-opportunities/keyword-ledger.json)收敛，不重复计算同义词搜索量。

**建议依次开发 Cutle → Poople → Colordle，首批最多3站；第二批 Metazooa → Travle。** 首批的“确定性”主要指玩法可做、数据可控和成本可界定；名称使用仍需发布前核验，SEO排名与收益尚未证实。先做完并观察首批，再决定第二批，不把11项全部启动。

## 1. 排队结果

Volume/KD为2026-10-24免费Semrush镜像显示估值，未取得官方Semrush独立认证；Trends为美国过去12个月的首4/末4个完整周均值，仅作方向筛查，最后一周剔除。不同对比图的指数不能直接比大小，0也不代表完全无搜索需求。

| 顺序 | 游戏 | 队列 | 月Volume / KD | Trends首4→末4 | 建站方式 | 开发可控性 / SEO证据 | 首选域名 |
|---|---|---|---:|---:|---|---|---|
| 1 | [Cutle](TASKS.md#cutle) | P0 · 首批 | 12,100 / 8 | 0 → 7.75 | 自研 | 高 / 中 | cutleunlimited.com |
| 2 | [Poople](TASKS.md#poople) | P0 · 首批 | 33,100 / 26 | 0 → 63.25 | 自研 + 公有领域词库 | 高 / 中 | pooplepractice.com |
| 3 | [Colordle](TASKS.md#colordle) | P0 · 首批 | 74,000 / 25 | 6 → 6 | 自研 + MIT颜色数据 | 高 / 中偏低 | colordleunlimited.com |
| 4 | [Metazooa](TASKS.md#metazooa) | P1 · 第二批 | 12,100 / 23 | 6 → 14 | 条件自研：先完成分类数据审查 | 中 / 中 | metazooapractice.com |
| 5 | [Travle](TASKS.md#travle) | P1 · 第二批 | 40,500 / 31 | 10.25 → 16.75 | 自研 + 公有领域地图 | 中偏高 / 中 | travleunlimited.com |
| 6 | [Spotle](TASKS.md#spotle) | P2 · 条件队列 | 110,000 / 23 | 5.25 → 21 | 条件自研：音乐人元数据先行 | 中偏低 / 中 | spotlepractice.com |
| 7 | [Traffic Road](TASKS.md#traffic-road) | P2 · 授权后可前移 | 14,800 / 29 | 37.5 → 33.5 | 授权iframe | 取决于授权及触屏 / 中 | playtrafficroad.com |
| 8 | [Maptap](TASKS.md#maptap) | P2 · 待差异化验证 | 40,500 / 31 | 0.5 → 80.5 | 条件自研地图定位 | 中偏低 / 中 | playmaptap.com |
| 9 | [Scrandle](TASKS.md#scrandle) | P2 · 待玩法/素材审计 | 90,500 / 15 | 3.5 → 3.5 | 待核验：授权iframe优先，或合规素材自研 | 低 / 中偏低 | playscrandle.com |
| 10 | [Songless](TASKS.md#songless) | P2 · 音频许可阻塞 | 74,000 / 21 | 4 → 18.5 | 授权iframe或取得音频许可后自研 | 低 / 中 | songlesspractice.com |
| 11 | [X Trench Run](TASKS.md#x-trench-run) | HOLD · 不进低成本首批 | 49,500 / 9 | 35.75 → 26.5 | 商业授权成品自托管；订阅iframe另询价 | 合同及预算未定 / 中偏低 | playxtrenchrun.com |

Colordle虽开发可控，但词义混杂、头部较强，仍属小额试验。Travle的KD31超出严格档，因此排第二批；不偷偷放宽原来的Volume>10,000、KD<30条件。

## 2. 为什么首批采用自研

- Cutle核心是几何计算；不依赖原站的代码、形状或素材。
- Poople第三方仓库声明源码供参考，不能当作已获商用许可的开源成品；改用独立字梯引擎和Unlicense词库。
- Colordle核验到MIT颜色数据；找到的同名开源游戏有玩法/技术差异，直接部署会承接错误意图。独立实现最简单。
- 本次**没有选出“目标玩法一致、代码+素材许可完整、可直接商用部署”的开源成品**。Metazooa工具/翻译仓库不等于完整游戏；iframe技术可嵌入也不等于获得授权。

详见[逐站来源与许可审计](SOURCE-AUDIT.md)，不是强行让三种建站方式各凑一个。

本轮另外用Chrome直接核对首批3个主词的[Google结果](evidence/google-cross-check.json)，请求gl=us/hl=en/pws=0；这不等于固定美国本地IP排名。Cutle实际前列出现镜像未列出的cutle.org；Poople已有练习竞品；Colordle确认同名混合玩法。[竞品功能核验](evidence/competitor-checks.json)已写回任务，不以镜像次序代替当前Google结果。其他8项本轮没有新增Google实查，沿用原台账并保持条件状态。

首批达到可玩预览后，应做至少5名目标玩家的对照试玩（需后续执行时安排）：任务完成、是否理解玩法、是否会再次使用及相对原站/竞品的具体原因。样本只作方向信号；若无法证明练习差异，先改产品，不采购并公开同质站。单站超过估算上限仍无可玩核心，则停下重估范围。

## 3. 预算与工期假设

按一名熟悉静态前端的开发者估算，包含玩法、基础SEO和人工QA，不含等待授权、商标/域名历史调查、公开发布等待和后续内容维护。Cutle3–4人日、Poople4–5人日、Colordle3–4人日，首批合计约10–13人日；第二批Metazooa6–9、Travle5–7人日。需要真实触屏验收，不能用缩小桌面窗口代替。未通过数据/授权门槛的站不报虚假的固定工期。

首选三个.com当前报价合计首年 **33.75美元**，单价11.25美元/年，当前续费报价亦11.25美元/年；不含可能税费、未来调价、托管/分析费用。此为报价，不是已经购买。具体时间与原始返回见[域名清单](DOMAINS.md)。

## 4. 关键词与页面策略

- 主词、game、play、online、free、unlimited、practice通常先在一个可玩主页自然承接；不要一变体一站、一词一页。每站只选一个主域名，不同时购买上线三份同内容站。
- 只有独立实用功能才加/solver/、/how-to-play/或真实策略页。首批不铺日期答案页；本站自有每日题不能伪称原站今日答案。自有archive须真的存在并能游玩。
- 各站新增变体是待验证的页面定位，**没有分别跑过Trends、Volume/KD**，不能套用主词量、相加或据此预测流量。开发前再按“Trends→同市场Semrush→当前Google SERP”验证unlimited/practice/solver等关键意图。Poople此前镜像还显示archive2,900/KD3、hints1,900/KD4、game1,600/KD15、answer720/KD9；仅补充候选，尚未逐词完成Trends核验。
- 首词已有原站主导，不能靠近似域名推断能拿走主词流量。新页面从有用的练习/教学意图试验，标题以游戏名、玩法和实际控制为主，不虚称官方、同步原版答案、联机或网络绕过。

## 5. 执行与扩张门槛

[完整任务清单](TASKS.md)含共用门槛、每站具体实现、SEO映射、验收标准和依赖。所有复选框是未执行的未来工作。首批顺序为G01→G02→逐站数据/引擎/玩法→G03/G04→获授权后G05→G06。第二批先做数据原型，首批质量和观察通过后再公开扩张。

建议公开后D+7查抓取/索引/错误，D+28看查询匹配和完整游玩率，D+56决定扩张/修正/暂停。此为复盘安排，不是到期应获得排名的承诺。先有GSC曝光/查询与实际开玩、完成/重玩数据，且无许可/质量阻塞，再考虑扩张；若只有部署数，没有效果数据，保持首批规模。数据太少先诊断曝光和抓取，缺失记未知，不因“0记录”立即断言没有需求。收入/广告审批均未测，不能据此给ROI结论。

## 6. 其他候选如何处理

[其余106词处置表](REMAINDER.md)保留全部上一轮候选，不因没有排进首批而丢失。KD小于30也不等于优先：Horsle重复游玩价值待测；Wave Rider混合鞋/冲浪意图；Curve Rush 2真实版本未定；Tap Road/Kart Bros走弱；Rodha混合教育意图；Poetl是球员拼写混淆。2v2io、Baseball Bros等多人游戏先做供应商授权和实时服务审计。

## 7. 证据与交付边界

- [原始域名查询](evidence/domain-quotes.json)：30个精确名称，25个返回可注册；available=false只表示本渠道未确认可注册，不推断一定已注册。
- [公开网页元数据](evidence/public-sources.json)、[仓库初查](evidence/github-source-search.json)、[许可与政策补查](evidence/source-checks.json)、[浏览器玩法核验](evidence/browser-rule-checks.json)。
- [结构化计划](plan.json)直接引用上一轮指标/Trends/SERP证据文件；[验证结果](validation.json)只验证文件和计划一致性，不替代官方量级或授权证明。
- 本轮只形成计划和只读核验；未购买、联系作者/供应商、建仓、建站、部署或修改现有游戏，未更改既有发布holds。
