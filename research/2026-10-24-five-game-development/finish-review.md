disposition: ship

Latest disposition is a **verdict pass on the four material fixes below**, all now resolved. It is not a new whole-surface approval or production acceptance. The original review is retained as the baseline; its `fix`, `missing`, and `contradicted` entries describe the pre-correction build. Poople and Metazooa retain their prior local-prototype `ship` dispositions.

Original input note: no QUALITY BAR card was supplied in the first packet. `QUALITY_BAR.md` was supplied for the verdict pass and is consistent with the confirmed functional briefs. This code-led build has no approved comp. Full datasets, non-game routes, dependency sources and physical-device behavior were not independently audited in this finish review.

## persistence

Pass for the local-prototype review packet: all five canonical roots have PRODUCT.md, PRD, a pinned design brief and a surface direction contract. Every FORM block records seed `dfa118b5`, corroborated by the supplied concept-seed execution, and the owner confirmed the existing PRD/brief scope. A new-world DESIGN.md is due after this review, so its absence at this point is not a finding.

All 15 required captures exist and were opened: for each of `cutle`, `poople`, `colordle`, `metazooa`, and `travle`, `.impeccable/review/desktop.png`, `mobile.png`, and `user-1266.png`. Each is a valid full-page game capture with the document top, correct content and sensible dimensions. Desktop widths are 1440px, phone widths 390px, and owner-window widths 1266px. No blank or black capture regions or wrong-page substitutions were found. The contact sheet was not used as a substitute.

The supplied runtime evidence reports 10 Chrome completions per game and separate keyboard/storage/UTC checks. Those are builder-provided test evidence; this reviewer did not open a browser or rerun them. They do not establish real-phone, five-player, production-domain, deployment, indexing, traffic or revenue acceptance.

## fidelity

| Game / element | State | Evidence and scope |
|---|---|---|
| Cutle — TYPE | match | Brief explicitly pins readable system type; clear title/control hierarchy and numerical scores in sampled source. The floor's own-world display warning does not override that pinned Operate brief. |
| Cutle — MATERIAL | match | Crisp geometric polygon and cutting line are the actual game, with no imitation physical material. |
| Cutle — GROUND | match | Sampled desktop pixel is `#f6f3ea`, equal to the brief's page token. |
| Cutle — first viewport / controls | match | Shape leads; mode, difficulty, two keyboard sliders and direct cut action are present. Mobile stacking follows the surface contract. |
| Cutle — gesture/visual agreement | contradicted | `coord()` treats the whole SVG box as its viewBox even when the 330px mobile height cap introduces letterboxing. The gesture must map to the polygon the player actually sees. See fix 1. |
| Poople — TYPE | match | System UI, a distinct four-letter monospace ladder, readable form and unambiguous goal are consistent with the brief. |
| Poople — MATERIAL | match | Real letter-chain content rather than decorative metaphor; changed-letter styling and layered hints exist in sampled source. |
| Poople — GROUND | match | Sampled desktop pixel is `#fbf7ef`, equal to the brief's page token. |
| Poople — topology / task | match | Start and POOP goal precede the chain; input, move count, undo and staged hint controls are nearby. The mobile capture reflows them legibly. |
| Colordle — TYPE | match | Neutral system type, names outside swatches, numerical match feedback; no color-dependent text contrast trick. |
| Colordle — MATERIAL | match | The target color itself is the focal material; neutral surrounding UI preserves the brief's color-lab intent. |
| Colordle — GROUND | match | Sampled desktop pixel is `#f5f5f5`, equal to the brief's page token. |
| Colordle — initial task | match | Target, name search and explicit RGB-score explanation are present; the search remains within the narrow layout. |
| Colordle — terminal comparison | missing | The brief promises an aligned target/best-guess comparison. The completed branch supplies best-name/percentage prose, while its swatch can be buried among the scrollable history. See fix 2. |
| Metazooa — TYPE | match | Readable names, scientific-name detail and textual branch explanations follow the natural-classification handbook brief. |
| Metazooa — MATERIAL | match | Text and the real classification trail carry the game; no unlicensed animal-picture stand-in. |
| Metazooa — GROUND | match | Sampled desktop pixel is `#f4f1e6`, equal to the brief's page token. |
| Metazooa — topology / truthful feedback | match | Search and remaining guesses lead; the trail occupies a separate region. Source uses the guessed animal's path until completion, highlights the shared ancestor and discloses the ENA snapshot. |
| Travle — TYPE | match | Country names and route metrics are readable; S/G labels supplement color. |
| Travle — MATERIAL | match | Actual country geometry and path order, rather than decorative travel imagery, own the screen. |
| Travle — GROUND | match | Sampled desktop pixel is `#f2f4f1`, equal to the brief's page token. |
| Travle — desktop task | match | Named start/goal, map, textual route, search and explicit connection rules form one coherent task. |
| Travle — mobile primary-input priority | contradicted | In the 390px capture, map, legend, route chip, attribution and metrics all precede the search. Its input falls below an 844px phone viewport. The original brief explicitly prioritizes search/status on mobile and places search next to the map's lower edge. See fix 3. |
| Travle — revealed-map semantics | contradicted | The reveal branch draws `optimal`, while its legend and accessible description still say the map is the player's route. See fix 4. |

