const test = require('node:test');
const assert = require('node:assert/strict');
const { prompts, normalize, validate } = require('../answer-bank.js');

test('random input, prototype names, markup and non-answer symbols never score', () => {
  const invalid = ['asdfghjkl', 'a'.repeat(48), '123456', 'constructor', 'toString', '__proto__',
    'hasOwnProperty', '<script>alert(1)</script>', '🚀', '!!!', '水', 'wa!!!ter', 'water123', 'water & oxygen'];
  let seed = 29;
  for (let i = 0; i < 250; i++) {
    let gibberish = 'zz';
    for (let j = 0; j < 18; j++) { seed = (seed * 16807) % 2147483647; gibberish += String.fromCharCode(97 + seed % 26); }
    invalid.push(gibberish);
  }
  for (let round = 0; round < prompts.length; round++) {
    for (const input of invalid) assert.deepEqual(validate(round, input), { accepted: false, answer: null, score: 0 }, `${round}: ${input}`);
  }
});

test('known answers must belong to the current prompt', () => {
  for (const [round, input] of [[0, 'europa'], [1, 'water'], [2, 'guitar'], [3, 'titan'], [3, 'moon'], [4, 'rogue planet'], [5, 'earth'], [5, 'big dipper'], [6, 'water']]) {
    assert.equal(validate(round, input).accepted, false, `${round}: ${input}`);
  }
  assert.equal(validate(1, 'titan').accepted, true);
  assert.equal(validate(3, 'io').accepted, true);
});

test('case, whitespace, full-width and curated plural/wording aliases share scores', () => {
  for (const input of ['water', ' WATER ', 'ＷＡＴＥＲ', 'water bottle', 'bottle   of water']) {
    assert.deepEqual(validate(0, input), { accepted: true, answer: 'water', score: 14 });
  }
  assert.deepEqual(validate(0, 'space-suit'), validate(0, 'suit'));
  assert.deepEqual(validate(1, 'Earth’s moon'), validate(1, 'moon'));
  assert.deepEqual(validate(2, 'rock'), validate(2, 'rocks'));
  assert.deepEqual(validate(6, 'shooting stars'), validate(6, 'meteor'));
  assert.equal(validate(2, 'CO2').accepted, true);
});

test('near matches are not silently marked correct', () => {
  for (const [round, input] of [[0, 'watre'], [0, 'watersssss'], [3, 'ion'], [3, 'europe'], [5, 'orion123'], [6, 'start']]) {
    assert.equal(validate(round, input).accepted, false);
  }
});

test('empty, missing, out-of-range and oversized inputs fail closed', () => {
  for (const input of ['', '  ', null, undefined, 42, {}, 'a'.repeat(1000)]) assert.equal(validate(0, input).accepted, false);
  for (const round of [-1, 7, 'constructor', undefined]) assert.equal(validate(round, 'water').accepted, false);
  assert.equal(normalize('wa!!!ter'), null);
});

test('all canonical answers and explicit aliases resolve to their authored scores', () => {
  for (let round = 0; round < prompts.length; round++) {
    for (const item of prompts[round].entries) {
      for (const input of [item.answer, ...item.aliases]) {
        assert.deepEqual(validate(round, input), { accepted: true, answer: item.answer, score: item.score });
      }
    }
  }
});
