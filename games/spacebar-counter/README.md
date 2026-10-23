# Spacebar Counter local pilot

Original HTML/CSS/JavaScript and SVG, created in this repository. No third-party
game code, artwork, audio, fonts, analytics, ads, or services are included.
This is an independent utility, not a claim of ownership of a game brand.

Run from this directory: `python3 -m http.server 4178 --bind 127.0.0.1`.

Keyboard mode accepts distinct unmodified Space keydowns while the large key has
focus. Auto-repeat and unreleased keys are ignored. Timed rounds use
`performance.now()` and reject presses at/after their deadline. Leaving the test
cancels the round. Tap/click mode is separately labeled; browser-button keyboard
activation also counts as a button activation in that mode. The app does not
certify physical input or detect all automation. Free count is not persisted.
Up to 12 completed rounds are saved locally; unavailable storage is tolerated.

## Build and production configuration

```sh
node --check game.js
node scripts/build.mjs
node scripts/build.mjs --origin https://spacebarcounter.xyz
```

The dependency-free exporter publishes only HTML, CSS, JavaScript, the icon,
license and generated SEO files to dist/. Sources and default local exports
remain noindex. The explicit production export sets matching canonical,
Open Graph URL, robots and sitemap. Vercel preview environments remain noindex.

The owner bought spacebarcounter.xyz at Spaceship and authorized deployment on
2026-10-23. Vercel uses Root Directory games/spacebar-counter and vercel.json.
Deployment and DNS verification status: ../../deployments/2026-10-23-games.md.
Research and earlier local QA remain in the workspace's dated research folder;
Google Trends validation is incomplete. No ads or analytics are installed.
