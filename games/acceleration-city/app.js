const SOURCE='https://activities.cs2n.org/acceleration-city/';
const stage=document.querySelector('#stage'),status=document.querySelector('#game-status'),opening=document.querySelector('#opening-screen'),shell=document.querySelector('#game');
const play=document.querySelector('#play-button'),reload=document.querySelector('#reload-game'),focus=document.querySelector('#focus-game'),cinema=document.querySelector('#cinema-button'),fullscreen=document.querySelector('#fullscreen-button');
const reloadConfirmation=document.querySelector('#reload-confirmation'),confirmReload=document.querySelector('#confirm-reload'),cancelReload=document.querySelector('#cancel-reload');
let frame=null,timer=null;
function launch(){
  if(frame)return;
  document.querySelector('#launch-screen').hidden=true;opening.hidden=false;status.textContent='Opening CS2N…';
  frame=document.createElement('iframe');frame.title='Acceleration City — original CS2N game';frame.src=SOURCE;frame.allow='fullscreen; autoplay; gamepad';frame.allowFullscreen=true;frame.referrerPolicy='origin';
  frame.addEventListener('load',()=>{opening.hidden=true;status.textContent='Source opened · game may still be loading';frame.focus();});
  frame.addEventListener('error',()=>showHelp('The source could not be opened. Try Reload or Open original.'));
  stage.append(frame);reload.disabled=false;focus.disabled=false;
  timer=setTimeout(()=>showHelp('Still waiting? If the game is blank, try the help below.'),25000);
}
function showHelp(message){opening.hidden=true;status.textContent=message;document.querySelector('#loading-help').open=true;}
function setCinema(active){document.body.classList.toggle('cinema',active);cinema.setAttribute('aria-pressed',String(active));cinema.textContent=active?'Exit focus view':'Focus view';}
function dismissReload(){reloadConfirmation.hidden=true;reload.setAttribute('aria-expanded','false');reload.focus();}
play.addEventListener('click',launch);
focus.addEventListener('click',()=>{if(frame){clearTimeout(timer);frame.focus();status.textContent='Game focused · click inside the game to drive';}});
reload.addEventListener('click',()=>{if(!frame)return;reloadConfirmation.hidden=false;reload.setAttribute('aria-expanded','true');cancelReload.focus();});
cancelReload.addEventListener('click',dismissReload);
confirmReload.addEventListener('click',()=>{if(!frame||reloadConfirmation.hidden)return;dismissReload();clearTimeout(timer);frame.remove();frame=null;launch();});
cinema.addEventListener('click',()=>setCinema(!document.body.classList.contains('cinema')));
fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(shell.requestFullscreen)await shell.requestFullscreen();else{setCinema(true);status.textContent='Fullscreen is unavailable here; focus view is on.';}}catch{setCinema(true);status.textContent='Fullscreen was unavailable; focus view is on.';}});
document.addEventListener('fullscreenchange',()=>{fullscreen.querySelector('span').textContent=document.fullscreenElement?'Exit fullscreen':'Fullscreen';});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){if(!reloadConfirmation.hidden){dismissReload();return;}if(!document.fullscreenElement)setCinema(false);}});
