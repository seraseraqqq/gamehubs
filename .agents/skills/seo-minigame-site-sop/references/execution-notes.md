# Practical Execution Notes

## Keyword Research Patterns
- Prefer "play X online free", "X no download", "X unblocked"
- Look for mechanics that are easy to implement: merge, snake, clicker, simple puzzle, reaction
- Avoid heavily trademarked names

## Domain Heuristics
- Short > long
- .com preferred when available
- Avoid hyphens if possible
- Check that the domain is not previously used for spam (basic web archive glance)

## Open Source Selection Criteria
- License: MIT, Apache-2.0, or CC0 preferred
- Size: Prefer < 200KB total assets
- Dependencies: Zero or minimal
- Mobile: Touch events present or easy to add

## Modification Boundaries
- Do not rewrite core game logic unless broken
- Focus changes on: title, colors, simple assets, page shell, SEO metadata
- Always preserve original license attribution if required

## SEO Minimum Viable
- Unique title and meta description
- H1 matching primary keyword intent
- JSON-LD Game schema
- Fast load (static, no heavy JS frameworks)
- Mobile-friendly viewport