# STARLING SEO implementation — 2026-10-23

## Scope and positioning

This change improves the existing English STARLING game page. Initial descriptive query targets are “space word game”, “free browser word game” and “rare answer game”. These are content-positioning hypotheses, not measured keyword volumes or ranking forecasts. No paid keyword research was run.

The page identifies STARLING as an independent game. The visible FAQ explains its relationship to Krillion and links to the original. The current fixed question set is described accurately; the page does not claim a daily puzzle, random bank, multiplayer, live rarity data or a global leaderboard.

## Implemented

- A descriptive 55-character title and 147-character meta description.
- One static H1, readable instructions, scoring details, route information and six visible FAQ entries using native details elements. This information is in server-delivered HTML and does not require JavaScript.
- A full-screen playable area followed by a responsive flight manual; original pixel art and game scripts are unchanged.
- Open Graph and Twitter card metadata, with an original 1200 × 630 image composed from the game's pixel sprites.
- WebPage and VideoGame/WebApplication JSON-LD describing visible, existing features. No fabricated reviews, ratings or unsupported rich-result claims.
- A local font preload, keyboard skip link, anchor navigation and a no-JavaScript explanation.
- Source crawler rules excluding development folders. Production output omits those folders altogether.
- A small dependency-free build command that generates consistent production canonical, og:url, absolute image URLs, JSON-LD identities, robots.txt and a one-URL XML sitemap from an explicit HTTPS origin.
- A publish allowlist that excludes unused painterly JPEGs, source atlases, research and browser artifacts. Assets in the verification build total approximately 258 KB, versus approximately 16.1 MB of working asset files. This is a packaging comparison, not a measured improvement in page loading time; the previous game already loaded only a subset of the working assets.

## Production configuration

The production domain is configured as `https://krilliononline.com/`. Working source and generated builds contain canonical tags, Open Graph / Twitter image URLs, Schema.org JSON-LD identities, robots.txt, and a sitemap.xml.

To generate a standalone distribution bundle:

    python3 scripts/build_site.py --site-url https://krilliononline.com
    python3 scripts/check_seo.py dist

Deploy the contents of dist/ as the site's root. The builder supports a root-hosted site, not a subdirectory installation. Its output marker permits subsequent builds into the same generated directory; it refuses unrelated non-empty output directories and output containing the source tree. Runtime and build commands use only the Python standard library. Recreating the social image optionally requires Pillow.

Do not deploy the temporary verification origin. The example origin https://starling.example was used exclusively in /tmp/starling-seo-verification to verify interpolation. The original SEO pass did not deploy, buy domains, submit Search Console, or configure analytics. A later deployment is already public at the confirmed origin (HTTP 200 in the 2026-10-23 workspace review); the owner authorized pushing this review’s changes to GitHub; production rollout is tracked separately.

Once the real domain is deployed, verify its canonical and HTTP status/redirect behavior, then submit that domain's sitemap in Search Console. Indexing and rankings have not been verified. No Lighthouse, Core Web Vitals, keyword-volume or traffic claims are made.

## Verification performed

- Source and generated-site automated checks: exactly one H1, non-empty metadata, parseable JSON-LD, static instructions, unique element IDs, local links and anchors, matching production URLs, robots/sitemap consistency and no development folders in the build.
- Four local, insecure or path-bearing URL inputs were rejected by the builder.
- Browser checks at desktop and 390 × 844 mobile dimensions: no horizontal overflow.
- With JavaScript disabled, the game description, instructions and FAQ remain in the document; the JavaScript requirement notice is visible.
- Both source and built-site smoke tests started the countdown, submitted “water”, received 140 points and advanced to the atmosphere. Mobile Enter submission, guide navigation and FAQ expansion worked.
- The built site had no observed page errors, failed resource requests or external requests during the smoke test.
- robots.txt, sitemap.xml and social image returned HTTP 200; a research document and a missing page returned HTTP 404 in the verification server.
- These were focused SEO and gameplay smoke checks, not a fresh full seven-round regression or validation at a production URL.

Screenshots: output/playwright/seo-guide-desktop.png and output/playwright/seo-guide-mobile-nojs.png.

## Answer-validation follow-up — 2026-10-23

The estimated fallback was removed. The scoring guide and help dialog now describe strict per-prompt answer/alias matching, retries on the existing deadline, and the possibility of unlisted valid answers. The publisher now includes answer-bank.js. See output/playwright/ANSWER-VALIDATION.md for regression evidence.

## Timeout-progress follow-up — 2026-10-23

The visible flight manual now explains that timeout/pass consume a prompt without moving the rocket. Only correct answers advance a sector; end-of-run text reflects the actual reached location. Evidence and repeatable checks are in output/playwright/TIMEOUT-PROGRESS.md.


## Workspace review follow-up — 2026-10-23

The brand in the initial HUD is the single H1; the flight-manual title is H2. Light text/shadow improves brand contrast against the sky. Visible privacy copy describes browser-local scores/settings. Vercel now invokes the existing runtime-only exporter; preview environments are noindex and have disallow robots rules. Source remains associated with the confirmed production origin. Four-width browser checks and the 11-test answer suite are recorded in `../../research/2026-10-23-existing-games/`. New edits belong to the authorized GitHub release batch; see `../../deployments/2026-10-23-existing-games.md`. The Krillion domain versus STARLING product identity remains an SEO positioning issue, not a metadata defect resolved by this pass.
