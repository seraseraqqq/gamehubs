// Local code-native card layout using the existing original cupcake illustrations.
// Usage: node scripts/render-social-card.cjs <absolute sharp module path>
// This is a development tool; production builds only copy the checked-in PNG.
const path = require('node:path');
const fs = require('node:fs');
const sharp = require(process.argv[2] || 'sharp');
const root = path.resolve(__dirname, '..');
const atlas = fs.readFileSync(path.join(root, 'assets/cupcakes-atlas.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><clipPath id="art"><rect x="756" y="84" width="356" height="462" rx="32"/></clipPath></defs>
<rect width="1200" height="630" fill="#faf7f2"/><circle cx="970" cy="315" r="270" fill="#f3e7dc"/>
<g font-family="Arial, sans-serif" fill="#533d32"><text x="72" y="118" font-size="25" font-weight="700" letter-spacing="2">CRUMB.</text>
<text x="72" y="258" font-size="84" font-weight="700">2048</text><text x="72" y="351" font-size="78" font-weight="700">Cupcakes</text>
<text x="76" y="420" font-size="27">Slide. Match. A little sweeter.</text>
<text x="76" y="513" font-size="21">Arrow keys · WASD · Swipe</text>
<text x="76" y="551" font-size="21" fill="#826a5b">Free to play · Undo · Local saves</text></g>
<image x="756" y="84" width="356" height="462" preserveAspectRatio="xMidYMid meet" href="data:image/png;base64,${atlas}" clip-path="url(#art)"/>
</svg>`;
sharp(Buffer.from(svg)).png().toFile(path.join(root, 'assets/og-cover.png')).then(() => console.log('Rendered assets/og-cover.png (1200 x 630)')).catch(error => { console.error(error); process.exitCode = 1; });
