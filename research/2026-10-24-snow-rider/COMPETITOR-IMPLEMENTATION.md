# Competitor implementation inspection

Checked 2026-10-24. Query: `snow rider 3d unblocked`.

Method: live search-result sample, followed by public HTTP inspection of parent HTML, source-observed game frame URLs and relevant JavaScript. This is not a verified, region-fixed Google top-ten ranking. The direct Google HTML request returned a JavaScript-gated search shell, so exact Google positions remain unknown. No browser UI, game execution, account access or game-package reuse was involved.

## Finding

Most confirmed examples use an iframe for the game container. That does not establish game authorship. A site can embed someone else's game, self-host an existing Unity export, or place its own original game in an iframe. Conversely, an empty SSR page without an iframe is not enough to prove native rendering: client-side player JavaScript must also be checked.

| Site | Verified loading chain | Authorship interpretation |
|---|---|---|
| [snowrider3d.com](https://snowrider3d.com/) | homepage iframe → `/embed/snow-rider-3d` → `html5.gamedistribution.com/3b79a8537ebc414fb4f9672a9b8c68c8/` | Confirmed third-party GameDistribution game embed. Homepage credits GameBiz. |
| [topvaz.com](https://topvaz.com/go/snow-rider-3d/) | iframe `#game-area` → `https://class811.github.io/g8/snow-rider-3d` | Confirmed external-game embedding; no evidence it authored the game. |
| [HopArcade](https://hoparcade.com/) | game element has `data-embed-type="iframe"` and `data-src="https://snowrider-unblocked.github.io/game/"`; GameFrame script mounts iframe | Confirmed lazy external iframe. |
| [snow-rider3d.github.io](https://snow-rider3d.github.io/) | iframe `file/` → `UnityLoader.instantiate` → `Build/SnowRider3D-gd-1.json` | Confirmed same-origin Unity export. Hosting the package is not proof of authorship. |
| [snow-rider-3d.gitlab.io](https://snow-rider-3d.gitlab.io/) | iframe `file/` → UnityLoader → `Build/SnowRider3D-gd-1.json` | Same loading pattern; no claim that source inspection establishes reuse rights. |
| [snowrider3dunblocked.me](https://snowrider3dunblocked.me/?play=1) | iframe `/game/` → UnityLoader → `Build/SnowRider3D-gd-1.json` | Self-hosted Unity export, not demonstrated original development by the site. |
| [Hooda Math](https://www.hoodamath.com/games/snowrider3d.html) | iframe → `/mobile/games/snow-rider-3d/game.html?nocheckorient=1` → UnityLoader → `Build/SnowRider3D-gd-1.json` | Confirmed iframe/same-origin Unity loading. This inspection does not decide the original game's authorship. |
| [Classroom Games CDN](https://dnrweqffuwjtx.cloudfront.net/snow-rider-3d/) | iframe → same CDN `/games/2025/unity2/snow-rider-3d/classroomgames/index.html` | Confirmed same-CDN frame. Child fetch failed, so no additional engine/authorship claim. |
| [snowrider.com](https://snowrider.com/) | `#game-iframe`, set by `assets/js/app.js?v1.58` → `/game/?v=9` → `src/main.js` → `src/game.js` | iframe around a custom Three.js implementation. [About](https://snowrider.com/about) explicitly says AppStation Studio created its own build. Code corroborates custom Three.js architecture; ownership remains the site's declaration. |
| [snowrider.app](https://snowrider.app/) | Next GameLoader dynamically imports SnowRiderGame → chunk `44k6_egeuihon.js`; custom renderer/game component, no game iframe found in reviewed chain | Direct native web game. [About](https://snowrider.app/about) states Next.js + React + Three.js + React Three Fiber and client-side physics/scoring. Public game chunk contains the Three/WebGL renderer and game export. |
| [snowrunner.org](https://snowrunner.org/) | Player chunk includes conditional game iframe, separate from hidden save-sync iframe | Dynamic iframe player found; exact game src not located. Homepage self-describes a same-origin Unity build, not independently confirmed by child fetch. |
| [catninja.co/snow-rider](https://catninja.co/snow-rider) | Player JavaScript includes conditional game iframe and separate save-sync iframe | Dynamic iframe player found; exact Snow Rider target not located. Do not count Cloudflare's hidden iframe or save bridge as the game. |

Nine of the twelve sampled sites have a directly identified game-frame target or lazy iframe configuration. Two more ship dynamic iframe player components, but their precise Snow Rider targets remain unlocated. One reviewed example renders its custom game directly in the React application. These counts describe this sample and are not a market-share or Google top-ten statistic.

## Implication for our site

SEO does not require independently programming the game. The observed iframe sites show that an embedded player can coexist with crawlable page copy and search visibility. This inspection does not isolate iframe usage as a cause of ranking. For players specifically seeking the established game, an authorized distribution/embed is a more direct content match; an original alternative remains a viable product choice but must meet player expectations and disclose its identity. The owner chose original development earlier; this research does not change the code or that decision.

## Evidence and reusable scripts

- `inspect-competitors.mjs`: executed for all twelve parent pages; `competitor-source-evidence.json`.
- `inspect-game-loaders.mjs`: executed for source-observed scripts/frames; `competitor-loader-evidence.json`. Some fetch failures were followed by one public HTTP retry.
- `competitor-followup-evidence.json`: successful direct checks for native app chunk, custom Three.js implementation and self-hosted Unity loaders.
- `competitor-source/`: raw public source snapshots for inspection only; excluded from the game's whitelisted export. Child-loader snapshots are evidence, not copied runtime game assets for our implementation.

No game code, production configuration, domain recommendation or deployment state changed in this follow-up.
