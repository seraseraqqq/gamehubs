const {test}=require('node:test'),assert=require('node:assert/strict');
const B=require('../clues.js');
test('20 distinct original practice entries have unique identifiers, answers and five types',()=>{assert.equal(B.clues.length,20);assert.equal(new Set(B.clues.map(q=>q.id)).size,20);assert.equal(new Set(B.clues.map(q=>q.answer)).size,20);assert.equal(new Set(B.clues.map(q=>q.type)).size,5);});
test('every explanation has an exact, reconstructable letter recipe',()=>{
 for(const q of B.clues){const c=q.construction,a=q.answer,b=B.construct(c);if(c.kind==='anagram')assert.deepEqual([...a].sort(),[...B.normalize(b)].sort());else if(c.kind==='hidden')assert.ok(B.normalize(b).includes(a));else assert.equal(b,a);assert.ok(q.explanation.includes(a));}
 assert.equal(B.validateBank(),true);
});
test('definitions and indicators are actually present in the visible clue',()=>{for(const q of B.clues){assert.ok(q.clue.includes(q.definition));assert.ok(q.clue.includes(q.indicator));assert.ok(q.hint.length>20);assert.ok(q.nudge.length>20);assert.ok(q.answer.length>=3&&q.answer.length<=8);}});
test('answer normalization handles case, spacing and punctuation without accepting other words',()=>{assert.equal(B.normalize(' s i l e n t '),'SILENT');assert.equal(B.normalize('Star-Fish'),'STARFISH');assert.notEqual(B.normalize('teacher'),'TEACHERS');assert.equal(B.normalize(null),'');assert.equal(B.normalize('123 !'),'');});
