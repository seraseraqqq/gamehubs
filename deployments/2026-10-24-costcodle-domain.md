# Costcodle 域名一致性修复

用户授权将正式域名统一为`https://costcodle.cc`。Vercel项目仍为`costcodle-unlimited`（`prj_YSqFgvdSOdZaaYdkPukWqmOmYpCm`）。项目已验证绑定costcodle.cc，www.costcodle.cc以301指向裸域。本轮未调整DNS、域名重定向或部署保护。

## 修复前的线上事实

- https://costcodle.cc/、/sitemap.xml、/robots.txt均返回200。
- 首页canonical、sitemap内loc和robots地图声明仍指向旧`costcodle-unlimited.vercel.app`。
- 旧默认地址首页及地图返回404 / DEPLOYMENT_NOT_FOUND。

## 本地已修复

- `index.html`：canonical、OG URL、OG/Twitter图片、VideoGame JSON-LD的URL及图片地址。
- `game.js`：成绩分享文案中的游戏链接。
- `vercel.json`：生产构建参数改为`--origin https://costcodle.cc`。
- 源码`robots.txt`、`sitemap.xml`和游戏README的构建示例。
- 项目台账中的正式域名、公开地址和待发布状态；较早的HTTP/部署审计快照作为历史保留。

24项域名/导出检查通过，覆盖预览与生产的canonical、社交元信息、结构化数据、分享链接、robots/sitemap、旧域名残留及预览noindex门禁；game.js语法检查通过。[验证证据](evidence/2026-10-24/costcodle-domain-checks.json)。本轮只替换域名，未改变游戏规则。

## 待发布与验收

当前仅本地源码修复，**未提交/推送GitHub，未部署Vercel**，遵守用户今天暂停部署的安排。线上旧元信息不会因本地修复自动改变。

明天将这些改动随对应源码提交推送，从包含本修复的最新main部署Costcodle；不要重发不含此修复的旧成功提交。正式域名应满足：

1. 首页200，canonical为`https://costcodle.cc/`。
2. `https://costcodle.cc/sitemap.xml`返回200，其loc为`https://costcodle.cc/`。
3. robots地图声明为`https://costcodle.cc/sitemap.xml`。
4. OG/JSON-LD/分享链接均无旧Vercel主机名；www继续301到裸域。
5. 完成线上验收后再向GSC提交新域名地图，记录提交/抓取/收录状态。
