---
name: Cluster Rush
description: A slate and amber frame for keyboard-first truck parkour.
colors:
  bg: "#191d21"
  panel: "#22282e"
  ink: "#f4f1e9"
  muted: "#b3bac0"
  accent: "#ffb06c"
  line: "#41484f"
  player: "#111518"
  accent-hover: "#ffc28d"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(28px, 3vw, 42px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.025em"
  article-display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(32px, 5vw, 48px)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-.035em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "15px"
    lineHeight: 1.6
  navigation:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "14px"
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "13px"
    lineHeight: 1.6
  caption:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
rounded:
  key: "4px"
  control: "7px"
  player: "12px"
spacing:
  tight: "8px"
  control: "12px"
  group: "16px"
  section: "24px"
  page: "40px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.bg}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 13px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "7px 13px"
  button-outline-hover:
    backgroundColor: "{colors.panel}"
  keycap:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    padding: "5px 7px"
  player:
    backgroundColor: "{colors.player}"
    rounded: "{rounded.player}"
  navigation:
    textColor: "{colors.muted}"
    typography: "{typography.navigation}"
  faq:
    textColor: "{colors.ink}"
    padding: "18px 0"
---

# Design System: Cluster Rush

## Overview

**Creative North Star: "Game-first slate stage"**

This names the implemented direction rather than an approved concept. The site surrounds a large external Unity player with dark slate, warm ivory text, and amber actions. Compact page controls support play; instructional prose follows the player in a quieter tone.

The system belongs to this local static site. The cross-origin game's artwork, interface, loading progress, and input behavior are outside its visual ownership. Source evidence is `style.css`, `index.html`, and `app.js`, reconciled with `PRODUCT.md` and the research direction contract. There is no approved comp or concept seed. This document records the build without certifying runtime behavior or release readiness.

**Key Characteristics:**
- Dark tonal framing with restrained amber emphasis.
- Self-hosted Figtree and compact, sentence-case controls.
- A dominant player, visible keyboard instructions, and flat supporting content.
- Geometric SVG marks and CSS disclosure indicators.

## Colors

Warm text and amber actions sit against cool slate surfaces; the frontmatter preserves the source color values.

### Primary
- **Amber** (`accent`): fullscreen action, title companion line, text links, disclosure indicators, focus outlines, and selection.
- **Light amber** (`accent-hover`): primary action hover feedback.

### Neutral
- **Slate** (`bg`): page canvas and text on the primary action.
- **Raised slate** (`panel`): keycaps, reload confirmation strip, and outlined action hover.
- **Ivory** (`ink`): headings, wordmark, controls, and FAQ questions.
- **Cool silver** (`muted`): navigation, support prose, captions, and status.
- **Slate line** (`line`): separators, keycap edges, outlined actions, and scrollbar thumb.
- **Near black** (`player`): player frame and stage surround.

**The Action Amber Rule.** Use amber for actionable or orienting elements, following the existing controls, links, focus, and disclosure patterns.

## Typography

**Display Font:** Figtree, with system-ui and sans-serif fallbacks.
**Body Font:** Figtree, with the same fallbacks.

The local variable font is loaded from `assets/fonts/Figtree-Latin.woff2` with `font-display: swap` and a declared weight range of 400–700. Its SIL OFL license is retained beside it. Fallbacks provide loading resilience; they are not the intended display voice.

### Hierarchy
- **Display:** the frontmatter display role serves the game title.
- **Article display:** the larger fluid role serves static article titles.
- **Headline:** section headings use the headline role; phone headings and article subheadings use 24px.
- **Body:** the body role supplies the page rhythm. Intro prose stops at 65ch; FAQ and article prose stop at 72ch.
- **Navigation:** navigation and support links use 14px; phone navigation uses 12px.
- **Label:** toolbar controls and keyboard instructions use 13px; phone controls use 12px.
- **Caption:** status, footer, and keycaps use 12px. Keycaps use a tighter line height of 1.2.

## Layout

Header, main, and footer share a centered maximum width of 1440px and desktop side padding of 40px. At a minimum viewport width of 1800px, the maximum grows to 1560px. The intro and FAQ stop at 1140px; article content stops at 800px.

The title, toolbar, player, and key instructions form a close group. The desktop stage height is `min(70svh, 760px)` with a 320px minimum; its iframe width is `min(100%, 105svh, 1140px)`. Wide screens raise these limits to 900px and 1350px. This constrains the frame toward 3:2 without promising a fixed desktop ratio at every viewport size.

Below the player, the intro uses two columns in a 1.3:1 ratio with a 90px gap and 52px top separation. The recurring spacing steps are recorded above; component-specific padding remains local.

At 760px and below, main side padding becomes 16px, header/footer padding becomes 20px, and the stage uses a 3:2 aspect ratio. The toolbar label disappears, actions use at least 44px height, keyboard hints wrap, intro columns stack, and the footer stacks. A visible note discloses unverified touch-only play. Focus mode and fullscreen expand the player to the viewport and remove its corner rounding.

**The Player First Rule.** Keep page controls next to the player and instructional content below it, preserving the implemented reading order.

## Elevation & Depth

The source has no box shadows. Depth comes from the near-black player against the slate canvas, lighter keycaps and confirmation strip, and thin separators. No entrance animation or authored transition is present. The reduced-motion media query disables animation, transitions, and smooth scrolling where applicable.

## Shapes

The player uses softly rounded, clipped corners. Controls use smaller rounded rectangles; keycaps use tight corners with a thicker bottom edge. FAQ rows remain flat with horizontal separators. The truck mark and fullscreen icon are authored stroke SVG; FAQ plus/minus indicators are drawn with CSS rectangles. Keyboard arrows are literal key labels, not a decorative icon family.

## Components

### Buttons

Compact, readable page actions sit in a tight toolbar. The amber fullscreen action uses bold text and an inline stroke SVG. Reload and focus actions are transparent with a one-pixel line border; hover raises their surface tone and lightens their border. Desktop minimum height is 38px; phone minimum height is 44px. Disabled buttons use wait cursors and 0.6 opacity. No active-state transform is defined.

Keyboard focus on buttons, links, and summaries uses a two-pixel amber outline with five-pixel offset. The skip link becomes visible on focus. The reload confirmation is an inline strip with two ordinary outlined actions; JavaScript moves focus to the cancel action on opening and returns it to Reload on cancel.

### Player / Containers

The player is the signature container, with clipped corners, near-black surround, a compact action bar, and a muted status footer. Supporting editorial content stays directly on the page canvas. Focus mode is a fixed, viewport-filling player with a flexible stage. Fullscreen has a similar source-defined presentation and a focus-mode fallback; browser support and successful game loading remain runtime concerns.

### Keycaps

Keyboard tokens use raised slate, ivory text, a one-pixel border with a two-pixel bottom edge, and a 24px minimum width. Group keys with their actual action labels. These are instructions, not interactive chips.

### Navigation

Two muted text links sit beside the geometric truck wordmark. Hover changes navigation text to amber. Phone treatment reduces type and spacing while preserving the links. Article links and inline help links carry amber, with underlines retained or exposed on hover according to their source context.

### FAQ Disclosure

Native details/summary rows use top separators and a closing bottom separator. Bold questions precede muted answers. The CSS horizontal and vertical rectangles form the closed plus; opening removes the vertical stroke. Earlier glyph declarations are overridden in the cascade and do not define the visual system.

## Do's and Don'ts

### Do:
- **Do** use the local Figtree font and retain its license when reusing the asset.
- **Do** preserve amber keyboard focus and the existing geometric indicator language.
- **Do** keep control labels literal and keyboard instructions accurate.
- **Do** distinguish the host page's visual system from the external game's interface.

### Don't:
- **Don't** inherit the repository root's Coreball design system into this app.
- **Don't** add decorative illustration, a sidebar catalog, or invented game progress to this game-first frame.
- **Don't** represent responsive page layout as verified touch gameplay or embedding permission.

Not canonized: superseded FAQ glyph declarations remain in the stylesheet but are overridden by CSS geometry; they are source cleanup drift, not an icon rule. No repair was made in this documentation-only pass. Motion absence is recorded as an implementation limit, not elevated into a ban on future motion.
