# Acceleration City：本地嵌入验证

核验日期：2026-10-25（Asia/Shanghai）。用户在核对阻塞后明确选择暂不申请授权，先进行代码嵌入。

## 本次完成

- 已核实唯一源码为 `https://github.com/seraseraqqq/gamehubs-acceleration-city`，本机检出位于 `E:/Projects/game-sites/acceleration-city`；fetch 后 main 与 origin/main 一致，核验时提交为 `ba82e939249b775f5637248af986843c5d31ce4b`。
- 原有 `app.js` 已在点击 Play 后创建 iframe，直接加载 `https://activities.cs2n.org/acceleration-city/`，包含全屏、键盘焦点和重载处理；无需重复添加第二套嵌入实现。
- 执行 `node scripts/verify.mjs`：89 项检查通过，报告在独立仓库 `scripts/verification.json`。覆盖构建、来源 URL、无 token、重载交互及预览/生产配置。
- 执行 `node scripts/build.mjs`：默认预览导出成功。启动 `node scripts/serve.mjs 4198`，本机入口为 http://127.0.0.1:4198/；此地址只适用于本设备正在运行的预览。
- HTTP 核验：首页、app.js、官方源均返回 200，当前官方响应未返回 X-Frame-Options 或 Content-Security-Policy 头。本地响应为 noindex。HTTP 通过不代表 Unity 完整游玩通过。

## 权限核对与用户选择

官方 [CS2N 条款](https://www.cs2n.org/tos) 的 Permitted Use 及 Prohibited Uses/Activities 限制外部展示与整合，现有证据没有提供本站商业嵌入许可。[CMU 官方联系方式](https://www.cmu.edu/roboticsacademy/about/contact-us.html) 公布 cmra@nrec.ri.cmu.edu。

已在连接邮箱中搜索游戏名、本站域名及 cs2n.org 来信，未找到匹配邮件；该结果不排除其他邮箱或线下文件中存在授权。后续用户明确选择不申请，因此本次没有创建或发送授权邮件，没有联系官方。

用户指令授权继续代码嵌入；不将其写成权利方的许可。本次没有修改生产许可确认标记、部署、DNS 或索引状态。

## 尚未验收

本次尚未进行浏览器内 Unity 菜单/驾驶/编程、手机实机、原生全屏、实际域名加载与性能核验。下一条动作是打开本机预览，点击 Play，完成游戏内实测；正式发布另按明确的发布范围处理。

相关站点状态通过 `scripts/hub.py` 的修订保存入口写回 `data/sites/acceleration-city.json`，保留上个版本和实际未发布状态。
