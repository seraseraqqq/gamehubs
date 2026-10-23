(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const pad = $('pad');
  const storageKey = 'spacebar-counter.rounds.v1';
  let duration = 10, input = 'keyboard', state = 'ready', count = 0;
  let started = 0, held = false, frame = 0, history = [];
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) history = saved.filter(r =>
      Number.isFinite(r.count) && r.count >= 0 && Number.isFinite(r.duration) && r.duration > 0 &&
      ['keyboard', 'tap'].includes(r.input) && Number.isFinite(r.at)).slice(0, 12);
  } catch { /* Counting still works when browser storage is unavailable. */ }
  const persist = () => { try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch {} };
  function showHistory() {
    const list = $('history-list');
    list.replaceChildren();
    if (!history.length) {
      const p = document.createElement('p'); p.className = 'empty';
      p.textContent = 'A fresh start. Complete a timed round to see it here.'; list.append(p); return;
    }
    history.forEach(r => {
      const row = document.createElement('div'); row.className = 'round';
      const values = [
        [(r.input === 'keyboard' ? 'Spacebar' : 'Tap / click') + ' · ' + r.duration + 's', 'INPUT / LENGTH'],
        [String(r.count), 'PRESSES'], [(r.count / r.duration).toFixed(2), 'PER SECOND'],
        [new Date(r.at).toLocaleDateString('en', { month: 'short', day: 'numeric' }), 'DATE']
      ];
      values.forEach(([value, label], i) => {
        const cell = document.createElement('span'); const text = document.createElement(i === 1 || i === 2 ? 'strong' : 'span');
        text.textContent = value; const caption = document.createElement('small'); caption.textContent = label;
        cell.append(text, caption); row.append(cell);
      }); list.append(row);
    });
  }
  function paint(now = performance.now()) {
    const elapsed = state === 'running' ? Math.max(0, (now - started) / 1000) : 0;
    $('count').textContent = count;
    if (state !== 'finished') {
      const seconds = duration ? Math.max(0, duration - elapsed) : elapsed;
      $('clock').replaceChildren(document.createTextNode(seconds.toFixed(1)), Object.assign(document.createElement('span'), { textContent: 's' }));
      $('rate').textContent = elapsed > 0 ? (count / elapsed).toFixed(2) : '0.00';
      const percent = duration ? Math.max(0, 1 - elapsed / duration) * 100 : 100;
      $('progress').style.transform = 'scaleX(' + percent / 100 + ')';
      document.querySelector('.meter').setAttribute('aria-valuenow', String(Math.round(percent)));
    }
  }
  function finish() {
    if (state !== 'running') return;
    state = 'finished'; cancelAnimationFrame(frame); held = false; pad.classList.remove('down');
    $('clock').replaceChildren(document.createTextNode('0.0'), Object.assign(document.createElement('span'), { textContent: 's' }));
    $('rate').textContent = (count / duration).toFixed(2); $('progress').style.transform = 'scaleX(0)';
    document.querySelector('.meter').setAttribute('aria-valuenow', '0');
    $('key-title').textContent = 'round complete'; $('key-detail').textContent = input === 'keyboard' ? 'Release Space, then press again for a new round' : 'Tap again to start a new round';
    $('status').textContent = 'Finished. ' + count + (count === 1 ? ' press in ' : ' presses in ') + duration + ' seconds.';
    $('result').hidden = false; $('result-text').textContent = count + ' presses · ' + (count / duration).toFixed(2) + ' per second';
    history.unshift({ count, duration, input, at: Date.now() }); history = history.slice(0, 12); persist(); showHistory();
  }
  function tick(now) {
    if (state !== 'running') return;
    if (duration && now - started >= duration * 1000) { finish(); return; }
    paint(now); frame = requestAnimationFrame(tick);
  }
  function reset(message = 'Ready when you are. The first press starts the clock.') {
    cancelAnimationFrame(frame); state = 'ready'; count = 0; held = false; pad.classList.remove('down');
    $('clock-label').textContent = duration ? 'TIME LEFT' : 'ELAPSED';
    $('key-title').textContent = input === 'keyboard' ? 'press space to begin' : 'tap here to begin';
    $('key-detail').textContent = input === 'keyboard' ? 'Click here to focus · release between presses' : 'Touchscreen and mouse results use a separate input label';
    $('result').hidden = true; $('status').textContent = message; paint();
  }
  function accept() {
    const now = performance.now();
    if (state === 'running' && duration && now - started >= duration * 1000) { finish(); return; }
    if (state === 'finished') reset();
    if (state === 'ready') {
      started = now; state = 'running'; $('status').textContent = duration ? 'Keep going. Every separate press counts.' : 'Free count is running. Reset when you are done.';
      $('key-title').textContent = input === 'keyboard' ? 'keep pressing space' : 'keep tapping'; frame = requestAnimationFrame(tick);
    }
    count++; paint(now);
  }
  pad.addEventListener('keydown', event => {
    if (event.code !== 'Space' || input !== 'keyboard' || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    event.preventDefault(); if (event.repeat || held) return;
    held = true; accept(); pad.classList.add('down');
  });
  pad.addEventListener('keyup', event => {
    if (event.code === 'Space') { if (input === 'keyboard') event.preventDefault(); held = false; pad.classList.remove('down'); }
  });
  pad.addEventListener('pointerdown', () => { if (input === 'tap') pad.classList.add('down'); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(name => pad.addEventListener(name, () => pad.classList.remove('down')));
  pad.addEventListener('click', () => { if (input === 'tap') accept(); });
  function cancel() { if (state === 'running') reset('Round cancelled because the test lost focus. No result was saved.'); }
  pad.addEventListener('blur', () => { held = false; pad.classList.remove('down'); cancel(); });
  window.addEventListener('blur', cancel);
  document.addEventListener('visibilitychange', () => { if (document.hidden) cancel(); });
  $('durations').addEventListener('click', event => {
    const button = event.target.closest('button[data-seconds]'); if (!button) return;
    duration = Number(button.dataset.seconds); $('durations').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button))); reset();
  });
  $('inputs').addEventListener('click', event => {
    const button = event.target.closest('button[data-input]'); if (!button) return;
    input = button.dataset.input; $('inputs').querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    pad.setAttribute('aria-label', input === 'keyboard' ? 'Focus the test, then press and release Space' : 'Tap or click to count a press');
    $('input-note').textContent = input === 'keyboard' ? 'Spacebar mode counts physical Space presses while the large key has focus. Holding the key counts once. A physical keyboard is required.' : 'Tap / click mode counts button activations. These results measure tapping or clicking, not physical spacebar speed. History labels each input separately.';
    reset();
  });
  $('reset').addEventListener('click', () => { reset(); pad.focus(); });
  $('clear-history').addEventListener('click', () => { history = []; persist(); showHistory(); $('status').textContent = 'Local round history cleared.'; });
  showHistory(); reset();
})();
