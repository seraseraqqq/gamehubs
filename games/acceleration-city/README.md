# Acceleration City — independent local player prototype

Original-game iframe + a focused dark static wrapper. No runtime packages, copied Unity build, account token, ad SDK or analytics. Original game: Carnegie Mellon Robotics Academy / CS2N. This page is not endorsed by them.

## Run locally

```powershell
cd E:\Projects\gamesHub\games\acceleration-city
node scripts/verify.mjs
node scripts/serve.mjs 4198
```

Open http://127.0.0.1:4198/ . The server builds a preview in `dist/` and returns a real 404 for missing routes. All preview pages and responses are noindex. Source HTML is also noindex.

## Permission and production export

The original game visibly states **For educational use only**. Commercial embedding permission is **unknown**. This is a local evaluation artifact; it has not been publicly deployed. Do not treat another publisher's embed as evidence of permission.

After obtaining the necessary rights, configure the actual owned origin and explicit permission flag:

```powershell
$env:SITE_ORIGIN = 'https://<your-owned-domain>'
$env:GAME_EMBED_LICENSE_CONFIRMED = 'true'
node scripts/build.mjs
```

The origin must be HTTPS and contain no path, query or credentials. The production gate refuses an origin without licence confirmation. `VERCEL_ENV=preview` always forces noindex. A flag is an operational safeguard, not a legal authorization.

Publish only the generated `dist/` directory after permissions and final validation. The output includes canonical, OG URL, valid JSON-LD, a three-page sitemap, robots, Cloudflare `_headers`, Vercel header configuration and `404.html`. One `SITE_ORIGIN` feeds every first-party absolute URL. With no origin, no first-party canonical is invented. An optional real game screenshot at `assets/og-game.jpg` enables a production OG image; it remains third-party artwork and needs the same rights review.

## Player features

- Explicit launch, honest source-open/loading messages and delayed recovery help.
- Inline Reload game / Keep playing confirmation, keyboard focus, focus view and native fullscreen with fallback. No browser-blocking confirmation dialog.
- Original source link and visible creator attribution.
- Original guide, practical loading help, educational resources and privacy explanation.
- Responsive shell without a claim that the original game supports phone touch input.

The frame is cross-origin. The shell cannot reliably read Unity progress, scores, save data or game readiness, inject touch controls or mute the provider. It therefore does not present fake controls for these functions. External game availability, loading speed, storage and provider-side tracking are outside this shell's control.

## Validation

`node scripts/verify.mjs` checks output metadata, valid schema, route references, noindex defaults, production licensing/origin gates, forced preview, sitemap and official token-free embed URL. Evidence is saved to `scripts/verification.json`. These checks do not claim browser gameplay, real-device touch or performance measurements. Main-agent browser evidence and competitor research live in `../../research/2026-10-24-acceleration-city/`.

Desktop browser validation reached the original menu, Continue, vehicle view and W-forward driving. Focus view entered and exited correctly. Fullscreen was rejected by the automation browser; its focus-view fallback worked, but native fullscreen remains unverified. A native reload confirmation interrupted browser automation and was replaced with the inline confirmation. The new inline confirmation and the final viewport-height adjustment have Node/static coverage but have not been recaptured in the browser. Mobile layout and gameplay also remain unverified.
