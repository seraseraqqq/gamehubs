# Current plan — 2026-10-24

Owner subsequently authorized switching to Miniplay, deployment to https://snowrider3d.top/ and actual-domain gameplay acceptance before indexing. Miniplay replacement is deployed and READY; noindex remains. No publisher-account creation is requested.

## 待办：正式域名游戏验收后开放索引

- [x] Replace direct GameDistribution iframe with the advertised Miniplay public embed and deploy under noindex.
- [ ] Verify actual-domain start, gameplay/steering/jump, game over and restart, ad recovery and reload.
- [ ] Verify fullscreen entry/exit and record mobile/device limits honestly.
- [ ] Only after acceptance, set PUBLISHER_DOMAIN_STATUS=verified, redeploy and verify canonical, robots and sitemap.

Historical direct-provider verification reached blocked.html with unregistered=true. That integration is superseded. Miniplay actual-domain gameplay verification was interrupted because Computer Use could not reliably determine the Windows browser URL. HTTP200 and local title/menu alone are insufficient acceptance evidence. Preserve the supplied public embed and provider SDK/branding.

Evidence: [deployment record](../../../deployments/2026-10-24-owned-game-domains.md), [provider response](../../../deployments/evidence/2026-10-24/snow-rider-provider-blocked.txt), [package sourcing](../../../research/2026-10-24-snow-rider/PACKAGE-SOURCING.md).

## Alternative research — 2026-10-24

[Local probe results](../../../research/2026-10-24-snow-rider/alternatives/README.md) informed the subsequent Miniplay switch. [Current release](../../../deployments/2026-10-24-snow-rider-miniplay.md), [workspace deployment inventory](../../../management/DEPLOYMENT_STATUS.md).## SEO maintenance — 2026-10-24

Current Miniplay metadata and social cards are checked in the [portfolio SEO review](../../../deployments/2026-10-24-seo-protected-games.md). The old direct-provider onboarding task is superseded; preserve the existing noindex hold until actual-domain gameplay acceptance. This SEO pass makes no deployment or environment change.
