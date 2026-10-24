# Alternative games and embeds — 2026-10-24

Scope: research and local iframe testing requested by the owner. Production deployment, publisher account deferral and noindex remain unchanged.

## Findings

| Candidate | Public source and embed | Observed locally | Limits |
|---|---|---|---|
| Existing Snow Rider 3D | [Miniplay listing](https://www.miniplay.com/game/snow-rider-3d), [advertised embed](https://www.miniplay.com/embed/snow-rider-3d) | Unity title and sled menu rendered; ordinary provider ad shown and dismissed with its visible Close ad button | Platform branding/ads; full round and actual production origin not verified |
| Snow Rider Neo, Jack.M | [GameMonetize listing](https://gamemonetize.com/snow-rider-neo-game), [public embed](https://html5.gamemonetize.games/e4woyszceuiqga5qts3de48wf7gczzsb/) | Clicked official PLAY GAME preloader; snowy START RUN / SLED menu rendered | A distinct game; actual run/control acceptance not certified |
| Snow Rush 3D, gameVgames | [GameMonetize listing](https://gamemonetize.com/snow-rush-3d-game), [public embed](https://html5.gamemonetize.games/qz19c89oeh9xgil0vhin4coe5c6y8o9x/) | Clicked official PLAY GAME preloader; animated Unity title / TAP TO START rendered | A distinct game; catalog's 1/2 player modes were not exercised |

First candidate for the existing-game search intent is Miniplay. Its public game page explicitly supplies the embed code. Internally it still uses GameDistribution. Our probe loaded only Miniplay's advertised embed URL, retaining provider parameters, branding, ads and controls; no extracted inner game URL was substituted into our site. This is an additional distribution entry, not a self-hosted game package.

The original Snow Rider 3D entry on GameMonetize points to game k6z3e79qwujg4gcfegdesc5y3j1me96y. Its actual .co endpoint returned403 with Game not found, while its outer .games launcher returned200. Excluded as a functioning original-game alternative. Neo and Rush actual .co game endpoints returned200, with their canvases visibly rendered. [Inner endpoint evidence](inner-game-http.json).

## Existing packages

- [McNateyboii/tej](https://github.com/McNateyboii/tej): complete Unity export components, including data5,813,599B, WASM6,650,777B, loader and framework. MIT label, copyright2026 Nathan Schoonover; README concerns the wrapper. Original-author distribution authorization not established. No binary was downloaded or executed.
- [arcadeclash/snow-rider-3d-unblocked](https://github.com/arcadeclash/snow-rider-3d-unblocked): Build and TemplateData present; MIT copyright2025 gamehippy. Core filenames/sizes match the previously located SnowRider3D-gd-1 export. Original-author authorization remains unverified; not adopted as a cleared self-hosted game.
- [Especially43/snow-rider](https://github.com/Especially43/snow-rider): MIT wrapper with external game assets, not a self-contained package. External binaries were not retrieved.
- [TonGaming/Snow-Rider](https://github.com/TonGaming/Snow-Rider): MIT Unity source for a distinct2D skiing/flip game, with creator-linked itch.io demo. No ready WebGL export was established in this check; weak3D sled search match.
- [amat55/SnowRider](https://github.com/amat55/SnowRider): MIT Unity project; no browser-ready export found in root and minimal README. Not a verified drop-in browser package.
- games-source/snow-rider-3d: API unavailable; not inspected through another route.

Repository license labels alone do not establish original-game provenance. These are sourcing findings; original-author authorization remains unverified. [Collected metadata and license text](package-candidates.json).

## Evidence and reproduction

- [Miniplay sled menu](miniplay-menu.png).
- [Miniplay after slide pointer attempt](miniplay-slide.png): menu remained visible; no full-round claim.
- [Neo start menu](neo-menu.png): start pointer attempt did not yield a visible transition; no full-round claim.
- [Rush title](rush-title.png).

Run `node research/2026-10-24-snow-rider/alternatives/probe-server.mjs` from repository root and open http://127.0.0.1:4215/ . The harness is local/noindex and serves three fixed public iframe URLs with the actual local referrer. Provider prompts/ads remain intact. Physical mobile, fullscreen and actual snowrider3d.top loading remain unverified. No account signup, agreement acceptance, paid plan, external message or production replacement was performed.

If a provider change is requested later, first verify the selected public embed on the real domain and check game controls, ad recovery, mobile/fullscreen, CSP, attribution and privacy copy. Keep noindex until actual game availability is established. Neo/Rush must retain their actual game identities rather than being presented as the existing Snow Rider 3D.
