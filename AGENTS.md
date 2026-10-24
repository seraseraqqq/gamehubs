# GameHubs repository rules

GameHubs is the portfolio registry and the temporary source repository for ten deployed games. Read `REPOSITORIES.md` and `repositories.json` before changing a game.

- Cluster Rush and Acceleration City have independent private repositories. Their `games/` directories here are frozen migration snapshots; make subsequent game changes in the canonical repository, not both copies.
- Existing deployed games still build from their own `games/<slug>` directory. Keep changes scoped to the requested game. Other chats may be editing this workspace; preserve their edits and stage explicit paths.
- Vercel's per-project Ignored Build Step runs `scripts/vercel-ignore.mjs`. If introducing a shared runtime dependency, add its path to the affected projects' ignore command. Root management documents and research are not runtime dependencies.
- New games should start in separate sibling repositories, one Vercel project per game; register their source, release state and domains here. Do not put nested Git repositories inside GameHubs.
- Preserve current release holds: Acceleration City awaits embedding permission; Cluster Rush awaits permission/domain decisions; Snow Rider remains noindex until actual-domain gameplay acceptance. Follow subsequent explicit owner authorization when these conditions change.
- Do not commit credentials, `.env` files, `.vercel` credentials or ignored downloaded game packages. Record verified outcomes separately from pending acceptance.
