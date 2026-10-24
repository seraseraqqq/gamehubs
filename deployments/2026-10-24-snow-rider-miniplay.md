# Snow Rider 3D — Miniplay production replacement

Owner authorized switching to Miniplay's advertised Snow Rider 3D iframe, deployment to snowrider3d.top and actual-domain gameplay verification before enabling indexing on 2026-10-24 (Asia/Shanghai).

Target: Vercel team team_yFBRBoOUaKz5Kjg6nxC3skZF; project gamehubs-snow-rider-3d / prj_3y4ZqX4XVMJ1pKdopPhEzC92CpbY; GitHub seraseraqqq/gamehubs main; root games/snow-rider-3d-unblocked; origin https://snowrider3d.top.

Status: implementation in progress. Existing production noindex is retained. The build requires PUBLISHER_DOMAIN_STATUS=verified before exporting indexable pages. Set that flag only after actual-domain gameplay acceptance. Source/default/preview builds remain noindex.

Provider URL: https://www.miniplay.com/embed/snow-rider-3d, exactly as advertised by https://www.miniplay.com/game/snow-rider-3d. Its internal game distribution remains provider-managed. Preserve its branding, ads, privacy controls and scripts. No copied package or extracted inner URL is used.

Acceptance: actual HTTPS origin; initial Play; correct game canvas/title; enter a run, steering/jump, game over and restart; ad recovery; wrapper reload; fullscreen enter/exit; canonical/robots/sitemap and assets after acceptance. Report any untested physical-device limits explicitly.

Unrelated game directories and deployments are out of scope. Existing no-publisher-account decision remains; this operation does not create an account or accept a new agreement.
