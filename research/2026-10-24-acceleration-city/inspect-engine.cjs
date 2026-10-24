const fs=require('fs');const p='research/2026-10-24-acceleration-city/raw/netEmbed.txt';fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace(/token=[^&"\s]+/g,'token=[REDACTED_PUBLIC_PAGE_TOKEN]'));
const s=fs.readFileSync('research/2026-10-24-acceleration-city/raw/officialMain.txt','utf8');const i=s.indexOf('loaderUrl:'); console.log(s.slice(i,i+600));
