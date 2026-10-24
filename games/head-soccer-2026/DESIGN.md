---
name: Head Soccer 2026
description: A simple football frame around an immediately playable match.
colors:
  paper: "#f4f3e9"
  ink: "#173b31"
  muted: "#52665b"
  line: "#ccd4c7"
  green: "#214f3c"
  orange: "#d54c23"
  cream: "#f9f9ef"
  lime: "#e3ed91"
  dark: "#132e25"
  primary-hover: "#eff7b5"
  toolbar-hover: "#e0e5d9"
  tab-surface: "#e3e7db"
typography:
  display:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(32px, 4vw, 48px)"
    fontWeight: 850
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "clamp(27px, 3vw, 36px)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "16px"
    lineHeight: 1.75
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
rounded:
  small: "4px"
  control: "6px"
  player-mobile: "8px"
  player: "12px"
spacing:
  small: "8px"
  compact: "12px"
  normal: "16px"
  medium: "20px"
  section: "24px"
  wide: "28px"
components:
  button-primary:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "16px 22px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-toolbar:
    textColor: "{colors.ink}"
    rounded: "{rounded.small}"
    padding: "10px 8px"
    typography: "{typography.label}"
  tab-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.small}"
    typography: "{typography.label}"
  player:
    backgroundColor: "{colors.dark}"
    rounded: "{rounded.player}"
  keycap:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.small}"
    padding: "3px 6px"
    height: "29px"
---

# Design System: Head Soccer 2026

## Overview

**Creative North Star: "The Simple Football Frame"**

The user chose game-first/simple-football. A saturated pitch, compact heavy headings and clear keyboard instructions sit within a warm paper surround. Football geometry supplies the identity; quiet dividers organize supporting copy.

This system covers this game’s static website and support pages. The cross-origin game retains its provider interface. The record follows shipped source and final desktop/mobile screenshots; no approved bitmap comp exists. Coreball-specific commitments in root PRODUCT.md do not apply here.

**Key Characteristics:**
- Field green and lime within a pale paper page.
- Locally hosted Figtree with compact heavy headings.
- Flat ruled sections and small rectangular controls.
- Pitch markings and original geometric SVG icons.

## Colors

### Primary
- **Field Green** (green): saturated launcher field.
- **Match Lime** (lime): primary play action and text selection.

### Secondary
- **Whistle Orange** (orange): title year, whistle drawing and focus outlines.

### Neutral
- **Paper** (paper): page background.
- **Deep Ink** (ink): reading text and selected control tab.
- **Muted Green** (muted): secondary copy and provider information.
- **Rule Green** (line): thin structural dividers.
- **Chalk Cream** (cream): launcher heading, selected-tab text and keycaps.
- **Frame Dark** (dark): player background before launcher or iframe covers it.
- Primary-hover, toolbar-hover and tab-surface are implemented interaction surfaces.

**The Field and Paper Rule.** Reserve the saturated field for the player; keep instructional and article surfaces on paper.

## Typography

**Display Font:** Figtree, with system-ui and sans-serif fallbacks.
**Body Font:** the same locally hosted variable Figtree family.

Heavy, closely spaced headings establish the compact sports character. Reading text uses generous leading. There is no separate display or monospace family.

### Hierarchy
- **Display:** page H1, following the display token; article H1 becomes (35px) on phones.
- **Headline:** lower-page section headings, following the headline token.
- **Title:** controls heading, growing to (23px) on phones. Launcher headline uses (800), (clamp(27px, 3.1vw, 42px)), (1.04) leading and (-0.025em) tracking; intermediate/phone overrides are (30px)/(27px).
- **Body:** introduction and article paragraphs, maximum (70ch); reduced to (15px) on phones.
- **Label:** toolbar and tab controls. Final readability overrides resolve status, provider and launcher helper copy to (12px). Navigation is (14px, 650), reduced to (12px) on phones.
- **Key legend:** Figtree (14px, 650). Arrow characters name real keyboard keys.

## Layout

