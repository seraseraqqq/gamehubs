# Costcodle Unlimited

An authentic, responsive, zero-dependency price guessing game modeled after Wordle and Tradle, designed for the primary keyword **`costcodle`** and secondary differentiator **`costcodle unlimited`**.

## Keyword Matrix

* **Primary Keyword**: `costcodle` (Monthly Volume: ~18,100, KD: 0)
* **Secondary / Differentiator Keyword**: `costcodle unlimited` (Addresses the top player pain-point: original game limits players to 1 puzzle per day)
* **Long-Tail Variants**:
  * `costcodle game`
  * `costcodle today`
  * `guess costco price game`
  * `play costcodle free`
  * `costcodle archive`

## Key Gameplay Features

1. **Dual Play Modes**:
   * **Daily Mode**: A deterministic daily challenge based on today's UTC calendar date. All players worldwide receive the same product.
   * **Unlimited Mode**: Infinite continuous replay mode drawing from a curated database of 35+ real Costco wholesale items.
2. **Authentic Tolerances**:
   * Red indicator: Off by >25% (Cold)
   * Yellow indicator: Within 25% (Warm)
   * Green indicator: Within 5% (Win!)
3. **Zadely Neo-Brutalist Aesthetic**:
   * Graphic paper grid background
   * `Dela Gothic One` + `Figtree` typography
   * Hard ink offset drop shadows
   * Tactile buttons and quick adjustment chips (+$1, +$5, +$20, +$100, Clear)
4. **Web Audio API**:
   * Dynamic synthesized sound effects for win chords, warm chimes, and cold thuds.
5. **Local Persistence**:
   * High streaks, win percentage, guess distribution, and daily completion records.
6. **Legal Compliance**:
   * Prominent non-affiliation disclaimer regarding Costco Wholesale Corporation.

## Deployment

Deployable directly to Vercel via:
```bash
cd games/costcodle
vercel deploy --prod
```
