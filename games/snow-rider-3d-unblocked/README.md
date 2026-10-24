# Snow Rider 3D Unblocked

Updated 2026-10-24. The site loads Snow Rider 3D through Miniplay's public embed at `https://www.miniplay.com/embed/snow-rider-3d`. The previous direct GameDistribution integration is superseded. A complete Unity export was found during research, but self-hosting permission was not established, so no downloaded game package is shipped.

## Run and verify

Run `node scripts/serve.mjs 4197`, then open http://127.0.0.1:4197/. Run `node scripts/verify.mjs` for source/export checks. Run `node scripts/build.mjs` for a safe noindex export.

Choose Play Snow Rider 3D, then follow Miniplay's own launcher and game menus. Arrows/A/D steer; Up/W jump. The provider controls gameplay, mobile inputs, saves, ads, privacy prompts and availability. The site does not read game scores or promise offline or ad-free play.

## Runtime and source boundaries

The export contains `index.html`, `player.js`, `style.css`, two supporting pages, icons, a local font and the publisher cover. The previous original engine and local Three.js renderer are not exported. Historical source and evidence remain in the repository's research directory.

The external player is created only after Play. The CSP allows Miniplay as the selected frame host. Preserve the supplied player UI, SDK, ads and actual parent referrer; do not spoof another domain or bypass provider checks. See [PROVENANCE.md](PROVENANCE.md).

## Production and indexing hold

Vercel Root Directory: `games/snow-rider-3d-unblocked`. Build: `node scripts/build.mjs`. Output: `dist`. No install step. The owner-confirmed domain is https://snowrider3d.top/; www redirects to the apex. The Miniplay version is deployed, but a full actual-domain gameplay/restart acceptance remains unverified. **Keep production noindex until that acceptance.** No publisher-account creation is requested.

`SITE_ORIGIN` accepts the actual owned HTTPS origin. Indexable canonical/social/schema URLs, robots and sitemap additionally require `PUBLISHER_DOMAIN_STATUS=verified`, only after actual-domain gameplay acceptance. Default builds, Vercel previews and production builds without that verified flag remain noindex. Do not set the flag to pass an SEO audit. Local fixture builds test the future accepted state without deploying or changing platform environment values.

Current [release record](../../deployments/2026-10-24-snow-rider-miniplay.md), [plan](.rankup/plan.md), [checks](.rankup/checks.md) and [portfolio SEO audit](../../deployments/2026-10-24-seo-protected-games.md). No Search Console or publisher revenue integration is claimed.
