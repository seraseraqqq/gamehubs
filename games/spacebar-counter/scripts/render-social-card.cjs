// Local design tool; the checked-in PNG is used by dependency-free production builds.
// Usage: node scripts/render-social-card.cjs <absolute sharp module path>
const path = require('node:path');
const fs = require('node:fs');
const sharp = require(process.argv[2] || 'sharp');
const root = path.resolve(__dirname, '..');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5f3ec"/>
<g font-family="Arial, sans-serif" fill="#262a29"><text x="76" y="106" font-size="22" font-weight="700" letter-spacing="3">SPACE / BAR</text>
<text x="76" y="214" font-size="68" font-weight="700">Spacebar Counter</text>
<text x="80" y="270" font-size="26">Count each press. Find your pace.</text>
<rect x="78" y="332" width="1044" height="164" rx="24" fill="#e5dfd2" stroke="#333936" stroke-width="2"/>
<rect x="88" y="342" width="1024" height="140" rx="20" fill="#fdfbf5" stroke="#333936" stroke-width="2"/>
<text x="600" y="422" text-anchor="middle" font-size="26" letter-spacing="3">PRESS SPACE TO BEGIN</text>
<path d="M530 444v12h140v-12" fill="none" stroke="#9b593c" stroke-width="4"/>
<text x="80" y="560" font-size="22">5 · 10 · 30 · 60 seconds</text><text x="1120" y="560" text-anchor="end" font-size="22" fill="#9b593c">Free count + separate tap test</text></g></svg>`;
fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
sharp(Buffer.from(svg)).png().toFile(path.join(root, 'assets/social-card.png')).then(() => console.log('Rendered assets/social-card.png (1200 x 630)')).catch(error => { console.error(error); process.exitCode = 1; });
