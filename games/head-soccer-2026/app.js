// Site controls only. The Construct game is delivered by the official GamePix feed.
export const GAME_URL='https://play.gamepix.com/head-soccer-2026/embed?sid=1';
const $=s=>document.querySelector(s),slot=$('#frame-slot'),start=$('#start');
const modes={
 solo:'<p class="mode-title">You vs the CPU</p><dl><div><dt>Move</dt><dd><kbd>←</kbd> <kbd>→</kbd></dd></div><div><dt>Jump</dt><dd><kbd>↑</kbd></dd></div><div><dt>Shoot</dt><dd><kbd>Z</kbd> <kbd>X</kbd></dd></div></dl><p class="control-note">Click inside the game first, then use your keyboard.</p>',
 duo:'<p class="mode-title">Player 1 · left side</p><dl><div><dt>Move</dt><dd><kbd>A</kbd> <kbd>D</kbd></dd></div><div><dt>Jump</dt><dd><kbd>W</kbd></dd></div><div><dt>Shoot</dt><dd><kbd>N</kbd> <kbd>M</kbd></dd></div></dl><p class="mode-title">Player 2 · right side</p><dl><div><dt>Move</dt><dd><kbd>←</kbd> <kbd>→</kbd></dd></div><div><dt>Jump</dt><dd><kbd>↑</kbd></dd></div><div><dt>Shoot</dt><dd><kbd>1</kbd> <kbd>2</kbd></dd></div></dl><p class="control-note">Choose 2 Players inside the game. Both players share one keyboard.</p>',
 touch:'<p class="mode-title">Take the pitch with you.</p><p class="control-note">Turn your phone sideways for a bigger pitch. Use the game’s on-screen arrows to move and jump, and the shot buttons to kick.</p><p class="control-note">Choose single-player on a phone. Local two-player mode works best on a computer with a keyboard.</p>'
};
function launch(){
 $('#load-help').hidden=false;$('#load-help').open=false;start.disabled=true;
 $('#player-status').textContent='Opening the game…';
 const frame=document.createElement('iframe');frame.title='Play Head Soccer 2026 — GamePix';frame.allow='autoplay; fullscreen; gamepad';frame.allowFullscreen=true;
 frame.sandbox='allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-pointer-lock';frame.referrerPolicy='strict-origin-when-cross-origin';
 frame.addEventListener('load',()=>{$('#player-status').textContent='Game page opened. Follow any prompts inside.';});
 frame.addEventListener('error',()=>{$('#player-status').textContent='The game could not be opened.';$('#load-help').hidden=false;});
 frame.src=GAME_URL;slot.replaceChildren(frame);slot.classList.add('active');$('#launch').hidden=true;
}
start.addEventListener('click',launch);$('#reload').addEventListener('click',()=>{if(window.confirm('Reload the game? Your current match will end.'))launch();});
document.querySelectorAll('[data-mode]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('#control-copy').innerHTML=modes[button.dataset.mode];}));
function focusMode(enabled){document.body.classList.toggle('focus-mode',enabled);$('#focus').setAttribute('aria-pressed',String(enabled));$('#focus').textContent=enabled?'Exit focus mode':'Focus mode';}
$('#focus').addEventListener('click',()=>focusMode(!document.body.classList.contains('focus-mode')));
document.addEventListener('keydown',e=>{if(e.key==='Escape')focusMode(false);});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement){await document.exitFullscreen();}else if($('#player').requestFullscreen){await $('#player').requestFullscreen();}else{focusMode(true);$('#player-status').textContent='Fullscreen is unavailable here. Focus mode is on.';}}catch{focusMode(true);$('#player-status').textContent='Fullscreen was unavailable. Focus mode is on.';}});
document.addEventListener('fullscreenchange',()=>{$('#fullscreen').firstChild.textContent=document.fullscreenElement?'Exit fullscreen ':'Fullscreen ';});
