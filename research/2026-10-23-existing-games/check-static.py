#!/usr/bin/env python3
"""Repeatable local SEO/export checks. Builds only; never deploys."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json,re,subprocess,struct,os,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[2]
OUT=Path(__file__).resolve().parent
GAMES={'block-blast-unblocked':'https://playblockblastunblocked.com','costcodle':'https://costcodle-unlimited.vercel.app','gulperio':'https://gulperio.com','summit-unlimited':'https://krilliononline.com'}
class Document(HTMLParser):
 def __init__(self,s):super().__init__();self.nodes=[];self.feed(s)
 def handle_starttag(self,tag,attrs):self.nodes.append((tag,dict(attrs)))
def run(args,env=None):subprocess.run(args,cwd=ROOT,check=True,capture_output=True,env={**os.environ,**(env or {})})
checks=[]
def check(game,name,value):
 checks.append({'game':game,'check':name,'pass':bool(value)})
 if not value:raise AssertionError(f'{game}: {name}')
for slug,origin in GAMES.items():
 p=ROOT/'games'/slug
 command=['python3',str(p/'scripts/build_site.py'),'--site-url',origin] if slug=='summit-unlimited' else ['node',str(p/'scripts/build.mjs'),'--origin',origin]
 run(command,{'VERCEL_ENV':'preview'})
 preview=(p/'dist/index.html').read_text()
 check(slug,'Vercel previews are noindex',bool(re.search(r'name="robots" content="noindex',preview)))
 check(slug,'Preview robots disallows and has no sitemap','Disallow: /' in (p/'dist/robots.txt').read_text() and not (p/'dist/sitemap.xml').exists())
 run(command,{'VERCEL_ENV':'production'})
 for mode in ['source','export']:
  base=p if mode=='source' else p/'dist';s=(base/'index.html').read_text();doc=Document(s)
  attrs=lambda tag,name,value:[a for t,a in doc.nodes if t==tag and a.get(name)==value]
  metas={a.get('name',a.get('property')):a.get('content','') for t,a in doc.nodes if t=='meta'}
  check(slug,mode+': exactly one static H1',len([t for t,a in doc.nodes if t=='h1'])==1)
  ids=[a['id'] for t,a in doc.nodes if 'id' in a]
  check(slug,mode+': unique element IDs',len(ids)==len(set(ids)))
  title=re.search(r'<title>(.*?)</title>',s,re.S).group(1)
  check(slug,mode+': title and description present',15<len(title)<85 and 70<len(metas['description'])<190)
  check(slug,mode+': canonical and social URL match',attrs('link','rel','canonical')[0]['href']==origin+'/' and metas['og:url']==origin+'/')
  check(slug,mode+': no zoom lock or keyword dump','user-scalable=no' not in s and 'maximum-scale=1' not in s and 'keywords' not in metas)
  schemas=[json.loads(x) for x in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',s,re.S)]
  check(slug,mode+': structured data parses and no fake ratings',bool(schemas) and all('aggregateRating' not in json.dumps(x) for x in schemas))
  # FAQ schema text must appear in the actual source HTML, not only JSON-LD.
  visible=re.sub(r'<script\b[^>]*>.*?</script>','',s,flags=re.S)
  faq=[g for x in schemas for g in x.get('@graph',[]) if g.get('@type')=='FAQPage']
  check(slug,mode+': structured FAQ matches visible copy',all(q['name'] in visible and q['acceptedAnswer']['text'] in visible for f in faq for q in f['mainEntity']))
  image=metas['og:image'];imagefile=base/urlsplit(image).path.lstrip('/')
  check(slug,mode+': real 1200x630 social PNG',imagefile.exists() and struct.unpack('>II',imagefile.read_bytes()[16:24])==(1200,630) and metas.get('og:image:width')=='1200' and metas.get('og:image:height')=='630' and metas['twitter:image']==image)
  check(slug,mode+': crawlable guide and JavaScript notice','<noscript>' in s and len(re.findall('<details',s))>=5)
  refs=[a.get('src') or a.get('href') for t,a in doc.nodes if t in ['img','script','link'] and (a.get('src') or a.get('href'))]
  local=[urlsplit(x).path.lstrip('/') for x in refs if not urlsplit(x).netloc and not x.startswith(('data:','#'))]
  check(slug,mode+': static asset references exist',all((base/x).is_file() for x in local))
  for _,css in [('style',base/'style.css')]:
   urls=re.findall(r'url\([\"\']?([^\)\"\']+)',css.read_text())
   check(slug,mode+': CSS assets local and present',all(not urlsplit(x).netloc and (base/x.lstrip('/').removeprefix('./')).exists() for x in urls if not x.startswith('data:')))
 sitemap=ET.parse(p/'dist/sitemap.xml');locs=[e.text for e in sitemap.iter() if e.tag.endswith('}loc')]
 check(slug,'Production robots/sitemap match origin',locs==[origin+'/'] and origin+'/sitemap.xml' in (p/'dist/robots.txt').read_text())
 check(slug,'Runtime export excludes development sources',all(not (p/'dist'/x).exists() for x in ['design','scripts','tests','output','README.md','games_data.json']))
 if slug=='costcodle':
  items=(p/'items.js').read_text();paths=re.findall(r'"image":\s*"([^"]+)"',items)
  check(slug,'All 152 catalog images are local and exist',len(paths)==152 and all((p/x.lstrip('/')).exists() for x in paths))
  check(slug,'Daily calendar uses UTC',"toISOString().slice(0, 10)" in (p/'game.js').read_text() or "toISOString().slice(0,10)" in (p/'game.js').read_text())
 if slug=='summit-unlimited':run(['python3',str(p/'scripts/check_seo.py'),str(p/'dist')])
(OUT/'static-checks.json').write_text(json.dumps({'checks':checks,'passed':sum(c['pass'] for c in checks),'total':len(checks)},indent=2))
print(f'PASS {len(checks)} static SEO/export checks across four games')
