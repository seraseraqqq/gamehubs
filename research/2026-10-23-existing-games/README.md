# Existing-game SEO / UI review — 2026-10-23

> 2026-10-24整理注：本报告保留当时结果；相关一次性测试/旧同步脚本已移出管理仓库，不再按文内旧命令复跑。当前质量复查使用仓库根执行 `node scripts/check-portfolio-seo.mjs --public`，游戏专属测试见各游戏README。

Scope: Block Blast, Costcodle, Gulper.io-inspired solo arena, STARLING. Cupcakes and Spacebar were not changed. Originally reviewed locally. The owner subsequently authorized committing and pushing this validated batch to origin/main. See ../../deployments/2026-10-23-existing-games.md for release status. No domain or Search Console action was taken.

Open `report.html` through a local server. Before screenshots were captured before edits; after screenshots use the same 1440 × 1000 desktop and 390 × 844 mobile viewport. JSON evidence includes additional 320/768 widths. The public baseline is a read-only HTTP snapshot, not a production gameplay audit.

## Reproduce

Serve game roots on localhost ports 4191–4194 in the order above. `agent-browser` must be installed; the browser checks use isolated disposable sessions and only clear storage on these localhost origins. Run browser scripts sequentially so a second browser does not background STARLING’s animation tab.

```sh
python3 research/2026-10-23-existing-games/check-static.py
python3 research/2026-10-23-existing-games/browser-layout.py
python3 research/2026-10-23-existing-games/browser-regression.py
python3 research/2026-10-23-existing-games/browser-storage.py
node --test games/summit-unlimited/tests/*.test.cjs
```

`check-static.py` builds preview and production exports locally, restores a production export and never deploys. Browser regression accepts Block's native confirmation using a confirm=true fixture, triggers Gulper's result method for recovery tests, and runs STARLING's real seven-answer route in reduced-motion mode. Storage checks make localStorage throw SecurityError using a pre-navigation script.

No current keyword-volume research, OpenSEO, paid APIs, field Core Web Vitals or real-device Safari tests were performed. Font evidence identifies the official Google Fonts and OFL sources. Remaining product/brand-intent gaps are described in the report.


Gulper follow-up: the user chose single-player computer rivals as the product direction, with no multiplayer planned. Human-like opponent behavior, 18 additional tests, and browser evidence are documented in [gulper-personality.md](gulper-personality.md).