The centered shell caps at (1260px) with (32px) side gutters. At viewport widths of at least (1600px), it caps at (1380px) with (48px) gutters. The desktop arena pairs a flexible player with a (252px) controls rail and (28px) gap; the wide variant uses (272px)/(36px).

At at most (1000px), gutters become (20px), the rail (220px), the gap (22px), and toolbar content stacks. At at most (760px), gutters become (16px), controls move below the player, and the toolbar returns to a row. The player changes from (16:9) to (16:10). Keyboard rows wrap horizontally on phones.

Below-player sections use a (1:1.45) column ratio and (80px) gap, reduced to (36px) at the intermediate breakpoint and one column on phones. Reading pages use an (800px) article column. Spacing expands beyond the compact control rhythm; this is not a strict modular scale.

Focus mode hides supporting page furniture and expands the player within a (1440px) shell. Native fullscreen removes the player radius.

## Elevation & Depth

No box shadows are used. Tonal layering, thin rules and thicker keycap bottom borders establish hierarchy. Faint pitch lines and translucent edition numerals remain background geometry. The primary action rises (2px) on hover and depresses (1px) on activation, with (0.15s) background/transform transitions. Reduced-motion preference disables transitions and smooth scrolling.

**The Flat Frame Rule.** Use tonal surfaces, dividers and borders to separate controls and content.

## Shapes

Controls have small rectangular corners; the player is more gently rounded. Pitch circles and ball/whistle SVG geometry are native football motifs. Keycaps use a (1px) border with a (3px) bottom edge. General interactive focus uses a (3px) orange outline with (4px) offset. SVG icons are generally (20px) with a (1.7) stroke; the play triangle is filled.

## Components

### Buttons

The lime primary action uses dark ink, (800) weight and a minimum (52px) height. On phones it uses (13px) text, (12px 16px) padding and a minimum (46px) height. Hover and active motion follow Elevation & Depth. Disabled state lowers opacity to (.65) with a wait cursor.

Toolbar actions are transparent, compact and bold. Hover and pressed Focus state use the toolbar-hover surface. Phone toolbar actions have a minimum (44px) height. Links inherit ink and turn burnt orange (#a93513) on hover; article play links share the primary-button presentation.

### Control Selector

Three mode buttons occupy a tinted tray with (4px) inset and (3px) gap. The selected button uses ink with cream lettering and aria-pressed. Selection replaces instructions without changing the actual game mode or restarting play. No separate hover treatment is defined for these tabs; focus retains the shared outline.

### Player and Keyboard Legend

The player clips launcher and iframe to the same rounded frame. A one-pixel pitch outline, halfway line, penalty boxes and center circle provide context without game artwork. The toolbar remains attached below the player. Keyboard legends pair ruled action rows with cream keycaps.

### Navigation

A geometric football SVG accompanies a compact wordmark. Header text links have no resting underline. On phones the Controls anchor hides and How to play remains. Support pages repeat this header, footer, palette and article typography.

### Disclosure Rows

FAQ rows are flat with bottom rules and padded summaries. Plus/minus characters express disclosure state. Answers use muted text and generous leading. Loading help uses a pale inset panel and starts collapsed after launch. No inputs, generic card grid or chip system is implemented.

## Do's and Don'ts

### Do:
- **Do** use the Field and Paper Rule for the game frame and supporting reading surfaces.
- **Do** retain visible focus outlines and reduced-motion behavior.
- **Do** use geometric SVG for interface icons and keycaps for actual keyboard labels.
- **Do** preserve the compact control rhythm and responsive stacking.

### Don't:
- **Don't** add box-shadow elevation to this flat frame.
- **Don't** inherit the repository’s Coreball-specific visual identity into this game.
- **Don't** infer provider-game styling from this website’s tokens.

Not canonized or repaired: the launcher's tiny tracked HOME / VS / AWAY decorative label is an eyebrow-like craft-floor defect, not a reusable typography role; documentation scope excludes source repairs.

Source evidence: style.css (including trailing readability overrides), index.html, app.js, how-to-play.html, local README.md, assets/PROVENANCE.json, project DIRECTION.md, research report and final site-desktop.jpg / site-mobile.jpg (2026-10-24).
