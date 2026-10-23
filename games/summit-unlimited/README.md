# STARLING — Signal to the Stars

An original pixel space word adventure. Seven timed prompts carry the player from a launch complex through the atmosphere, Moon, Mars, Jupiter, solar system, Milky Way and cosmic horizon.

## Run locally

No build or runtime dependencies are required. From this directory:

```sh
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`. All runtime sprites and fonts are local. Sound is synthesized after the player enables it.

## Pixel scene architecture

- `scene.js`: low-resolution Canvas world with independent sprite layers, cloud drift, star twinkle, orbiting objects, rocket movement, animated exhaust and three transition treatments: liftoff, flyby and scale pullback.
- `game.js`: seven rounds, 25-second deadlines, input locking during travel, local score records, restart and synthesized ambience/effects. Points and narrative distance are separate.
- `index.html` and `style.css`: crisp HTML text, solid prompt card, bottom answer dock, route ruler, pixel instruments, responsive portrait layout and reduced-motion support.
- `assets/pixel/`: original generated source atlases and prepared transparent sprites. The old painterly JPEG files are retained from the previous direction but are not loaded by this version.
- `assets/fonts/`: locally hosted Silkscreen Regular and its OFL license.
- `design/pixel-flight-direction.png`: generated visual direction, separate from browser screenshots.
- `design/ART-DIRECTION.md`: diagnosis of the previous design, style rules, layer responsibilities and transition design.

To regenerate prepared sprites from the saved source images, install Pillow in a development environment and run:

```sh
python3 scripts/prepare_assets.py
```

The game itself does not require Python or Pillow when hosted as static files.

## Validation

Browser coverage includes the full seven-answer route and result, restarting, skipping, empty submission, repeated submission protection, sound toggling, help, reduced-motion mode, and desktop/portrait screenshots. See `output/playwright/` for captured evidence. Runtime loading makes no external asset requests.

## Remaining product scope

Rarity currently uses a curated local table and a simple fallback for novel answers; it is not live player frequency or semantic answer validation. Prompts are fixed. There is no account system, shared daily seed, archive, global leaderboard or multiplayer. The route compresses astronomical distances for a story and is not a simulation.

Audio is a procedural ambient arrangement with chimes and a synthesized engine sweep, rather than a professionally composed soundtrack or recorded sound library. Further polish would benefit from bespoke ship animation, celestial surface animation and layered sound design.

## Effort assessment

The static single-player word-game loop is low-to-medium difficulty. Consistent pixel art, independent ambient animation, scene transitions, mobile layout and sound polish make the presentation medium difficulty and should have their own art/QA budget. As a planning estimate, a polished vertical slice takes roughly 3–7 focused working days for an experienced developer with art support; a production title with daily content, answer validation, collected rarity data, persistence and administration is more plausibly 3–6 weeks for a small experienced team. Multiplayer and ongoing operations are additional scope. These are scope-based estimates, not delivery commitments.

## SEO and static publication

The page includes a crawlable flight manual, truthful feature FAQ, social preview image and game structured data. See [SEO.md](SEO.md) for implementation details and verification.

A production build requires the actual public HTTPS origin. Run from this directory, replacing the URL with the real domain:

```sh
python3 scripts/build_site.py --site-url https://YOUR-REAL-DOMAIN
python3 scripts/check_seo.py dist
```

Publish the contents of `dist/` as the website root. The build generates canonical/social URLs, `robots.txt` and `sitemap.xml`, and copies only runtime assets. It omits development research, source atlases, screenshots and unused artwork. Source HTML intentionally has no canonical until a real domain is configured. No production deployment or Search Console submission has been performed.

To validate the working source or regenerate the sharing image:

```sh
python3 scripts/check_seo.py
python3 scripts/create_social_card.py  # optional; requires Pillow
```
