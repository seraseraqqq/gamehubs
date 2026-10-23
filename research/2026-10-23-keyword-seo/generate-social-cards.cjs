// Recreate the four keyword-led social cards. Requires @napi-rs/canvas via NODE_PATH.
const fs=require('fs'),path=require('path');
const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');
const root=path.resolve(__dirname,'../..');
GlobalFonts.registerFromPath(path.join(root,'games/coreball/assets/fonts/Figtree-Latin.woff2'),'Figtree');
// Coreball art superseded by ../2026-10-23-coreball-cats/make-social.cjs.
for(const slug of ['minute-cryptic-unlimited'])for(const guide of [false,true]){
 const cryptic=slug!=='coreball',c=createCanvas(1200,630),x=c.getContext('2d');
 const bg=cryptic?'#f7f4eb':'#101c2c',ink=cryptic?'#29392e':'#f7f4eb',accent=cryptic?'#496650':'#95c9bd';
 x.fillStyle=bg;x.fillRect(0,0,1200,630);x.fillStyle=accent;x.fillRect(72,72,64,6);
 x.font='600 19px Figtree';x.fillText(guide?'FREE GAME GUIDE':'FREE BROWSER GAME',72,121);
 x.fillStyle=ink;x.font='700 68px Figtree';
 const lines=cryptic?(guide?['How to solve','cryptic clues']:['Minute Cryptic','Unlimited']):(guide?['Coreball tips','& level guide']:['Coreball','Play free online']);
 lines.forEach((line,i)=>x.fillText(line,72,240+i*88));
 x.font='400 27px Figtree';x.fillStyle=accent;
 x.fillText(cryptic?(guide?'5 clue types · Worked examples · Explained answers':'20 original clues · Hints · No daily play limit'):(guide?'Shot timing · Practice mode · 30-level reference':'30 original levels · Unlimited retries · No signup'),72,474);
 x.font='400 18px Figtree';x.fillText(cryptic?'Independent cryptic practice · Fixed replayable collection':'Independent Coreball-style game',72,550);
 const asset=guide?'guide-card.png':'social-card.png';fs.writeFileSync(path.join(root,'games',slug,'assets',asset),c.toBuffer('image/png'));
}
