# Current plan — 2026-10-24

Owner confirmed: “还没有账户，先保留部署并记录待办”. Preserve the deployed wrapper at https://snowrider3d.top/, DNS and production PUBLISHER_DOMAIN_STATUS=unregistered; retain noindex and the pending-approval notice. Publisher onboarding is deferred by owner. No account creation, contract acceptance or further deployment work is requested now.

## 待办：发布商账户与域名审批

- [ ] Owner creates a GameDistribution publisher account and completes its required agreements.
- [ ] Register snowrider3d.top and obtain approval to load Snow Rider 3D game3b79a8537ebc414fb4f9672a9b8c68c8.
- [ ] Once approved, clear PUBLISHER_DOMAIN_STATUS=unregistered and redeploy using the actual owned origin.
- [ ] Verify actual-domain game loading and controls, plus mobile/fullscreen behavior; recheck HTTPS, canonical, robots and sitemap before indexing.

Actual-domain verification reached the official blocked.html response with unregistered=true. Local title/menu success is not production gameplay evidence. Do not spoof a referrer, bypass the provider SDK or copy the unlicensed Unity package.

Evidence: [deployment record](../../../deployments/2026-10-24-owned-game-domains.md), [provider response](../../../deployments/evidence/2026-10-24/snow-rider-provider-blocked.txt), [package sourcing](../../../research/2026-10-24-snow-rider/PACKAGE-SOURCING.md).
