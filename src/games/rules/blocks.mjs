export const shapes = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
];
export const rotatePiece = (piece) =>
  piece[0].map((_, i) => piece.map((row) => row[i]).reverse());
export function blockFits(board, piece, x, y) {
  for (let r = 0; r < piece.length; r++)
    for (let c = 0; c < piece[r].length; c++)
      if (piece[r][c]) {
        const xx = x + c,
          yy = y + r;
        if (xx < 0 || xx >= 10 || yy >= 20 || (yy >= 0 && board[yy][xx]))
          return false;
      }
  return true;
}
export function clearBlockRows(board) {
  const rows = [];
  board.forEach((r, i) => {
    if (r.every(Boolean)) rows.push(i);
  });
  return {
    rows,
    board: [
      ...Array.from({ length: rows.length }, () => Array(10).fill(0)),
      ...board.filter((_, i) => !rows.includes(i)),
    ],
  };
}
