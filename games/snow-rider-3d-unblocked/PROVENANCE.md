# Source and asset provenance — current publisher player

Updated 2026-10-24. The existing Snow Rider 3D game is loaded through Miniplay’s public embed at https://www.miniplay.com/embed/snow-rider-3d . Miniplay uses GameDistribution for game delivery; the underlying catalog credits GameBiz. The earlier direct GameDistribution integration is superseded. Game content and trademarks belong to their respective owners; this site is an independent publisher page.

- player.js: original first-party loading/fullscreen/recovery wrapper only. It contains no game simulation and leaves the publisher's SDK/branding/ads intact.
- index.html, guide, about.html and style.css: original site shell and help copy, revised for the actual publisher game.
- assets/publisher-cover.jpg: unchanged publisher catalog artwork downloaded on 2026-10-24 from https://img.gamedistribution.com/3b79a8537ebc414fb4f9672a9b8c68c8-1280x720.jpg . Origin is embedded in JPEG metadata. It is not presented as our own game art.
- Figtree font and OFL license: existing repository asset, locally served.
- Mountain favicon and app icons: original site navigation identity, distinct from publisher game artwork.

Superseded: engine.js, scene.js, game.js, vendor/ and the earlier social-card image are not loaded by the homepage and are excluded from the whitelisted dist export. Earlier engine tests apply only to that retired demo. Historical source is retained locally and in research; the build verifier checks that it is absent from delivery.

A complete Unity build was found at unblockedgames71/snowrider-unblocked, with data, WebAssembly, framework and loader files. Repository license metadata is null and no license file was observed. No self-hosting license was established, so its binaries were not copied into the site. Two other candidate repositories returned HTTP451 and were not bypassed. GameMonetize's catalog ZIP function downloads thumbnails only; its direct player endpoint returned403 in the HTTP probe. See the package-sourcing report for raw evidence.