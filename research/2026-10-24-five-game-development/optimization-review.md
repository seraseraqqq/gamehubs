Method: dual-agent (A: /root/optimization_design_a · B: /root/optimization_evidence_b), plus parent source/SEO synthesis.

# Five-game UI, interaction and SEO optimization review

Scope: the five local first versions, not production traffic or ranking. No application code was changed during this assessment. A finished before B's detector findings entered synthesis. Live Chrome inspection and source-matched captures were used; physical phone/soft-keyboard behavior, screen readers, Lighthouse/CWV and real-user retention remain unmeasured. Prior QA histories are not player or traffic evidence.

## Overall judgment

The interfaces are appropriate functional puzzle MVPs. Their real game artifacts provide enough identity; existing restrained palettes, native controls and game-name-first copy can stay. The largest opportunity is to make each gameplay loop easier to see and learn from, particularly on short/mobile screens, and then give each support page a genuinely useful tool or worked example.

Existing SEO foundations are present: six HTML routes per game, descriptive distinct titles, one H1 per page, raw-HTML instructions, and truthful homepage VideoGame JSON-LD. The default local noindex and omitted canonical are intentional, not current defects.

## Qualitative heuristic scores

Assessment A scored all ten applicable Nielsen heuristics 0–4. These are design judgments, not experimental measurements or Google quality scores.

| Heuristic | Cutle | Poople | Colordle | Metazooa | Travle |
|---|---:|---:|---:|---:|---:|
| Status visibility | 3 | 3 | 3 | 3 | 3 |
| Users' language | 3 | 3 | 3 | 2 | 3 |
| Control/freedom | 2 | 3 | 2 | 2 | 3 |
| Consistency | 3 | 3 | 3 | 3 | 3 |
| Error prevention | 3 | 3 | 3 | 3 | 3 |
| Recognition over recall | 3 | 3 | 2 | 2 | 2 |
| Efficiency | 3 | 3 | 3 | 3 | 2 |
| Minimalism | 2 | 3 | 3 | 3 | 3 |
| Error recovery | 3 | 3 | 2 | 2 | 3 |
| Help | 3 | 3 | 3 | 3 | 3 |
| Total /40 | 28 | 30 | 27 | 26 | 28 |

## Five priority issues

1. **P1 — Shorten the mobile action/feedback loop.** Shared header/title/mode/difficulty consume roughly 300px before the game. At 390×844, Colordle and Travle search is around y740–750; the next results lie farther below. Cutle's submit is below the initial fold, and desktop sliders were measured at y891 in a 717px viewport. Direct drag works, so this is friction rather than a complete blocker. Compact the above-game controls; keep Cutle score/adjustment beside the board, Colordle target/search/latest feedback together, and Travle current/goal/input close. As histories grow, keep next input before secondary history. References: Cutle Game.tsx:137/166/180/209; Colordle Game.tsx:94/126; Travle Game.tsx:156–180; shared styles.css:223/774/781/787.
2. **P2 — Make feedback actionable.** Metazooa should surface the best known shared branch near search, explain reliable clades in familiar language, and distinguish the newest guess from the best deduction. Colordle can retain compact target/best/latest swatches while playing and offer explicitly optional channel-direction learning hints. Poople solver should distinguish unsupported words from disconnected pairs and highlight each changed letter. Cutle should explain how to move the line toward balance. These are learning/continuation hypotheses, not measured retention improvements.
3. **P2 — Improve recovery and accessible search.** Shared search is untrimmed substring matching capped at30, clears a rejected choice, and gives generic recovery advice. Prefer exact/prefix matches and keep rejected queries. Clearly state that selecting a result submits a guess. Difficulty immediately replaces an unfinished round; defer the new difficulty to the next puzzle or state that consequence and preserve a resume path. In live empty cmdk search, aria-expanded=true referenced a nonexistent list. Link field help/errors with aria-describedby/aria-invalid and keep the expanded/list contract correct. Preserve the existing visible keyboard focus and live feedback.
4. **P2 — Make replay and sharing useful.** Current history exposes five of50 records, with generic Solved/Revealed/moves wording and no challenge identity. Show starting word, route endpoints, answer color/animal or first/best cut as appropriate, correct the unit, expose older saved records on request and compare practice-again outcomes. Copied results need a verified public game link; optional same-seed challenge links could support meaningful sharing after release. Challenge URLs should not become a large collection of near-duplicate indexable pages. Do not add accounts/leaderboards merely to solve retrieval.
5. **P2 — Give the support pages independent value and investigate payloads.** Interactive worked examples and lookup/comparison tools are more valuable than expanding generic copy. Retain one playable landing page for the overlapping game/unlimited/practice intent. Travle's map is the clearest technical payload target; simplify/cull geometry with border usability tests, then measure actual mobile loading/interaction before architecture changes.

## Per-game next iteration

