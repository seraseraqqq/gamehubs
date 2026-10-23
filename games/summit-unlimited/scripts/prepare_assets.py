"""Normalize generated sprites onto a shared low-resolution pixel grid."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / 'assets' / 'pixel'

def sprite(image, name, width):
    image = image.convert('RGBA')
    image.putalpha(image.getchannel('A').point(lambda a: 255 if a >= 220 else 0))
    box = image.getbbox()
    if box:
        image = image.crop(box)
    image = image.resize((width, max(1, round(width * image.height / image.width))), Image.Resampling.NEAREST)
    # Eliminate generated soft shading without introducing new colors or shapes.
    alpha = image.getchannel('A')
    image = image.convert('RGB').quantize(colors=20).convert('RGBA')
    image.putalpha(alpha)
    image.save(ROOT / f'{name}.png', optimize=True)

for atlas, names in [('planets', ['earth', 'moon', 'mars', 'jupiter', 'saturn', 'sun']), ('objects', ['satellite', 'asteroids', 'beacon', 'galaxy', 'cloud', 'meteor'])]:
    image = Image.open(ROOT / f'{atlas}-source.png')
    cw, ch = image.width // 3, image.height // 2
    for n, name in enumerate(names):
        x, y = n % 3 * cw, n // 3 * ch
        sprite(image.crop((x, y, x + cw, y + ch)), name, 256 if atlas == 'planets' else 192 if name == 'galaxy' else 128 if name == 'cloud' else 64)
sprite(Image.open(ROOT / 'rocket-source.png'), 'rocket', 28)
port = Image.open(ROOT / 'spaceport-source.png').convert('RGBA').resize((640, 360), Image.Resampling.NEAREST)
port.putalpha(port.getchannel('A').point(lambda a: 255 if a >= 220 else 0))
port.save(ROOT / 'spaceport.png', optimize=True)
