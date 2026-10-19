// Pure, immutable chess rules shared by the UI, worker, and perft regression tests.
export const squareName = (i) => "abcdefgh"[i % 8] + (8 - Math.floor(i / 8));
export const squareIndex = (name) =>
  (8 - Number(name[1])) * 8 + "abcdefgh".indexOf(name[0]);
export const side = (p) => (p ? (p === p.toUpperCase() ? "w" : "b") : null);
const other = (t) => (t === "w" ? "b" : "w");
const inside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
export function fromFen(
  fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
) {
  const [placement, turn, castle, ep, half, full] = fen.split(" "),
    board = [];
  for (const ch of placement) {
    if (ch === "/") continue;
    if (/\d/.test(ch)) board.push(...Array(Number(ch)).fill(null));
    else board.push(ch);
  }
  const state = {
    board,
    turn,
    castle: castle === "-" ? "" : castle,
    ep: ep === "-" ? -1 : squareIndex(ep),
    half: Number(half) || 0,
    full: Number(full) || 1,
    history: [],
  };
  state.history = [chessKey(state)];
  return state;
}
export function attacked(board, square, by) {
  const row = Math.floor(square / 8),
    col = square % 8;
  for (let i = 0; i < 64; i++) {
    const p = board[i];
    if (side(p) !== by) continue;
    const r = Math.floor(i / 8),
      c = i % 8,
      dr = row - r,
      dc = col - c,
      t = p.toLowerCase();
    if (t === "p" && dr === (by === "w" ? -1 : 1) && Math.abs(dc) === 1)
      return true;
    if (t === "n" && Math.abs(dr) * Math.abs(dc) === 2) return true;
    if (t === "k" && Math.max(Math.abs(dr), Math.abs(dc)) === 1) return true;
    if (
      (t === "b" && Math.abs(dr) === Math.abs(dc)) ||
      (t === "r" && (dr === 0 || dc === 0)) ||
      (t === "q" && (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)))
    ) {
      if (!dr && !dc) continue;
      const rr = Math.sign(dr),
        cc = Math.sign(dc);
      let clear = true;
      for (let y = r + rr, x = c + cc; y !== row || x !== col; y += rr, x += cc)
        if (board[y * 8 + x]) {
          clear = false;
          break;
        }
      if (clear) return true;
    }
  }
  return false;
}
export function inCheck(state, turn = state.turn) {
  const king = state.board.indexOf(turn === "w" ? "K" : "k");
  return king < 0 || attacked(state.board, king, other(turn));
}
function rawApply(state, move) {
  const board = [...state.board],
    piece = board[move.from],
    captured = board[move.to];
  board[move.to] = move.promotion
    ? state.turn === "w"
      ? move.promotion.toUpperCase()
      : move.promotion.toLowerCase()
    : piece;
  board[move.from] = null;
  if (move.ep) board[move.to + (state.turn === "w" ? 8 : -8)] = null;
  if (move.castle) {
    const rookFrom = move.to > move.from ? move.from + 3 : move.from - 4,
      rookTo = move.to > move.from ? move.from + 1 : move.from - 1;
    board[rookTo] = board[rookFrom];
    board[rookFrom] = null;
  }
  let castle = state.castle;
  const strip = (rights) => {
    for (const right of rights) castle = castle.replace(right, "");
  };
  if (piece === "K") strip("KQ");
  if (piece === "k") strip("kq");
  for (const [index, right] of [
    [0, "q"],
    [7, "k"],
    [56, "Q"],
    [63, "K"],
  ])
    if (move.from === index || move.to === index) strip(right);
  return {
    board,
    turn: other(state.turn),
    castle,
    ep:
      piece?.toLowerCase() === "p" && Math.abs(move.to - move.from) === 16
        ? (move.from + move.to) / 2
        : -1,
    half:
      piece?.toLowerCase() === "p" || captured || move.ep ? 0 : state.half + 1,
    full: state.full + (state.turn === "b" ? 1 : 0),
    history: state.history,
  };
}
export function chessKey(state) {
  let ep = -1;
  if (state.ep >= 0) {
    const target = state.ep,
      originRow = Math.floor(target / 8) + (state.turn === "w" ? 1 : -1),
      col = target % 8;
    for (const c of [col - 1, col + 1])
      if (
        inside(originRow, c) &&
        state.board[originRow * 8 + c] === (state.turn === "w" ? "P" : "p")
      ) {
        const next = rawApply(state, {
          from: originRow * 8 + c,
          to: target,
          ep: true,
        });
        if (!inCheck(next, state.turn)) {
          ep = target;
          break;
        }
      }
  }
  return `${state.board.map((p) => p || ".").join("")} ${state.turn} ${state.castle} ${ep}`;
}
export function chessMoves(state, from = null) {
  const moves = [],
    { board, turn } = state,
    opponent = other(turn);
  function add(origin, to, extra = {}) {
    const piece = board[origin];
    if (board[to]?.toLowerCase() === "k") return;
    if (piece.toLowerCase() === "p" && (to < 8 || to >= 56)) {
      for (const promotion of ["q", "r", "b", "n"])
        moves.push({ from: origin, to, ...extra, promotion });
    } else moves.push({ from: origin, to, ...extra });
  }
  for (let i = 0; i < 64; i++) {
    if (from !== null && i !== from) continue;
    const p = board[i];
    if (side(p) !== turn) continue;
    const r = Math.floor(i / 8),
      c = i % 8,
      t = p.toLowerCase();
    if (t === "p") {
      const d = turn === "w" ? -1 : 1,
        start = turn === "w" ? 6 : 1;
      if (inside(r + d, c) && !board[(r + d) * 8 + c]) {
        add(i, (r + d) * 8 + c);
        if (r === start && !board[(r + 2 * d) * 8 + c])
          add(i, (r + 2 * d) * 8 + c);
      }
      for (const dc of [-1, 1])
        if (inside(r + d, c + dc)) {
          const to = (r + d) * 8 + c + dc;
          if (side(board[to]) === opponent) add(i, to);
          else if (
            to === state.ep &&
            board[r * 8 + c + dc] === (turn === "w" ? "p" : "P")
          )
            add(i, to, { ep: true });
        }
    }
    if (t === "n" || t === "k") {
      const dirs =
        t === "n"
          ? [
              [-2, -1],
              [-2, 1],
              [-1, -2],
              [-1, 2],
              [1, -2],
              [1, 2],
              [2, -1],
              [2, 1],
            ]
          : [
              [-1, -1],
              [-1, 0],
              [-1, 1],
              [0, -1],
              [0, 1],
              [1, -1],
              [1, 0],
              [1, 1],
            ];
      for (const [dr, dc] of dirs)
        if (
          inside(r + dr, c + dc) &&
          side(board[(r + dr) * 8 + c + dc]) !== turn
        )
          add(i, (r + dr) * 8 + c + dc);
    }
    if ("brq".includes(t)) {
      const dirs =
        t === "b"
          ? [
              [1, 1],
              [1, -1],
              [-1, 1],
              [-1, -1],
            ]
          : t === "r"
            ? [
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
              ]
            : [
                [1, 1],
                [1, -1],
                [-1, 1],
                [-1, -1],
                [1, 0],
                [-1, 0],
                [0, 1],
                [0, -1],
              ];
      for (const [dr, dc] of dirs)
        for (let rr = r + dr, cc = c + dc; inside(rr, cc); rr += dr, cc += dc) {
          const target = rr * 8 + cc;
          if (side(board[target]) === turn) break;
          add(i, target);
          if (board[target]) break;
        }
    }
    const home = turn === "w" ? 60 : 4;
    if (t === "k" && i === home && !inCheck(state)) {
      const rights = turn === "w" ? ["K", "Q"] : ["k", "q"],
        rook = turn === "w" ? "R" : "r";
      if (
        state.castle.includes(rights[0]) &&
        board[home + 3] === rook &&
        !board[home + 1] &&
        !board[home + 2] &&
        !attacked(board, home + 1, opponent) &&
        !attacked(board, home + 2, opponent)
      )
        add(i, home + 2, { castle: true });
      if (
        state.castle.includes(rights[1]) &&
        board[home - 4] === rook &&
        !board[home - 1] &&
        !board[home - 2] &&
        !board[home - 3] &&
        !attacked(board, home - 1, opponent) &&
        !attacked(board, home - 2, opponent)
      )
        add(i, home - 2, { castle: true });
    }
  }
  return moves.filter((move) => !inCheck(rawApply(state, move), turn));
}
export function applyChess(state, move, record = true) {
  const next = rawApply(state, move);
  if (record) next.history = [...state.history, chessKey(next)];
  return next;
}
export function chessStatus(state) {
  const moves = chessMoves(state);
  if (!moves.length)
    return inCheck(state)
      ? {
          over: true,
          label: `Checkmate. ${state.turn === "w" ? "Black" : "White"} wins.`,
        }
      : { over: true, label: "Stalemate. A draw." };
  if (state.half >= 100)
    return { over: true, label: "Draw by the fifty-move rule." };
  if (state.history.filter((k) => k === chessKey(state)).length >= 3)
    return { over: true, label: "Draw by threefold repetition." };
  const material = state.board
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => p && p.toLowerCase() !== "k");
  if (
    !material.length ||
    (material.length === 1 && "bn".includes(material[0].p.toLowerCase())) ||
    (material.every(({ p }) => p.toLowerCase() === "b") &&
      new Set(material.map(({ i }) => (Math.floor(i / 8) + (i % 8)) % 2))
        .size === 1)
  )
    return { over: true, label: "Draw. Insufficient mating material." };
  return {
    over: false,
    label: `${state.turn === "w" ? "White" : "Black"} to move${inCheck(state) ? " · Check" : ""}`,
  };
}
export function perft(state, depth) {
  if (depth === 0) return 1;
  return chessMoves(state).reduce(
    (count, move) => count + perft(applyChess(state, move, false), depth - 1),
    0,
  );
}
