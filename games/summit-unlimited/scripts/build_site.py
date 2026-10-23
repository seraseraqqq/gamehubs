#!/usr/bin/env python3
"""Build the public static site using an explicit production URL; no dependencies."""
import argparse
import html
import json
from pathlib import Path
import re
import shutil
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SPRITES = ('rocket', 'spaceport', 'earth', 'moon', 'mars', 'jupiter', 'saturn',
           'sun', 'satellite', 'asteroids', 'beacon', 'galaxy', 'cloud', 'meteor')


def production_url(value):
    parsed = urlsplit(value)
    hostname = parsed.hostname or ''
    if (parsed.scheme != 'https' or not hostname or parsed.username or parsed.password
            or parsed.port or parsed.query or parsed.fragment or parsed.path not in ('', '/')
            or hostname in ('localhost', '127.0.0.1', '::1')
            or hostname.endswith(('.localhost', '.local'))):
        raise argparse.ArgumentTypeError('Provide the real HTTPS site origin, without a path, query or local host.')
    return value.rstrip('/') + '/'


def build(site_url, output):
    output = output.resolve()
    # Never overwrite the working game or another existing directory.
    marker = output / '.starling-build'
    if output == ROOT or ROOT.is_relative_to(output):
        raise ValueError('Output must not contain the source directory.')
    if output.exists() and any(output.iterdir()) and not marker.exists():
        raise ValueError('Output must be empty or a previous STARLING build.')
    output.mkdir(parents=True, exist_ok=True)
    marker.write_text('Generated STARLING public site.\n')
    page = (ROOT / 'index.html').read_text()
    canonical = html.escape(site_url, quote=True)
    if '  <!-- Production canonical and absolute social URLs are inserted by scripts/build_site.py. -->' in page:
        page = page.replace('  <!-- Production canonical and absolute social URLs are inserted by scripts/build_site.py. -->',
                            f'  <link rel="canonical" href="{canonical}">\n  <meta property="og:url" content="{canonical}">')
    else:
        page = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{canonical}">', page)
        page = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{canonical}">', page)
    page = re.sub(r'content="(?:\./assets/starling-social\.png|https?://[^"]+/assets/starling-social\.png)"',
                  f'content="{canonical}assets/starling-social.png"', page)
    pattern = r'(<script type="application/ld\+json" id="game-schema">)(.*?)(</script>)'
    match = re.search(pattern, page, re.S)
    schema = json.loads(match.group(2))
    webpage = schema['@graph'][0]
    webpage.update({'@id': site_url + '#webpage', 'url': site_url,
                    'image': site_url + 'assets/starling-social.png'})
    webpage['mainEntity'].update({'@id': site_url + '#game', 'url': site_url,
                                 'image': site_url + 'assets/starling-social.png'})
    page = page[:match.start(2)] + json.dumps(schema, ensure_ascii=False, indent=2) + page[match.end(2):]
    (output / 'index.html').write_text(page)
    for filename in ('style.css', 'answer-bank.js', 'scene.js', 'game.js'):
        shutil.copy2(ROOT / filename, output / filename)
    public_assets = ['icon.svg', 'starling-social.png', 'fonts/Silkscreen-Regular.ttf', 'fonts/OFL.txt']
    public_assets += [f'pixel/{name}.png' for name in SPRITES]
    for filename in public_assets:
        target = output / 'assets' / filename
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(ROOT / 'assets' / filename, target)
    (output / 'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: ' + site_url + 'sitemap.xml\n')
    ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
    ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
    sitemap = ET.Element(ns + 'urlset')
    ET.SubElement(ET.SubElement(sitemap, ns + 'url'), ns + 'loc').text = site_url
    ET.ElementTree(sitemap).write(output / 'sitemap.xml', encoding='utf-8', xml_declaration=True)
    print(f'Built {output}\nCanonical: {site_url}\nSitemap: {site_url}sitemap.xml')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--site-url', required=True, type=production_url)
    parser.add_argument('--output', type=Path, default=ROOT / 'dist')
    args = parser.parse_args()
    build(args.site_url, args.output)
