# Head Soccer 2026

Static, game-first site around the official GamePix public-feed iframe. Research and source attribution: [report](../../research/2026-10-24-head-soccer-2026/README.md).

```powershell
node scripts/build.mjs
node scripts/serve.mjs 4201
node scripts/check.mjs
```

Run from this game directory. Open http://127.0.0.1:4201/. Exports are noindex by default. Configure `SITE_ORIGIN` to an owned bare HTTPS origin for production; non-production Vercel builds remain noindex. Vercel Root Directory: `games/head-soccer-2026`, output: `dist`.

Owner confirmed the purchased domain playheadsoccer.com. Production resolves to https://www.playheadsoccer.com/ on Vercel (verified 2026-10-24). The build normalizes the apex origin to this final www host for canonical, social URLs and sitemap; release evidence: ../../deployments/2026-10-24-owned-game-domains.md. Game URLs are from the official public catalog; `sid=1` is the public default, not a monetized account. Verify publisher/commercial configuration before enabling revenue. Game code, artwork and services remain with their owners; nothing from competitor runtime packages is redistributed.

Figtree is locally hosted under its included SIL OFL. Website graphics are original SVG geometry rasterized by `scripts/assets.mjs`; sharp is needed only to regenerate icons and share graphics. Set `SHARP_MODULE` to an installed sharp package if it is outside normal module resolution. Shipping JS has no dependency installation.

`scripts/pages.mjs` authors the checked-in static support pages. After editing its copy, regenerate and run the export check. Actual touch hardware and remote multiplayer have not been verified. Browser fullscreen may fall back to Focus mode. Resizing a running provider game may require a reload.
