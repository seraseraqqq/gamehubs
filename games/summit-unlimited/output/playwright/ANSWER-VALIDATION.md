# Answer validation regression — 2026-10-23

## Root cause and behavior change

The original `rarity()` function assigned an estimated score to every string missing from a tiny answer table. It also used a normal object lookup, allowing inherited names such as `constructor` to return non-numeric values. This was a correctness defect; missing entries were not validated answers.

`answer-bank.js` now builds a separate Map for each prompt. A match must be a canonical answer or explicitly authored alias. Unknown inputs return an explicit rejected result with zero score; arbitrary punctuation is not erased to manufacture a valid answer. Normalization covers case, whitespace, full-width text and apostrophe/hyphen variants. Wrong-category answers and close spellings are not silently accepted.

The authored lists contain 137 canonical entries across seven prompts. Lists are deliberately finite and can reject reasonable answers that have not been added. They are not semantic AI validation or a copy of the complete Krillion database. Unsupported examples in the old prototype's space-orbit/night-sky tables were removed during curation.

Rejected submissions keep the existing deadline, round, scene and score; feedback and aria-invalid indicate rejection. Typing clears the error indicator. Submit checks the absolute deadline as well as the timer callback, so late answers earn zero. Timeout/pass continue to move the narrative route forward at zero points.

Validated best scores use `starling-validated-v1-best`, keeping inflated prototype records out of the current scoreboard. Old stored data is left untouched.

## Automated checks

`node --test tests/answer-validation.test.cjs`: six tests passed. Covers 250 generated garbage strings plus symbols, markup, object/prototype names, wrong-category answers, aliases, Unicode normalization, close spellings, empty/oversized/badly typed inputs, invalid round IDs, and every authored entry/alias.

JavaScript syntax checks and source/generated SEO checks passed. The static publisher copies the new answer-bank.js dependency.

## Browser checks

- Seven-round reduced-motion run: submit a wrong answer each round, assert unchanged round/scene/score/deadline, then submit a valid answer. Final score: 1,850 points. Duplicate resolve during travel did not add points.
- Accepted sequence: water bottle / europa / rock / io / planet / orion / stars.
- Titan was rejected for the Jupiter-moon prompt; the answer module accepts it for the solar-system-moon prompt.
- Seeded the legacy best-score key with 999999: current record started at zero. Finishing and restarting preserved the validated 1,850-point record and reset the run score.
- 390 × 844 mobile run: multiple invalid attempts kept the original deadline. A real 25-second timeout advanced at zero points. Pass advanced at zero points. An expired deadline plus valid submitted answer also advanced at zero points.
- Empty required input failed form validity. No observed page errors or horizontal overflow.
- The seven-round flow used reduced motion to shorten travel only. The real timer test waited the normal 25 seconds. A separate expired-submit test set the deadline into the past to exercise that race path deterministically.

Screenshots: answer-validation-invalid.png and answer-validation-mobile.png.
