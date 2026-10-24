// The game remains an unmodified, cross-origin Unity build. These controls manage the page only.
const $=s=>document.querySelector(s),frame=$('#game-frame'),status=$('#player-status'),prompt=$('#reload-prompt');
let warningTimer;
function observeLoad(){clearTimeout(warningTimer);warningTimer=setTimeout(()=>{status.textContent='If the player stays blank, use loading help. Loading progress is shown inside the game.';},30000);}
frame.addEventListener('load',()=>{status.textContent='Game page opened. Wait for Unity, then select a level inside.';});
frame.addEventListener('error',()=>{status.textContent='The game page could not open. Try Reload or loading help.';});
observeLoad();
$('#reload').addEventListener('click',()=>{prompt.hidden=false;$('#cancel-reload').focus();});
$('#cancel-reload').addEventListener('click',()=>{prompt.hidden=true;$('#reload').focus();});
$('#confirm-reload').addEventListener('click',()=>{prompt.hidden=true;status.textContent='Reloading game page. Unity loads inside the player.';frame.src=frame.src;observeLoad();});
function focusMode(enabled){document.body.classList.toggle('focus-mode',enabled);$('#focus').setAttribute('aria-pressed',String(enabled));$('#focus').textContent=enabled?'Exit focus mode':'Focus mode';if(!enabled&&status.textContent.startsWith('Fullscreen unavailable.'))status.textContent='Focus mode closed. Click inside the game to continue.';}
$('#focus').addEventListener('click',()=>focusMode(!document.body.classList.contains('focus-mode')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){focusMode(false);prompt.hidden=true;}});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if($('#player').requestFullscreen)await $('#player').requestFullscreen();else throw Error('unsupported');}catch{focusMode(true);status.textContent='Fullscreen unavailable. Focus mode is on; use Exit focus mode to return.';}});
document.addEventListener('fullscreenchange',()=>{$('#fullscreen').childNodes[0].textContent=document.fullscreenElement?'Exit fullscreen ':'Fullscreen ';});
// Parent keystrokes are never forwarded: cross-origin frames isolate game input and storage.
