---
name: Acceleration City player page
description: A restrained dark frame for the original CS2N game.
colors:
  page: "#101716"
  surface: "#18211f"
  screen: "#0a0e0d"
  ink: "#f0f4eb"
  muted: "#b5c4bb"
  line: "#33423b"
  accent: "#a8e0c0"
  accent-ink: "#102a1d"
  focus: "#f1ca84"
  action-hover: "#c7ecd5"
  quiet-hover: "#2c3e34"
typography:
  title:
    fontSize: "clamp(22px, 2.3vw, 30px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  headline:
    fontSize: "clamp(24px, 2.7vw, 36px)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  body:
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontSize: "13px"
    fontWeight: 400
rounded:
  quiet-control: "4px"
  primary-control: "6px"
  game-surface: "12px"
spacing:
  compact: "8px"
  control-gap: "12px"
  group: "16px"
  section-gap: "24px"
  section-inset: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.primary-control}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.action-hover}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.quiet-control}"
    padding: "10px 13px"
  game-surface:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.game-surface}"
---

# Design System: Acceleration City player page

## Overview

**Creative North Star: "The Quiet Game Frame"** — descriptive shorthand for the user's confirmed dark, simple direction, rather than a new identity claim.

Scope is only `games/acceleration-city`; the root Coreball world does not apply. The current code places the original game inside a restrained dark frame with legible controls and subdued instructions. It does not restyle the cross-origin game itself.

**Key Characteristics:**
- Dark tonal surfaces and warm white text.
- Pale green actions and an original geometric A mark.
- Flat ruled reading sections.

This is a source-derived code-led record with no approved raster comp. The final review disposition is **recapture**: mobile, final inline confirmation and height changes lack browser captures; native fullscreen success is not established.

## Colors

Near-black green surfaces support the original game's colors without adding a competing illustrated world.

### Primary
- **Pale green action** (`accent`): actions, useful links and the mark; `accent-ink` supplies dark text and `action-hover` lightens primary hover.
- **Warm focus** (`focus`): keyboard outlines on links, buttons, summaries and focusable regions.

### Neutral
- **Dark frame** (`page`), **toolbar surface** (`surface`) and **loading ground** (`screen`) separate regions by tone.
- **Warm white ink** (`ink`) and **muted green ink** (`muted`) distinguish primary and supporting copy.
- **Foliage divider** (`line`) defines rules and outlined controls; `quiet-hover` marks hovered or selected toolbar actions.

**The Quiet Frame Rule.** Wrapper color identifies actions while original game graphics remain authoritative inside the frame.

## Typography

**Current body font:** the frontmatter system sans stack. Headings currently inherit it; this is a source observation, not a reusable own-world display prescription.

Authored weights are regular (400) and semibold (600). Homepage title and section headlines use the frontmatter roles. The launch headline grows from 28px to 44px; reading titles grow from 36px to 56px, becoming 36px below 560px. Reading headings use 26px and 20px. Body is 16px at 1.6 line height, typically bounded to 70ch. Navigation uses 14px, metadata 12px, and toolbar labels 13px, becoming 12px on small screens.

## Layout

The wrapper caps at 1580px with 64px total gutter. Below 900px the gutter becomes 40px; below 560px it becomes 28px. Desktop stage height is `min(810px, calc(100svh - 230px))`, minimum 420px. At 900px it becomes `min(66vh, 620px)`, minimum 360px; at 560px it uses 58svh with the same minimum.

Introduction and FAQ use a 1:1.4 grid, 64px gap and 48px block inset. They stack below 900px with a 24px gap; the inset becomes 32px below 560px. Reading width caps at 840px. The toolbar stacks its status and distributed action row below 900px. Mobile copy separates wrapper responsiveness from original keyboard input.

Final focus/fullscreen rules use a 100dvh flex column: stage flexes, toolbar and inline confirmation retain their height. These supersede the earlier fixed stage-height rules. Below 560px the confirmation stacks its warning above its actions.

## Elevation & Depth

No wrapper box shadows are authored. Tonal grounds, thin rules and clipping define depth. Keyboard focus uses a 3px outline with 5px offset. Selection uses action fill and dark action ink. Loading feedback overlays the stage without decorative glow.

## Shapes

Game surface radius is 12px; primary controls use 6px and quiet controls 4px. Focus view removes the surface radius. The A mark is crisp original line geometry; small interface SVGs use consistent strokes or simple fills, rather than new game illustrations.

## Components

### Buttons
Primary actions use the accent pair, 54px minimum height and the recorded padding. Quiet toolbar actions use transparent fill and 44px minimum height. Hover adds a tonal fill; selected focus view exposes `aria-pressed`. Disabled toolbar controls use .42 opacity. Color transitions use .16s ease-out only when reduced motion is not requested.

### Game frame and loading
Play creates the official iframe on demand. Source load says the game may still be initializing; a delayed hint exposes recovery help. Focus view hides surrounding content while retaining its exit. Fullscreen failure falls back to focus view.

### Inline reload confirmation
A non-modal group below the toolbar contains the warning and **Reload game / Keep playing**. Default focus selects cancellation; Escape dismisses it. A one-pixel top rule, 12px by 20px inset and 44px action minimum separate it from gameplay. Confirmation alone replaces the iframe. Final visual evidence for this state is outstanding.

### Navigation and disclosures
Navigation uses simple semibold branding and muted links, underlining on hover. The skip link retains dark action ink on hover. The About header link hides below 560px; footer navigation remains. Help and FAQ use native details/summary controls with spacing and rules.

### Motion
The launch mark has one .55s clip-path reveal using `cubic-bezier(.16,1,.3,1)`. This and interface color transitions are suppressed under reduced motion. The wrapper imposes no motion rules on the third-party game.

## Do's and Don'ts

### Do:
- **Do** keep this system scoped to Acceleration City.
- **Do** preserve the user's dark, restrained frame and game-first hierarchy.
- **Do** retain explicit focus, recovery and cancellation states.
- **Do** distinguish wrapper responsiveness from original game input support.

### Don't:
- **Don't** inherit Coreball's cream, peach or paw materials.
- **Don't** describe captured original game imagery as original wrapper artwork.
- **Don't** treat source-load feedback as proof of Unity readiness.
- **Don't** claim the outstanding responsive/fullscreen review is complete.

Not canonized or repaired: the inherited system heading face is recorded as implementation rather than a reusable own-world display prescription. Detector findings and final visual evidence remain subject to recapture; documentation does not certify their resolution.
