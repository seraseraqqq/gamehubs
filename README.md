# GameHubs

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
Spaceship. Ads, analytics and Search Console are not connected.


## Existing-game review — 2026-10-23

Reviewed Block Blast, Costcodle, Gulper.io-inspired solo arena and STARLING (`summit-unlimited`). Changes cover SEO accuracy, social cards, mobile layout, original category illustrations, controls, storage fallback and runtime-only exports. The owner authorized this validated batch to be committed and pushed to `origin/main`; production rollout is recorded separately. The older headline keyword estimates above are historical, not newly verified SEO evidence.

[Inspection report and before/after evidence](research/2026-10-23-existing-games/report.html). Local review previews: Block Blast `4191`, Costcodle `4192`, Gulper `4193`, STARLING `4194`. Preview servers need to be running.


## Repository delivery workflow

The owner has authorized completed, validated GameHubs optimization changes to be committed and pushed directly to the existing GitHub repository without asking again. Keep commits scoped, exclude secrets/generated exports, and report the commit and push result. A push may trigger connected Vercel projects; verify deployment separately before claiming the production site changed. Domain purchases and paid services still require their own authorization.

See [existing-game release record](deployments/2026-10-23-existing-games.md).


## Second independent-game build — 2026-10-23

| Game | Repository directory | Local preview |
| --- | --- | --- |
| Pinlark — original rotating-pin timing puzzle, 30 levels | games/orbit-pins | http://127.0.0.1:4195/ |
| Clue Garden — 20 original cryptic clues, hints and explanations | games/cryptic-practice | http://127.0.0.1:4196/ |

Both are dependency-free static apps with local assets and safe browser-local progress. Default/source and Vercel preview builds are noindex; `SITE_ORIGIN` or an explicit approved `--origin` enables canonical/robots/sitemap only after the owner chooses an owned domain. No new Vercel project or domain purchase is performed in this batch. The Pinlark directory retains its original working-name slug; the public name changed after a same-name Orbit Pins mobile game was found.

[Second-build evidence and domain candidates](research/2026-10-23-two-new-games/README.md).
