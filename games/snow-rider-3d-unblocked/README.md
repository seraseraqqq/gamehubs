# Snow Rider 3D Unblocked — existing publisher game

Updated 2026-10-24. The owner replaced the original-game direction: first seek a reusable existing game package, then use a publisher iframe. A complete Unity export was found, but no self-hosting license was established. This site now loads the existing Snow Rider 3D through the public GameDistribution player, game ID 3b79a8537ebc414fb4f9672a9b8c68c8.

## Run and verify

Run node scripts/serve.mjs 4197, then open http://127.0.0.1:4197/ . Run node scripts/verify.mjs for current static/export checks. Run node scripts/build.mjs for a safe noindex export.

Click Play Snow Rider 3D, then use the publisher's own Play prompt and game menus. Arrows/A/D steer; Up/W jump. The provider controls the game, mobile inputs, saves, ads, privacy prompts and availability. The surrounding site does not control game scores or promise ad-free/offline play.

## Delivery and source scope

The runtime is index.html, player.js, style.css, two supporting pages, icons, a local font and the publisher cover. No original engine.js, scene.js, game.js or local Three.js renderer is exported or loaded. Those earlier source files and their engine tests remain historical local work only. A source snapshot is in research/2026-10-24-snow-rider/superseded-original at the repository root.

The player uses the actual parent origin/path in gd_sdk_referrer_url. Do not replace it with another site's URL, bypass domain checks, remove publisher branding/SDK or suppress its advertisements. The production CSP allows frames from html5.gamedistribution.com only. Local preview serves the same header.

## Production

Vercel Root Directory: games/snow-rider-3d-unblocked. Build: node scripts/build.mjs. Output: dist. No npm install is needed. Set SITE_ORIGIN to the actual owned HTTPS origin to enable canonical, absolute social/schema URLs, robots and sitemap. Vercel preview builds stay noindex. Only deploy dist, not the source directory.

No production domain, deployment, publisher account/revenue-share setup or Search Console connection is configured. Review the platform's current publisher terms and complete any required publisher/domain setup before production. The local integration is not a representation that a publisher account exists.

## Evidence

Current package investigation and integration: ../../research/2026-10-24-snow-rider/PACKAGE-SOURCING.md. Current static report: scripts/verification.json. Browser shell checks: ../../research/2026-10-24-snow-rider/player-shell-qa.json. Earlier original-engine tests and screenshots are superseded, not validation of this player.