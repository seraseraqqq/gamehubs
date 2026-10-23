const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
const bank = require('../answer-bank.js');

// Run the actual game controller against a small DOM/clock/scene adapter.
function controller() {
  function element() {
    const attrs = new Map(), classes = new Set();
    return { textContent: '', value: '', disabled: false, style: {}, dataset: {},
      classList: { add: x => classes.add(x), remove: x => classes.delete(x),
        toggle(x, on) { if (on) classes.add(x); else classes.delete(x); }, contains: x => classes.has(x) },
      setAttribute: (key, value) => attrs.set(key, value), removeAttribute: key => attrs.delete(key),
      hasAttribute: key => attrs.has(key), addEventListener() {}, focus() {},
      replaceChildren(...children) { this.textContent = children.map(x => typeof x === 'string' ? x : x.textContent).join(''); }
    };
  }
  const elements = new Map(), pips = Array.from({ length: 7 }, element), route = Array.from({ length: 8 }, element);
  const storage = new Map(), travels = [];
  let now = 1000, interval;
  const context = vm.createContext({
    window: { StarlingAnswers: bank, flightScene: { ready: Promise.resolve(), reset() {}, async travel(to) { travels.push(to); } } },
    document: { getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
      querySelector: () => elements.get('submit'), querySelectorAll: selector => selector === '#roundPips i' ? pips : route,
      createTextNode: text => text, createElement: () => element() },
    localStorage: { getItem: key => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    performance: { now: () => now }, matchMedia: () => ({ matches: true }),
    setTimeout: callback => queueMicrotask(callback), setInterval: callback => { interval = callback; return 1; },
    clearInterval() { interval = undefined; }, console
  });
  elements.set('submit', element());
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8'), context);
  return { travels, pips, elements,
    run: expression => vm.runInContext(expression, context),
    snapshot: () => JSON.parse(vm.runInContext('JSON.stringify({round:state.round,stage:state.stage,score:state.altitude,answers:state.answers,running:state.running})', context)),
    expire() { now += 25001; },
    async timeout() { now += 25001; interval(); await new Promise(resolve => setImmediate(resolve)); }
  };
}

test('timer expiry consumes a missed question without moving the rocket or distance', async () => {
  const game = controller(); await game.run('begin()'); await game.timeout();
  const result = game.snapshot();
  assert.equal(result.round, 1); assert.equal(result.stage, 0); assert.equal(result.score, 0);
  assert.equal(result.answers[0].outcome, 'timeout'); assert.deepEqual(game.travels, []);
  assert.equal(game.elements.get('distance').textContent, '0 km');
  assert.equal(game.pips[0].classList.contains('missed'), true);
  assert.equal(game.pips[0].classList.contains('done'), false);
});

test('pass stays still; the next correct answer advances one actual sector', async () => {
  const game = controller(); await game.run('begin()'); await game.run("resolveAnswer('',true)");
  assert.equal(game.snapshot().stage, 0); assert.deepEqual(game.travels, []);
  await game.run("resolveAnswer('europa')");
  assert.equal(game.snapshot().round, 2); assert.equal(game.snapshot().stage, 1);
  assert.equal(game.snapshot().score, 720); assert.deepEqual(game.travels, [1]);
});

test('a full timeout run remains grounded and cannot claim successful completion', async () => {
  const game = controller(); await game.run('begin()');
  for (let i = 0; i < 7; i++) await game.timeout();
  const result = game.snapshot();
  assert.equal(result.running, false); assert.equal(result.stage, 0); assert.equal(result.score, 0);
  assert.deepEqual(game.travels, []); assert.equal(result.answers.length, 7);
  assert.equal(game.elements.get('resultTitle').textContent, 'STILL ON THE LAUNCH PAD.');
  assert.equal(game.elements.get('bestAnswer').textContent, '—');
});

test('partial and all-correct results reflect the actual destination; restart clears misses', async () => {
  const game = controller(); await game.run('begin()'); await game.run("resolveAnswer('',true)");
  const answers = ['water', 'europa', 'rocks', 'io', 'planet', 'orion', 'stars'];
  for (const answer of answers.slice(1)) await game.run(`resolveAnswer(${JSON.stringify(answer)})`);
  assert.equal(game.snapshot().stage, 6);
  assert.equal(game.elements.get('resultTitle').textContent, 'JOURNEY INCOMPLETE.');
  assert.match(game.elements.get('resultEyebrow').textContent, /MILKY WAY \/ 6 OF 7/);
  await game.run('begin()');
  assert.equal(game.pips.some(pip => pip.classList.contains('missed')), false);
  for (const answer of answers) {
    const before = game.snapshot(); await game.run("resolveAnswer('asdfghjkl')");
    assert.deepEqual(game.snapshot(), before);
    await game.run(`Promise.all([resolveAnswer(${JSON.stringify(answer)}),resolveAnswer(${JSON.stringify(answer)})])`);
  }
  assert.equal(game.snapshot().stage, 7); assert.equal(game.snapshot().score, 1850);
  assert.equal(game.elements.get('resultTitle').textContent, 'BEYOND THE KNOWN.');
});


test('a valid answer submitted after its deadline is a miss with no boost', async () => {
  const game = controller(); await game.run('begin()'); game.expire();
  await game.run("resolveAnswer('water')");
  assert.equal(game.snapshot().stage, 0); assert.equal(game.snapshot().score, 0);
  assert.equal(game.snapshot().answers[0].outcome, 'timeout'); assert.deepEqual(game.travels, []);
});
