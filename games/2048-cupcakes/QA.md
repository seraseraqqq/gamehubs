# 2048 Cupcakes local QA — 2026-10-23

Story: keyboard, swipe or on-screen direction → original merge engine → animated
board and score → browser-local save → restore/undo/continue. There is no backend
or external gameplay API.

## Automated engine checks

`node --test tests/engine.test.mjs`: **7 / 7 passed**.

- [2,2,2,2] becomes [4,4,0,0]; [4,4,8,0] becomes [8,8,0,0], without double merges.
- Right/up/down direction and merge order are correct.
- No-op moves do not mutate the input or award score.
- A full checkerboard is terminal; an adjacent equal pair remains playable.
- Spawns use empty spots and legal 2/4 values with unique tile IDs.
- Save validation rejects malformed grids, duplicate IDs, invalid values and
  negative/unsafe fields.
- Across 400 seeded varied boards and all four directions (1600 move cases),
  sliding conserves total tile value and does not duplicate tile IDs.

## Browser flows

`python3 scripts/qa-browser.py`: **22 / 22 passed** in an isolated Chromium
session. Raw check details are retained locally in output/browser-checks.json.

| Area | Verified behavior |
| --- | --- |
| Entry | Two starting tiles, one H1 and only local resource requests |
| No-op | No spawn, no score change, no consumed undo state |
| Actual keyboard | ArrowLeft merges two 2s, scores 4 and adds one tile |
| Undo | Restores the complete previous grid, score, move count and spawn ID; best score remains |
| Restore | Reload restores the identical game and undo history |
| Preferences | Number labels survive refresh; native settings checkbox stays synchronized |
| Dialog | Escape closes preferences; movement is blocked while a dialog is open |
| Restart | Cancel preserves the board; confirm resets the board/history and preserves best |
| Victory | A deterministic 1024+1024 fixture shows the rainbow and the correct 2048 score gain |
| Continue | Keep baking retains the winning board and enables further play |
| Terminal state | Full nonmergeable fixture shows game over; restart creates a playable batch |
| Corrupt data | Broken JSON recovers to a fresh playable board without a page exception |
| Pointer swipe | At 390px, an actual browser pointer drag across the board merges and scores |
| Responsive | No document horizontal overflow at 320, 390, 768, 1024 or 1440 CSS px |
| Reduced motion | Emulated OS preference removes CSS animation/transition while merges still work |
| Runtime | No page JavaScript errors returned after these flows |

Additional checks: sound toggle updates its accessible state and the stored
preference; settings can turn it off. A natural 16-key play sequence produced 64
points with eight tiles (2/4/8/16), used for the desktop/mobile screenshots. The
fixture scores were not left in the delivered game state.

## Visual review

- Original 4×3 transparent cupcake atlas, with a 390KB WebP delivery version.
- Desktop 1440×1000 and narrow screen 390×844 reviewed from actual screenshots.
- Full-page screenshots cover the instructions, twelve cupcake levels, useful
  questions, privacy and credits.
- Numbers are on by default, so colors/art are not the only way to identify tiles.
- Native buttons, native dialogs, visible focus and a board summary/status are
  present. This is not a complete assistive-technology or WCAG audit.

Screenshots are in output/desktop.png, output/mobile.png and their full-page
variants. They are local QA artifacts, ignored by Git.

## Static export and SEO

- `node scripts/build.mjs` succeeds with no package installation.
- Default source/export are noindex, with robots Disallow; no fabricated domain,
  canonical or sitemap is present in the preview.
- Production-mode export was tested locally using the reserved synthetic origin
  https://cupcakes.example. Canonical, Open Graph URL, robots and sitemap agree;
  JSON-LD parses. No network request or deployment was performed for that origin.
- The final export was restored to preview/noindex mode after that test.
- Original PNG is excluded from the deployable export; WebP and required notices
  are included. The complete upstream 2048 MIT notice is preserved.
- No ads, analytics, embeds or external font requests are installed.

## Verification limits

Real iOS/Android touchscreen hardware, Safari/Firefox, disabled browser storage,
actual audible output, final-domain behavior and public Core Web Vitals were not
verified. Pointer swiping was exercised in a narrow viewport; it is not a claim
of a real-device test. Local timing is not a field performance score.

The earlier Google Trends gap remains a research limitation. The user explicitly
authorized the initial local development/preview. At that stage no production
release had occurred. The later release is recorded below.

## Production release follow-up — 2026-10-23

The owner purchased 2048cupcakes.xyz and authorized GitHub upload and production
Vercel deployment. The initial source release 4ff570e reached READY. Seven hosted
HTTP checks matched local build hashes and seven hosted Chromium browser checks
passed (startup, keyboard merge, undo, saved state, canonical, mobile layout and
no page errors). The Vercel custom-domain binding is verified, while Spaceship
DNS and final public HTTPS remain pending the owner's changes.

Full release and exact DNS records: ../../deployments/2026-10-23-games.md.