| Game | UI/interaction | Useful SEO content direction, demand not yet verified |
|---|---|---|
| Cutle | Board, ratio and cut controls visible together; active drag/slider relationship; optional reference bisector after an attempt; shape-specific practice | Interactive triangle medians, rectangle centers and polygon area examples in /strategy |
| Poople | Keep current word/POOP/input together as ladder grows; improve dictionary discovery and solver error diagnosis; mark changed letters in results | Strengthen the actual /solver with reachable examples, difficulty and explanations, rather than duplicate play pages |
| Colordle | Target/search/nearest guess remain comparable; optional disclosed learning hints; preserve challenge difficulty by not revealing candidate swatches automatically in normal play | /color-guide gains hex lookup, hue/lightness filters and comparisons; keep curated naming/data scope accurate |
| Metazooa | Best branch beside input; familiar clade explanations and clear best-versus-latest feedback; searchable accepted animals | /taxonomy-guide gains an actual two-animal common-ancestor comparison and explanations from the fixed dataset |
| Travle | Current-country marker and optional tap-to-name/fit-map controls; next input prioritized; optional training hints rather than listing all legal borders by default | Actual route/border lookup, worked shortest paths and a clear exception table |

## SEO and payload evidence

Parent inspected all30 generated HTML pages. Each has one H1, a distinct title within its site and noindex,follow. Strategy pages contain actual examples but can become more useful through diagrams/tools. Word counts are descriptive and are not quality thresholds.

| Site | Home HTML raw KiB | Home HTML gzip KiB | Largest entry JS raw/gzip KiB | Largest game-related chunk raw/gzip KiB |
|---|---:|---:|---:|---:|
| Cutle | 12.4 | 4.4 | 340.0 /109.2 | 47.6 /18.3 |
| Poople | 16.1 | 4.4 | 340.3 /109.4 | 48.0 /19.5 |
| Colordle | 12.6 | 4.4 | 340.5 /109.5 | 63.4 /21.1 |
| Metazooa | 13.1 | 4.5 | 341.0 /109.7 | 88.1 /31.4 |
| Travle | 235.6 | 61.9 | 340.8 /109.7 | 260.3 /89.5 |

These are local filesystem bytes and parent-computed gzip, not measured transfers or CWV. B measured176 map paths,225,745 map-outerHTML characters and a241,209-byte Travle homepage. A regional view still renders the whole map. Source attribution of the shared roughly340KiB entry requires a bundle analyzer; do not call it all unused code.

Release configuration must eventually set the actual verified origin and indexing flag and validate canonical/redirects/OG/robots/sitemap together. Current local noindex should remain. Current keyword variants do not have new demand measurements in this review; no search-volume, ranking or revenue outcome is inferred.

Google's current guidance recognizes games and interactive tools as main content and emphasizes original effort, usefulness and accuracy: https://developers.google.com/search/docs/fundamentals/creating-helpful-content . Similar query-doorway pages add risk when they merely funnel to one useful game: https://developers.google.com/search/docs/essentials/spam-policies . Page experience should be measured broadly; good CWV alone does not guarantee rankings: https://developers.google.com/search/docs/appearance/page-experience . Titles should remain concise, descriptive and page-specific: https://developers.google.com/search/docs/appearance/title-link . Structured data must describe visible content accurately: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data .

## Measurement plan and order

First improve mobile context/action placement and safe recovery. Then improve game-specific learning, identifiable replay and verified-link sharing. Finally enrich the actual solver/guide/strategy tools and measure production performance. On release, measure first-valid-move rate, invalid submissions, completion by difficulty/hint use, actual next-round starts, sharing-to-play arrivals and return visits alongside GSC impressions/clicks/query/page data. No current metrics exist to quantify an uplift.

## Evidence provenance and limits

A assessed design/source independently and live-inspected all five. One Poople screenshot timed out once; its live DOM plus source-matched prior image were used. B independently captured all five mobile views and verified focus, disabled Undo, real empty/error text, source/HTTP and console samples. All owned sessions closed and existing owner preview servers were untouched. No user-visible overlay was injected; the standalone overlay payload was unavailable. B's detector returned206 documentation advisories and0 primary findings; these are not206 UX defects and do not justify arbitrary style changes.

Target slugs were resolved by the bundled helper (game-tsx within each separate repository). No ignore file existed. This is the first formal critique snapshot for each target; no improvement trend is established. Supporting B report: [optimization-assessment-b.md](optimization-assessment-b.md). Questions for a future implementation decision: prioritize mobile/feedback, replay/sharing, or SEO tools; scope the top three issues or all five sites in batches. This assessment itself did not authorize application changes.

## 沉淀的脚本

无新增应用或浏览器脚本；复用既有OpenCLI和Impeccable命令完成只读评估。字节体积为一次性本地检查，不是线上监控或排名报告。
