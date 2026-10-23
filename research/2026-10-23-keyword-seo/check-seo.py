"""Validate both complete static exports without third-party dependencies.
Run from any directory: python research/2026-10-23-keyword-seo/check-seo.py
Origins below are fixtures, never deployment configuration.
"""
from pathlib import Path
from html.parser import HTMLParser
import subprocess, os, json, re
from urllib.parse import urlsplit, unquote
ROOT = Path(__file__).resolve().parents[2]
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__(); self.meta={}; self.links=[]; self.assets=[]; self.ids=[]; self.h1=0; self.schemas=[]; self.script=None; self.feed(text)
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content','')
        if tag=='link':
            if a.get('rel')=='canonical':self.meta['canonical']=a['href']
            if 'href' in a:self.assets.append(a['href'])
        if tag=='a' and 'href' in a:self.links.append(a['href'])
        if tag in ['script','img'] and 'src' in a:self.assets.append(a['src'])
        if tag=='script' and a.get('type')=='application/ld+json':self.script=''
    def handle_data(self, data):
        if self.script is not None:self.script+=data
    def handle_endtag(self, tag):
        if tag=='script' and self.script is not None:self.schemas.append(json.loads(self.script));self.script=None
results=[]
for slug,guide,keyword in [('coreball','coreball-tips.html','coreball'),('minute-cryptic-unlimited','how-to-solve-cryptic-clues.html','minute cryptic unlimited')]:
    site=ROOT/'games'/slug; out=site/'dist'; origin='https://'+slug+'.example'
    for mode in ['production','preview','default']:
        env={**os.environ};env.pop('SITE_ORIGIN',None);env.pop('VERCEL_ENV',None)
        args=['node','scripts/build.mjs']
        if mode!='default':args+=['--origin',origin];env['VERCEL_ENV']=mode
        subprocess.run(args,cwd=site,env=env,check=True,capture_output=True)
        pages={n:Page((out/n).read_text(encoding='utf8')) for n in ['index.html',guide]}
        for name,p in pages.items():
            html=(out/name).read_text(encoding='utf8'); assert p.h1==1,(slug,name,'h1')
            assert len(p.ids)==len(set(p.ids)),(slug,name,'duplicate IDs')
            title=re.search(r'<title>(.*?)</title>',html).group(1)
            assert 20<len(title)<75 and 70<len(p.meta['description'])<180
            assert not re.search(r'Pinlark|Clue Garden',html,re.I)
            assert p.meta['og:title']==p.meta['twitter:title']==title.replace('&amp;','&')
            assert p.meta['description']==p.meta['og:description']==p.meta['twitter:description']
            if name=='index.html':
                assert keyword in title.lower()
                faq=p.schemas[0]['@graph'][1]['mainEntity']
                visible=re.findall(r'<details><summary>(.*?)</summary><p>(.*?)</p></details>',html)
                assert [(q['name'],q['acceptedAnswer']['text']) for q in faq]==visible,(slug,'FAQ drift')
            for href in p.links+p.assets:
                u=urlsplit(href)
                if u.scheme or href.startswith('//'):continue
                target=out/unquote(u.path or name)
                if target.is_dir():target=target/'index.html'
                assert target.exists(),(slug,name,'broken link',href)
                if u.fragment and target.suffix=='.html':assert u.fragment in Page(target.read_text(encoding='utf8')).ids,(slug,href)
            for tag in ['og:image','twitter:image']:
                assert (out/'assets'/Path(urlsplit(p.meta[tag]).path).name).exists()
            if mode=='production':
                url=origin+('/' if name=='index.html' else '/'+name)
                assert p.meta['canonical']==p.meta['og:url']==url
                assert p.meta['robots'].startswith('index,')
                assert all(p.meta[t].startswith(origin+'/assets/') for t in ['og:image','twitter:image'])
                entity=p.schemas[0].get('@graph',[p.schemas[0]])[0];assert entity['url']==url
            else:assert p.meta['robots']=='noindex, nofollow' and 'canonical' not in p.meta
        if mode=='production':
            sitemap=(out/'sitemap.xml').read_text();assert set(re.findall(r'<loc>(.*?)</loc>',sitemap))=={origin+'/',origin+'/'+guide}
            assert 'Sitemap: '+origin+'/sitemap.xml' in (out/'robots.txt').read_text()
        else:assert not (out/'sitemap.xml').exists() and 'Disallow: /' in (out/'robots.txt').read_text()
        assert not any((out/n).exists() for n in ['README.md','scripts','tests','design','PROVENANCE.md'])
        results.append({'site':slug,'mode':mode,'pages':2,'passed':True})
# Default noindex exports are left behind intentionally.
(ROOT/'research/2026-10-23-keyword-seo/static-checks.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps(results,indent=2))
