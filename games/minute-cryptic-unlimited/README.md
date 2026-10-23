# Minute Cryptic Unlimited practice

Independent cryptic-clue practice. 20 original phrasings across anagram, hidden word, reversal, charade and container constructions. Three progressive hints, a full explanation, filtered no-repeat rounds and distinct solved/revealed local records. Unlimited replay, not an unlimited supply of new clues. No account or backend.

## Local preview

```sh
python3 -m http.server 4196
```

Open http://127.0.0.1:4196/. Start a local server before opening this address.

## Build and verify

```sh
node --test tests/*.test.cjs
node scripts/build.mjs
node scripts/build.mjs --origin https://your-approved-domain.example
```

`dist/` contains only runtime files, local assets and licensing. Default/source and Vercel preview builds remain noindex. An explicitly approved HTTPS origin (via `--origin` or `SITE_ORIGIN`) enables indexable production metadata, canonical, absolute social URLs, robots and sitemap. The example is an interpolation fixture, not a domain recommendation. No production domain is configured or purchased by this change. Vercel configuration builds this directory independently; no new Vercel project is created in this task.

## Sources and boundaries

See [PROVENANCE.md](PROVENANCE.md). Original code, clue phrasings, hints, explanations and vector artwork are authored for this project. Figtree is bundled with SIL OFL. No copied original-game code, levels, graphics, membership puzzles, external feed, ads or analytics.

Every entry has a letter recipe checked by the bank validator and tests. Definitions, indicators and detailed parse notes have been reviewed during authoring; no external professional setter/editor review is claimed. The bank is finite and reshuffles after a filtered round. A previously solved clue stays solved if a later round is revealed; a previously revealed clue can become solved through later practice. Unfinished rounds are not restored on refresh.

Records are browser-local and not competitive/anti-cheat scores. Storage restrictions fall back to in-memory play. Simulated responsive Chromium checks do not replace real-device Safari testing or field Core Web Vitals.

## Delivery evidence

[Build / browser evidence and domain research](../../research/2026-10-23-two-new-games/README.md). This batch is intended for the owner-authorized GitHub push after verification; custom-domain launch awaits the owner's domain choice/purchase.

## Keyword SEO update — 2026-10-23

No separate public brand. Main query: **minute cryptic unlimited**. Supporting guide: [how-to-solve-cryptic-clues.html](how-to-solve-cryptic-clues.html). Source and preview builds stay noindex. Configure SITE_ORIGIN to an owned domain in production to enable both pages, self-canonicals, absolute share images and the two-URL sitemap. cleanUrls is disabled deliberately so .html guide URLs are served without redirect/canonical disagreement.

Vercel Root Directory: `games/minute-cryptic-unlimited`. Local-storage keys remain unchanged. See [current SEO validation](../../research/2026-10-23-keyword-seo/README.md).
