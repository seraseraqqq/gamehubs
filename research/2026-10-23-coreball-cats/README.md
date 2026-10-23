# Coreball playroom redesign

Started 2026-10-23; final user-directed revision and validation 2026-10-24.

## Final direction

The owner requested a more enjoyable Coreball with a 3D fluffy ball and cat actions, while keeping the original timing rules. They chose direct playable implementation. During live review they rejected the disconnected side kitten, dark moving bands on the sphere, pixel paws that resembled duck feet, oblique paw perspective and thin-line pin art. The final version follows those corrections:

- One centered playfield, with the ball, incoming pin and launch control on one axis.
- Soft peach WebGL sphere and short irregular fibers. No sinusoidal surface-grain pattern, variable tilt, camera motion or screen shake. SVG ball remains available when WebGL cannot initialize or its context is lost.
- Smooth flat closed cat paws, viewed from directly above. Vertical wrists, small toe seams, no toe pads, spread thumbs, pixel blocks or rotation. Original Canvas paths in `paws.js`; no generated kitten raster ships.
- Filled ivory toy-pin bodies with matching soft tan outlines and rounded heads. Waiting, flying and attached pins use the same complete form; successful pins use a coral tint.
- Every accepted launch alternates a vertical 500ms paw anticipation/swat/return gesture. Successful landings produce a short local ring and fragments at the real landing point; a clean streak of three or more strengthens that feedback. Misses use muted rose feedback. Optional synthesized hit sound follows the existing sound preference.
- Original 30 levels, collision mechanics, 70% Practice, keyboard controls and storage key preserved. Streak is an in-attempt display, not a fabricated competitive score.

## Evidence and validation

[Desktop preview](desktop-preview.png) · [Mobile preview](mobile-preview.png)

- `node --test games/coreball/tests/*.test.cjs`: 8/8 pass, including a safe solution for all 30 original levels in both modes, collisions, one-in-flight limit and pause behavior.
- `python research/2026-10-23-keyword-seo/check-seo.py`: both sites' production, preview and default exports pass. This verifies links, metadata, assets, FAQ/schema agreement, canonical/robots/sitemap and runtime allowlists. Fixture origins are never deployed. The Cryptic game's implementation was not changed.
- Chrome at 390px, 1440px and the user's 2560px viewport: centered layout and no horizontal document overflow. The 390×844 initial view includes the complete launch control; measured bottom about 728px.
- Real UI clicks on Practice Level 1 reached five successful placements, streak five and the `Nicely played!` result with the final flat paw and full flying-pin graphics. Actual collision showed streak zero, `Two pins touched`, Retry level and disabled launch. Keyboard P paused and focused the resume control. No error-level console messages were observed in the smoke check.
- Current high-level crowded-board capture shows Level 30 with ten starting pins and thirteen incoming pins. Timed swat capture shows a raised right paw, complete pin in flight and the matching status. Review-only captures live under ignored `.impeccable/review/`; final representative previews are retained here.
- Mechanical detector ran once. Small functional text was raised to at least 12px; progress animation uses transform rather than width. Cream palette and nested-control heuristics are retained with contextual explanations in [detector notes](detector-notes.md). The result panel is a transient game state, not a nested information-card layout.
- Both shipping PNG cards were rebuilt with the current paw and pin style; provenance scan reports two rasters and zero missing origins. Original generated cat trials were discarded from the game assets. The generated originals outside this repository were preserved.

No production deployment, search indexing or field Core Web Vitals result is claimed. Source/default and preview exports remain noindex. Domains and advertising are still unconfigured for this game.

## Design records

`PRODUCT.md` records the owner's constraints. `DESIGN.md` and `.impeccable/design.json` document the implemented Coreball system only; they do not restyle the other games. The route brief is `.impeccable/surfaces/games-coreball-index-html.md`. The final review uses the latest user correction as its visual authority; no approved comp exists because the owner chose code-first.

## 沉淀的脚本

- `make-social.cjs`: native Canvas renderer for the two current social cards, sharing `drawPaw` with the game. Run with bundled `@napi-rs/canvas` and `sharp` available via `NODE_PATH`; executed successfully.
- `games/coreball/scripts/build.mjs`: standalone export updated to include `fur.js` and `paws.js`; production and preview paths verified.
- Reused `../2026-10-23-keyword-seo/check-seo.py` for complete export validation. Its earlier social renderer now handles only Cryptic so it cannot overwrite the current Coreball art.

Maintenance: current art and scope supersede the rejected interim concepts; source saves and historical SEO research are preserved. No domain or advertising configuration was changed.

Final independent review: **ship**, scoped to the supplied homepage captures and interaction revision; no material fixes requested. The guide source was not part of that visual review, but its static export/link checks passed. Design documentation completed by a separate documenter.
