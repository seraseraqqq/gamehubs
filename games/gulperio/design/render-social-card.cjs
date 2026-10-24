// Render the existing code-native social artwork with current game copy.
// Usage: node design/render-social-card.cjs <absolute sharp module path>
// Local design tool only; never loaded by the game or production build.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require(process.argv[2] || 'sharp');
const root = path.resolve(__dirname, '..');
const arena = fs.readFileSync(path.join(root, 'assets/arena-preview.svg')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="1" fill="#ecf8ef" opacity=".09"/></pattern><clipPath id="arena"><rect x="676" y="116" width="459" height="398" rx="24"/></clipPath></defs>
<rect width="1200" height="630" fill="#0d1727"/><rect width="1200" height="630" fill="url(#dots)"/>
<g font-family="Arial, sans-serif" fill="#ecf8ef"><text x="64" y="207" font-size="17" font-weight="800" letter-spacing="2">GULPER.IO</text>
<g font-size="50" font-weight="900"><text x="64" y="300">Glow. Grow.</text><text x="64" y="370">Go again.</text></g>
<text x="64" y="432" font-size="20">Free online snake game · Computer rivals</text></g>
<image x="676" y="116" width="459" height="398" preserveAspectRatio="xMidYMid slice" clip-path="url(#arena)" href="data:image/svg+xml;base64,${arena}"/>
<rect x="676" y="116" width="459" height="398" rx="24" fill="none" stroke="#3d5875" stroke-width="2"/>
<rect x="697" y="447" width="224" height="46" fill="#0d1727" stroke="#3f8588"/><text x="711" y="476" font-family="Arial, sans-serif" font-size="15" font-weight="700" fill="#57e4d9">PLAY AT GULPERIO.COM</text>
</svg>`;
sharp(Buffer.from(svg)).png().toFile(path.join(root, 'assets/social-card.png')).then(() => console.log('Rendered social-card.png (1200 x 630)')).catch(error => { console.error(error); process.exitCode = 1; });
