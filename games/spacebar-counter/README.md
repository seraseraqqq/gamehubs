# Spacebar Counter local pilot

Original HTML/CSS/JavaScript and SVG, created in this repository. No third-party
game code, artwork, audio or fonts are included. Vercel Web Analytics is integrated
for hosted page views; there are no ads.
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
node scripts/build.mjs --origin https://www.spacebarcounter.xyz
```

The dependency-free exporter publishes only HTML, CSS, JavaScript, the icon,
license and generated SEO files to dist/. Sources and default local exports
remain noindex. The explicit production export sets matching canonical,
Open Graph URL, robots and sitemap. Vercel preview environments remain noindex.

The production export includes a 1200 × 630 sharing card with Open Graph/Twitter
metadata and a matching WebApplication URL/image. Its source is the code-native
SVG layout in `scripts/render-social-card.cjs`; regenerate it with
`node scripts/render-social-card.cjs <absolute-sharp-module-path>`. Sharp is only
used for local design work; the production build copies the checked-in PNG.

The owner bought spacebarcounter.xyz at Spaceship and authorized deployment on
2026-10-23. Vercel uses Root Directory games/spacebar-counter and vercel.json.
Deployment and DNS verification status: ../../deployments/2026-10-23-games.md.
Research and earlier local QA remain in the workspace's dated research folder;
Google Trends validation is incomplete. Ads remain disabled.


## Vercel Web Analytics — 2026-10-23

The HTML initializes `window.va` and loads Vercel's same-origin
`/_vercel/insights/script.js` on hosted HTTPS pages. Local HTTP/file previews
skip the script. No npm dependency or framework is needed for this static HTML
integration. Gameplay records remain in local storage; no custom game events
are sent. The owner will enable Web Analytics in the Vercel dashboard.
After enabling it, redeploy if needed and verify a page-view request.
See [Analytics release record](../../deployments/2026-10-23-analytics.md).
