# GameHubs 游戏开发与发布默认规则

生效：2026-10-25，来源为站主本轮追加规则。适用于后续研究、新游戏开发，以及已授权的游戏修改／发布；实际实现仍进入各游戏唯一源码仓库。规则存在本身不代替执行验收。后续站主已明确授权17站改造，实际完成记录以GameHubs正式站点记录及 deployments/2026-10-25-portfolio-analytics.md 为准。

## 1. 关键词研究来源

先用 Google Trends 验证趋势，再观察真实 Google SERP；补充指标优先使用[免费 Semrush 镜像](https://sem.3ue.com/analytics/keywordoverview/?db=us)。可使用站主的[自部署 OpenSEO](http://43.130.248.164:3002/p/a0e8ed65-e108-41a8-bb7a-6903c73acd5e)，也可使用 DataForSEO API。免费镜像是指标来源优先级，不代替 Trends、真实 SERP 或产品可行性判断。

- 三个来源分别保存 provider、目标国家／语言、指标数据库／时间口径、采集时间、实际数值、原始证据及错误。镜像显示值标注非官方核验；OpenSEO 标注自部署和其可见上游；DataForSEO 标注实际 endpoint、请求范围及响应 cost。来源冲突保留各自结果，不拼出一个伪精确值；缺失为 unknown。
- 默认沿用 US/en；同词、同国家、同语言比较。原词、变体、合格／不合格／未知／失败均回填，不能只存短名单。
- 已允许使用自部署 OpenSEO，不再套用旧“禁止 OpenSEO”规定。若某个操作实际调用付费上游，先核对本轮范围、余额与已有预算；超出已有授权才补充确认，不因打开自部署页面反复询问。
- DataForSEO 可作为补充、扩词或交叉核验；使用前确认已授权的请求规模和费用，复用有效证据。既有脚本仍需显式 `--allow-paid`，该参数不是硬性金额上限；超时不盲目重发可能已计费的请求。
- 原入口有附加查询参数时，可用站主提供的完整入口；不要将登录态、授权头或访问令牌复制到研究证据及子项目。

### 跨设备凭据

统一使用 `DATAFORSEO_LOGIN`、`DATAFORSEO_PASSWORD`，非敏感市场配置为 `DATAFORSEO_LOCATION_CODE=2840`、`DATAFORSEO_LANGUAGE_CODE=en`。

- GitHub Actions：凭据存 Repository／Environment Secrets，工作流仅引用 `${{ secrets.DATAFORSEO_LOGIN }}` 和 `${{ secrets.DATAFORSEO_PASSWORD }}`，通过运行时环境变量注入。仓库只保存变量名、用途和存储位置。
- 本机／另一设备：从受信密钥管理器注入同名环境变量，或使用已忽略的本地 `.env`。若需要凭据随 Git 同步，只提交加密后的密文，解密密钥另存设备密钥库／受信密码管理器，不与密文一起入库。
- Actions Secrets 只能注入获准的工作流，不能从 GitHub 下载明文用于新设备；不能把配置 Secrets 记成所有设备已可调用。Base64 不是加密，私有仓库也不提交明文或授权头。
- 本次只记录规范，没有收到、创建、迁移或验证任何 DataForSEO 凭据；未来接入须以成功的最小授权请求确认可用性，证据脱敏。

## 2. Vercel 自定义域名

| 域名 | Vercel 设置 | 目标 |
|---|---|---|
| `example.com` | Connect to an environment → Production | 正式不带 www 地址 |
| `www.example.com` | Redirect to Another Domain → **301** | `example.com`，访问结果为 `https://example.com/…` |

在项目实际 team／project 下配置并核对域名验证、DNS 与 HTTPS。`SITE_ORIGIN`（或该游戏对应配置）、canonical、Open Graph URL、sitemap 和 GameHubs `urls.production` 均使用同一不带 www 地址。跳转保留路径与查询参数，不形成循环；首页和至少一个内页都要实测。不得用默认307／308代替站主指定的301。

没有自定义域名时保留已分配的 Vercel 默认域，不为 `*.vercel.app` 人工构造 www。已有 www 主站或308属于待迁移事实；在实际完成迁移和验证后才更新正式记录，不能只改台账制造通过。域名接通与允许索引是独立事项，原有 noindex 验收条件继续保留。

## 3. 默认接入 Vercel Web Analytics

站主所说的 analysis 按 **Vercel Web Analytics** 执行。默认包含客户端接入与 Vercel 项目启用两个步骤，不能只完成其中一个。

1. 在实际承载网页的包安装 `@vercel/analytics`，更新该仓库锁文件。React／TanStack 使用 `@vercel/analytics/react` 的 `<Analytics />`，挂在共享根布局，仅一份；Next.js 使用其适配入口。普通 JS 使用 `import { inject } from '@vercel/analytics'; inject();`，在浏览器入口执行，避免 SSR 直接运行。无包管理构建的静态 HTML 使用官方支持的脚本接入，记录为何未安装 npm 包。
2. 发布时在正确 Vercel 项目的 Analytics 页面启用 Web Analytics。可用 CLI 时先核对当前版本帮助和 team，再执行 `vercel project web-analytics enable <project-name>`；不依赖记忆猜 API。此项默认授权使用当前套餐内普通 Web Analytics，不包含套餐升级、付费扩展或重复接入多套统计。
3. 构建并部署后，用真实浏览器访问生产页，检查统计脚本正常加载、pageview 请求成功；SPA 验证一次路由切换，避免重复初始化。随后回读项目启用状态和后台数据接收。后台有延迟或广告拦截时如实记录 pending，不用“已安装”冒充“已收到数据”。
4. 在正式站点 `development.webAnalytics` 分别记录 `provider`、`sdkInstalled`、`projectEnabled`、`pageviewVerified`、`dashboardReceived`、`checkedAt` 与证据路径；未运行的状态为 `null`／pending。同步各游戏接入看板。不要回填未验证的现有站点。

Speed Insights 是另一项性能服务，不能用它代替 Web Analytics，也不因本规则默认开通付费套餐。统计不收集用户答案、邮件、密钥或其他敏感信息；URL 含敏感参数时先做过滤。

## 4. 开发与发布交付清单

- 发布前全量读取团队项目的 Git 关联，按仓库分组查重；只核对正式站点清单会漏掉额外的 `web` 等项目。确认唯一正式项目后，在获准修复范围内解除多余项目的 Git 连接，不能通过重复导入解决导入建议。
- `New repositories detected` / `Git Import` 是可部署目录建议，不是待部署队列。根目录构建的 pnpm workspace 可继续出现 `apps/web` 建议；先核对现有项目ID、仓库、Root Directory、build/output配置、READY版本和线上资源，再消除重复建议，不能为了消除建议改坏构建根目录。
- 发布记录优先保存到 GameHubs 管理仓库；游戏源码的小修复先本地验证、合并提交后再发布，避免仅为补充发布记录重复触发构建。Ignored Build Step 中止的部署仍可能占部署配额，不能拿 CANCELED 当作没有消耗。
- [ ] 研究记录所用来源、市场、时间、原始证据和 unknown；凭据没有进入 Git 或研究附件。
- [ ] 新游戏唯一源码仓库的依赖、锁文件和共享布局已完成 Web Analytics 接入。
- [ ] Vercel 正确项目已开启 Web Analytics；脚本／pageview／后台接收分别有证据或明确 pending。
- [ ] 若有自定义域名：不带 www 为 Production；www → 不带 www 为301，HTTPS、内页路径和查询参数通过。
- [ ] canonical／sitemap／运行时 origin／GameHubs 生产地址一致；既有索引暂缓条件没有被误解除。
- [ ] 按当前 revision 保存正式站点记录，再 validate／generate；部署完成、完整游玩和搜索收录分别记录。

核验参考（2026-10-25）：[Vercel Analytics 快速开始](https://vercel.com/docs/analytics/quickstart)、[Analytics SDK](https://vercel.com/docs/analytics/package)、[Vercel project CLI](https://vercel.com/docs/cli/project)、[自定义域名](https://vercel.com/docs/domains/set-up-custom-domain)、[GitHub Actions Secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)。
