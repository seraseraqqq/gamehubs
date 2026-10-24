# GameHubs repository rules

GameHubs is the portfolio registry and the temporary source repository for ten deployed games. Read `management/REPOSITORIES.md` and `management/data/repositories.json` before changing a game.

- Cluster Rush and Acceleration City have independent private repositories. Their `games/` directories here are frozen migration snapshots; make subsequent game changes in the canonical repository, not both copies.
- Existing deployed games still build from their own `games/<slug>` directory. Keep changes scoped to the requested game. Other chats may be editing this workspace; preserve their edits and stage explicit paths.
- Vercel's per-project Ignored Build Step runs `scripts/vercel-ignore.mjs`. If introducing a shared runtime dependency, add its path to the affected projects' ignore command. Root management documents and research are not runtime dependencies.
- New games should start in separate sibling repositories, one Vercel project per game; register their source, release state and domains here. Do not put nested Git repositories inside GameHubs.
- Preserve current release holds: Acceleration City awaits embedding permission; Cluster Rush awaits permission/domain decisions; Snow Rider remains noindex until actual-domain gameplay acceptance. Follow subsequent explicit owner authorization when these conditions change.
- Do not commit credentials, `.env` files, `.vercel` credentials or ignored downloaded game packages. Record verified outcomes separately from pending acceptance.
- Public game copy should lead with the game name, gameplay and controls. The owner does not want repeated "inspired", "clone" or imitation disclaimers in titles and sales copy. Keep required credits/licenses and accurate feature descriptions; do not invent official affiliation, multiplayer or other unsupported features.

## Management repository layout

- Root is a management entry point: keep README.md, HANDOFF.md and AGENTS.md plus required hidden configuration only. Do not add root JSON, spreadsheets, temporary tests or single-game product/design files.
- Current management documents and plans belong in management/; authoritative JSON registries live in management/data/. Preserve keyword/competitor research and evidence in research/, release records in deployments/.
- Temporary task scripts belong outside the repository; retain reusable portfolio tools in management/tools/ or .rankup/scripts/. Never re-create retired root paths in generators.
- Existing games/ and scripts/vercel-ignore.mjs remain deployment dependencies until the remaining canonical repositories are migrated. Do not delete them as repository cleanup.
