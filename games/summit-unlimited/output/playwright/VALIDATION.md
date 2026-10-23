# Pixel redesign browser verification · 2026-10-23

Local target: http://127.0.0.1:4173/ (static Python server).

## Functional checks

- Normal-motion seven-round run: atmosphere → Moon → Mars → Jupiter → solar system → Milky Way → cosmic horizon. Result: **6,010 PTS**, matching the seven chosen curated answers.
- Reduced-motion seven-round run: same destinations and score; all seven progress pips completed.
- Empty answer did not advance; two consecutive submit events advanced only one round.
- Restart returned to Earth with zero score and a fresh 25-second timer.
- Passing advanced the route with zero score. Expiring a deadline also advanced with zero score.
- Sound button toggled its audio state and accessible pressed state; help opened and closed with Escape.
- Fresh local runs emitted no JavaScript errors and requested no external runtime assets.

## Visual and motion checks

- Desktop captures: 1440 × 900. Portrait captures: 390 × 844 and 320 × 700. Layout bounds also checked at widths 768 and 1440.
- The longest distance label (384,400 km) fits the 320px instrument. Prompt and input fit the viewport without horizontal scrolling.
- Consecutive canvas captures differed while the player waited on the launch pad: environment motion continues before submission.
- With reduced motion enabled, idle canvas captures stayed identical.
- Resizing under reduced motion renders one fresh frame. This check caught and fixed an initially black canvas after resize.
- Short portrait layout keeps the location label above the prompt (14px clearance at 320 × 700).
- The normal flight run exercised all three transition treatments. `pixel-flight-motion.gif` is a 54-frame browser capture of idle motion, answer feedback and launch, approximately 5.4 seconds; it is not a generated concept animation.

## Practical limits

Automated browser checks covered Chromium. Physical mobile keyboard behavior, Safari/Firefox, perceived loudness and musical quality still benefit from real-device review. Rarity scoring remains the documented local prototype.
