# Credits and artwork

This is an independent cupcake-themed interpretation of the 2048 sliding puzzle.
It is not affiliated with other 2048 Cupcakes websites or bakeries.

## Game concept and implementation

- 2048 was created by Gabriele Cirulli: https://github.com/gabrielecirulli/2048
- The upstream project is MIT licensed. Its complete license is preserved in
  assets/LICENSE-2048.txt, captured during the research on 2026-10-23.
- This version's engine, input handling, save/undo system, UI and vector symbols
  were implemented specifically for this repository; no upstream source files
  or third-party Cupcakes game code, photos, audio or brand logos were copied.
- Because upstream code was not imported, there is no imported code commit to
  pin. The linked upstream license is attribution/reference, not a claim that it
  covers other Cupcakes sites' assets or names.
- Original source code in this folder uses the LICENSE file alongside it.

## Original cupcake illustrations

Created for this project on 2026-10-23 with the built-in imagegen tool. The source
is assets/cupcakes-atlas.png (1448 × 1086, RGBA). The browser uses a same-size WebP
export with alpha, assets/cupcakes-atlas.webp. Only format compression was used;
sprites are selected using CSS background positions, not redrawn or taken from
other game sites. Icons, favicon, typography treatment and page layout are
original code; font rendering uses locally available system fonts.

The image generation prompt is preserved in assets/art-prompt.txt. Generative
artwork provenance is documented; no exclusive intellectual-property rights or
trademark clearance are asserted. The local working wordmark is Crumb.

The social preview image, when present, is a browser screenshot of this site's
original UI and generated illustrations. It contains no third-party screenshot.

## Sound

Optional notes are synthesized using the browser Web Audio API. No sampled sound
files or external sound service is used. Sound defaults off.
