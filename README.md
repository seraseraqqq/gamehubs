# GameHubs

## Head Soccer 2026 — 2026-10-24

`games/head-soccer-2026` is a static site around the official GamePix public-feed iframe, matching the direct competitor's architecture. Includes responsive game-first layout, accurate control references, focus mode, fullscreen fallback, supporting guide and domain-configured SEO export. Preview: http://127.0.0.1:4201/. No new deployment or purchase. [Research, screenshot gallery, difficulty and verified domain shortlist](research/2026-10-24-head-soccer-2026/README.md).

A collection of lightweight, high-performance, SEO-optimized browser mini-games.

## Repository Structure

All game implementations are organized in secondary directories under `games/`:

```
gamehubs/
├── README.md
├── matrix-sites.json
└── games/
    └── block-blast-unblocked/
        ├── index.html
        ├── style.css
        ├── game.js
        ├── favicon.svg
        ├── assets/
        ├── manifest.json
        ├── robots.txt
        ├── sitemap.xml
                └── README.md
```

## Games Directory

### Acceleration City — local prototype

* **Directory**: [games/acceleration-city](games/acceleration-city/README.md)
* **Research**: [competitor screenshots, embed evidence, difficulty and available domains](research/2026-10-24-acceleration-city/README.md)
* Direct official iframe with a focused dark wrapper. Local noindex evaluation; commercial embedding rights and final browser checks remain unresolved. No deployment is claimed.

### 1. Block Blast Unblocked
* **Directory**: [`games/block-blast-unblocked`](games/block-blast-unblocked)
* **Primary Keyword**: `block blast unblocked` (Volume: 22,200/mo, KD: 7)
* **Visual Style**: Neo-Brutalist flat paper texture sticker theme (inspired by zadely.com)
* **Tech Stack**: Vanilla HTML5 / CSS3 / ES6+ JavaScript / Web Audio API
* **Features**: 8×8 block puzzle, smart solvable spawns, dual controls (drag & drop + tap to place), combo scale chimes, high-score local persistence.

## Vercel Deployment

### Deploying the Subdirectory directly
Set the **Root Directory** in Vercel project settings to:
```
games/block-blast-unblocked
```

Each game is a separate Vercel project pointing at its own subdirectory. There
is no shared root deployment configuration; do not deploy the repository root
as one of these games.

## New independent game sites

| Game | Vercel root directory | Production origin |
| --- | --- | --- |
| 2048 Cupcakes / Crumb | games/2048-cupcakes | https://www.2048cupcakes.xyz |
| Spacebar Counter | games/spacebar-counter | https://www.spacebarcounter.xyz |

Both games are dependency-free static applications. Their vercel.json files
build a whitelisted dist/ export with domain-specific canonical, robots and
sitemap files. Source/local previews and Vercel preview builds remain noindex.
Local Cupcakes preview: http://127.0.0.1:4180/.

See each game's README and [deployment record](deployments/2026-10-23-games.md)
for deployment and domain verification status. DNS is managed by the owner at
Spaceship. Ads and Search Console are not connected. Vercel Web Analytics scripts are
installed across all six deployed games; the owner manages the dashboard switches.
See [Analytics release record](deployments/2026-10-23-analytics.md).


## Existing-game review — 2026-10-23

Reviewed Block Blast, Costcodle, Gulper.io-inspired solo arena and STARLING (`summit-unlimited`). Changes cover SEO accuracy, social cards, mobile layout, original category illustrations, controls, storage fallback and runtime-only exports. The owner authorized this validated batch to be committed and pushed to `origin/main`; production rollout is recorded separately. The older headline keyword estimates above are historical, not newly verified SEO evidence.

[Inspection report and before/after evidence](research/2026-10-23-existing-games/report.html). Local review previews: Block Blast `4191`, Costcodle `4192`, Gulper `4193`, STARLING `4194`. Preview servers need to be running.


## Repository delivery workflow

The owner has authorized completed, validated GameHubs optimization changes to be committed and pushed directly to the existing GitHub repository without asking again. Keep commits scoped, exclude secrets/generated exports, and report the commit and push result. A push may trigger connected Vercel projects; verify deployment separately before claiming the production site changed. Domain purchases and paid services still require their own authorization.

See [existing-game release record](deployments/2026-10-23-existing-games.md).


## Second independent-game build — 2026-10-23

| Game | Repository directory | Local preview |
| --- | --- | --- |
| Coreball-style game, 30 original levels | games/coreball | http://127.0.0.1:4195/ |
| Minute Cryptic Unlimited practice — 20 original clues | games/minute-cryptic-unlimited | http://127.0.0.1:4196/ |

Both are dependency-free static apps with local assets and safe browser-local progress. Default/source and Vercel preview builds are noindex; `SITE_ORIGIN` or an explicit approved `--origin` enables canonical/robots/sitemap only after the owner chooses an owned domain. No new Vercel project or domain purchase is performed in this batch. The game directories and public copy now use their SEO target keywords; no separate consumer brands are maintained.

[Second-build evidence and domain candidates](research/2026-10-23-two-new-games/README.md).

## Keyword-focused SEO update — 2026-10-23

`games/orbit-pins` moved to `games/coreball`; `games/cryptic-practice` moved to `games/minute-cryptic-unlimited`. Each homepage targets its main query and links to one static supporting guide. Update any external Vercel Root Directory to the new path before the next build. Runtime storage keys remain compatible. No owned production origin is configured for either site.

[SEO rationale, sources and validation](research/2026-10-23-keyword-seo/README.md).

## Snow Rider 3D publisher game — 2026-10-24

The owner replaced original development with the existing game. games/snow-rider-3d-unblocked now loads the GameDistribution Snow Rider 3D iframe. A complete Unity package was found but self-hosting rights were not established. The original engine/vendor are excluded from delivery. Preview: http://127.0.0.1:4197/ .

68 static/export and 9 browser-shell checks pass; existing game title/menu/tutorial rendered. Full-round, physical-mobile and persistent fullscreen-exit validation remain outside the verified scope. No domain or deployment is configured. [Current sourcing and integration evidence](research/2026-10-24-snow-rider/PACKAGE-SOURCING.md).
