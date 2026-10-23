---
name: Coreball cat playroom
description: Visual system for games/coreball only, derived from the completed playable page and guide.
colors:
  paper: "#f8f6ed"
  ink: "#293f35"
  muted: "#5b6c60"
  green: "#355e4b"
  green-dark: "#244635"
  play-surface: "#e6eddf"
  line: "#cbd6c5"
  coral: "#f4ab90"
  button-cream: "#fffdf4"
  selected-cream: "#fffdf5"
  mode-tray: "#cdddc6"
  quiet-hover: "#e7eddc"
  level-rest: "#f0f2e8"
  focus: "#a84d30"
  toy-ivory: "#fff0d5"
  toy-outline: "#bd987b"
  toy-peach: "#f4c7aa"
  toy-peach-outline: "#ba8c73"
  paw-ivory: "#fff2d9"
  paw-outline: "#bf9b7b"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "43px"
    fontWeight: 800
    lineHeight: 1.16
    letterSpacing: "-.035em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-.025em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "19px"
    fontWeight: 750
    letterSpacing: "-.02em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.65
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
rounded:
  surface: "16px"
  primary: "12px"
  level: "9px"
  quiet: "24px"
  mode: "23px"
  mode-tray: "28px"
spacing:
  grid-gap: "8px"
  control-gap: "12px"
  desktop-gutter: "34px"
  mobile-gutter: "17px"
components:
  button-primary:
    backgroundColor: "{colors.green}"
    textColor: "{colors.button-cream}"
    rounded: "{rounded.primary}"
    padding: "12px 25px"
  button-primary-hover:
    backgroundColor: "{colors.green-dark}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.quiet}"
    padding: "8px 17px"
  button-round:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "50%"
    width: "40px"
    height: "40px"
  mode-selected:
    backgroundColor: "{colors.selected-cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.mode}"
    padding: "7px 17px"
  level-button:
    backgroundColor: "{colors.level-rest}"
    rounded: "{rounded.level}"
  level-selected:
    backgroundColor: "{colors.coral}"
    textColor: "#412c21"
    rounded: "{rounded.level}"
  game-surface:
    backgroundColor: "{colors.play-surface}"
    rounded: "{rounded.surface}"
---

# Design System: Coreball cat playroom

## Overview

**Creative North Star: "Coreball cat playroom"**

This system governs only `games/coreball/index.html`, `games/coreball/coreball-tips.html`, and their shared Coreball components. It does not govern other games in this repository. Cream paper, moss lettering and a sage play surface frame a soft peach timing toy. The game remains the dominant object; the surrounding controls are quiet and compact.

The shipped scene combines a shaded procedural fur sphere with flat toy pins and cropped cat mittens. The latest confirmed direction rejects the seated side kitten and pixel paws: the mittens are smooth, closed and seen directly overhead. Their vertical launch gestures and local impact feedback accompany the puzzle without becoming obstacles. This is a source-derived record of a code-first implementation; no approved comp is claimed.

**Key Characteristics:**
- Cream and sage framing with moss controls.
- Locally hosted Figtree throughout.
- Peach fur, filled toy pins and smooth overhead mittens.
- Event-driven feedback with reduced-motion support.

## Colors

Warm neutrals and muted greens let peach game materials and the coral selected level carry emphasis.

### Primary
- **Moss green** (`green`, `green-dark`): primary actions and their hover state.

### Secondary
- **Soft coral** (`coral`): selected level, supported by a darker tan border and dark brown text.
- **Toy peach and ivory** (`toy-peach`, `toy-ivory`): distinguish newly placed and waiting pins from the initial ivory pins; matching tan outlines keep both forms legible.

### Neutral
- **Cream paper** (`paper`): page and reset dialog.
- **Moss ink and muted foliage** (`ink`, `muted`): readable primary and supporting copy.
- **Pale sage** (`play-surface`): the final game container, overriding the earlier mint background.
- **Foliage line** (`line`): navigation, guide, FAQ and record dividers.
- **Ivory mitten** (`paw-ivory`, `paw-outline`): the flat paw silhouette; toe seams are lighter and do not become pads.
- **Rust focus** (`focus`): visible keyboard outline.

### Named Rules
**The Material Match Rule.** Waiting, flying and attached pins share filled shafts, tan outlines and round heads; color may distinguish placement state without changing that construction.

## Typography

**Display Font:** Figtree (system-ui, sans-serif fallback).
**Body Font:** Figtree (system-ui, sans-serif fallback).

**Character:** Rounded, compact lettering keeps the friendly materials readable. The locally hosted variable face provides the hierarchy through size and weight rather than a second display family.

### Hierarchy
- **Display:** Coreball heading uses the frontmatter display role; it becomes 37px at 600px. At that breakpoint its inherited line height is 1.1. The guide uses a separate `clamp(30px,4vw,43px)` heading and 30px on mobile.
- **Headline:** guide-section headings use the headline role, becoming 25px on mobile. The article uses 26px/1.3 headings, becoming 23px on mobile.
- **Title:** level-picker heading uses the title role, becoming 17px on mobile. Current level is 20px/800, becoming 16px.
- **Body:** base text uses the body role. Homepage guide paragraphs are 14px/1.9 and mobile 12px; article paragraphs retain 1.85 line height and mobile 14px.
- **Label:** modes, records, hints and supporting controls use 12px. Header navigation is 13px/550, becoming 12px on mobile. No uppercase eyebrow style is part of the system.

