export function mergeMove(board, direction) {
  const next = Array(16).fill(0),
    transitions = [];
  let score = 0;
  for (let line = 0; line < 4; line++) {
    const indices = Array.from({ length: 4 }, (_, i) =>
      direction === "left"
        ? line * 4 + i
        : direction === "right"
          ? line * 4 + 3 - i
          : direction === "up"
            ? i * 4 + line
            : (3 - i) * 4 + line,
    );
    const tiles = indices
      .filter((i) => board[i])
      .map((i) => ({ from: i, value: board[i] }));
    let out = 0;
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i],
        dest = indices[out++];
      if (tiles[i + 1]?.value === tile.value) {
        next[dest] = tile.value * 2;
        score += next[dest];
        transitions.push(
          { from: tile.from, to: dest, merged: true },
          { from: tiles[i + 1].from, to: dest, merged: true },
        );
        i++;
      } else {
        next[dest] = tile.value;
        transitions.push({ from: tile.from, to: dest, merged: false });
      }
    }
  }
  return {
    board: next,
    score,
    transitions,
    changed: next.some((v, i) => v !== board[i]),
  };
}
export function mergeCanMove(board) {
  return (
    board.some((n) => !n) ||
    ["left", "right", "up", "down"].some((d) => mergeMove(board, d).changed)
  );
}
