// Original code-rendered Coreball social cards. NODE_PATH supplies @napi-rs/canvas and sharp.
const fs=require('fs'),path=require('path');const {createCanvas,GlobalFonts}=require('@napi-rs/canvas');const sharp=require('sharp');
const root=path.resolve(__dirname,'../..');GlobalFonts.registerFromPath(path.join(root,'games/coreball/assets/fonts/Figtree-Latin.woff2'),'Figtree');
const {drawPaw}=require(path.join(root,'games/coreball/paws.js'));
(async()=>{for(const guide of [false,true]){
const c=createCanvas(1200,630),x=c.getContext('2d');x.fillStyle='#f8f6ed';x.fillRect(0,0,1200,630);x.fillStyle='#e6eddf';x.beginPath();x.roundRect(650,40,510,550,28);x.fill();
x.fillStyle='#293f35';x.font='800 74px Figtree';x.fillText(guide?'Coreball tips':'Coreball',65,210);x.font='500 39px Figtree';x.fillText(guide?'Find your timing.':'Soft ball.',65,283);x.fillText(guide?'Place every pin.':'Sharp timing.',65,335);x.font='400 23px Figtree';x.fillStyle='#5b6c60';x.fillText(guide?'Shot timing · Practice · 30 levels':'30 levels · Playful paws · Free to play',65,444);
const cx=905,cy=255,r=83;
for(const angle of [-.5,1,2.6,4.1]){const px=cx+Math.cos(angle)*148,py=cy+Math.sin(angle)*148;x.strokeStyle='#bd987b';x.lineWidth=7;x.lineCap='round';x.beginPath();x.moveTo(cx+Math.cos(angle)*r,cy+Math.sin(angle)*r);x.lineTo(px,py);x.stroke();x.strokeStyle='#fff0d5';x.lineWidth=4;x.stroke();x.fillStyle='#fff0d5';x.beginPath();x.arc(px,py,9,0,Math.PI*2);x.fill();x.strokeStyle='#bd987b';x.lineWidth=1.5;x.stroke();}
const ball=x.createRadialGradient(cx-33,cy-35,6,cx+8,cy+9,r);ball.addColorStop(0,'#ffddba');ball.addColorStop(.6,'#f2b493');ball.addColorStop(1,'#df9d87');x.fillStyle=ball;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();
for(const offset of [800,980]){x.save();x.translate(offset,440);x.scale(1.05,1.05);drawPaw(x);x.restore();}
x.fillStyle='#355e4b';x.font='600 16px Figtree';x.fillText('Independent browser timing game',65,550);
const dest=path.join(root,'games/coreball/assets',guide?'guide-card.png':'social-card.png');await sharp(c.toBuffer('image/png')).png({palette:true,colors:256}).toFile(dest);
}})();
