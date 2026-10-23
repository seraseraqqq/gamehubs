# Neon Snake Arena — Gulper.io-inspired

An independent single-player neon snake arena with computer-controlled rivals. It does not connect to the original Gulper.io multiplayer service. Rankings belong to the current local arena; there is no shared leaderboard.

## Local preview

No runtime dependencies. From this game directory:

```sh
python3 -m http.server 4193
```

Open http://127.0.0.1:4193/. The repository review server uses this port during the current session.

## Gameplay

- Move the mouse over the arena or drag a finger to steer.
- Hold the left mouse button or Space while the canvas is focused to boost. On touchscreens, a second finger boosts. Boosting spends length.
- Losing window focus or cancelling a touch releases boost.
- Choose a named color skin, enter a nickname and start. New run also restarts after dismissing the result.
- Best score and optional sound preference stay in the browser when storage is available. Sound starts off.

## Assets and SEO

Fonts are hosted locally with their OFL license files; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Native HTML/CSS/vector artwork supplies the page and social card. Social-card source is in `design/social-card.html`; the published PNG is 1200 × 630. No remote font or product-image request is needed to play.

The HTML contains one H1, readable instructions, matching visible FAQ/JSON-LD, a canonical URL, and Open Graph/Twitter metadata. FAQ schema is descriptive and does not guarantee a Google rich result. No ratings or ranking promises are supplied. Existing Vercel analytics/performance script hooks are retained for hosted pages and skipped on localhost; page privacy text discloses them.

## Static export

```sh
node scripts/build.mjs                         # noindex local export
node scripts/build.mjs --origin https://gulperio.com        # production export
```

`vercel.json` builds `dist/`. The allowlist publishes runtime files, asset/license notices, robots and sitemap; it excludes scripts, design sources, raw datasets, research, README and test evidence. Non-production Vercel environments are noindex even if the origin argument is present. An export does not deploy anything.

## Workspace review — 2026-10-23

SEO accuracy, original/local assets, mobile spacing, control accessibility and storage failure handling were reviewed locally. See [review evidence](../../research/2026-10-23-existing-games/report.html). The reviewed changes are included in the owner-authorized GitHub release batch; see [release status](../../deployments/2026-10-23-existing-games.md) for production verification. Previous keyword numbers in project history were not revalidated in this task and are not a current forecast. No OpenSEO or paid keyword calls were used.


## Computer rival personalities — 2026-10-23

Product decision: keep this game single-player with computer rivals. Multiplayer infrastructure is outside the planned scope. Improving opponent behavior is the intended direction, not a temporary substitute awaiting a multiplayer release.

`bot-brain.js` gives every rival one of four styles: collector, hunter, drifter or rookie. Each has a bounded local view, staggered decision timing, target commitment, occasional late reactions and steering errors. Hunters attempt short intercepts, competitors race for food, cautious rivals retreat, and all rivals check curved routes using their normal movement physics. Sprinting comes in short bursts with rest and mass limits. Opponents can target each other; there is no player-only target rule. Shielded/tiny starters are excluded from hunt acquisition.

A run has 18 unique rival identities. Handles, colors and styles persist when a defeated rival returns after a varied delay. New runs clear the previous respawn queue, preventing delayed spawns or duplicate identities. The page continues to identify opponents as computer-controlled; no fabricated chat, network latency or real-player presence is shown.

The simulation uses the engine's existing frame-based timing; reaction/respawn durations therefore depend on effective frame rate. This change does not convert physics to elapsed-time stepping.

Validation:

```sh
node --test tests/*.test.cjs
```

Tests cover limited perception, target retention/loss, bot-vs-bot interception, novice shields, retreat/avoidance, bounded sprinting, chase limits, persistent respawns, clean restart and a seeded 3600-frame simulation. Browser checks and evidence are recorded in `../../research/2026-10-23-existing-games/gulper-personality.md`. Included in the GitHub release batch; production verification is separate.
