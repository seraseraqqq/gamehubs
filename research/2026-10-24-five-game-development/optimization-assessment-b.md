Method: independent Assessment B (detector + browser + source/HTTP evidence), isolated from Assessment A
Date: 2026-10-25 Asia/Shanghai (observations collected 2026-10-24 15:58–16:02 UTC)
Scope: E:/Projects/game-sites/{cutle,poople,colordle,metazooa,travle}/apps/web/src; existing localhost ports 4311–4315. Read-only assessment; no application edits.

## Evidence quality and scope

I did not read Assessment A or earlier review conclusions. This report separates observed behavior, source deductions, and recommendations. No Lighthouse scores, Core Web Vitals, traffic, conversions, search rankings, or real-device keyboard measurements were fabricated.

Live evidence used fresh OpenCLI sessions on the explicitly authorized Chrome profile fwnupvwa. Every operation targeted the exact page ID returned by open. The sessions were evidence-b-{cutle,poople,colordle,metazooa,travle}-pine. All five were explicitly closed. No existing user tab was claimed, no foreground operation was requested, no servers were started, and no storage was cleared or successful game move submitted.

Desktop DOM observations were at 1266 × 717 CSS pixels. A mobile-width screenshot was captured for each game at 390 × 844 through OpenCLI screenshot viewport overrides, then the normal viewport was restored. This is browser emulation, not a physical-phone test. Most initial tabs reported visibility hidden; Travle reported visible. Screenshots succeeded without a foreground request. Timing conclusions are consequently excluded.

Transient UI-only probes: keyboard focus on Cutle mode controls; Poople empty form submit; Colordle no-match search. Colordle query was cleared with Escape before tab closure. These did not create a successful move or change a saved puzzle.

## Mechanical detector

Command: C:/Users/Sera/.agents/skills/impeccable/scripts/impeccable.cmd detect --json, with all five source directories as positional targets. There were 91 total source files across the five trees, below the 500-file narrowing threshold. No target had .impeccable/critique/ignore.md.

The first invocation's displayed JSON was truncated. A single capture rerun was necessary to recover complete structured counts; it was not a separate assessment or changed-scope rerun. The rerun exited 0 and returned **206 advisory findings, 0 primary findings**. All three rules are design-system-documentation checks:

| Game | design-system-font-size | design-system-radius | design-system-color | Total |
|---|---:|---:|---:|---:|
| Cutle | 30 | 4 | 9 | 43 |
| Poople | 29 | 2 | 9 | 40 |
| Colordle | 31 | 4 | 9 | 44 |
| Metazooa | 31 | 4 | 9 | 44 |
| Travle | 31 | 4 | 0 | 35 |
| Total | 152 | 18 | 36 | 206 |

