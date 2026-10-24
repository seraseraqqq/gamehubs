## Production update — 2026-10-24

Owner confirmed purchased snowrider3d.top and authorized deployment. GitHub main pushed; Vercel gamehubs-snow-rider-3d deployed. DNS A216.198.79.1, www CNAME575342d45dca2a14.vercel-dns-017.com; www301 to apex. HTTPS is valid. Actual-domain game verification FAILED: GameDistribution blocked.html returns domain=snowrider3d.top, unregistered=true. The added official SDK frame permits the provider’s response; it does not solve registration. Production uses PUBLISHER_DOMAIN_STATUS=unregistered to keep noindex, disallow crawling and show the pending approval message. No referrer spoof or SDK bypass. Owner confirmed no account and explicitly deferred onboarding; retain deployment/noindex, with future account/domain approval steps in plan.md. After approval remove pending flag, redeploy and verify gameplay. Evidence: ../../../deployments/2026-10-24-owned-game-domains.md. Earlier pending-purchase/local-success statements below are historical.

# Current checks — 2026-10-24

- Passed: existing game sourcing recorded; complete Unity export found but self-hosting license unestablished; selected public GameDistribution iframe fallback.
- Passed: current static/export verifier — 68 checks, scripts/verification.json. Original engine/scene/game/vendor not exported.
- Passed: 9 CUA shell checks in player-shell-qa.json: no frame before Play, no original simulation, cover, overflow, reload state, one correct provider frame and actual referrer.
- Observed: actual nested Unity canvas, title screen, sled menu and input tutorial rendered; ArrowUp event sent. Full game round not certified.
- Partial: fullscreen entered with visible internal44px exit, then IAB left fullscreen before next action. Internal exit click not completed.
- Pending: mobile-width verification. IAB ignored requested viewport widths and reported987px; captures are default IAB, not mobile proof. Physical-device input/performance not tested.
- Passed: production CSP permits selected publisher frame; local preview serves the same CSP. Source/default/preview remain noindex, canonical/robots/sitemap production export verified.
- Pending: registrar price/availability/history, owned domain, publisher account/onboarding, production deployment and Search Console. No ranking/revenue claim.

Earlier engine-test and original-scene evidence are historical only. Current report: ../../../research/2026-10-24-snow-rider/PACKAGE-SOURCING.md.