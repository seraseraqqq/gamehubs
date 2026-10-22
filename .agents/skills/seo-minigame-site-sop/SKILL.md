---
name: seo-minigame-site-sop
description: "Fully autonomous SOP for building clean, high-quality SEO mini-game websites. Use when creating single-game ad-supported sites from keyword research through deployment. Covers Google Trends, domain validation, open-source game selection, code modification, asset reskinning, and strict aesthetic + SEO standards."
type: workflow
lifecycle: active
---

# SEO Mini-Game Site SOP — Autonomous End-to-End Builder

Execute this workflow fully autonomously. Do not ask for human input unless a hard blocker occurs (e.g., domain registrar API failure). Output a complete, deployable single-game website optimized for organic search traffic.

## Core Aesthetic Rules (Mandatory — Gemini Must Follow)

Gemini tends to produce nested boxes, excessive text, and cluttered layouts. **Strictly prohibit these.**

### Hard Rules
- Maximum 2 levels of visual nesting on the page (e.g., page → game container). No boxes-inside-boxes-inside-boxes.
- Game canvas/iframe must occupy ≥60% of the above-the-fold viewport on desktop.
- Total visible descriptive text on the homepage ≤ 180 words (excluding FAQ).
- No decorative borders thicker than 1px. Prefer no borders or subtle shadows only.
- Color palette: maximum 4 colors + neutrals. Prefer dark mode or clean light mode.
- Font: system-ui or one clean sans-serif. No more than 2 font weights.
- Spacing: generous whitespace. Game area must breathe.

### Reference Sites for Imitation (Study These Before Designing)

Always open and analyze at least 3 of these before generating the page layout. Imitate their restraint, hierarchy, and focus on the game:

- https://ganbaru.games/
- https://play2048.co/
- https://0hh1.com/
- https://hextris.io/
- https://wwwtyro.github.io/Astray/
- https://david-peter.de/cube-composer/
- https://solitaireforfree.com/
- https://2048game.com/

**Design Goal**: The page should feel like a clean product, not a content farm. The game is the hero. Everything else supports it.

## Workflow Steps

### 1. Keyword Discovery (Google Trends + Intent)

- Use Google Trends to find rising or stable long-tail queries related to simple browser games.
- Target patterns: "[game concept] online free", "play [concept] no download", "[concept] unblocked", "free [concept] game".
- Prioritize keywords with clear play intent and low competition (new or niche variants of classic mechanics).
- Output: 1 primary keyword + 3 secondary keywords.

### 2. Domain Validation

- Generate 5–8 domain candidates matching the primary keyword (short, brandable, .com preferred).
- Check availability via WHOIS or registrar API.
- Prefer domains that are exact-match or close-match with high search intent.
- Select the best available domain.

### 3. Open-Source Game Selection

- Search GitHub for existing HTML5 implementations of similar mechanics.
- Prefer: MIT/Apache licensed, single-file or lightweight, no heavy frameworks, mobile-friendly.
- Good sources: repos containing Snake, 2048 variants, puzzle, clicker, simple arcade.
- Clone the most suitable repo. Document the original license.

### 4. Code Modification (魔改)

- Replace all branding, titles, and hardcoded strings with the new game name and keyword.
- Update colors, simple shapes, or CSS variables for visual freshness (do not overhaul logic).
- Ensure the game works offline-first and is mobile responsive.
- Add basic high-score persistence via localStorage if missing.
- Keep the codebase simple. Avoid introducing new dependencies.

### 5. Asset Update & Shelling (套壳)

- Replace or recolor existing sprites/assets using free CC0 sources (Kenney, OpenGameArt) or simple CSS/Canvas redraws.
- If the game is pure geometric, prefer keeping it simple.
- Create a clean page shell around the game:
  - Minimal header with game title (H1)
  - Game area (dominant)
  - Short "How to Play" (≤40 words)
  - Optional compact FAQ (3 questions max)
  - Footer with copyright + original license attribution if required

### 6. SEO Implementation

- Title tag: Primary keyword + "Online Free" or similar (≤60 chars)
- Meta description: Clear value prop + call to play (≤155 chars)
- Semantic HTML: proper H1, one H2 for How to Play
- Schema.org Game structured data (JSON-LD)
- Open Graph tags with clean game screenshot or generated thumbnail
- Sitemap + robots.txt
- Internal linking if part of a multi-game network (optional)

### 7. Quality Gate (Must Pass Before Output)

Before finalizing, verify:
- [ ] Game is immediately playable without scrolling on desktop
- [ ] No nested card/box UI patterns
- [ ] Total body text under 180 words
- [ ] Page loads in <2s on simulated 3G
- [ ] Mobile touch controls work
- [ ] Aesthetic matches the restraint of the reference sites

## Output Format

Deliver:
1. Complete static site files (index.html + assets)
2. Domain recommendation
3. Keyword report (primary + secondary)
4. Brief changelog of modifications made to the original game
5. Deployment notes (static host ready: Vercel, Cloudflare Pages, etc.)

See `references/aesthetic-checklist.md` and `references/reference-sites.md` for detailed standards.