# Timeout must not advance flight — 2026-10-23

## Cause and fix

The previous answer-validation patch removed fallback points but still sent accepted answers and timeout/pass through the same scene travel code. The destination was also based on question number, so a later correct answer could jump over missed sectors.

The controller now records each round as correct, timeout or pass. Only correct rounds call launchWhoosh(), flightScene.travel() and setScene(). Timeout/pass show a NO BOOST message, keep distance and world state, and move to the next prompt. Correct answers advance from current stage + 1. The completion screen uses actual stage and correct-answer count. Round pips distinguish missed prompts from correct ones.

## Browser verification

- Normal-motion mobile 390 × 844: started a round and waited the real 25 seconds without typing. On the next prompt: score=0, distance=0 km, controller stage=0, scene stage=0, travel calls=[], one missed pip, feedback TIME UP / +0 PTS. NO BOOST.
- Answered the second prompt with europa: score=720, stage=1 and travel calls=[1]. No catch-up jump to stage 2.
- Passed the third prompt: same stage=1, same score=720, no additional travel call.
- Reduced-motion full zero-answer run used expired deadlines to exercise seven misses quickly. Result: stage=0, score=0, seven missed pips, no travel calls, STILL ON THE LAUNCH PAD, 0 OF 7 CORRECT, rarest answer=—.
- One pass plus six correct: stage=6, score=1710, MILKY WAY / 6 OF 7 CORRECT, JOURNEY INCOMPLETE.
- Restart cleared missed indicators. Seven correct with an invalid retry per prompt: stage=7, score=1850, seven correct pips, COSMIC HORIZON / 7 OF 7 CORRECT.
- No observed browser page errors.

Screenshots: timeout-no-boost-mobile.png and timeout-zero-result.png.

## Repeatable checks

node --test tests/*.test.cjs

Eleven tests pass. In addition to answer matching, the controller regression suite executes the real game.js with a small DOM, clock and scene adapter, checking timer expiry, pass, the next correct destination, zero/partial/full results, restart, repeated submission and expired valid submission. It does not replace the real-time browser check above.
