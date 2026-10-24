// Publisher-provided Snow Rider 3D player. No original game simulation is imported.
const GAME_URL='https://html5.gamedistribution.com/3b79a8537ebc414fb4f9672a9b8c68c8/';
function embedURL(pageURL){const page=new URL(pageURL),url=new URL(GAME_URL);url.searchParams.set('gd_sdk_referrer_url',page.origin+page.pathname);return url.href;}
const $=id=>document.getElementById(id),stage=$('game'),mount=$('player-mount'),status=$('player-status');
$('direct').href=embedURL(location.href);
let frame,slowTimer,version=0;
function loadGame(){
 clearTimeout(slowTimer);const attempt=++version;
 frame?.remove();stage.dataset.state='connecting';$('poster').hidden=true;$('reload').disabled=false;
 status.textContent='Opening the publisher player… The game may show a privacy prompt or an ad.';
 frame=document.createElement('iframe');frame.id='publisher-game';frame.title='Snow Rider 3D — GameDistribution player';frame.allow='autoplay; fullscreen; gamepad';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';frame.src=embedURL(location.href);
 frame.addEventListener('load',()=>{if(attempt!==version)return;stage.dataset.state='connected';clearTimeout(slowTimer);status.textContent='Player page opened. Choose Play inside the player if shown; the game may still be loading.';});
 frame.addEventListener('error',()=>{if(attempt!==version)return;stage.dataset.state='connection-error';clearTimeout(slowTimer);status.textContent='The publisher player could not connect. Try Reload game or Open game.';});
 mount.append(frame);frame.focus();
 slowTimer=setTimeout(()=>{if(attempt===version&&stage.dataset.state==='connecting'){stage.dataset.state='slow';status.textContent='The publisher is taking longer to respond. You can wait, reload or open the game in its own tab.';}},20000);
}
$('play').addEventListener('click',loadGame);$('reload').addEventListener('click',loadGame);
async function toggleFullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else if(stage.requestFullscreen)await stage.requestFullscreen();else status.textContent='Fullscreen is unavailable here. Open the game in its own tab for more room.';}catch{status.textContent='Fullscreen is unavailable here. Try Open game.';}}
$('fullscreen').addEventListener('click',toggleFullscreen);$('exit-fullscreen').addEventListener('click',toggleFullscreen);
document.addEventListener('fullscreenchange',()=>{$('fullscreen').setAttribute('aria-label',document.fullscreenElement?'Exit fullscreen':'Enter fullscreen');});
window.addEventListener('offline',()=>{status.textContent='Your connection is offline. The publisher game may need a connection to finish loading.';});
