# Current checks — 2026-10-24

- Passed: Miniplay public embed selected and deployed at https://snowrider3d.top/. The previous direct GameDistribution blocker is historical; no unlicensed Unity package is exported.
- Passed: current source/default export remains noindex. An owned-origin build also remains noindex until `PUBLISHER_DOMAIN_STATUS=verified`; Vercel preview overrides the verified fixture and remains noindex.
- Passed: source/export metadata, one H1 per page, unique descriptions, local links/assets, JSON-LD syntax, social image resolution, three-URL accepted-state sitemap and preview isolation checked by `node scripts/verify.mjs`. See [SEO review](../../../deployments/2026-10-24-seo-protected-games.md) for the current count and scope.
- Passed: current CSP permits the selected Miniplay frame. Runtime excludes the superseded original engine, scene, game and vendor files.
- Observed: Miniplay local title/menu; production HTTP200 and noindex. See [release record](../../../deployments/2026-10-24-snow-rider-miniplay.md).
- Pending: actual-domain full run, steering/jump, game over/restart, ad recovery/reload and fullscreen entry/exit. HTTP200 does not certify gameplay.
- Pending: physical mobile input/performance and field Core Web Vitals. Browser performance tooling was unavailable during this SEO pass.
- Pending: indexing gate release and Search Console submission only after gameplay acceptance. No account onboarding is currently requested.

Earlier direct-provider and original-engine records are historical evidence, not acceptance of the current player. Current [plan](plan.md) and [handoff](INDEX.md).
