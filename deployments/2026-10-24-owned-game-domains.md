# Owned game domains — deployment and verification

## Outcome

- Head Soccer: https://playheadsoccer.com/ is deployed and public. Valid HTTPS, canonical, indexability, robots, sitemap, support page, JS/CSS and www301 passed. Actual-domain browser loaded GamePix and the Head Soccer 2026 title screen; screenshot: evidence/2026-10-24/head-soccer-production.png. Physical touch/multiplayer/full-round certification is outside this release verification.
- Snow Rider: https://snowrider3d.top/ has a deployed Vercel wrapper, valid HTTPS and correct DNS/www301, **but the game is blocked by the publisher**. Edge reached the official `blocked.html` URL with `domain=snowrider3d.top` and `unregistered=true`; evidence/2026-10-24/snow-rider-provider-blocked.txt and .png. Local title/menu success did not establish production availability. Adding the official SDK frame to CSP permits its response and does not resolve domain registration. The pending production export deliberately remains noindex, omits its sitemap and displays the approval notice.
- Acceleration City: owner explicitly deferred publication because permission is not yet obtained. Domain stays parked; no Vercel project or DNS changes.
- The other five domains were already online, with HTTPS200, expected canonical and no noindex. They were inspected and not manually redeployed. GitHub's existing integration may create deployments on a repository push.

GitHub source release: `4fe4c038e080a9078d830d31dce3dfd61a62f2a4`, pushed to main. Snow Rider SDK frame adjustment: `adab3a07894fd95221cbeefc89bc05e1873c2f5c`; pending-publisher/noindex runtime: `b4dbe7c8bf9cc8811eaa0ec2396a1a9151197b38`. Source audit: 180 initial staged files, 8,826,977 bytes, no credential/private-key findings. Downloaded research snapshots, retired custom Snow Rider engine/vendor and dist were excluded.

| New project | Root | Production origin | Vercel project ID |
|---|---|---|---|
| gamehubs-head-soccer-2026 | games/head-soccer-2026 | https://playheadsoccer.com | prj_iYamXrporUtpovAR6rwvL6QZuUPp |
| gamehubs-snow-rider-3d | games/snow-rider-3d-unblocked | https://snowrider3d.top | prj_3y4ZqX4XVMJ1pKdopPhEzC92CpbY |

Both projects link to seraseraqqq/gamehubs, main; Node24, build `node scripts/build.mjs`, empty install, output dist, static framework. SITE_ORIGIN is production-only. Existing team deployment protection remains enabled for Vercel-hosted previews, custom domains public. No protection weakening, paid upgrades or new analytics/ad accounts.

Spaceship DNS added only to the two previously empty zones; nameservers retained launch1/launch2.spaceship.net, TTL30min. Apex A216.198.79.1; Head Soccer www CNAME744c75b0c0f00bf8.vercel-dns-017.com; Snow Rider www CNAME575342d45dca2a14.vercel-dns-017.com. Both www names301 to their apex. Vercel reported misconfigured=false for apex and www. Snow Rider certificate cert_9bMu1uQ1kI2JgEUoQhZgKsiD was issued after DNS propagated. Registrar screenshots: head-soccer-dns.png and snow-rider-dns.png in the evidence directory.

Snow Rider follow-up: on 2026-10-24 (Asia/Shanghai), owner confirmed “还没有账户，先保留部署并记录待办”. No publisher account exists; onboarding is deferred by owner. Preserve the deployed wrapper, DNS and PUBLISHER_DOMAIN_STATUS=unregistered / noindex. Future todo: owner creates a GameDistribution publisher account, registers snowrider3d.top and obtains approval for game3b79a8537ebc414fb4f9672a9b8c68c8. Checklist: games/snow-rider-3d-unblocked/.rankup/plan.md. Do not create an account/accept contracts, spoof another site's referrer, bypass the SDK or copy unlicensed binaries. After publisher approval, clear `PUBLISHER_DOMAIN_STATUS=unregistered`, redeploy, verify the actual game on its real domain, then enable indexing. No indexing submissions or ranking/revenue claims.

Verification reports: evidence/2026-10-24/preflight.json (before discovering publisher-domain restriction), production-http-before-publisher-hold.json (pre-hold web checks), production-http.json (current expected release state). Run `node deployments/verify-owned-game-domains.mjs` from the repository root. Its success verifies web delivery and the intentional publisher hold; it does not mean Snow Rider gameplay passed.

## Initial audit and authorization

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

Final pending-state deployment: dpl_2yWHt6yjZEtSEVpJRsmLB7V1ZTBH, READY production at b4dbe7c8bf9cc8811eaa0ec2396a1a9151197b38. HTTP verification at 2026-10-24T04:19:34.278Z passed Head Soccer indexable delivery and Snow Rider intentional noindex/publisher-hold delivery. Actual Snow Rider gameplay remains blocked. Initial verified Head Soccer production: dpl_3CSozsx588uEUVcv629zoiTPUCjs at 4fe4c038e080a9078d830d31dce3dfd61a62f2a4. Complete API evidence: evidence/2026-10-24/vercel-release.json.
