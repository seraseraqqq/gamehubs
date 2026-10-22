# GameHubs

A collection of lightweight, high-performance, SEO-optimized browser mini-games.

## Repository Structure

All game implementations are organized in secondary directories under `games/`:

```
gamehubs/
├── README.md
├── vercel.json
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
        ├── vercel.json
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

### Monorepo Fallback
The root `vercel.json` includes URL rewrites directing all traffic directly to `games/block-blast-unblocked/`, allowing root deployments to seamlessly serve the game.
