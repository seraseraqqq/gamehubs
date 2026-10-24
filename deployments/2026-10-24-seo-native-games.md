# Four native game sites: SEO audit and repairs

Observed 2026-10-24 (Asia/Shanghai). Scope: Block Blast Unblocked, 2048 Cupcakes,
Spacebar Counter and Gulper.io. Each production exporter publishes one HTML page
(`/`); design HTML and development files are excluded from deployment.

## Findings and repairs

| Site | Finding | Result in the local production export |
|---|---|---|
| Block Blast Unblocked | The description led with a generic independent puzzle rather than the game or controls. | Description, OG/Twitter description and VideoGame description now lead with the game name and describe drag, tap and keyboard input. Credits and affiliation statements remain. |
| 2048 Cupcakes | The live page had no OG image, no explicit Twitter title/description/image, and no URL/image identifying its VideoGame entity. | Added an original 1200 × 630 code-native sharing-card layout using existing cupcake illustrations; completed OG/Twitter metadata and canonical URL/image in JSON-LD. Description now states the 10-move undo and actual controls. |
| Spacebar Counter | The live page had no OG image and only a Twitter card type; schema lacked an image and description. | Added a 1200 × 630 card drawn in SVG and rendered to PNG; completed OG/Twitter metadata and WebApplication URL/image/description. The utility remains correctly classified as a utility. |
| Gulper.io | The current source already has matching metadata, cards, single-player description and schema. Live HTML still has the older “Inspired” title. | No redundant source edits. Verified the current production export uses the previously approved game-first title and accurately describes computer rivals. Pending deployment remains separate. |

The cards are checked-in assets; production exporters acquire no new dependency.
Both new images were opened and visually inspected. Gameplay and page layouts
were not changed. No ratings, review counts or multiplayer claims were added.

## Per-page metadata after repair

All four pages have `lang="en"`, one H1, readable HTML instructions, and valid
JSON-LD syntax. The canonical shown below is also the sitemap URL and OG URL.
Production robots metadata is `index, follow, max-image-preview:large`.

| Page / canonical | Title | Description | Structured data |
|---|---|---|---|
| https://playblockblastunblocked.com/ | Block Blast Unblocked — Free 8×8 Block Puzzle | Play Block Blast Unblocked free. Place shapes on an 8×8 board, clear rows and columns, build combos, and save your best. Drag, tap or use the keyboard. | VideoGame + visible FAQPage |
| https://www.2048cupcakes.xyz/ | 2048 Cupcakes — A Cozy Cupcake Merge Game \| Crumb | Play 2048 Cupcakes free. Slide and merge matching cupcakes toward 2048, undo up to 10 moves, and save your batch. Use arrow keys, WASD or swipe controls. | VideoGame |
| https://www.spacebarcounter.xyz/ | Spacebar Counter — A Simple Spacebar Speed Test | Count individual spacebar presses in 5, 10, 30 or 60 seconds. Filter held-key repeats, compare your local results, or try a separate tap test. | WebApplication |
| https://gulperio.com/ | Gulper.io Snake Game — Play Online Free | Play Gulper.io in your browser. Collect glowing orbs, outmaneuver computer rivals and boost your way to a new high score. Free to play, no download. | VideoGame + visible FAQPage |

## Validation

- Existing rankup `seo-audit.mjs` fetched all four live homepages. Each HTTP 200;
  live canonical matches its final approved host. The checker’s missing-keywords
  observation was not treated as a defect or used to add meta-keyword stuffing.
- Direct HTTP checks: all eight live `robots.txt`/`sitemap.xml` requests return
  200; robots permit crawling and name the correct sitemap. Each sitemap lists
  exactly its own canonical homepage.
- All four exporters ran in three modes: default preview, `VERCEL_ENV=preview`
  with an origin, and approved production origin. **232 assertions passed**:
  title/description/H1/language, JSON-LD parsing, schema URL/image, all local
  anchor/resource targets and fragments, canonical, OG/Twitter image metadata,
  real 1200 × 630 PNG dimensions, robots and sitemap. Default/Vercel previews
  retain noindex, disallow crawling and emit no sitemap. Production exports are
  the final local `dist` state.
- Existing 2048 engine suite: **7/7 passed**. Existing Gulper suite:
  **18/18 passed**. Modified build scripts pass `node --check`;
  scoped `git diff --check` passes.
- Export validation used a temporary local validation script; the aggregate
  portfolio audit provides the durable verification workflow.

No deployment or push was performed by this review worker. Local exports are
verified; production still serves the pre-push version. Browser PageSpeed,
AITDK, live social-card fetches after deployment, real-device gameplay and
Search Console indexing are separate checks, not claimed complete here.

## Reusable scripts

- `games/2048-cupcakes/scripts/render-social-card.cjs`
- `games/spacebar-counter/scripts/render-social-card.cjs`

Both were executed successfully with the installed bundled Sharp module:
`node <script> <absolute-sharp-module-path>`. They only regenerate their own
game's sharing PNG and are excluded from the runtime export. Usage is recorded
in each game's README.
