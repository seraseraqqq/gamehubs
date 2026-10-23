# 2048 Cupcakes — Crumb

A complete local browser-game pilot: original twelve-level cupcake artwork,
4×4 sliding merge puzzle, 10-move undo, persistent game/best/preferences,
keyboard/swipe/on-screen controls, optional synthesized notes, number-label
toggle, and win/continue/game-over/restart flows.

## Local preview

```sh
python3 -m http.server 4180 --bind 127.0.0.1
```

Open http://127.0.0.1:4180/ from this directory. ES modules require HTTP; opening
index.html with file:// is not supported by all browsers.

## Checks and export

```sh
node --test tests/engine.test.mjs
node --check game.mjs
node scripts/build.mjs
```

The dependency-free export is in dist/. The default export and source are
noindex with robots disallow. A confirmed final origin can be passed to
`node scripts/build.mjs --origin https://your-approved-domain.example` to emit
matching canonical, Open Graph URL and sitemap, and enable indexability in the
export. This command never deploys and does not modify the preview sources.
Review all production URLs before publishing.

## Controls and behavior

- Arrow keys / WASD, swipes or four direction buttons move all cupcakes.
- Z undoes a move; N asks to start a new batch. Shortcuts are inactive in dialogs
  and text inputs, or while the board is outside the visible viewport.
- Invalid moves do not spawn tiles or consume undo history. Equal tiles merge
  once per move, with the resulting value added to the score.
- A new 2 (90%) or 4 (10%) appears after each valid move.
- 2048 is the rainbow goal. Continue unlocks 4096 and further numerical play.
  Higher values beyond 4096 reuse the Golden encore art with their exact label.
- Best score survives undo/new batches. Clearing site data clears all progress.
- At most 10 previous valid game states are saved. Preferences and progress stay
  in this browser; they do not sync. Invalid saved boards recover to a new game;
  unavailable storage shows a warning while keeping gameplay usable.
- The untimed game needs no pause state. Dialogs block movement, reduced motion
  follows the operating system, and audio defaults off.

## Scope, provenance and release state

Primary intent: play 2048 cupcakes / cupcake 2048, one page for the same intent.
Target market hypothesis: US / English. Research is saved at
../../research/2026-10-23-game-keywords/. User-supplied Semrush: 110000 / KD 28;
Ahrefs: >10000 / KD 1. These are estimates, not expected traffic. Google Trends
was blocked/incomplete in the earlier research; current local development was
explicitly authorized. The owner subsequently bought 2048cupcakes.xyz and authorized production deployment on 2026-10-23.

License and asset provenance: THIRD_PARTY_NOTICES.md. No source code, assets or
branding from existing Cupcakes sites was copied. No ads, embeds, external fonts or gameplay backend are installed. Vercel Web
Analytics is integrated for hosted page views. The production origin is https://www.2048cupcakes.xyz. Vercel builds from this
subdirectory using vercel.json and publishes only dist/. Preview deployments
remain noindex. Search Console, ad approval and real-device performance remain
separate work. Deployment and DNS verification status is tracked in
../../deployments/2026-10-23-games.md.

The verification record is QA.md. Local QA is not a production browser/device or
Core Web Vitals guarantee.


## Vercel Web Analytics — 2026-10-23

The HTML initializes `window.va` and loads Vercel's same-origin
`/_vercel/insights/script.js` on hosted HTTPS pages. Local HTTP/file previews
skip the script. No npm dependency or framework is needed for this static HTML
integration. Gameplay records remain in local storage; no custom game events
are sent. The owner will enable Web Analytics in the Vercel dashboard.
After enabling it, redeploy if needed and verify a page-view request.
See [Analytics release record](../../deployments/2026-10-23-analytics.md).
