> Current naming/SEO supersedes this build record: [keyword SEO update](../2026-10-23-keyword-seo/README.md). Public brands removed by owner decision; original QA snapshots remain historical evidence.

# Pinlark + Clue Garden — 2026-10-23 build

The owner authorized building both proposed games and requested purchasable domain candidates after completion. The existing repository workflow authorizes committing and pushing validated work directly to GitHub.

## Delivered games

- **Coreball-style game / Pinlark** (`games/coreball`): 30 original rotating-pin levels; full-speed Challenge and 70% Practice with separate local records; elapsed-time rotation, one in-flight pin, pause/resume, keyboard/pointer/touch, optional synthesized sound and safe local persistence. Preview: http://127.0.0.1:4195/.
- **Clue Garden** (`games/minute-cryptic-unlimited`): 20 original clue phrasings across five cryptic constructions; three hints, definition highlighting, full explanation, category filters, no-repeat rounds and separate solved/revealed records. Unlimited replay of a clearly disclosed finite bank. Preview: http://127.0.0.1:4196/.

Original native SVG/HTML/CSS artwork, locally licensed Figtree and dependency-free runtime code. No backend, ads, analytics or external runtime services. See each game's PROVENANCE.md and LICENSE. Neither is an official Coreball or Minute Cryptic release; no third-party game package, level table or subscription clue feed was imported.

## Verification

- **12/12** Node tests: all 30 original Challenge levels and all 30 Practice variants have an executable safe solution; in-flight gating, pause, collision, frame-step consistency, end states and invalid input. Every clue has a validated letter recipe, unique answer/ID, definition and indicator in the text.
- **26/26** actual browser scenarios: real timed Practice and Challenge wins, separated progression, reload, keyboard, pause, restart, malformed records, sound and keyboard focus after pause/restart; correct/wrong/empty clues, all hints, reveal distinction, all filters, local persistence, and solving a complete 20-clue non-repeating round.
- **56/56** static SEO/export checks: single H1, unique IDs, valid visible-content JSON-LD, real 1200 × 630 social cards, local licensed assets, explicit-origin canonical/robots/sitemap, development files excluded, source/default/preview noindex, invalid origins rejected.
- Layout: each game at 320/390/768/1440px, no horizontal document overflow, external runtime asset requests or observed JS errors. Storage-disabled gameplay checks passed for both apps.
- Screenshots manually inspected at desktop and mobile. New Pinlark brand screenshots/social card were recaptured after the naming update.

Browser interaction regression uses reduced-motion and explicitly scrolls off-screen controls into view before real clicks (the CLI does not do that automatically). Pinlark is won by reading visible SVG geometry and clicking the normal launch button at safe times, not by replacing the result state. This is desktop Chromium responsive testing, not real-device Safari or a field Core Web Vitals measurement.

## Domain choices

Fresh exact-name availability and one-year USD registration/renewal quotes are in [domain-final-check.json](domain-final-check.json), obtained from Vercel's unauthenticated registrar search API. These are not Spaceship checkout quotes. `available: false` means unavailable or not confirmed; `available: true` remains subject to change before purchase.

Low-cost pilot choices: **pinlark.xyz** and **crypticpractice.xyz**. Long-term .com alternatives, if present as available in the final check: **playpinlark.com** and **crypticpractice.com**. The functional cryptic domain fits the independent Clue Garden brand; it does not imply access to Minute Cryptic's archive.

The original working name Orbit Pins was retired after an existing Android game with that exact name was found: https://play.google.com/store/apps/details?id=com.toomuchgames.orbitpins . A second working-name candidate Pinlume was also rejected after finding an existing software product. Final Pinlark exact-name web screening did not identify an identical game in the returned sample; this is not formal trademark clearance. The source directory retains its original work slug.

No domain purchase, registration, nameserver/DNS mutation, new Vercel project, Search Console or analytics setup was performed. Both games remain noindex until the owner chooses an owned domain and configures an approved SITE_ORIGIN. Google Trends evidence remains incomplete; shipping these games is an owner-authorized product experiment, not proof of future keyword rankings or revenue.

## Reproduce

```sh
node --test games/coreball/tests/*.test.cjs games/minute-cryptic-unlimited/tests/*.test.cjs
python3 research/2026-10-23-two-new-games/check-builds.py
python3 research/2026-10-23-two-new-games/browser-qa.py
python3 research/2026-10-23-two-new-games/storage-qa.py
```

Browser checks require `agent-browser` and game-root servers on 4195/4196. Run browser scripts sequentially, since creating another foreground browser can correctly auto-pause Pinlark.

## Coreball keyword correction — 2026-10-23

The owner identified that the shipped brand-led page omitted the approved Coreball target from its title and H1, and inventory incorrectly used `rotating pin puzzle` as the primary keyword. Corrected the primary keyword to `coreball`, mapped `coreball game` / `coreball online` to this one page, and aligned title, H1, lead, instructions, social metadata/card and game schema. Pinlark remains a secondary brand; the visible FAQ continues to disclose original levels and independent implementation. No claim of official status or network-policy bypass. No additional keyword data was purchased. Domain candidates above remain brand candidates, not an instruction to buy before choosing positioning.

Correction validation: 56/56 static SEO/export checks passed after the copy update. `keyword-alignment-qa.json` records the actual title/H1/description and overflow/external-request checks at 320/390/768/1440px, a successful launch smoke check and no observed browser errors. Desktop/mobile game captures and the social PNG were refreshed and visually inspected. The earlier full gameplay suite remains the prior engine validation; gameplay code was unchanged in this correction.