These are not 206 usability defects. They say the local DESIGN.md ramp/palette does not document literal values found in source. For example styles.css:89 (1.05rem), :96 (0.8rem), :533 (5px radius), and :630 (#dceaf0). The full compact rule/location inventory is appended below.

False-positive / low-value interpretation: most map-color advisories in Cutle, Poople, Colordle, and Metazooa arise from copied, unused .map-board rules in each complete stylesheet. Travle's actual map palette is documented and returned zero color advisories. Do not change unrelated game colors merely to suppress these notices. Font/radius values require a deliberate documentation-versus-implementation decision; the detector does not prove they look wrong. Source contains styles for other game types, but this is a maintenance issue before it is a material performance issue.

### Overlay status

No user-visible detector overlay exists. A distributable detect.js was not found in the installed skill scripts, and the briefing disallowed new servers/ad hoc page mutation. The available live-browser.js is the variant-mode UI, not a safe standalone detector payload. No title/script mutation preflight was performed, no script was injected, and no live-server cleanup was needed. Fallback signals: CLI detector, live read-only DOM, screenshots, and source/HTTP evidence.

## Verified strengths

- The initial game is playable immediately; there is no blocking onboarding modal. The three header destinations consistently expose Play, rules, and the game-specific support resource.
- Controls use visible labels, 44px-high buttons/selects, 48px-high text inputs, native disabled states, and mostly semantic sections/lists. Poople Undo and Travle Undo were actually disabled initially, with computed opacity 0.5. Search offers visible keyboard instructions and a real no-result message.
- Keyboard focus is present: after focusing the first Cutle mode button and pressing Tab, Daily puzzle matched :focus-visible, with an automatic outline and a 3px shadow ring. The mobile screenshot visibly confirms a strong focus boundary. This contradicts a blanket “no focus indicators” accusation.
- Poople's empty submit says “Enter exactly four letters.” Colordle's impossible query says “No matching results. Try another name.” Both remain interactive; console captures contained zero messages in all five sessions at the times sampled.
- Main content, rules, FAQ answers, headings, and support pages are in HTTP HTML, not entirely dependent on post-load JavaScript. Each homepage contains one VideoGame JSON-LD block. The game-specific solver/color dictionary/taxonomy/strategy resources create meaningful support content.

## Highest-value opportunities

### 1. P1: Put the next action and its context inside a short mobile play loop

This is most acute in Colordle, Cutle, and Travle. At 390 × 844, the common header, title, tagline, mode switch, and difficulty occupy about the first 300px before the game begins. Colordle then shows a 170px swatch, a redundant instruction line, an additional heading and explanation; its search input is around y=750 and the result list falls below the viewport. Travle's country input appears around y=740 after the map, legend, and three statistics. Cutle's board and sliders fit, but the Cut button is below the first viewport.

Desktop Cutle is also oversized: live DOM measured its SVG at 592.44 × 507.80, y=362.36; the slider inputs began y=891, while the viewport was only 717px tall. The cut card was 653.19px high at y=303.94. A keyboard user must scroll to adjust the cut and may lose simultaneous sight of the full shape.

Source: cutle/apps/web/src/styles.css:223 (.game-layout), :485 (.cut-board), :498 (.slider-grid), :774 (single-column breakpoint), :781 (mobile-only max-height). colordle/apps/web/src/game/Game.tsx:130 onward places the extra heading/explanation before Search. travle/apps/web/src/game/Game.tsx:156–180 places stats before Search.

Fix: reduce above-game spacing on narrow/short screens; group mode and difficulty more compactly. In Colordle, put the color search directly beside/below the swatch and shorten the second instruction block. In Travle, place the country field immediately after the endpoint prompt, with the map supporting it. In Cutle, cap desktop SVG height as well and keep angle, offset, submission, and result in one coherent visible area. Preserve the direct drag interaction. Verify at 390×844, 360px width, 200% zoom, and with the actual mobile keyboard visible; the latter was not measured here.

Suggested command: $impeccable adapt / $impeccable distill.

### 2. P2: Finish the accessible search and validation contract

Live Metazooa's empty search input had role=combobox, aria-expanded=true, and aria-controls pointing to a nonexistent element. This follows the shared Search implementation, which mounts Command.List only when query is nonempty. Colordle, Metazooa, and Travle use this implementation. The visible help text has no id/aria-describedby relationship to the input.

Poople's failed submit showed a useful visible live status, but the input had no aria-invalid or aria-describedby pointing to its error. That makes the field's error state less discoverable when a screen-reader user returns to it. The existing role=status is useful and should be kept.

Sources: colordle/apps/web/src/components/common.tsx:77–124 (same structure in the other local copies); poople/apps/web/src/game/Game.tsx:117–159. The cmdk list is conditionally mounted at common.tsx:104–105. Shared Feedback is at :128–143.

Fix: keep the list/control relationship valid in closed and open states, expose the correct expanded value, connect help and error text to the field, and set aria-invalid only when validation fails. Test actual screen-reader announcements rather than inferring them from color or screenshot. No physical screen reader was run in this assessment.

Suggested command: $impeccable harden.

### 3. P2: Announce successful moves and avoid erasing attempted choices on rejection

Cutle's valid submission changes the visual percentages and heading, but Feedback continues to display static keyboard instructions once error is cleared. The 48–52% success result and split percentages are outside a live status. Travle's successful move updates the route, counters, and next-country label while the live Feedback returns to the same static “Choose a bordering country...” sentence. These updates deserve a concise outcome announcement.

The shared Search always clears query immediately after onChoose, regardless of whether the game accepted the guess. Travle can reject a non-bordering or repeated country, so a rejected selection vanishes and the player has to reconstruct it. This is a source deduction, not a tested invalid-country click. Colordle/Metazooa duplicate guesses share the same risk.

Sources: cutle/apps/web/src/game/Game.tsx:35–45, :169–191, :224–227; travle/apps/web/src/game/Game.tsx:58–62 and :177–180; common.tsx:112–113 in those three searchable games.

Fix: produce a concise outcome status after each accepted cut/country; include the relevant percentage or country/crossing count. Make onChoose return accepted/rejected state, clear only accepted choices, and keep rejected search text available for correction.

Suggested command: $impeccable harden / $impeccable clarify.

### 4. P2: Make puzzle replacement and early reveal feel deliberate

Difficulty changes immediately replace the practice puzzle in every useGame copy. There is no short inline warning or explicit “New puzzle” action at the control. A player can lose a long active ladder/route by exploring difficulty. The code supports separate daily/practice states, which is good, but that preservation does not extend to changing difficulty.

Sources: poople/apps/web/src/lib/session.ts:193–199 (same behavior in all five copies); common.tsx:46–58. Reveal/Show solution actions end the round immediately: poople game/Game.tsx:172–183, colordle :162–168, metazooa :134–140, travle :212–218. They are visually secondary but permanent for the current round; some games have a replay action after completion.

Fix: signal “Changing difficulty starts a new puzzle” beside the control, or apply a queued difficulty on an explicit Next/New puzzle action. For reveal, use an inline second-step confirmation or a reversible answer panel where practical; avoid a modal on every ordinary guess. Validate long in-progress games and return-from-interruption states. This source-level risk was not triggered because Assessment A shares the browser storage origin.

Suggested command: $impeccable harden / $impeccable clarify.

### 5. P2: Make each game-specific explanation teach the next decision

Metazooa already exposes its classification tree and deepest shared ancestor, but “shared nodes” is a structural count. The first-guess empty state sits low in mobile flow and gives no concrete worked example. Add a short example of how sharing Mammalia changes the next guess; retain the accurate caveat that classification depth is not evolutionary time. Sources: metazooa/apps/web/src/game/Game.tsx:114–119, :179–195.

Colordle's match score is precise to two decimal places, while the active loop provides little directional guidance beyond closer/farther. A compact optional “more red / less blue” or visual target-versus-last-guess comparison would reduce blind name guessing without changing the core rules; this would be a new supported feature and must be designed deliberately. The current comparison is only shown after completion. Source: colordle/apps/web/src/game/Game.tsx:50–61, :191 onward.

Travle's map has useful S/G markers and titles, but it is a noninteractive image. Country shapes may suggest clicking, while there are no path pointer or click handlers. Make the search-first action obvious; if click-to-guess is added, pair it with keyboard/search equivalence. This is an expectation risk, not a claim that clicking was advertised. Source: travle/apps/web/src/game/Game.tsx:88–109, :143–154, :170–175.

Suggested command: $impeccable onboard / $impeccable clarify.

## Other concrete improvements

- Cutle sliders update the proposed line while the board still renders the previous split polygons whenever latest && !drag. Distinguish “previous result” from “next cut preview,” or restore the intact shape during adjustment. Source: cutle/game/Game.tsx:113–134, :145–160.
- The shared header/footer links have no aria-current on the active route, observed in Metazooa and present in all five source copies. Add route state without adding navigation items. Source: routes/__root.tsx:55–66.
- Both Poople and Travle can produce a growing chain/route. The CSS already bounds word-chain and guess lists, but keyboard/mobile tests should ensure the active input does not leave the viewport while the board auto-scrolls. Poople currently scrolls the latest ladder row after submission (game/Game.tsx:42–45), which may compete with input focus on small screens; not reproduced through a long game here.
- Typography is readable and purposeful at the sampled viewport. The tiny header/footer and 12–13px helper text are candidates for a mobile legibility pass, but no WCAG failure is asserted from size alone.
- Buttons/selects are 44px high; Cutle range controls are 36px high. A slider hit-area increase is sensible. Navigation text links are smaller than 44px; target-spacing compliance was not measured and is not automatically a failure.

## SEO and technical evidence

### HTTP route samples

All byte counts below are UTF-8 HTML response-body sizes from local HTTP, not compressed transfer sizes, and may vary with generated initial puzzle state.

| Game | Homepage bytes | Support route | Support HTML bytes | Status |
|---|---:|---|---:|---|
| Cutle | 12,659 | /strategy | 4,623 | 200 / 200 |
| Poople | 16,440 | /solver | 7,529 | 200 / 200 |
| Colordle | 12,924 | /color-guide | 30,958 | 200 / 200 |
| Metazooa | 13,395 | /taxonomy-guide | 16,963 | 200 / 200 |
| Travle | 241,209 | /strategy | 4,859 | 200 / 200 |

Each sample had a route-specific title and H1. Cutle /how-to-play was also 200, 5,766 bytes, with its rules and controls title. The local unknown path /not-a-real-page returned a correct 404 but only a 57-byte fragment: Page not found and return link, without a title or branded document shell. This is a modest recovery/consistency improvement, not a soft-404 SEO bug.

All tested normal local routes intentionally emit **noindex,follow** and no canonical. The site.ts implementation only enables indexing when the explicit indexability flag is true and origin starts with HTTPS. The Vite config defines these from SITE_ORIGIN and SITE_INDEXABLE. Therefore missing localhost canonicals/noindex are expected release gates, not defects to remove locally. Check actual-domain canonical, og:url/image, robots and sitemap together only after deployment/domain decisions. Do not claim current search visibility or revenue opportunity from local markup.

Sources: each apps/web/src/site.ts:72 onward; travle/apps/web/vite.config.ts:5; homepage routes/index.tsx:7–28 for VideoGame JSON-LD. Origin-specific OG URLs are conditional. No fabricated reviews/ratings are present in the sampled schema.

Content opportunity: the support pages genuinely help play, so refine them around specific player questions and link back to the relevant game action. Colordle's color guide searches names/aliases but displays hex values; adding hex lookup would match visible content and useful search intent. Its current filter omits c.hex (game/ColorGuide.tsx:7–10). Metazooa's dictionary offers group filtering but no text name search (game/TaxonomyGuide.tsx:4–31); add it if players need to inspect the 130 accepted animals. These are source-backed feature/content opportunities; keyword demand was not measured.

### Travle geometry is the clearest payload target

Live DOM contained **176 map paths and 176 title elements**. The .map-board outerHTML alone was **225,745 characters**. Thus most of its 241KB homepage HTML is map markup; this is directly measured. It renders every mapPaths entry even when the viewBox zooms into a small region (game/Game.tsx:93).

Existing production output (built around 2026-10-24 15:39 UTC) shows:

| Game | Largest index JS, bytes | Largest game/routes/engine chunk, bytes | CSS bytes |
|---|---:|---:|---:|
| Cutle | 348,172 | 48,701 routes | 24,905 |
| Poople | 348,509 | 49,142 engine | 26,437 |
| Colordle | 348,622 | 64,969 routes | 25,228 |
| Metazooa | 349,136 | 90,178 routes | 24,918 |
| Travle | 349,022 | 266,505 routes | 25,274 |

These are raw filesystem bytes in apps/web/dist/client/assets, not gzip/Brotli, not necessarily all initial requests, and not FCP/LCP/INP. They establish a target for investigation, not a performance score. The roughly 348–349KB shared entry suggests common framework/runtime cost; attribution requires a bundle analyzer, which was not run.

Fix priority: simplify map geometry and coordinate precision while preserving border usability; investigate limiting path output to the visible region, static/cached map layers, or otherwise avoiding large geometry duplication between HTML and client bundle. Keep endpoint text and an accessible route description available. Then capture a real initial waterfall and mobile CPU/network profile before changing broad framework architecture. Do not claim an expected percentage speedup without measurement.

Network capture on Colordle returned count=0 with 8 requests filtered out; it is not proof that the page makes no requests. performance resource enumeration returned [] in these bridge captures. Console was sampled after load and may omit earlier navigation messages. No robust network waterfall, transfer compression, cache headers, per-route JS request coverage, cold-load timing, or bundle attribution was obtained.

## Run notes

- Independence: Assessment A and its conclusions were not read. Findings withheld from parent until A-complete release.
- CLI detector: successful, 206 advisory / 0 primary; one capture rerun due initial truncation. Counts and locations retained below; parent need not rerun.
- Ignore files: no per-site critique ignore.md found.
- Browser: five fresh owned tabs, explicit target IDs, background request, five mobile screenshots; desktop DOM measured. No screen-reader or physical-device run.
- Focus/state probes: visible focus confirmed; disabled Undo states confirmed; empty/no-match errors confirmed.
- Overlay: unavailable; no detector script injection, no live server.
- Cleanup: all five owned session leases explicitly released; no server or process left by B. Five screenshots retained as temporary evidence at C:/Users/Sera/AppData/Local/Temp/evidence-b-{game}-mobile.png for parent reuse. No other temporary files were written by B.
- Formal design/heuristic score: deliberately not supplied by B; Assessment A owns holistic judgment.
- Questions skipped: sub-assessment evidence collection; parent owns final user questions.

## 沉淀的脚本

无。本轮是一次性只读审查，现成 Impeccable 与 OpenCLI 命令已覆盖；写入权限仅限本报告，未添加项目脚本或修改应用。采集命令、目标和限制均在本报告记录，截图由现成 CLI 生成。

## Compact detector rule/location inventory

All paths below are within E:/Projects/game-sites/<game>/apps/web/src. All findings are advisory.

### cutle

- design-system-font-size (30): styles.css:89,96,115,128,196,202,259,276,340,355,417,428,458,468,482,504,528,541,546,554,566,584,623,674,678,684,711,737,754,814.
- design-system-radius (4): styles.css:533,590,667,729.
- design-system-color (9): styles.css:630,635,640,643,646,650,696,699,702.

### poople

- design-system-font-size (29): styles.css:89,96,115,128,196,202,259,276,340,355,417,428,458,468,482,504,541,546,554,566,584,623,674,678,684,711,737,754,814.
- design-system-radius (2): styles.css:667,729.
- design-system-color (9): styles.css:630,635,640,643,646,650,696,699,702.

### colordle

- design-system-font-size (31): styles.css:89,96,115,128,196,202,259,276,340,355,417,428,458,468,482,504,528,541,546,554,566,584,623,674,678,684,711,737,754,814,866.
- design-system-radius (4): styles.css:533,590,667,729.
- design-system-color (9): styles.css:630,635,640,643,646,650,696,699,702.

### metazooa

- design-system-font-size (31): game/Game.tsx:191; styles.css:89,96,115,128,196,202,259,276,340,355,417,428,458,468,482,504,528,541,546,554,566,584,623,674,678,684,711,737,754,814.
- design-system-radius (4): styles.css:533,590,667,729.
- design-system-color (9): styles.css:630,635,640,643,646,650,696,699,702.

### travle

- design-system-font-size (31): game/Game.tsx:261; styles.css:89,96,115,128,196,202,259,276,340,355,417,428,458,468,482,504,528,541,546,554,566,584,623,674,678,684,711,737,754,814.
- design-system-radius (4): styles.css:533,590,667,729.
