import { seeded } from "./arrows.mjs";
const shuffled = (a, rng) => {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export function sudokuCandidates(board, index) {
  if (board[index]) return [];
  const row = Math.floor(index / 9),
    col = index % 9,
    used = new Set();
  for (let i = 0; i < 9; i++) {
    used.add(board[row * 9 + i]);
    used.add(board[i * 9 + col]);
    used.add(
      board[
        (Math.floor(row / 3) * 3 + Math.floor(i / 3)) * 9 +
          Math.floor(col / 3) * 3 +
          (i % 3)
      ],
    );
  }
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !used.has(n));
}
export function countSudokuSolutions(input, limit = 2) {
  const board = [...input];
  let count = 0;
  function solve() {
    let at = -1,
      choices = null;
    for (let i = 0; i < 81; i++)
      if (!board[i]) {
        const next = sudokuCandidates(board, i);
        if (!next.length) return;
        if (!choices || next.length < choices.length) {
          at = i;
          choices = next;
          if (choices.length === 1) break;
        }
      }
    if (at < 0) {
      count++;
      return;
    }
    for (const n of choices) {
      board[at] = n;
      solve();
      board[at] = 0;
      if (count >= limit) return;
    }
  }
  solve();
  return count;
}
export function validSudoku(board) {
  if (
    board.length !== 81 ||
    board.some((n) => !Number.isInteger(n) || n < 1 || n > 9)
  )
    return false;
  for (let i = 0; i < 81; i++) {
    const copy = [...board],
      n = copy[i];
    copy[i] = 0;
    if (!sudokuCandidates(copy, i).includes(n)) return false;
  }
  return true;
}
export function generateSudoku(difficulty = "medium", seed = Date.now()) {
  const rng = seeded(seed),
    groups = () =>
      shuffled([0, 1, 2], rng).flatMap((b) =>
        shuffled([0, 1, 2], rng).map((i) => b * 3 + i),
      ),
    rows = groups(),
    cols = groups(),
    nums = shuffled([1, 2, 3, 4, 5, 6, 7, 8, 9], rng);
  const solution = rows.flatMap((r) =>
      cols.map((c) => nums[(r * 3 + Math.floor(r / 3) + c) % 9]),
    ),
    board = [...solution],
    clues = { easy: 42, medium: 34, hard: 28 }[difficulty] || 34;
  let remain = 81;
  for (const i of shuffled(
    Array.from({ length: 81 }, (_, i) => i),
    rng,
  )) {
    if (remain <= clues) break;
    const value = board[i];
    board[i] = 0;
    if (countSudokuSolutions(board) !== 1) board[i] = value;
    else remain--;
  }
  return { board, solution };
}
