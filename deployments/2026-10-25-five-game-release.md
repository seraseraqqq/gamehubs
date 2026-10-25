# 五个待验收游戏部署到 Vercel

2026-10-25（Asia/Shanghai）。用户明确要求将 Cutle、Poople、Colordle、Metazooa、Travle 部署到 Vercel。本轮使用现有独立源码与 main 分支，没有购买域名、接广告或把真人/真机验收记为通过。

| 游戏 | 独立 Vercel 项目 | 公开访问地址 | 实际生产源码 |
|---|---|---|---|
| Cutle | prj_GsfEJjROGzjNVTKWZzUIsEMmZl9O | https://gameshub-cutle.vercel.app/ | ad22343eea1b16d2d864f1485ba6dd4c66735bcf |
| Poople | prj_9q0dNtkD2iDZhLYNDV45mdtHR6nz | https://gameshub-poople.vercel.app/ | 6ce5a6fa47dc2ad599244c2b1fc072bddf35307a |
| Colordle | prj_MO2mqYcaGJjLqrYaocxZDwpjEmyr | https://gameshub-colordle.vercel.app/ | 15c6fcc700d91867973e09d099c8b24776cffa24 |
| Metazooa | prj_Jf18eJkWESULNxxU1lkcVl39ii9R | https://gameshub-metazooa.vercel.app/ | bf51cf666218691c4f767e30a9a2b20039a99174 |
| Travle | prj_eO2dPfqIs1Wx5KPim0I52tlnWlVP | https://gameshub-travle.vercel.app/ | c4beed9defbbb241d961f3b0229bbc1973061daf |

五个项目全部 READY，属于 gx03410-8651s-projects，与各自 `seraseraqqq/gameshub-<id>` 私有仓库 main 分支集成。构建命令 pnpm build，输出 apps/web/dist/client，仓库根构建。按仓库 packageManager 锁定 pnpm 12.9.1，ENABLE_EXPERIMENTAL_COREPACK=1；SITE_INDEXABLE=false，默认域保留 noindex。

## 验证结果

- 五仓 `pnpm check` 均通过，包含类型检查、25项引擎测试（6/5/4/4/6）与 TanStack 静态预渲染生产构建。
- 各站6条公开页面及其实际引用的 JS/CSS/图标、robots、sitemap、真实404每站22项，共110项HTTP检查通过。工具为 `scripts/check-game-release.mjs --discover-assets`。
- 在本机已登录 Edge 的实际生产页面检查 hydration 后的交互：Cutle 一刀产生50:50反馈及本地记录；Poople 拒绝zzzz且提示计数/字母提示更新；Colordle 搜索Red并提交，产生匹配百分比；Metazooa 搜索Dog并提交，产生共有分类节点及剩余次数；Travle 提示返回最短下一步Niger。浏览器截图已保存。
- 仅本轮部署与冒烟通过，实体手机、五人对照、跨浏览器/读屏全覆盖、生产性能与真实搜索收录仍未验收。没有将部署 READY 替代完整产品验收。

证据目录：`deployments/evidence/2026-10-25-five-game-release/`，含 Vercel 生产状态/版本、五份HTTP报告及五张浏览器截图。

## Cluster Rush 地址回填

Vercel 当前实际绑定为 https://playclusterrush.online/ ，www 301 到根域。DNS nameservers 仍为 Spaceship，Vercel 返回 misconfigured=false。初次核验时证书尚未生效，未绕过TLS；之后正常验证证书通过，页面/资源/跳转12项检查全部通过。原默认域作为备用入口保留。

本轮只核实并更新管理台账，没有再次操作域名购物车、付款或DNS。当前游戏导出仍 noindex、未配置正式 canonical；该事实与“域名已接通”分开。域名是用户自行处理后的实际新地址，不能把此前 .com 报价/暂缓决定当作当前 .online 状态。
