# Costcodle Unlimited

An independent six-guess price puzzle with a shared UTC daily item and unlimited practice. The catalog contains 152 fixed puzzle reference prices; these are not current store prices. Original local category illustrations represent product categories, not official product photographs. No affiliation with Costco is implied.

## Local preview

No runtime dependencies. From this game directory:

```sh
python3 -m http.server 4192
```

Open http://127.0.0.1:4192/. The repository review server uses this port during the current session.

## Gameplay

- Daily item: deterministic hash of the UTC calendar date. Completed daily results restore in the same browser.
- Unlimited: replay with a randomly selected catalog item.
- Within 5% is a win; within 25% is warm; otherwise cold. Higher/lower hints guide the next guess. Six attempts per round.
- Statistics, daily completion and optional sound preference are browser-local. Invalid/corrupt records fall back safely. Pricing data has no live feed or verified collection date.

## Assets and SEO

Fonts are hosted locally with their OFL license files; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Native HTML/CSS/vector artwork supplies the page and social card. Social-card source is in `design/social-card.html`; the published PNG is 1200 × 630. No remote font or product-image request is needed to play.

The HTML contains one H1, readable instructions, matching visible FAQ/JSON-LD, a canonical URL, and Open Graph/Twitter metadata. FAQ schema is descriptive and does not guarantee a Google rich result. No ratings or ranking promises are supplied. Existing Vercel analytics/performance script hooks are retained for hosted pages and skipped on localhost; page privacy text discloses them.

## Static export

```sh
node scripts/build.mjs                         # noindex local export
node scripts/build.mjs --origin https://costcodle.cc        # production export
```

`vercel.json` builds `dist/`. The allowlist publishes runtime files, asset/license notices, robots and sitemap; it excludes scripts, design sources, raw datasets, research, README and test evidence. Non-production Vercel environments are noindex even if the origin argument is present. An export does not deploy anything.

## Workspace review — 2026-10-23

SEO accuracy, original/local assets, mobile spacing, control accessibility and storage failure handling were reviewed locally. See [review evidence](../../research/2026-10-23-existing-games/report.html). The reviewed changes are included in the owner-authorized GitHub release batch; see [release status](../../deployments/2026-10-23-existing-games.md) for production verification. Previous keyword numbers in project history were not revalidated in this task and are not a current forecast. No OpenSEO or paid keyword calls were used.