Local-prototype dispositions: **Cutle: fix; Poople: ship; Colordle: fix; Metazooa: ship; Travle: fix.** A `ship` here concerns the supplied local prototype and reviewed surface only.

## ceiling

The pinned Operate worlds call for the actual game artifact, a clean grid, neutral controls and explanatory feedback. Poople and Metazooa reach that functional surface bar in the supplied captures. Cutle's coordinate agreement, Colordle's promised comparative result, and Travle's mobile work-area priority/result labeling remain material gaps. No decorative texture, image campaign, exotic typography or new branding direction is owed by these briefs. An unspecified QUALITY BAR card cannot support a stronger visual-ceiling claim.

The THESIS, OWN-WORLD and STORY promises otherwise hold: compact titles, immediate game content, own data/rules, and a direct path to practice. FORM is persisted. FIRST VIEWPORT is specifically deficient for Travle's mobile search. No kickers, hard offset shadows, glyph substitute logos, decorative gradients, fake physicality, invented player totals, or invented commercial claims were found in the reviewed surfaces. The visible histories are local QA game results, not traffic or popularity claims.

## material_fixes

1. **Cutle — pointer coordinates:** `E:/Projects/game-sites/cutle/apps/web/src/game/Game.tsx:46` maps client coordinates using the SVG bounding-box width/height, while `apps/web/src/styles.css:781` caps the mobile SVG at 330px. At wider mobile widths the intrinsic viewBox can letterbox, so a visual drag is interpreted in a different coordinate system. Convert client points with the inverse SVG screen CTM (with a safe null-matrix path), or otherwise guarantee and account for the drawable viewport. Verify a drag at a width where the height cap applies; keep the keyboard alternative. This is the game's input truth, not cosmetic polish.
2. **Colordle — result comparison:** `E:/Projects/game-sites/colordle/apps/web/src/game/Game.tsx:155` needs the brief's direct target-versus-best-guess comparison at completion/reveal. Render the two labeled swatches together, with names/hex values and the best match score on neutral text surfaces. Handle zero guesses honestly. Do not require hunting through the scrolling history to see why the best guess was close.
3. **Travle — mobile search placement:** `E:/Projects/game-sites/travle/apps/web/src/game/Game.tsx:77` / `:167` and `apps/web/src/styles.css:774` stack the entire map column, including attribution and route chips, before the action column. Move the next-country input and current/goal state next to the map's bottom or ahead of secondary material on narrow screens, and reduce/map-group secondary content so the first useful input is visible at 390×844. Preserve the textual route and source credit below the work area.
4. **Travle — revealed-map legend and accessible text:** `E:/Projects/game-sites/travle/apps/web/src/game/Game.tsx:42`, `:91`, and `:152` switch `shown` to the shortest route after reveal, but the legend remains “Your route” and the SVG accessible name enumerates `r.route`. Identify the displayed shortest route accurately (or draw both routes with distinct labels) and make the accessible description match the highlighted/polyline data. Keep the actual player route separately readable.

These four items are local-prototype fixes. Production authorization, physical touch-device play, 320/375px and real soft-keyboard acceptance, and the planned five-player comparison remain separate gates; this review does not close them. Post-fix evidence should recapture the same required files and include a visible non-winning Colordle reveal and a Travle shortest-route reveal for scoring fixes 2 and 4.

