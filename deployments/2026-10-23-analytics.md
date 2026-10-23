# Vercel Web Analytics integration — 2026-10-23

Scope: the six already-deployed sites in `seraseraqqq/gamehubs`.
Owner instruction: install Analytics and push; the owner will enable the
Vercel dashboard switches personally. No dashboard settings were changed.

| Game | Vercel project | Integration in this release |
| --- | --- | --- |
| Block Blast | block-blast-unblocked | Existing Analytics loader verified; retained |
| Costcodle | costcodle-unlimited | Existing Analytics loader verified; retained |
| Gulper | gulperio-game | Existing Analytics loader verified; retained |
| STARLING | gamehubs-summit-unlimited | Added Analytics loader and updated privacy text |
| Spacebar Counter | gamehubs-spacebar-counter | Added Analytics loader and updated privacy text |
| 2048 Cupcakes | gamehubs-2048-cupcakes | Added Analytics loader and updated privacy text |

All six HTML pages initialize `window.va` and load the same-origin
`/_vercel/insights/script.js`. The three new loaders run on hosted HTTPS pages
and skip local HTTP, file URLs, localhost and IPv6 loopback. The static build
pipelines preserve the integration without an npm package or framework.
Existing Speed Insights hooks were retained. No custom gameplay events were
added. The two newer Coreball and Minute Cryptic practice sites are not deployed and
are outside this batch.

Current inventory and README statements now distinguish installed scripts from
verified collection. Historical deployment records describe their release-time
state and are superseded by this record for Analytics integration status.

Validation:

- All six source pages contain exactly one Analytics loader; inline JavaScript
  syntax checks passed in source and generated HTML.
- All twelve static builds passed (preview and production for each site),
  preserving the loader, preview noindex/blocked robots, and production
  canonical/robots/sitemap output.
- Eighteen isolated execution scenarios passed for the three added loaders:
  HTTPS insertion, HTTP localhost/IPv4 skip, HTTPS localhost/IPv6 skip,
  file URL skip, plus the Analytics event queue in each scenario.
- Git whitespace validation passed.

The authorized source changes are committed and pushed to `origin/main`;
the confirmed commit and push result are reported in the chat. A Git push can
trigger Vercel deployments. This record does not assert that collection is
active or that an Analytics page-view request was received.

Owner follow-up: enable Web Analytics for each project in Vercel; redeploy
after enabling if Vercel requires it, then visit the public site and verify
its Analytics page-view request and dashboard data.

Reference: [Vercel Web Analytics quickstart](https://vercel.com/docs/analytics/quickstart).
