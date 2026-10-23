# Block Blast Unblocked

An independent 8×8 browser block puzzle. Drag, tap, or use the keyboard to place the three tray shapes, clear complete rows/columns and chase a browser-local best. This is not an official Block Blast product; network access depends on the user’s network.

## Local preview

No runtime dependencies. From this game directory:

```sh
python3 -m http.server 4191
```

Open http://127.0.0.1:4191/. The repository review server uses this port during the current session.

## Gameplay

- Keyboard: focus a tray piece, press Enter/Space, move with arrows, Enter/Space to place, Escape to clear selection.
- Pointer: drag a shape onto the board, or select it and tap a board cell.
- Restart clears the current board. Sound is optional and initially off. Best score and sound preference persist when browser storage is available.

## Assets and SEO

Fonts are hosted locally with their OFL license files; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Native HTML/CSS/vector artwork supplies the page and social card. Social-card source is in `design/social-card.html`; the published PNG is 1200 × 630. No remote font or product-image request is needed to play.

The HTML contains one H1, readable instructions, matching visible FAQ/JSON-LD, a canonical URL, and Open Graph/Twitter metadata. FAQ schema is descriptive and does not guarantee a Google rich result. No ratings or ranking promises are supplied. Existing Vercel analytics/performance script hooks are retained for hosted pages and skipped on localhost; page privacy text discloses them.

## Static export

```sh
node scripts/build.mjs                         # noindex local export
node scripts/build.mjs --origin https://playblockblastunblocked.com        # production export
```

`vercel.json` builds `dist/`. The allowlist publishes runtime files, asset/license notices, robots and sitemap; it excludes scripts, design sources, raw datasets, research, README and test evidence. Non-production Vercel environments are noindex even if the origin argument is present. An export does not deploy anything.

## Workspace review — 2026-10-23

SEO accuracy, original/local assets, mobile spacing, control accessibility and storage failure handling were reviewed locally. See [review evidence](../../research/2026-10-23-existing-games/report.html). The reviewed changes are included in the owner-authorized GitHub release batch; see [release status](../../deployments/2026-10-23-existing-games.md) for production verification. Previous keyword numbers in project history were not revalidated in this task and are not a current forecast. No OpenSEO or paid keyword calls were used.
