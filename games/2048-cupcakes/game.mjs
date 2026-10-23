import { clone, hasMoves, highest, newGame, slide, spawn, validState } from './engine.mjs';

const $ = id => document.getElementById(id);
const board = $('board'), layer = board.querySelector('.tile-layer');
const STORE = 'crumb.cupcakes.v1';
const treats = [
  ['Cherry vanilla', '#fff7e9'], ['Double chocolate', '#f5e6da'],
  ['Strawberry', '#fbe3e2'], ['Blueberry', '#e8e8f4'],
  ['Lemon sunshine', '#fbf0cc'], ['Mint chip', '#e5eee2'],
  ['Red velvet', '#f4dfdb'], ['Salted caramel', '#f7e8cc'],
  ['Lavender macaron', '#ede3f1'], ['Pistachio', '#e9edcf'],
  ['Rainbow party', '#fae3e6'], ['Golden encore', '#f1dfbd']
];
let state, history = [], best = 0, highestSeen = 2;
let preferences = { numbers: true, sound: false };
let busy = false, queued = null, moveTimer = 0, transaction = 0, overlayMode = '';
let audio = null, gesture = null, restorationMessage = '';
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

try {
  const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
  if (saved?.version === 1) {
    if (validState(saved.state)) {
      state = saved.state;
      state.won = state.won || highest(state.grid) >= 2048;
      history = Array.isArray(saved.history) ? saved.history.filter(validState).slice(-10) : [];
      restorationMessage = state.moves > 0 ? 'Welcome back. Your little batch is right where you left it.' : '';
    } else restorationMessage = "We couldn't restore the previous board, so a fresh batch is ready.";
    if (Number.isSafeInteger(saved.best) && saved.best >= 0) best = saved.best;
    if (Number.isSafeInteger(saved.highestSeen) && saved.highestSeen >= 2 && saved.highestSeen <= 2 ** 40 && Number.isInteger(Math.log2(saved.highestSeen))) highestSeen = saved.highestSeen;
    if (typeof saved.preferences?.numbers === 'boolean') preferences.numbers = saved.preferences.numbers;
    if (typeof saved.preferences?.sound === 'boolean') preferences.sound = saved.preferences.sound;
  }
} catch {
  restorationMessage = "A fresh batch is ready. Previous browser data couldn't be restored.";
}
state ||= newGame(); best = Math.max(best, state.score); highestSeen = Math.max(highestSeen, highest(state.grid));

function persist() {
  try {
    localStorage.setItem(STORE, JSON.stringify({ version: 1, state, history, best, highestSeen, preferences }));
    $('storage-warning').hidden = true;
  } catch { $('storage-warning').hidden = false; }
}

function treatment(value) {
  const index = Math.min(treats.length - 1, Math.max(0, Math.log2(value) - 1));
  return { index, name: treats[index][0], color: treats[index][1] };
}

function setSprite(element, index) {
  element.style.setProperty('--col', index % 4);
  element.style.setProperty('--row', Math.floor(index / 4));
}

function tileFace(element, value) {
  const treat = treatment(value);
  element.dataset.value = value;
  element.style.setProperty('--tile-bg', treat.color);
  element.title = `${treat.name} · ${value}`;
  setSprite(element.querySelector('.sprite'), treat.index);
  element.querySelector('.tile-number').textContent = value.toLocaleString('en-US');
}

function makeTile(tile, x, y, spawned = false) {
  const element = document.createElement('div');
  element.className = 'tile' + (spawned ? ' tile-spawn' : ''); element.dataset.id = tile.id;
  const face = document.createElement('div'); face.className = 'tile-face';
  const icon = document.createElement('i'); icon.className = 'sprite';
  const number = document.createElement('span'); number.className = 'tile-number';
  face.append(icon, number); element.append(face); tileFace(element, tile.value);
  element.style.setProperty('--x', x); element.style.setProperty('--y', y);
  return element;
}

function drawBoard() {
  layer.replaceChildren();
  state.grid.forEach((row, y) => row.forEach((tile, x) => { if (tile) layer.append(makeTile(tile, x, y)); }));
}

function drawCollection() {
  const collection = $('cupcake-collection');
  treats.forEach(([name], index) => {
    const item = document.createElement('div'); item.className = 'collection-item' + (index === 10 ? ' is-goal' : '');
    const image = document.createElement('i'); image.className = 'sprite'; image.setAttribute('aria-hidden', 'true'); setSprite(image, index);
    const label = document.createElement('strong'); label.textContent = name;
    const value = document.createElement('small'); value.textContent = (2 ** (index + 1)).toLocaleString('en-US') + (index === 10 ? ' · THE GOAL' : '');
    item.append(image, label, value); collection.append(item);
  });
}

