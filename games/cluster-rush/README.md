# Cluster Rush

**Migrated:** [independent private repository](https://github.com/seraseraqqq/gamehubs-cluster-rush). This directory is a transitional snapshot; see [MIGRATED.md](MIGRATED.md).

Dependency-free static site around the **existing Unity game**, matching the iframe architecture observed on competitors. No original gameplay engine or copied Unity binaries. Research and screenshots: `../../research/2026-10-24-cluster-rush/README.md`.

```powershell
node scripts/author-pages.mjs
node scripts/build.mjs
node scripts/serve.mjs 4202
```

Preview: http://127.0.0.1:4202/ . Build with `SITE_ORIGIN` set to the owner's chosen bare HTTPS origin, or `node scripts/build.mjs --origin HTTPS_ORIGIN`, for production canonical URLs, indexable metadata and sitemap. Source and Vercel previews stay noindex. Do not assume a recommended domain is owned.

Vercel Root Directory: `games/cluster-rush`; whitelisted export: `dist`. Not deployed in this task. Commercial embedding permission is unconfirmed and must be resolved before a public release; technical embeddability alone is not permission.

Site features: eager direct game iframe without the competitor's extra launch wrapper, measured 3:2 viewport, focus mode, fullscreen fallback, inline reload confirmation, keyboard instructions verified in the game, original control and troubleshooting guides. Mobile layout is responsive; touch gameplay is not claimed. No fake loading percentage, fake mute control, in-game progress access or cloud-save claim.

The external game can change independently. Recheck its loading chain, rights, actual domain and real devices before publishing. The full Unity load is not promised to meet the lightweight website's performance target.
