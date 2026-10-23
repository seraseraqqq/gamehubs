// Original 2048 implementation. See LICENSE and THIRD_PARTY_NOTICES.md.
export const SIZE = 4;
export const DIRECTIONS = ['left', 'up', 'right', 'down'];
export const clone = value => JSON.parse(JSON.stringify(value));
export const emptyGrid = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(null));

export function coordinates(direction, line, offset) {
  if (direction === 'left') return [offset, line];
  if (direction === 'right') return [SIZE - 1 - offset, line];
  if (direction === 'up') return [line, offset];
  if (direction === 'down') return [line, SIZE - 1 - offset];
  throw new RangeError('Unknown direction');
}

export function slide(grid, direction) {
  if (!DIRECTIONS.includes(direction)) throw new RangeError('Unknown direction');
  const next = emptyGrid();
  const motions = [], mergedIds = [];
  let gain = 0, moved = false;
  for (let line = 0; line < SIZE; line++) {
    const tiles = [];
    for (let offset = 0; offset < SIZE; offset++) {
      const [x, y] = coordinates(direction, line, offset);
      if (grid[y][x]) tiles.push({ ...grid[y][x], fromX: x, fromY: y });
    }
    let target = 0;
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      const [x, y] = coordinates(direction, line, target++);
      const sibling = tiles[i + 1];
      const merge = sibling && sibling.value === tile.value;
      const value = tile.value * (merge ? 2 : 1);
      next[y][x] = { id: tile.id, value };
      motions.push({ id: tile.id, x, y, retired: false });
      if (x !== tile.fromX || y !== tile.fromY) moved = true;
      if (merge) {
        gain += value; moved = true; mergedIds.push(tile.id);
        motions.push({ id: sibling.id, x, y, retired: true }); i++;
      }
    }
  }
  return { grid: next, gain, moved, motions, mergedIds };
}

export function hasMoves(grid) {
  for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) {
    if (!grid[y][x]) return true;
    if (x < SIZE - 1 && grid[y][x].value === grid[y][x + 1]?.value) return true;
    if (y < SIZE - 1 && grid[y][x].value === grid[y + 1][x]?.value) return true;
  }
  return false;
}

export function highest(grid) {
  return Math.max(2, ...grid.flat().map(tile => tile?.value || 0));
}

export function spawn(state, random = Math.random) {
  const empty = [];
  state.grid.forEach((row, y) => row.forEach((tile, x) => { if (!tile) empty.push([x, y]); }));
  if (!empty.length) return null;
  const [x, y] = empty[Math.min(empty.length - 1, Math.floor(random() * empty.length))];
  const tile = { id: state.nextId++, value: random() < .9 ? 2 : 4 };
  state.grid[y][x] = tile;
  return { ...tile, x, y };
}

export function newGame(random = Math.random) {
  const state = { grid: emptyGrid(), score: 0, moves: 0, nextId: 1, won: false, keepPlaying: false };
  spawn(state, random); spawn(state, random);
  return state;
}

export function validState(state) {
  if (!state || !Array.isArray(state.grid) || state.grid.length !== SIZE) return false;
  if (!['score', 'moves', 'nextId'].every(key => Number.isSafeInteger(state[key]) && state[key] >= (key === 'nextId' ? 1 : 0))) return false;
  if (typeof state.won !== 'boolean' || typeof state.keepPlaying !== 'boolean') return false;
  const ids = new Set(); let count = 0;
  for (const row of state.grid) {
    if (!Array.isArray(row) || row.length !== SIZE) return false;
    for (const tile of row) {
      if (tile === null) continue;
      if (!tile || !Number.isSafeInteger(tile.id) || tile.id < 1 || tile.id >= state.nextId || ids.has(tile.id)) return false;
      if (!Number.isSafeInteger(tile.value) || tile.value < 2 || tile.value > 2 ** 40 || !Number.isInteger(Math.log2(tile.value))) return false;
      ids.add(tile.id); count++;
    }
  }
  return count > 0;
}
