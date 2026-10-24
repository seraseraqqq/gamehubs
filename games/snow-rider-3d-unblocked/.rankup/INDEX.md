# Snow Rider 3D — current handoff

Updated 2026-10-24 (Asia/Shanghai). Website wrapper deployed at https://snowrider3d.top/; Vercel project gamehubs-snow-rider-3d. DNS/HTTPS/www301 verified.

- Owner confirmed no GameDistribution publisher account and chose to retain deployment and record a todo. Publisher onboarding is deferred; no account creation is authorized now.
- Actual game is blocked by the provider: domain=snowrider3d.top, unregistered=true. Keep production PUBLISHER_DOMAIN_STATUS=unregistered, noindex and the approval notice.
- Future steps: owner creates an account, registers the domain and obtains approval; then redeploy, verify actual gameplay and SEO before indexing. [Todo checklist](plan.md).
- Existing publisher iframe remains the selected game source. A complete Unity package was located without an established self-hosting license; the earlier custom engine is superseded and excluded from delivery.
- Local checks: 68 static/export and 9 shell checks; local title/menu/tutorial observed. Actual-domain gameplay failed; full-round/physical-mobile/fullscreen-exit remain unverified.
- Preserve publisher UI/SDK and actual parent referrer. Do not spoof another site or copy unlicensed binaries.
- [Release and owner decision](../../../deployments/2026-10-24-owned-game-domains.md), [provider blocker](../../../deployments/evidence/2026-10-24/snow-rider-provider-blocked.txt), [sourcing](../../../research/2026-10-24-snow-rider/PACKAGE-SOURCING.md).
- Alternative research: [three locally rendered public embeds and package checks](../../../research/2026-10-24-snow-rider/alternatives/README.md). Miniplay is the first existing-game candidate; Neo/Rush are distinct games. Production unchanged; actual-domain and full-round checks pending.
