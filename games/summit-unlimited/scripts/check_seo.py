#!/usr/bin/env python3
"""Check source HTML or a built STARLING site without third-party dependencies."""
import argparse
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import urlsplit, unquote
import xml.etree.ElementTree as ET


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.meta, self.links, self.ids, self.schema, self.text = {}, [], [], [], []
        self.h1_count = 0
        self.in_schema = False
        self.in_title = False
        self.title = ''

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'h1':
            self.h1_count += 1
        if tag == 'meta':
            self.meta[attrs.get('name', attrs.get('property', ''))] = attrs.get('content', '')
        if tag in ('a', 'link', 'script', 'img'):
            self.links.append((tag, attrs))
        if tag == 'script' and attrs.get('type') == 'application/ld+json':
            self.in_schema = True
        if tag == 'title':
            self.in_title = True

    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_schema = False
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_schema:
            self.schema.append(data)
        else:
            self.text.append(data)
        if self.in_title:
            self.title += data


def check(root):
    page = Page()
    page.feed((root / 'index.html').read_text())
    assert page.h1_count == 1, 'Expected one descriptive H1'
    assert len(page.ids) == len(set(page.ids)), 'Duplicate HTML IDs'
    assert 'word game' in page.title.lower(), 'Title must describe the game'
    assert page.meta.get('description'), 'Missing description'
    assert 'noindex' not in page.meta.get('robots', ''), 'Public HTML is noindex'
    for key in ('og:title', 'og:description', 'og:image', 'twitter:card', 'twitter:image'):
        assert page.meta.get(key), f'Missing {key}'
    assert page.meta['og:image:width'] == '1200' and page.meta['og:image:height'] == '630'
    text = ' '.join(page.text)
    for phrase in ('How to play STARLING', '25 seconds', 'seven prompts', 'Frequently asked questions'):
        assert phrase in text, f'Missing static text: {phrase}'
    for tag, attrs in page.links:
        target = attrs.get('href', attrs.get('src', ''))
        parsed = urlsplit(target)
        if parsed.scheme or parsed.netloc:
            continue
        if parsed.fragment:
            assert unquote(parsed.fragment) in page.ids, f'Broken anchor: {target}'
        if parsed.path and parsed.path != './':
            assert (root / unquote(parsed.path)).is_file(), f'Missing asset: {target}'
    schema = json.loads(''.join(page.schema))
    webpage = schema['@graph'][0]
    game = webpage['mainEntity']
    assert {'VideoGame', 'WebApplication'}.issubset(game['@type'])
    assert game['isAccessibleForFree'] is True and game['playMode'] == 'SinglePlayer'
    canonical_links = [attrs['href'] for tag, attrs in page.links if attrs.get('rel') == 'canonical']
    if canonical_links:
        assert len(canonical_links) == 1
        canonical = canonical_links[0]
        assert canonical.startswith('https://')
        assert page.meta['og:url'] == webpage['url'] == game['url'] == canonical
        assert page.meta['og:image'] == page.meta['twitter:image'] == canonical + 'assets/starling-social.png'
        robots = (root / 'robots.txt').read_text()
        assert 'Sitemap: ' + canonical + 'sitemap.xml' in robots
        sitemap = ET.parse(root / 'sitemap.xml')
        assert [x.text for x in sitemap.findall('.//{*}loc')] == [canonical]
        assert not any((root / x).exists() for x in ('research', 'design', 'scripts', 'output'))
        print('PASS: production canonical, social URLs, JSON-LD, sitemap and runtime-only output')
    else:
        assert not (root / 'sitemap.xml').exists(), 'Do not ship a guessed source sitemap'
        print('PASS: source metadata and static guide; production URL awaits build configuration')
    print(f'PASS: one H1, working local links, static instructions; title {len(page.title)} / description {len(page.meta["description"])} characters')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', nargs='?', type=Path, default=Path(__file__).resolve().parents[1])
    check(parser.parse_args().root.resolve())
