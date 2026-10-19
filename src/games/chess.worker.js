import { chessMoves, applyChess, inCheck } from "./rules/chess.mjs";
const value = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
function evaluate(state) {
  let score = 0;
  state.board.forEach((p, i) => {
    if (!p) return;
    const white = p === p.toUpperCase(),
      central = 7 - Math.abs((i % 8) - 3.5) - Math.abs(Math.floor(i / 8) - 3.5),
      advance = white ? 6 - Math.floor(i / 8) : Math.floor(i / 8) - 1;
    score +=
      (white ? 1 : -1) *
      (value[p.toLowerCase()] +
        central * 4 +
        (p.toLowerCase() === "p" ? advance * 6 : 0));
  });
  return score;
}
function search(state, depth, alpha, beta) {
  const moves = chessMoves(state);
  if (!moves.length)
    return inCheck(state)
      ? state.turn === "w"
        ? -100000 - depth
        : 100000 + depth
      : 0;
  if (!depth) return evaluate(state);
  moves.sort(
    (a, b) =>
      (value[state.board[b.to]?.toLowerCase()] || 0) -
      (value[state.board[a.to]?.toLowerCase()] || 0),
  );
  let best = state.turn === "w" ? -Infinity : Infinity;
  for (const move of moves) {
    const score = search(
      applyChess(state, move, false),
      depth - 1,
      alpha,
      beta,
    );
    if (state.turn === "w") {
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
    } else {
      best = Math.min(best, score);
      beta = Math.min(beta, best);
    }
    if (beta <= alpha) break;
  }
  return best;
}
self.onmessage = ({ data: { state, depth, id } }) => {
  const moves = chessMoves(state);
  let chosen = moves[0],
    best = Infinity;
  for (const move of moves) {
    const score = search(
      applyChess(state, move, false),
      Math.max(1, depth - 1),
      -Infinity,
      Infinity,
    );
    if (score < best) {
      best = score;
      chosen = move;
    }
  }
  self.postMessage({ move: chosen, id });
};
