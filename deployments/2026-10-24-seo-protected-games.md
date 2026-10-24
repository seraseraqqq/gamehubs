# SEO review: Coreball, Minute Cryptic Unlimited and Snow Rider 3D

Date: 2026-10-24 (Asia/Shanghai). Reviewed all seven published/source HTML pages and their static exports. This pass does not deploy, change platform environment values, remove indexing holds or certify gameplay.

## Per-page results

All seven pages returned readable HTML during the live audit. All retain `noindex, nofollow`, with no canonical and no sitemap in the default export. This is deliberate: Coreball/Minute Cryptic await owned domains; Snow Rider awaits actual-domain gameplay acceptance. Existing future-production fixture builds test canonical/social/schema/sitemap generation without changing these live gates.

| Site/page | Title | Description length, before → after | Structured data | Index state |
|---|---|---:|---|---|
| Coreball `/` | Coreball – Play Free Online / 30 Levels | 161 → 152 | VideoGame + visible FAQPage | Hold |
| Coreball `/coreball-tips.html` | Coreball Tips & Level Guide: All 30 Original Levels | 151 → 145 | Article, author added | Hold |
| Minute Cryptic `/` | Minute Cryptic Unlimited – Free Cryptic Practice | 159 → 150 | VideoGame + visible FAQPage | Hold |
| Minute Cryptic `/how-to-solve-cryptic-clues.html` | How to Solve Cryptic Clues: 5 Worked Examples | 157 → 148 | Article, author added | Hold |
| Snow Rider `/` | Snow Rider 3D Unblocked — Play Free Online | 137 → 137 | VideoGame | Hold |
| Snow Rider `/snow-rider-3d-controls.html` | Snow Rider 3D Controls & Loading Help | 147 → 147 | Article | Hold |
| Snow Rider `/about.html` | About & Privacy — Snow Rider 3D Game Page | 130 → 130 | AboutPage added | Hold |

Each source/default page has one H1, a unique title/description and local instructions readable without JavaScript. The raw audit and after-export metadata are in local `deployments/evidence/2026-10-24/seo-protected/live-before.json` and `local-after.json`; these raw diagnostic files need not be committed.

## Repairs

- Coreball homepage now leads with game name, pin timing, controls and available modes in description/social/schema metadata. The VideoGame name matches the visible name. Credits and original-work disclosure remain intact.
- Coreball/Minute descriptions are concise and consistent across page, Open Graph, Twitter and game/article schema. Guide articles identify GameHubs as author and include Twitter image alt text. No ratings, reviews, affiliation or new-gameplay claims were added.
- Snow Rider's three pages now have explicit Twitter cards, titles, descriptions and cover images, plus image dimensions/alt text. The cover's actual size is 1280 × 720. Its production exporter replaces every relative social-image occurrence, including Twitter. The About page has descriptive H1 and AboutPage schema.
- Snow Rider README/checks/plan no longer present the superseded direct GameDistribution blocker or publisher-account onboarding as the current task. They consistently record the deployed Miniplay version and pending actual-domain acceptance.

Missing `meta keywords` observations are rejected: adding them has no Google ranking value. Missing canonicals and `noindex` observations are accepted release restrictions, not permission to expose these sites to indexing. Structured-data checks confirm JSON syntax and relevant types; Google rich-result eligibility is not claimed.

## Verification

- `node --test tests/*.test.cjs` in Coreball: 8/8 pass.
- Same command in Minute Cryptic: 4/4 pass.
- Existing `research/2026-10-23-keyword-seo/check-seo.py` (bundled Python): all 6 site/build-mode cases pass, covering 12 page-mode combinations; page metadata parity, visible FAQ parity, links/assets/fragment targets, JSON-LD, exact sitemap URLs, production canonicals and Vercel preview/default noindex.
- `node scripts/verify.mjs` in Snow Rider: 80/80 pass. Source/local links, share metadata, JSON-LD, current provider CSP, accepted-state canonical/sitemap and absolute OG/Twitter images pass. Explicit owned-origin without acceptance, Vercel preview even with the verified fixture, and the final default build all remain noindex. The final `dist` outputs for all three games are safe noindex previews.
- Live rankup audit: all 7 known pages fetched; no fetch errors or malformed JSON-LD observed. The live copy still predates these local repairs until a successful release.

## Remaining limits

No owned domain was selected for Coreball/Minute Cryptic. Snow Rider's full actual-domain gameplay/restart/fullscreen and physical-mobile acceptance remain pending. No indexing change or Search Console submission was performed. OpenCLI was unavailable in the current shell, so AITDK and PageSpeed/browser verification were not available in this pass; field CWV is unknown. No performance score or SEO ranking improvement is claimed.

## 沉淀的脚本

Enhanced the existing `games/snow-rider-3d-unblocked/scripts/verify.mjs` with assertions for complete per-page Twitter cards and absolute production Twitter images; verified with the real source and isolated fixture origins. Reused the existing two-site SEO export verifier and rankup live-audit script instead of adding duplicate tooling.