## keep

Keep the game-name-first copy, playable artifact as the visual center, independent UTC puzzles, local-only progress truth, explicit score/border/taxonomy rules, neutral text beside arbitrary colors, and the restrained brief-pinned system; do not dilute these fixes with a new branding or marketing surface.

## verdict

The same three required captures were reopened for each affected game: Cutle, Colordle and Travle. The six additional `revealed-{desktop,mobile,user-1266}.png` captures for Colordle and Travle were also opened. All are valid, correctly scoped, full-page game captures. The supplied quality-bar card was read; no new design hunt was opened.

1. **Resolved — Cutle pointer coordinates.** Current `Game.tsx` applies `getScreenCTM().inverse()` to a client-space DOMPoint and handles a missing matrix without inventing a cut direction. The required recaptures preserve the existing board and keyboard controls. Recorded native-CDP drag evidence in `.rankup/evidence/pointer-acceptance.json` places the endpoints at approximately `(19.82,179.40)` and `(399.46,179.40)` for the expected `(20,180)` to `(400,180)` letterboxed test, produces one valid 50.45% cut, and passes the stated tolerance. This closes the identified coordinate mismatch; it is not a physical touch-device result.
2. **Resolved — Colordle terminal comparison.** All three reveal captures visibly pair Target · Brown with Best · Alabaster, label their RGB values on neutral surfaces and show the 28.72% best-match score. The pair stays adjacent and readable on mobile rather than requiring a search through history. The completed branch explicitly handles no guesses with “No guesses to compare yet.” This resolves the missing comparative result.
3. **Resolved — Travle mobile search placement.** The new 390px capture places the input directly after the reduced map/legend and route metrics. The full input now fits within the 844px phone viewport, while route chips and source attribution follow the main work area. Desktop and 1266px captures retain the map/search relationship. This resolves the specific mobile-priority finding; actual soft-keyboard/device acceptance remains separate.
4. **Resolved — Travle revealed-map semantics.** All reveal captures visibly label the displayed map path “Shortest route” and present Iraq → Iran → Armenia as the solution. The actual player route, Iraq → Iran, remains separately readable below. Current SVG accessible text enumerates `shown` and identifies it as the shortest route in the reveal state; `.rankup/evidence/review-fixes.json` records the same labels and sequence. The visible and accessible meanings now agree with the highlighted route.

No regressions attributable to this correction batch were observed in the supplied recaptures.

## remaining

Clear for the four scored material findings. Final local-prototype disposition for those corrections: `ship`. Retain the original Poople/Metazooa local-prototype `ship` results. This verdict does not close real-phone touch and soft-keyboard acceptance, five-player comparative testing, production performance, name/domain review, deployment or indexing.

## verdict — hover cascade correction

**Resolved across all five sites.** In each current `apps/web/src/styles.css:182`, the generic pale-background hover selector explicitly excludes `.primary` buttons and `[aria-pressed="true"]` mode buttons. It therefore cannot override their accent background while leaving white text. The accent/white rule remains intact, and the primary hover keeps only `brightness(1.15)`. This closes the specific selector-cascade failure rather than merely relying on a later rule to win by order.

The five supplied native-Chrome `.rankup/evidence/hover-acceptance.json` records agree with that source behavior. Their selected-mode and primary-hover contrast ratios, including the recorded brightness filter for the latter, are:

| Site | Selected-mode contrast | Primary-hover contrast |
|---|---:|---:|
| Cutle | 8.03:1 | 6.65:1 |
| Poople | 8.18:1 | 6.78:1 |
| Colordle | 12.50:1 | 11.12:1 |
| Metazooa | 7.60:1 | 6.25:1 |
| Travle | 7.96:1 | 6.58:1 |

All exceed 4.5:1 for normal text. No default-state layout or pixel change follows from this selector correction, so the previous required captures remain applicable. No regression attributable to this scoped change was identified. This pass reviewed the current cascade and the supplied measured records; it did not run a new browser or a new full-surface review.

## remaining — hover cascade correction

Clear for the hover-cascade item; the four earlier findings remain resolved. Scoped disposition remains `ship` for the local-prototype corrections, with the existing physical-device, comparative-player and production gates unchanged.
