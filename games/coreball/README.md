# Coreball-style game

SEO target: **coreball**, with **coreball game** and **coreball online** on the same page. No separate consumer brand is used. The title, H1, introduction, social metadata and game description identify it as an independent Coreball-style game; it does not claim to be the original game.

Original rotating-pin timing game. 30 authored, replayable levels, full-speed Challenge and separate 70% Practice mode. Keyboard, pointer and touch controls; local completions, attempts and best successful times. No backend.

## Local preview

```sh
python3 -m http.server 4195
```

Open http://127.0.0.1:4195/. Start a local server before opening this address.

## Build and verify

```sh
node --test tests/*.test.cjs
node scripts/build.mjs
node scripts/build.mjs --origin https://your-approved-domain.example
```

`dist/` contains only runtime files, local assets and licensing. Default/source and Vercel preview builds remain noindex. An explicitly approved HTTPS origin (via `--origin` or `SITE_ORIGIN`) enables indexable production metadata, canonical, absolute social URLs, robots and sitemap. The example is an interpolation fixture, not a domain recommendation. No production domain is configured or purchased by this change. Vercel configuration builds this directory independently; no new Vercel project is created in this task.

## Sources and boundaries

See [PROVENANCE.md](PROVENANCE.md). Original code, level definitions and vector artwork are authored for this project. Figtree is bundled with SIL OFL. No copied original-game code, levels, graphics, membership puzzles, external feed, ads or analytics.

The engine uses elapsed seconds and analytically defined rotation. Only one pin may be in flight. Pausing freezes rotation and flight; tab/window loss automatically pauses. Successful final shots end the timer at landing. Practice never writes Challenge progress. The automated solver demonstrates one safe solution for each of the 30 levels in both modes; it does not imply every sequence of shots is recoverable.

Records are browser-local and not competitive/anti-cheat scores. Storage restrictions fall back to in-memory play. Simulated responsive Chromium checks do not replace real-device Safari testing or field Core Web Vitals.

## Delivery evidence

[Build / browser evidence and domain research](../../research/2026-10-23-two-new-games/README.md). This batch is intended for the owner-authorized GitHub push after verification; custom-domain launch awaits the owner's domain choice/purchase.

## Keyword SEO update — 2026-10-23

No separate public brand. Main query: **coreball**. Supporting guide: [coreball-tips.html](coreball-tips.html). Source and preview builds stay noindex. Configure SITE_ORIGIN to an owned domain in production to enable both pages, self-canonicals, absolute share images and the two-URL sitemap. cleanUrls is disabled deliberately so .html guide URLs are served without redirect/canonical disagreement.

Vercel Root Directory: `games/coreball`. Local-storage keys remain unchanged. See [current SEO validation](../../research/2026-10-23-keyword-seo/README.md).
