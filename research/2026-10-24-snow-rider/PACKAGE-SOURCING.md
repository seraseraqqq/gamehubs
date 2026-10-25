# Existing game package / publisher player replacement

> 2026-10-24整理注：本报告保留当时结果；相关一次性测试/旧同步脚本已移出管理仓库，不再按文内旧命令复跑。当前质量复查使用仓库根执行 `node scripts/check-portfolio-seo.mjs --public`，游戏专属测试见各游戏README。

Started 2026-10-24. The owner explicitly superseded the original-game choice: prioritize a reusable existing Snow Rider 3D package; use a publisher iframe if no suitable package can be established. This authorizes the local replacement, not a domain purchase, account signup, outreach or production deployment.

Research outcome: a complete Unity WebGL export was located, but no self-hosting license was established. The local site was replaced with the public GameDistribution player, preserving its SDK, branding and advertisements. No domain purchase, account signup, production deployment, referrer spoofing or access-control bypass was performed.

## Package findings

1. [unblockedgames71/snowrider-unblocked](https://github.com/unblockedgames71/snowrider-unblocked): complete Build and TemplateData directories. Core files are data5,813,599 bytes, WebAssembly6,650,777 bytes, framework514,248 bytes, loader156,644 bytes and manifest418 bytes — about13.1MB combined. GitHub license metadata was null and the root listing showed no LICENSE file. The repository's self-hosting instructions are a maintainer claim, not verified rights-holder permission. No game binaries were copied into our runtime. [Raw metadata](package-evidence.json).
2. drippy-cat/snowrider3D and itsvijaysingh/snow-rider3d: HTTP451. No alternate endpoint was used to bypass those restrictions. snowrider-3d/snowrider returned404.
3. [GameMonetize game listing](https://gamemonetize.com/snow-rider-3d-game): supplied embed links, but its downloadZip function creates a file called Snow Rider 3D-gm-thumbnails.zip containing catalog images. It is not a downloadable game build. The .games launcher returned200; its .co game endpoint returned403 in the public HTTP probe. Not selected.
4. [GameDistribution game listing](https://gamedistribution.com/games/snow-rider-3d/): public player URL and publisher catalog asset were available. Selected iframe game ID3b79a8537ebc414fb4f9672a9b8c68c8. The catalog/player credits GameBiz; ownership is not independently adjudicated here. Its [publisher program](https://www.gamedistribution.com/publishers/) documents embedding; its [publisher terms](https://static.gamedistribution.com/terms/publisher.html) refer to active publisher accounts. No account was created or agreement accepted; required onboarding must be completed before production publishing/revenue-share claims.

## Implementation

The homepage now loads only player.js, with no original canvas/engine. The existing publisher game starts after a deliberate Play action, and its own PLAY prompt remains intact. The actual parent origin/path is used for gd_sdk_referrer_url. Reload, direct-open and fullscreen controls wrap the player. CSP permits frames from html5.gamedistribution.com; local preview serves the same header.

The old custom score, gift bank, sled-color shop, sound, touch buttons and original-game claims were removed from the page. Guides and privacy copy describe the actual external game. The catalog cover replaces our old scene illustration. Old source/saves are retained as history; engine.js, scene.js, game.js, vendor and the old scene image are excluded from dist. A snapshot is in superseded-original/.

## Validation

- 68 static/export checks pass, including metadata, canonical, sitemap, noindex previews, actual provider CSP and exclusion of the retired engine.
- 9 CUA shell checks pass under production-equivalent CSP: no frame before Play, no original engine, loaded cover, default-width overflow, reload state, one selected game frame and actual parent referrer. [Reproducible shell results](player-shell-qa.json).
- The publisher's nested Unity canvas rendered its Snow Rider3D title, sled menu and input tutorial in our local page. Canvas start clicks and ArrowUp were exercised. This does not certify a full game round. [Runtime observations](publisher-browser-checks.json).
- IAB fullscreen exposed a44px exit control, then ended before the next call; internal exit action is not certified. A nested-frame coordinate click was rejected by browser safety; no alternate-coordinate workaround was used.
- Requested1440px and390px IAB viewports both reported987px. The captures named desktop/mobile reflect attempted targets, not verified mobile dimensions. Physical mobile behavior and performance remain pending.
- Provider ad SDK emitted a deprecated browsingTopics error and IMA warnings; they did not prevent the observed title/menu/tutorial. These are external SDK logs, not silently represented as a clean provider console.

Current preview: http://127.0.0.1:4197/ . Default/export remains noindex. No production deployment or domain purchase occurred.

## 沉淀的脚本

- browser-player-qa.mjs: executed in CUA against the current local page,9 checks passed; uses documented CUA APIs only.
- games/snow-rider-3d-unblocked/scripts/verify.mjs: executed,68 checks passed; restores noindex dist after synthetic production-origin checks.
- build.mjs and serve.mjs: updated and executed; fixed runtime whitelist and production-equivalent local CSP.
- sync-publisher-records.mjs: executed; synchronizes the current player identity, design sidecar and project records while preserving all nine portfolio entries.

Next: complete publisher/domain onboarding for an actual owned origin, deploy when authorized, then verify the real-domain player and physical mobile. The retired original-engine tests are not part of current acceptance.