function refreshInfo(message = '') {
  for (const [id, value] of [['score', state.score], ['best', best]]) {
    $(id).textContent = value.toLocaleString('en-US');
    $(id).toggleAttribute('data-long', value >= 100000);
  }
  $('undo').disabled = history.length === 0;
  $('undo-count').textContent = history.length ? `(${history.length})` : '';
  $('board-summary').textContent = state.grid.map((row, index) => `Row ${index + 1}: ${row.map(t => t ? `${treatment(t.value).name}, ${t.value}` : 'empty').join('; ')}.`).join(' ');
  if (message) $('game-status').textContent = message;
  refreshOverlay();
}

function refreshOverlay() {
  const mode = state.won && !state.keepPlaying ? 'won' : !hasMoves(state.grid) ? 'over' : '';
  $('game-overlay').hidden = !mode;
  if (!mode) { overlayMode = ''; return; }
  const changed = mode !== overlayMode; overlayMode = mode;
  if (mode === 'won') {
    $('end-icon').textContent = '✧'; $('end-kicker').textContent = 'THE SWEETEST LITTLE MILESTONE';
    $('end-title').textContent = 'A rainbow, just for you.';
    $('end-description').textContent = 'You made the 2048 cupcake! Keep baking for the golden encore, or enjoy a fresh start.';
    $('end-primary').textContent = 'Keep baking'; $('end-secondary').textContent = 'Start a new batch'; $('end-secondary').hidden = false;
  } else {
    $('end-icon').textContent = '♡'; $('end-kicker').textContent = 'EVERY BATCH TEACHES YOU SOMETHING';
    $('end-title').textContent = 'Fresh out of room.';
    $('end-description').textContent = `You baked up ${state.score.toLocaleString('en-US')} points. There's always room for another try.`;
    $('end-primary').textContent = 'Try a new batch'; $('end-secondary').textContent = 'Undo the last move'; $('end-secondary').hidden = history.length === 0;
  }
  if (changed) {
    $('game-status').textContent = mode === 'won' ? 'You reached 2048. Rainbow cupcake unlocked!' : `No moves left. Final score ${state.score}.`;
    $('end-primary').focus({ preventScroll: true });
  }
}

function gentleNote(value) {
  if (!preferences.sound) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)();
    if (audio.state === 'suspended') audio.resume().catch(() => {});
    const oscillator = audio.createOscillator(), gain = audio.createGain();
    oscillator.type = 'sine'; oscillator.frequency.value = 360 + Math.min(12, Math.log2(value)) * 35;
    const now = audio.currentTime;
    gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.035, now + .01); gain.gain.exponentialRampToValueAtTime(.0001, now + .16);
    oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(now); oscillator.stop(now + .18);
  } catch { /* Sound is optional; the game remains usable without Web Audio. */ }
}

function stopAnimation() {
  transaction++; clearTimeout(moveTimer); busy = false; queued = null; board.setAttribute('aria-busy', 'false');
}

function move(direction) {
  if (document.querySelector('dialog[open]') || overlayMode) return;
  if (busy) { queued = direction; return; }
  const result = slide(state.grid, direction);
  if (!result.moved) { refreshInfo('A little full that way. Try another direction.'); return; }
  history.push(clone(state)); if (history.length > 10) history.shift();
  state.grid = result.grid; state.score += result.gain; state.moves++;
  const added = spawn(state); state.won ||= highest(state.grid) >= 2048;
  best = Math.max(best, state.score); highestSeen = Math.max(highestSeen, highest(state.grid));
  persist(); busy = true; board.setAttribute('aria-busy', 'true'); const token = ++transaction;
  for (const motion of result.motions) {
    const element = layer.querySelector(`[data-id="${motion.id}"]`);
    if (!element) continue;
    element.classList.remove('tile-spawn', 'tile-merged');
    element.style.setProperty('--x', motion.x); element.style.setProperty('--y', motion.y);
    if (motion.retired) element.classList.add('tile-retired');
  }
  $('score').textContent = state.score.toLocaleString('en-US'); $('best').textContent = best.toLocaleString('en-US');
  if (result.gain) {
    $('score-gain').textContent = `+${result.gain}`; $('score-gain').classList.remove('show');
    void $('score-gain').offsetWidth; $('score-gain').classList.add('show'); gentleNote(result.gain);
  }
  moveTimer = setTimeout(() => {
    if (token !== transaction) return;
    layer.querySelectorAll('.tile-retired').forEach(element => element.remove());
    state.grid.forEach(row => row.forEach(tile => {
      if (!tile) return;
      const element = layer.querySelector(`[data-id="${tile.id}"]`);
      if (element) { tileFace(element, tile.value); if (result.mergedIds.includes(tile.id)) element.classList.add('tile-merged'); }
    }));
    if (added) layer.append(makeTile(added, added.x, added.y, true));
    busy = false; board.setAttribute('aria-busy', 'false');
    const message = result.gain ? `Lovely. +${result.gain} points. Biggest cupcake: ${treatment(highest(state.grid)).name}.` : 'A little more room. Keep baking.';
    refreshInfo(message);
    const next = queued; queued = null; if (next && !overlayMode) move(next);
  }, reduceMotion.matches ? 0 : 130);
}

