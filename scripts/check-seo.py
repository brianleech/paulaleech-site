"""Check built production HTML, or live URLs: python scripts/check-seo.py [--live]."""
import json
import sys
import urllib.request
from pathlib import Path
from html.parser import HTMLParser
import xml.etree.ElementTree as ET

LIVE = '--live' in sys.argv
ORIGIN = 'https://paulaleech.com'
PATHS = ['/', '/about', '/work-with-paula', '/supervision', '/courses', '/press', '/contact', '/teaching']

def fetch(path):
    if LIVE:
        return urllib.request.urlopen(ORIGIN + path, timeout=30).read().decode()
    file = path.lstrip('/')
    if not Path(file).suffix:
        file = file.rstrip('/') + '/index.html' if file else 'index.html'
    return (Path('dist') / file).read_text()

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.json_text = []
        self.in_json = False
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if tag == 'script':
            self.in_json = attrs.get('type') == 'application/ld+json'
    def handle_endtag(self, tag):
        if tag == 'script':
            self.in_json = False
    def handle_data(self, data):
        if self.in_json:
            self.json_text.append(data)

def check_links():
    for path in ['/', '/about']:
        html = fetch(path)
        assert '/work-with-paula#' not in html, f'{path}: obsolete service anchors'
        assert 'Explore supervision' in html, f'{path}: missing descriptive CTA'
        p = Page(html)
        assert any(t == 'a' and a.get('href') == '/supervision' for t, a in p.tags)
    print('PASS: service links and labels')

def check_metadata():
    descriptions = []
    for path in PATHS:
        p = Page(fetch(path))
        desc = [a['content'] for t,a in p.tags if t == 'meta' and a.get('name') == 'description']
        assert len(desc) == 1 and desc[0], path
        descriptions.extend(desc)
        canonical = [a['href'] for t,a in p.tags if t == 'link' and a.get('rel') == 'canonical']
        assert canonical == [ORIGIN + path], (path, canonical)
        graphs = [json.loads(s) for s in p.json_text]
        assert graphs and graphs[0]['@context'] == 'https://schema.org', path
        assert any(x['@type'] == 'Person' for x in graphs[0]['@graph']), path
    assert len(set(descriptions)) == len(PATHS), 'Descriptions must be page-specific'
    root = ET.fromstring(fetch('/sitemap.xml'))
    locations = {n.text for n in root.findall('{*}url/{*}loc')}
    assert locations == {ORIGIN + p for p in PATHS}, locations
    assert 'Sitemap: ' + ORIGIN + '/sitemap.xml' in fetch('/robots.txt')
    sandbox = Page(fetch('/sandbox/spec-variants'))
    assert any(t == 'meta' and a.get('name') == 'robots' and 'noindex' in a.get('content','') for t,a in sandbox.tags)
    print('PASS: unique descriptions, canonical URLs, JSON-LD, sitemap, robots, sandbox noindex')

check_links()
if '--links-only' not in sys.argv:
    check_metadata()
