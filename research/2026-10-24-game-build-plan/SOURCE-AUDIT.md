# 玩法、源码与许可判断

核验日2026-10-24。公开可读、能够iframe、GitHub仓库存在、LICENSE允许复用，是四件不同的事。代码/数据许可不代替名称、商标、音乐/图片及服务条款审查。以下只据已取到的文件与公开政策作实施判断，没有联系权利方，也没有获得新增授权。

## Cutle

结论：**自研**。静态页面 + TypeScript + SVG。独立实现直线/半平面裁剪和多边形面积，MVP只生成凸多边形；图形、随机种子、UI全部自行制作。无需iframe，不复制原站每日形状或代码。

- [原站规则](https://pfiffel.com/cutle/)：拖动直线分割形状，以接近50:50为目标；48:52及以内算赢，原站每日UTC更新。HTTP检查曾失败，规则随后由网页读取确认。未核验到原游戏可商用开源代码。
- [当前前列竞品](https://cutle.org/)：页面明示Infinite、Archive、自定义形状和生成工具；无限模式不保存进度，不能把无限本身当作独家差异。

## Poople

结论：**自研 + 公有领域词库**。TypeScript词图 + BFS求最短路径，词库离线打包。独立整理常见四字母词、建立连通分量，只抽取能到POOP的起点。自有每日seed，与原站题库无同步关系。

- [原站玩法](https://poople.io/)：浏览器规则确认：四字母英文词，每次只换一个字母，向POOP转换，追求少步数。
- [当前练习竞品](https://pooplegame.com/unlimited)：已存在无限练习及Solver入口；页面称练习不保存，本地练习历史仅作拟验证差异。
- [第三方参考仓库](https://github.com/poople-game/poople-game)：README仅称源码供参考，游戏内容归Poople；没有确认可商用开源许可，不能直接部署。
- [候选词库许可](https://github.com/dwyl/english-words/blob/master/LICENSE.md)：Unlicense，公有领域献出文本；商业使用可行。锁定版本、保留许可记录并另行清洗词表。

## Colordle

结论：**自研 + MIT颜色数据**。独立颜色匹配逻辑 + MIT颜色名快照。MVP用明确公开的RGB距离归一化分数；相同颜色100%，越接近分数越高。它是本站评分，不能声称复现原站算法。颜色名别名和重复色值先规范化。

- [本次目标原站](https://colordle.ryantanen.com/)：浏览器帮助确认颜色名输入、百分比反馈、每日颜色，数据链接meodai/color-names。未确认原游戏代码许可。
- [颜色名数据MIT许可](https://github.com/meodai/color-names/blob/master/LICENSE)：MIT，David Aerne；可使用数据，保留版权及许可。
- [另一个MIT版本](https://github.com/hobgoblina/colordle)：README/LICENSE可用，但React17/旧CRA，玩法是另一类Wordle式输入；App含反嵌入检查。不是目标原版直接部署包。
- [BSD版差异](https://github.com/weber1158/colordle)：BSD-3-Clause已见，但为MATLAB十六进制猜色应用，不是网页可直接部署源。

## Metazooa

结论：**条件自研：先完成分类数据审查**。自建精选动物列表+taxon ID映射+最近共同祖先LCA；优先核查NCBI taxonomy包，再固定版本。若使用Wikidata CC0自行整理，需独立校验分类一致性。MVP无动物照片、不抓取原站私有题库。

- [原站FAQ](https://metazooa.com/faq)：确认基于NCBI分类，并非直接使用Wikipedia树。
- [官方翻译仓库](https://github.com/the-abe-train/metazooa-translations)：公开翻译不等于完整游戏代码。LICENSE和其引用的twl-monorepo源码请求未取得可用文件；不推断仓库私有或授予分发权。
- [MIT工具而非网页游戏](https://github.com/harrison-barnes/metazooa)：Python分析/抓取/模拟工具；不是开源网页成品，不继承其抓取的原站清单。
- [NCBI政策](https://www.ncbi.nlm.nih.gov/home/about/policies/)：政府制作信息有公有领域说明，同时提示第三方内容和数据限制；具体taxonomy下载包声明仍需核验，不能一概宣布全部NCBI数据无约束。
- [可替代结构化数据许可](https://www.wikidata.org/wiki/Wikidata:Licensing)：Wikidata结构化命名空间为CC0；其他文字及图片不自动CC0。如改用此数据，应以自有分类规则说明，不声称原站一致。

## Travle

结论：**自研 + 公有领域地图**。本地简化SVG地图+自建国家邻接图+BFS最短路；使用Natural Earth数据快照。陆地边界、飞地、海峡/岛屿连接须写明自己的规则，不能仅靠多边形相交自动认定。

- [原站](https://travle.earth/)：国家路径猜谜；原站每日题不复制。
- [旧版入口](https://imois.in/games/travle/)：作为玩法核验入口；未确认可直接部署的完整开源许可。
- [Natural Earth官方使用条款](https://www.naturalearthdata.com/about/terms-of-use/)：矢量/栅格地图公有领域，可商用修改；适合离线SVG底图。国家邻接仍需单独整理。

## Spotle

结论：**条件自研：音乐人元数据先行**。拟自研艺人属性猜谜，先验证合法可用的元数据来源/更新方式；MVP可不含音频与头像。若无法满足玩家识别需求则暂缓，不抓取受限服务。

- [原站](https://spotle.io/)：艺人猜测玩法；代码、照片及数据集的商用来源仍待核验。

## Traffic Road

结论：**授权iframe**。只考虑权利方允许的iframe/feed；确认域名、广告、分成、退出/下架及可用性约束，再验证frame/CSP、保存、重启、横竖屏和触屏。授权未到位不镜像包、不替换广告。

- [游戏说明](https://azgames.io/traffic-road)：四模式3D摩托游戏；HTTP页面出现traffic-road.embed地址，仅证明技术入口。
- [AZ条款](https://azgames.io/term-of-use)：只明示个人非商业材料访问，复制/修改/分发等需事先书面许可；未找到可覆盖本站商业嵌入的授权。

## Maptap

结论：**条件自研地图定位**。拟自研地图定位与距离评分；离线地图+独立整理地点事实。地图精度、地点命名、移动缩放和题目成本先做小样。没有获准iframe源。

- [原站菜单](https://maptap.gg/)：Chrome核验Practice Levels、Prior Days、玩家关卡、Atlas、Groups、Versus等。
- [地图底图候选](https://www.naturalearthdata.com/about/terms-of-use/)：仅解决底图，不等于地点题库/图片/原站游戏代码许可。

## Scrandle

结论：**待核验：授权iframe优先，或合规素材自研**。先完成真实玩法与每类素材的权利来源清单。可授权feed则iframe；有独立可商用数据/素材才评估自研。没有条件前不指定为开源部署。

- [原站入口](https://scrandle.com/)：HTTP入口可访问，未完成完整实际游戏和素材来源核验。

## Songless

结论：**授权iframe或取得音频许可后自研**。首先核查权利方是否提供可商用嵌入/音频方案。若没有授权内容，降为观察，不以陌生开源壳套商业录音。

- [原站](https://lessgames.com/songless)：歌曲识别方向；音频许可、具体供给与嵌入授权未核验。

## X Trench Run

结论：**商业授权成品自托管；订阅iframe另询价**。只有预算和合同通过后才按授权部署编译成品或订阅iframe；这不是“开源部署”。原开发商游戏演示/CDN不等于免费发行许可。

- [官方许可产品页](https://www.marketjs.com/item/x-trench-run/)：页面列VIP Prime 5999 USD、编译成品、单项目/单域名、原样不含定制。
- [官方买家FAQ](https://www.marketjs.com/buyer-faq/)：固定费通常交编译文件自托管，订阅交iframe链接；不交原始源码。不能把5999当作已包含订阅iframe的价格。

## 额外排除的误用

- osmanyo/colordle的LICENSE请求404，不能把仓库公开等同允许商用。
- hobgoblina/colordle的MIT代码与目标原版玩法不一致；页面还明确阻止外站嵌入，不擅自iframe该站。需要复用任何组件时仍保留通知并审查依赖。
- AEFeinstein/metazooa-solver有MIT代码，但README是本地求解工具并包含从原站提取物种的流程。其代码许可不自动证明原站数据可重新分发，本计划不用原站提取名单。
- NCBI数据政策不是对所有第三方内容的无条件许可；taxonomy包声明和具体字段仍是MET-DATA的验收前提。
- Natural Earth公有领域底图不自动提供准确的游戏邻接表/城市题库，地图事实也要检验。

原始取证：[HTTP元数据](evidence/public-sources.json)、[首轮仓库文件](evidence/github-source-search.json)、[补充文件与政策](evidence/source-checks.json)、[浏览器观察](evidence/browser-rule-checks.json)。GitHub请求404只代表该路径/访问未取得文件，不推断作者恶意或仓库一定私有。