## Layout

The page shell caps at 1140px with centered margins. Side padding steps from the desktop gutter to 25px at 900px, the mobile gutter at 600px and 12px at 360px. The centered play scene caps at 550px. Its SVG uses a 500 by 510 viewBox, and the fur canvas aligns to the same core through percentage sizing and positioning.

The level grid uses 15 columns with the grid gap, then 10 columns at 900px and six at 600px with a 7px gap. Level buttons retain a 42px minimum height. The homepage guide changes from a two-column 1:1.5 grid to one column at 600px; the article caps at 780px with scrollable tables.

Round information sits above the scene; cropped paws occupy the launch end of the same vertical play axis. The launch button caps at 430px on desktop and fills the available mobile width. Desktop card controls use 28px side insets; mobile uses 15px at the top and 14px at the footer. Compact navigation hides the first homepage link at 600px and all header links at 360px.

## Elevation & Depth

Depth is selective: diffuse surface shadows separate the play area and overlays, while the sphere earns its volume through light and procedural filaments. Pins and paws stay flat; paws explicitly carry no CSS filter shadow. Borders and tonal fills define the small controls.

### Shadow Vocabulary
- **Game surface:** `0 14px 35px #40573b0d`, the final card override.
- **Primary hover:** `0 6px 14px #2f503321`.
- **Selected mode:** `0 2px 5px #3f5c3520`.
- **Outcome overlay:** `0 12px 38px #48633f24`.
- **Reset dialog:** `0 18px 60px #263e3550` over a translucent moss backdrop.

## Shapes

Soft rectangles organize the interface: surface corners use the surface radius, primary actions the primary radius, and numbered level buttons the level radius. Quiet controls and segmented modes use pill curves; the pause control is circular.

Paws are original smooth closed mitten paths with straight vertical wrists and three short toe seams. Their overhead silhouette has no pads, spread thumb, perspective or rotation. Pin shafts use a rounded outer stroke (7 SVG units) and filled inner stroke (4 SVG units), with round heads and tan borders. The fur shader uses diffuse and rim lighting with 5,200 curved filaments; it does not add sine-wave surface stripes.

## Components

### Buttons
Friendly and substantial primary actions use the primary button tokens, weight 750, and a 50px minimum height. Launch is 54px high on desktop and 51px on mobile. Hover darkens the fill and adds diffuse depth; active translates down 2px. Disabled primary controls use .55 opacity. Quiet controls use thin foliage borders, transparent backgrounds and a pale hover fill; pause is a compact outlined circle.

All interactive controls preserve the rust focus outline (3px with 5px offset). The restart action is an underlined text button with a 30px minimum height.

### Mode Selector
A darker sage pill tray groups Challenge and Practice. Selected mode uses a cream fill and small ambient shadow; inactive mode stays transparent. State is exposed through `aria-pressed`.

### Level Picker
Numbered softly rounded buttons have a muted neutral fill and thin border. Hover adds sage fill and strengthens the border; coral identifies selection, and a small green dot indicates completion independently of selection.

### Cards / Containers
The game surface clips its contents at rounded corners and uses the faint game shadow. The result overlay is a centered cream panel with a larger shadow, a direct heading, short explanation and primary action. A native dialog uses the same cream material for resetting progress. The guide and FAQ use ruled sections rather than a grid of floating cards.

### Navigation
Simple text links carry the page navigation. Homepage branding uses a heavier Figtree wordmark and an inline paw SVG; hover underlines the navigation text. The guide uses text branding and a breadcrumb, preserving the shared shell and ink palette.

### Timing Toy and Feedback
The centered sphere is rendered in WebGL with a peach radial-gradient fallback when WebGL is unavailable or lost. The rotating pins and waiting and flying pins share the same complete toy form. The paw canvas is drawn locally by `paws.js`, without external sprites.

Launches trigger a 500ms vertical anticipation and swat. Success emits a local ring and six small fragments; a streak of at least three raises the count to ten and expands the spread. A collision emits six muted rose fragments. Impact effects last .5s and are removed after 600ms. Happy reactions lift the paws vertically; neither paw rotates. Decorative fur bounce, paw motion, impacts, celebration and smooth scrolling are suppressed under reduced motion, while necessary gameplay rotation remains.

## Do's and Don'ts

### Do:
- **Do** keep this system scoped to games/coreball.
- **Do** use the final sage game surface and shared cream page material.
- **Do** preserve visible keyboard focus and reduced-motion behavior.
- **Do** keep waiting, flying and attached pins visually consistent.
- **Do** tie paw gestures and localized feedback to gameplay events.

### Don't:
- **Don't** restore the seated side kitten or pixel paws rejected by the owner.
- **Don't** add paw pads, spread thumbs, oblique perspective or rotation to the overhead mittens.
- **Don't** replace filled toy pins with thin metallic lines.
- **Don't** add dark ripple stripes to the smooth peach fur.
- **Don't** turn paws or decorative feedback into collision obstacles.

Not canonized or repaired: obsolete pearl/rose pin gradients and earlier overridden CSS remain in source; they are superseded implementation residue, not reusable rules. No source cleanup was authorized in this documentation pass.
