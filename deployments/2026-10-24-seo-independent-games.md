# Independent game repositories: SEO review

Checked 2026-10-24 (Asia/Shanghai). Sources: `E:/Projects/game-sites/cluster-rush` and `E:/Projects/game-sites/acceleration-city`. Both initially clean. The old GameHubs game directories were not edited. Neither site is deployed; permission and release holds remain in force.

## Findings and repairs

| Site | Verified issue | Repair |
|---|---|---|
| Cluster Rush | Homepage OG title omitted the descriptive game query present in its title; Twitter title/description/image and share image alternatives were absent. | Aligned OG title; exporter now supplies page-specific Twitter metadata, absolute production image URLs and descriptive image alternatives for all five content pages. |
| Cluster Rush | Export verifier used a real, unowned domain as a test origin. | Uses reserved `cluster-rush-build-check.invalid`; no ownership or purchase implied. |
| Acceleration City | Guide/about lacked OG descriptions; game-specific subject was absent from their H1s; Twitter metadata was incomplete. | Added page descriptions and clear game-led H1s; exporter supplies Twitter titles/descriptions plus OG/Twitter images in preview and production. The actual existing screenshot is 949×545; dimensions and alternatives are emitted, using `/assets/og-game.jpg` when no production origin is configured. |
| Acceleration City | A configured origin remained in preview schema/breadcrumbs although canonical was suppressed. | Forced preview clears the origin before schema construction; all non-production Vercel environments use preview behavior. |
| Acceleration City | Production game schema pointed only at the third-party activity, rather than connecting the canonical player page and game entity. | Production VideoGame URL/@id derives from the owned-origin setting; WebPage points to that entity, retaining official source in `sameAs` and original creator attribution. |
| Acceleration City | Origin validation allowed local/IP/port-bearing production targets. | Rejects these targets along with insecure, path, query and credential-bearing origins. |

No invented reviews/ratings, affiliation, multiplayer or touch support was added. Gameplay, visual styling, provider branding and attribution are preserved.

## Per-route metadata and indexing

All routes below have exactly one H1. T/D are observed title/description character counts, including source HTML entities. Every content page has a distinct title/description and valid JSON-LD. Current final exports are all **noindex, nofollow**, blocked by preview robots; no first-party canonical is invented.

| Repository | Route | Title | T/D | Production fixture behavior |
|---|---|---|---|---|
| Cluster Rush | `/` | Cluster Rush — Play the Truck Jumping Game Online | 49/154 | Own canonical/OG URL and VideoGame schema; sitemap |
| Cluster Rush | `/how-to-play.html` | How to Play Cluster Rush — Controls, Climbing & Tips | 52/151 | Own canonical/OG URL and WebPage schema; sitemap |
| Cluster Rush | `/not-loading.html` | Cluster Rush Not Loading? Browser & Keyboard Fixes | 50/149 | Own canonical/OG URL and WebPage schema; sitemap |
| Cluster Rush | `/about.html` | About This Cluster Rush Fan Site & Game Source | 46/127 | Own canonical/OG URL and WebPage schema; sitemap |
| Cluster Rush | `/privacy.html` | Privacy — Cluster Rush Fan Site | 31/127 | Own canonical/OG URL and WebPage schema; sitemap |
| Cluster Rush | `/404.html` | Page Not Found — Cluster Rush | 29/88 | Remains noindex; no canonical/schema/sitemap entry |
| Acceleration City | `/` | Acceleration City — Play the CoBot Driving Game | 47/146 | Own canonical/OG URL and connected VideoGame/WebPage schema; sitemap |
| Acceleration City | `/guide.html` | Acceleration City Guide — CoBot, Controls & Loading Help | 56/149 | Own canonical/OG URL and WebPage/Breadcrumb schema; sitemap |
| Acceleration City | `/about.html` | About This Acceleration City Player Guide | 41/123 | Own canonical/OG URL and WebPage/Breadcrumb schema; sitemap |
| Acceleration City | `/404.html` | Page Not Found — Acceleration City | 34/— | Remains noindex; intentionally no search description/canonical/schema/sitemap entry |

Production behavior was tested only in local fixture exports with reserved `.invalid` origins. Acceleration City's test permission flag does not establish actual embedding rights. Default exports were restored afterward. Acceleration City's empty preview sitemap and Cluster Rush's absent preview sitemap are intentional; production output has three and five canonical content URLs respectively.

## Validation

- Cluster Rush: `node scripts/check.mjs` — **107 assertions pass**. Covers default/forced-preview isolation, production metadata, schemas, share image fields, internal file/anchor resolution, sitemap exclusion and export whitelist. Evidence: canonical repo `research/2026-10-24-cluster-rush/export-checks.json`.
- Acceleration City: `node scripts/verify.mjs` — **89 checks pass**. Covers noindex/origin/license gates, canonical and schema identities, preview and production social images, measured image dimensions/alternatives, invalid origins, route references and existing reload behavior. Evidence: canonical repo `scripts/verification.json`.
- Acceleration City: `node scripts/build.mjs` — final export `production: false`, `origin: null`.
- Aggregate checker: `node management/tools/check-portfolio-seo.mjs --site acceleration-city` from GameHubs — all four preview routes pass, zero failures.
- Both repositories: `git diff --check` passes (only existing Windows newline conversion notices).

Public redirect/crawl/header checks, AITDK, real performance/Core Web Vitals, Search Console and actual-domain gameplay cannot be accepted for sites with no production deployment. No ranking or traffic improvement is claimed.

## Changed paths

Cluster Rush: `.rankup/INDEX.md`, `.rankup/audit.md`, `index.html`, `scripts/build.mjs`, `scripts/check.mjs`, `research/2026-10-24-cluster-rush/export-checks.json`.

Acceleration City: `HANDOFF.md`, `about.html`, `guide.html`, `scripts/build.mjs`, `scripts/verify.mjs`, `scripts/verification.json`.

## 沉淀的脚本

Extended the existing parameterized exporters and verifiers above; no duplicate audit or browser script was introduced. Each was executed with real local repository paths and reserved production fixtures. Handoff/audit documents record completed fixes separately from pending release acceptance. Commit/push is left to the coordinating agent.
