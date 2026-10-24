# Gulperio copy and domain verification

Owner preference: use direct game/SEO copy; avoid repeated imitation/inspired framing. Keep the game name Gulper.io and website domain gulperio.com. Describe actual controls, computer rivals and local arena rankings accurately.

Verified Vercel domain: `gulperio.com`, `verified:true`, project `prj_wVEVdXppNfidfGfeDXKSpDCEo1os` (`gulperio-game`), team `team_yFBRBoOUaKz5Kjg6nxC3skZF`. Source build origin, canonical, Open Graph URLs, robots and sitemap all use `https://gulperio.com`.

Changed homepage title/social metadata to **Gulper.io Snake Game — Play Online Free**, rewrote the description and gameplay introduction, removed the unnecessary official-game comparison FAQ from both visible content and JSON-LD, simplified the footer, and updated the app manifest/social card. No gameplay logic changed. Required font notices and privacy information remain.

Validation: 21 preview/production metadata and export checks passed; FAQ schema matches visible answers, preview remains noindex, production uses the correct domain. The regenerated 1200×630 social PNG was visually checked. Evidence: [gulper-copy-checks.json](evidence/2026-10-24/gulper-copy-checks.json).

Publication: source pushed to GitHub main at `5432fff22f72b40b522dc24804c2d0102401e34e`. Its Vercel status reports `Deployment rate limited — retry in 24 hours.` The public homepage returns HTTPS200, canonical is correct, and its title still contains the previous Inspired wording; the new copy is not live. After quota recovery, deploy the pending source and check the public title and social card. No quota workaround or paid-plan change was made.

Local asset tool: `games/gulperio/design/render-social-card.cjs`; verified by passing the bundled absolute `sharp` module path. It re-renders native SVG artwork and text; it is excluded from the runtime export.
