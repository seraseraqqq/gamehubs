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
