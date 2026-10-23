#!/usr/bin/env python3
"""Create a local sharing card from the game's original pixel sprites (requires Pillow)."""
from pathlib import Path
import random
from PIL import Image, ImageDraw, ImageFont, ImageOps
ROOT = Path(__file__).resolve().parents[1]
image = Image.new('RGB', (1200, 630), '#081529')
draw = ImageDraw.Draw(image)
rng = random.Random(72)
for _ in range(125):
    x, y = rng.randrange(1200), rng.randrange(630)
    draw.rectangle((x, y, x + 2, y + 2), fill=rng.choice(['#38566b', '#90afbc', '#edf2db']))
for y in range(0, 630, 6):
    draw.line((0, y, 1200, y), fill='#0b1a2d')

def sprite(name, size, xy):
    obj = Image.open(ROOT / 'assets/pixel' / (name + '.png')).convert('RGBA')
    obj = ImageOps.contain(obj, size, Image.Resampling.NEAREST)
    image.paste(obj, xy, obj)

sprite('galaxy', (420, 260), (790, 40))
sprite('earth', (210, 210), (910, 397))
sprite('moon', (80, 80), (764, 388))
sprite('rocket', (125, 215), (825, 234))
draw.rectangle((51, 73, 697, 555), fill='#0c1d31', outline='#38566b', width=3)
draw.rectangle((51, 73, 697, 79), fill='#8fe3e1')
font = ROOT / 'assets/fonts/Silkscreen-Regular.ttf'
def text(xy, label, size, color):
    draw.text(xy, label, font=ImageFont.truetype(str(font), size), fill=color)
text((82, 111), 'SIGNAL TO THE STARS', 20, '#fa7183')
text((78, 164), 'STARLING', 70, '#edf2db')
text((82, 279), 'A SPACE WORD GAME', 24, '#8fe3e1')
text((82, 346), '7 PROMPTS', 24, '#edf2db')
text((82, 388), '25 SECONDS EACH', 24, '#edf2db')
text((82, 477), 'PLAY FREE IN YOUR BROWSER', 17, '#e9cc89')
image.save(ROOT / 'assets/starling-social.png', optimize=True)
print('Created assets/starling-social.png (1200 × 630)')
