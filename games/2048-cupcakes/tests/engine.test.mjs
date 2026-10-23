import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyGrid, slide, spawn, newGame, hasMoves, highest, validState, clone } from '../engine.mjs';

function board(rows) {
  let id = 1;
  const grid = emptyGrid();
  rows.forEach((row, y) => row.forEach((value, x) => { if (value) grid[y][x] = { id: id++, value }; }));
  return grid;
}
const values = grid => grid.map(row => row.map(tile => tile?.value || 0));
const total = grid => grid.flat().reduce((sum, tile) => sum + (tile?.value || 0), 0);

test('each tile merges once and score counts resulting values', () => {
  const result = slide(board([[2, 2, 2, 2], [4, 4, 8, 0]]), 'left');
  assert.deepEqual(values(result.grid)[0], [4, 4, 0, 0]);
  assert.deepEqual(values(result.grid)[1], [8, 8, 0, 0]);
  assert.equal(result.gain, 16);
  assert.equal(result.mergedIds.length, 3);
});
test('direction determines merge order, not original tile position', () => {
  assert.deepEqual(values(slide(board([[2, 2, 4, 4]]), 'right').grid)[0], [0, 0, 4, 8]);
  assert.deepEqual(values(slide(board([[2], [2], [4], [4]]), 'down').grid).map(r => r[0]), [0, 0, 4, 8]);
  assert.deepEqual(values(slide(board([[2], [2], [4], [4]]), 'up').grid).map(r => r[0]), [4, 8, 0, 0]);
});
test('no-op does not mutate the board or award points', () => {
  const grid = board([[2, 4, 8, 16]]), saved = clone(grid);
  const result = slide(grid, 'left');
  assert.equal(result.moved, false); assert.equal(result.gain, 0); assert.deepEqual(grid, saved);
});
test('full boards are terminal only when no orthogonal merge exists', () => {
  const dead = board([[2,4,2,4],[4,2,4,2],[2,4,2,4],[4,2,4,2]]);
  assert.equal(hasMoves(dead), false);
  dead[0][1].value = 2; assert.equal(hasMoves(dead), true);
});
test('new game and random spawns add only one legal tile in an empty spot', () => {
  const state = newGame(() => .1);
  assert.equal(state.grid.flat().filter(Boolean).length, 2); assert.equal(validState(state), true);
  const sum = total(state.grid); const tile = spawn(state, () => .95);
  assert.equal(tile.value, 4); assert.equal(total(state.grid), sum + 4);
  assert.equal(highest(state.grid), 4);
});
test('saved state validation rejects duplicates, malformed grids and unsafe data', () => {
  const state = newGame(() => .1); assert.equal(validState(state), true);
  const bad = clone(state); const tiles = bad.grid.flat().filter(Boolean); tiles[1].id = tiles[0].id;
  assert.equal(validState(bad), false);
  assert.equal(validState({ ...state, score: -1 }), false);
  assert.equal(validState({ ...state, grid: [[null]] }), false);
  const corrupt = clone(state); corrupt.grid.flat().find(Boolean).value = 3;
  assert.equal(validState(corrupt), false);
});
test('mass is conserved for every direction across 400 varied boards', () => {
  let seed = 47;
  const random = () => ((seed = (1664525 * seed + 1013904223) >>> 0) / 2 ** 32);
  for (let trial = 0; trial < 400; trial++) {
    const grid = board(Array.from({length:4}, () => Array.from({length:4}, () => random() < .35 ? 0 : 2 ** (1 + Math.floor(random() * 8)))));
    for (const direction of ['left','right','up','down']) {
      const result = slide(grid, direction);
      assert.equal(total(result.grid), total(grid));
      const ids = result.grid.flat().filter(Boolean).map(t => t.id);
      assert.equal(new Set(ids).size, ids.length);
      if (!result.moved) assert.deepEqual(result.grid, grid);
    }
  }
});