function undo() {
  if (!history.length) return;
  stopAnimation(); state = history.pop(); overlayMode = ''; drawBoard();
  persist(); refreshInfo('One step back. A little room for a second chance.'); board.focus({ preventScroll: true });
}

function freshBatch() {
  stopAnimation(); state = newGame(); history = []; overlayMode = '';
  drawBoard(); persist(); refreshInfo("A fresh little batch. Let's make something lovely."); board.focus({ preventScroll: true });
}

function requestFreshBatch() {
  if (state.moves === 0 || !hasMoves(state.grid)) freshBatch();
  else $('restart-dialog').showModal();
}

function applyPreferences() {
  board.classList.toggle('hide-numbers', !preferences.numbers);
  $('numbers-toggle').setAttribute('aria-pressed', String(preferences.numbers)); $('numbers-setting').checked = preferences.numbers;
  $('sound-toggle').setAttribute('aria-pressed', String(preferences.sound)); $('sound-setting').checked = preferences.sound;
  $('sound-toggle').setAttribute('aria-label', preferences.sound ? 'Turn sound off' : 'Turn sound on');
  $('sound-toggle').title = preferences.sound ? 'Sound on' : 'Sound off';
  $('sound-toggle').querySelector('use').setAttribute('href', preferences.sound ? '#i-sound' : '#i-muted');
  persist();
}

board.querySelector('.board-cells').replaceChildren(...Array.from({ length: 16 }, () => Object.assign(document.createElement('div'), { className: 'board-cell' })));
drawBoard(); drawCollection(); refreshInfo(restorationMessage); applyPreferences();

document.addEventListener('keydown', event => {
  if (event.ctrlKey || event.metaKey || event.altKey || document.querySelector('dialog[open]')) return;
  if (event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  if (event.target.closest('button, a, summary') && !$('play').contains(event.target)) return;
  const rect = board.getBoundingClientRect();
  if (rect.bottom <= 0 || rect.top >= innerHeight) return;
  const keys = { ArrowLeft: 'left', ArrowUp: 'up', ArrowRight: 'right', ArrowDown: 'down', a: 'left', w: 'up', d: 'right', s: 'down' };
  const direction = keys[event.key] || keys[event.key.toLowerCase()];
  if (direction) { event.preventDefault(); move(direction); }
  else if (event.key.toLowerCase() === 'z') { event.preventDefault(); undo(); }
  else if (event.key.toLowerCase() === 'n') { event.preventDefault(); requestFreshBatch(); }
});
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => { move(button.dataset.direction); board.focus({ preventScroll: true }); }));
board.addEventListener('pointerdown', event => {
  if (event.isPrimary === false || event.button !== 0 || event.target.closest('button') || overlayMode) return;
  gesture = { x: event.clientX, y: event.clientY, id: event.pointerId };
  board.setPointerCapture(event.pointerId); board.focus({ preventScroll: true });
});
board.addEventListener('pointerup', event => {
  if (!gesture || event.pointerId !== gesture.id) return;
  const dx = event.clientX - gesture.x, dy = event.clientY - gesture.y; gesture = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < Math.max(18, board.clientWidth * .045)) return;
  move(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? 'right' : 'left' : dy > 0 ? 'down' : 'up');
});
board.addEventListener('pointercancel', () => { gesture = null; });
$('undo').addEventListener('click', undo); $('new-game').addEventListener('click', requestFreshBatch);
$('restart-cancel').addEventListener('click', () => $('restart-dialog').close());
$('restart-confirm').addEventListener('click', () => { $('restart-dialog').close(); freshBatch(); });
$('end-primary').addEventListener('click', () => {
  if (overlayMode === 'won') { state.keepPlaying = true; persist(); refreshInfo('The rainbow is yours. On to a golden encore.'); board.focus({ preventScroll: true }); }
  else freshBatch();
});
$('end-secondary').addEventListener('click', () => { if (overlayMode === 'over') undo(); else requestFreshBatch(); });
$('numbers-toggle').addEventListener('click', () => { preferences.numbers = !preferences.numbers; applyPreferences(); });
$('sound-toggle').addEventListener('click', () => { preferences.sound = !preferences.sound; applyPreferences(); if (preferences.sound) gentleNote(4); });
$('numbers-setting').addEventListener('change', event => { preferences.numbers = event.target.checked; applyPreferences(); });
$('sound-setting').addEventListener('change', event => { preferences.sound = event.target.checked; applyPreferences(); if (preferences.sound) gentleNote(4); });
for (const [button, dialog] of [['settings-open', 'preferences-dialog'], ['about-open', 'about-dialog'], ['privacy-open', 'privacy-dialog']]) {
  $(button).addEventListener('click', () => $(dialog).showModal());
}
document.querySelectorAll('.dialog-close, .dialog-done').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));
