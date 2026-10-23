# GameHubs handoff

Updated 2026-10-23. User wants keyword-led, ad-supported single-game sites, with no separate Pinlark or Clue Garden branding.

- Current directories: games/coreball and games/minute-cryptic-unlimited. Main queries: coreball and minute cryptic unlimited. Costcodle was not modified.
- SEO implementation and local QA completed: [report](research/2026-10-23-keyword-seo/README.md). Historical QA snapshots retain former site IDs; current scripts use renamed paths. Existing storage keys are intentionally preserved.
- Next: owner selects owned domains. Configure SITE_ORIGIN and external Vercel Root Directory using the new paths, deploy, verify live canonical/robots/sitemap, then connect GSC and submit sitemaps. No production state, indexing or ranking is claimed. Ads remain unconnected.
