# Owned game domains — release in progress

2026-10-24 (Asia/Shanghai). Owner explicitly confirmed the eight domains in the attached registrar screenshot were purchased for GameHubs and authorized GitHub push followed by deployment.

Repository: seraseraqqq/gamehubs, production branch main. Vercel team: team_yFBRBoOUaKz5Kjg6nxC3skZF, gx03410-8651s-projects, Hobby. Existing projects/domains are inspected before mutations; unrelated projects are out of scope.

| Domain | Game directory | Initial Vercel state |
|---|---|---|
| playaccelerationcity.com | games/acceleration-city | No project; owner confirmed no permission yet and explicitly deferred publication |
| playheadsoccer.com | games/head-soccer-2026 | No project |
| snowrider3d.top | games/snow-rider-3d-unblocked | No project; publisher iframe version selected |
| 2048cupcakes.xyz | games/2048-cupcakes | Existing project, www canonical and apex301 redirect |
| spacebarcounter.xyz | games/spacebar-counter | Existing project, www canonical and apex301 redirect |
| krilliononline.com | games/summit-unlimited | Existing project/domain |
| gulperio.com | games/gulperio | Existing project/domain |
| playblockblastunblocked.com | games/block-blast-unblocked | Existing project/domain |

Before release: inspect public DNS/HTTPS and current project configuration; verify the new game exports; stage only authorized source/evidence, exclude retired original engine, generated exports, credentials and temporary source snapshots. Push the exact reviewed commit, then create/reuse monorepo projects with their correct root directories and production-only SITE_ORIGIN. Bind apex/www as appropriate, use DNS records returned for the actual domain/project, preserve unrelated registrar records and verify public HTTPS/metadata/game launch before claiming a custom domain live.

Acceleration City: owner replied “暂未取得，先部署其余游戏”. Do not create a production project, change its DNS or set GAME_EMBED_LICENSE_CONFIRMED=true. Its prototype and research may be versioned; publication is deferred.

Initial public checks: all five existing sites returned HTTPS200 from Vercel, with expected canonical URLs and no noindex. The three new domains are still parked and HTTPS fetch failed. Evidence: evidence/2026-10-24/initial-public-state.json. Head Soccer export checks and Snow Rider's 68 static/export checks passed before release.

No domain purchase, registrar transfer, nameserver migration, paid upgrade, account creation or analytics/advertising activation is requested by this release.
