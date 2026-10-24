# Coreball + Minute Cryptic Unlimited SEO — 2026-10-23

> 2026-10-24整理注：本报告保留当时结果；相关一次性测试/旧同步脚本已移出管理仓库，不再按文内旧命令复跑。当前质量复查使用仓库根执行 `node management/tools/check-portfolio-seo.mjs --public`，游戏专属测试见各游戏README。

## Scope and delivery

The owner corrected the second game from Costcodle to orbit-pins, approved keyword-based directory names and explicitly requested no separate public brands. Current paths are `games/coreball` and `games/minute-cryptic-unlimited`. Costcodle is unchanged. Source code module identifiers and browser storage keys remain compatible; these are not public branding.

Both sites are locally validated. There is no owned production origin in the repository inventory. This is an implementation report, not evidence of live deployment, indexing, traffic, keyword volume or revenue.

## Method and source boundaries

Public Web.Cafe sources checked on 2026-10-23:

- [一个关键词一个页面，索引页别硬写成排名页](https://new.web.cafe/tutorial/detail/83j52alj94) — public heading dated 2026-05-29.
- [首页和核心功能别分开，后面改起来很麻烦](https://new.web.cafe/tutorial/detail/rrcbxuqj82) — public heading dated 2026-05-04.
- [SEO 平台数据为何只能参考](https://new.web.cafe/tutorial/detail/u1ckzztgqv) — public heading dated 2026-09-15.
- [Official API and skill distribution](https://seo.web.cafe/api/) — official `gefei` and `gefei-page` instructions downloaded and read. The CLI reported no configured token. No paid API call was made; SEO credits spent: 0. No official audit score is claimed. The public article pages expose headings/navigation but not their full member-only text; no claim to have read those bodies is made.

Our application of those principles: keep the game on its primary landing page, concentrate each main query on that homepage, and add one distinct useful guide rather than duplicate landing pages for minor keyword variants. Do not hide content from crawlers or manufacture ratings, unlimited new puzzles, official affiliation, network-unblocking promises or keyword metrics.

## Page map and changes

| Site | Page | Target intent |
| --- | --- | --- |
| Coreball | `/` | coreball, coreball game, coreball online: play immediately |
| Coreball | `/coreball-tips.html` | coreball tips: flight timing, practice, all 30 original configurations |
| Cryptic | `/` | minute cryptic unlimited: practice without a daily play limit |
| Cryptic | `/how-to-solve-cryptic-clues.html` | how to solve cryptic clues: five original worked examples |

- Replaced public Pinlark/Clue Garden branding in homepage copy, navigation, metadata, share cards and game dialogs. The query now leads the title, H1, description and introduction.
- Kept a short independent-version explanation. Cryptic explicitly has 20 original clues with unlimited replay; it does not advertise an infinite supply of unique clues or official daily answers.
- Added static guides with links from their homepages and return links. Coreball's reference matches engine parameters; Cryptic's five examples match the authored clue bank. Answers use native accessible disclosure elements.
- Rebuilt four 1200 × 630 PNG cards, with separate home and guide images. No new runtime requests or dependencies.
- Builds export both pages and produce matching self-canonical URLs, absolute social-image URLs, JSON-LD URLs, robots and two-page sitemaps when an owned production origin is explicitly configured. Preview and default builds remain noindex; stale production sitemaps cannot survive a preview rebuild.
- Kept `.html` guide URLs and set `cleanUrls: false` to avoid a redirect/canonical mismatch. Repository directory changes do not imply public URL changes; no invented old-domain redirects were added.
- Updated inventory, current navigation references and historic QA script paths. Historical JSON/image results retain old site IDs as records of the previous build. The old research report has a correction note pointing here.

## Validation

- `node --test games/coreball/tests/*.test.cjs games/minute-cryptic-unlimited/tests/*.test.cjs`: 12/12 pass, including all 30 levels in both modes and all 20 clue constructions.
- `python research/2026-10-23-keyword-seo/check-seo.py`: both sites × production, preview and default exports × two pages pass. Checks include one H1, duplicate IDs, metadata agreement, real assets, internal links and fragments, visible FAQ/schema agreement, canonical URLs, robots, sitemap and development-file exclusion. `.example` origins are local fixtures only. [Machine-readable results](static-checks.json).
- Chrome browser smoke checks on 2026-10-23: both homepages initialize; 30 level choices; both homepages and both guides have no document-wide overflow at 390 px; Cryptic guide disclosure opens; Coreball guide renders 30 rows. Viewport override was reset and the QA tab closed. OpenCLI was unavailable, so the built-in Chrome connection was used. This is not a field Core Web Vitals or real-device Safari test.
- Source/social-card PNG visually inspected. No paid page-coach, AITDK, PageSpeed, GSC or live production verification was performed.

## Launch and measurement

Set external Vercel Root Directory to `games/coreball` or `games/minute-cryptic-unlimited`. Configure `SITE_ORIGIN` to each owned HTTPS domain in production; preview environments retain noindex. Deploy and verify both live pages, share images, canonical, robots and sitemap before submitting to Search Console. No domain purchase or new hosting project is part of this change.

After verification, submit each sitemap in its own GSC property. Review query/page impressions, clicks, CTR and positions after data accumulates; use actual queries to decide the next useful page. Do not assume deployment guarantees indexing or traffic. Ads are currently unconnected, and no ad provider IDs or revenue claims were inserted.

## 沉淀的脚本

- `check-seo.py`: repeatable dependency-free export and link validation; executed successfully for both real game directories.
- `generate-social-cards.cjs`: repeatable native typography PNG generation; executed successfully with bundled `@napi-rs/canvas` available through `NODE_PATH`.
- Each game's `scripts/build.mjs`: isolated export for its Vercel root; no dependency on files above that directory.

Maintenance: current references and inventory updated, storage keys and historical QA snapshots intentionally retained. No cross-project SEO result is inferred from these local checks.
