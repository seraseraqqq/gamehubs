#!/usr/bin/env python3
"""Build/export validation; uses only local interpolation fixtures and never deploys."""
from pathlib import Path
import json,re,subprocess,os,struct,html,xml.etree.ElementTree as ET
from html.parser import HTMLParser
from urllib.parse import urlsplit
R=Path(__file__).resolve().parents[2];OUT=Path(__file__).resolve().parent
class Doc(HTMLParser):
 def __init__(self,text):super().__init__();self.nodes=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.nodes.append((tag,dict(attrs)))
checks=[]
def check(slug,name,value):
 checks.append({'game':slug,'check':name,'pass':bool(value)})
 if not value:raise AssertionError(slug+': '+name)
def build(slug,origin=None,environment='production'):
 args=['node',str(R/'games'/slug/'scripts/build.mjs')]+(['--origin',origin]if origin else [])
 subprocess.run(args,check=True,capture_output=True,env={**os.environ,'VERCEL_ENV':environment,'SITE_ORIGIN':''})
for slug in ['orbit-pins','cryptic-practice']:
 root=R/'games'/slug;origin='https://'+slug+'.example'
 build(slug,origin)
 for mode,p in [('source',root),('production',root/'dist')]:
  text=(p/'index.html').read_text();d=Doc(text)
  meta={a.get('name',a.get('property')):a.get('content')for tag,a in d.nodes if tag=='meta'}
  ids=[a['id']for tag,a in d.nodes if 'id'in a]
  check(slug,mode+': single H1 and unique IDs',sum(tag=='h1'for tag,a in d.nodes)==1 and len(ids)==len(set(ids)))
  check(slug,mode+': title and description present',bool(re.search('<title>.+?</title>',text)) and 90<len(meta['description'])<190)
  schema=json.loads(re.search(r'<script type="application/ld\+json" id="game-schema">(.*?)</script>',text,re.S)[1])
  check(slug,mode+': truthful game schema',schema['@graph'][0]['playMode']=='SinglePlayer' and 'aggregateRating'not in str(schema))
  visible=re.sub(r'<script.*?</script>','',text,flags=re.S)
  if slug=='orbit-pins':
   title=html.unescape(re.search(r'<title>(.*?)</title>',text,re.S)[1]).lower()
   h1=html.unescape(re.sub('<[^>]+>','',re.search(r'<h1>(.*?)</h1>',visible,re.S)[1])).lower()
   inventory=json.loads((R/'matrix-sites.json').read_text())
   entries=inventory if isinstance(inventory,list)else next(v for v in inventory.values()if isinstance(v,list))
   site=next(v for v in entries if v['siteId']==slug)
   check(slug,mode+': approved Coreball target in inventory and prominent page copy',site['primaryKeyword']=='coreball' and all('coreball' in value for value in [title,h1,meta['description'].lower(),schema['@graph'][0]['description'].lower()]) and 'independent' in meta['description'].lower())
  check(slug,mode+': structured FAQ matches visible content',all(q['name']in html.unescape(visible)and q['acceptedAnswer']['text']in html.unescape(visible)for q in schema['@graph'][1]['mainEntity']))
  check(slug,mode+': 1200x630 social PNG',struct.unpack('>II',(p/'assets/social-card.png').read_bytes()[16:24])==(1200,630))
  refs=[a.get('src')or a.get('href')for tag,a in d.nodes if tag in ['script','link','img']and(a.get('src')or a.get('href'))]
  check(slug,mode+': runtime asset references exist',all((p/urlsplit(x).path.lstrip('/')).is_file()for x in refs if not urlsplit(x).netloc and not x.startswith(('data:','#'))))
  urls=re.findall(r'url\([\"\']?([^\)\"\']+)',(p/'style.css').read_text())
  check(slug,mode+': fonts local and licensed',all(not urlsplit(x).netloc and(p/x.removeprefix('./')).exists()for x in urls)and(p/'assets/fonts/Figtree-OFL.txt').exists())
  check(slug,mode+': no zoom lock, no-JS notice','user-scalable=no'not in text and'maximum-scale=1'not in text and'<noscript>'in text)
  if mode=='source':check(slug,'Source is noindex with no unowned canonical','noindex'in meta['robots']and not any(tag=='link'and a.get('rel')=='canonical'for tag,a in d.nodes))
  else:
   check(slug,'Production origin interpolation',origin+'/'in text and origin+'/assets/social-card.png'in text and 'index, follow'in meta['robots'])
   check(slug,'Production robots and sitemap match',origin+'/sitemap.xml'in(p/'robots.txt').read_text() and origin+'/'in(p/'sitemap.xml').read_text())
   check(slug,'Development files excluded',all(not(p/x).exists()for x in ['scripts','tests','design','README.md','PROVENANCE.md']))
 build(slug,origin,'preview');p=root/'dist'
 check(slug,'Vercel preview stays noindex','noindex'in(p/'index.html').read_text()and'Disallow: /'in(p/'robots.txt').read_text()and not(p/'sitemap.xml').exists())
 build(slug);check(slug,'Default build stays noindex','noindex'in(root/'dist/index.html').read_text())
 for invalid in ['http://example.com','https://localhost','https://example.com/path','https://user:pass@example.com','https://example.com:444']:
  process=subprocess.run(['node',str(root/'scripts/build.mjs'),'--origin',invalid],capture_output=True,env={**os.environ,'SITE_ORIGIN':'','VERCEL_ENV':'production'})
  check(slug,'Rejects invalid origin '+invalid,process.returncode!=0)
(OUT/'static-checks.json').write_text(json.dumps({'checks':checks,'passed':sum(c['pass']for c in checks),'total':len(checks)},indent=2))
print('PASS',len(checks),'static SEO / export checks; final exports remain noindex.')
