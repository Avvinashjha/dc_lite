import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  shuffle,
} from "../runtime.js";
import {
  shapes,
  rotatePiece,
  blockFits,
  clearBlockRows,
} from "../rules/blocks.mjs";
const palette = [
  C.sky,
  C.butter,
  C.lavender,
  "#839ab5",
  C.peach,
  C.sage,
  C.red,
];
export function mount(s) {
  const hud = s.hud({
      score: "SCORE",
      level: "LEVEL",
      lines: "LINES",
      best: "PERSONAL BEST",
    }),
    g = canvasGame(s, { width: 460, height: 550 }),
    { ctx } = g;
  let board = Array.from({ length: 20 }, () => Array(10).fill(0)),
    bag = [],
    queue = [],
    piece = null,
    type = 0,
    x = 3,
    y = 0,
    hold = null,
    held = false,
    score = 0,
    lines = 0,
    level = 1,
    drop = 0,
    lockDelay = 0,
    clearTimer = 0,
    clearing = [],
    ended = false;
  const z = 24,
    ox = 24,
    oy = 24;
  function drawBag() {
    if (!bag.length) bag = shuffle([0, 1, 2, 3, 4, 5, 6]);
    return bag.pop();
  }
  while (queue.length < 4) queue.push(drawBag());
  function spawn(nextType) {
    type = nextType === undefined ? queue.shift() : nextType;
    if (nextType === undefined) queue.push(drawBag());
    piece = shapes[type].map((r) => [...r]);
    x = Math.floor((10 - piece[0].length) / 2);
    y = 0;
    drop = 0;
    lockDelay = 0;
    if (!blockFits(board, piece, x, y)) end();
  }
  function end() {
    if (ended) return;
    ended = true;
    s.best(score);
    s.result(
      "A good stack of decisions.",
      `${score} points · ${lines} lines · Best ${s.best()}`,
      g.wrap,
      true,
    );
  }
  function lock() {
    if (ended || clearTimer) return;
    for (let r = 0; r < piece.length; r++)
      for (let c = 0; c < piece[r].length; c++)
        if (piece[r][c]) {
          if (y + r < 0) {
            end();
            return;
          }
          board[y + r][x + c] = type + 1;
        }
    const result = clearBlockRows(board);
    held = false;
    if (result.rows.length) {
      clearing = result.rows;
      clearTimer = 0.22;
      score += [0, 100, 300, 500, 800][clearing.length] * level;
      lines += clearing.length;
      level = Math.floor(lines / 10) + 1;
      for (const row of clearing) g.burst(ox + 120, oy + row * z, C.butter, 15);
      s.tone(660, 0.12);
      piece = null;
    } else spawn();
  }
  function move(dx) {
    if (ended || clearTimer) return;
    if (blockFits(board, piece, x + dx, y)) {
      x += dx;
      lockDelay = Math.min(lockDelay, 0.1);
    }
  }
  function rotate() {
    if (ended || clearTimer) return;
    const next = rotatePiece(piece);
    for (const dx of [0, -1, 1, -2, 2])
      if (blockFits(board, next, x + dx, y)) {
        piece = next;
        x += dx;
        return;
      }
  }
  function soft() {
    if (ended || clearTimer) return;
    if (blockFits(board, piece, x, y + 1)) {
      y++;
      score++;
      drop = 0;
    }
  }
  function hard() {
    if (ended || clearTimer) return;
    let rows = 0;
    while (blockFits(board, piece, x, y + 1)) {
      y++;
      rows++;
    }
    score += rows * 2;
    g.burst(ox + (x + 1) * z, oy + (y + 1) * z, palette[type], 10);
    s.tone(190, 0.06);
    lock();
  }
  function holdPiece() {
    if (ended || held || clearTimer) return;
    const current = type;
    if (hold === null) {
      hold = current;
      spawn();
    } else {
      const swap = hold;
      hold = current;
      spawn(swap);
    }
    held = true;
  }
  g.key((key, repeat) => {
    if (key === "ArrowLeft") move(-1);
    else if (key === "ArrowRight") move(1);
    else if (key === "ArrowDown") soft();
    else if (key === "ArrowUp" && !repeat) rotate();
    else if (key === " " && !repeat) hard();
    else if (key.toLowerCase() === "c" && !repeat) holdPiece();
  });
  g.controls(
    g.control("←", "ArrowLeft", { repeat: true }),
    g.control("Rotate ↻", "ArrowUp"),
    g.control("→", "ArrowRight", { repeat: true }),
    g.control("↓", "ArrowDown", { repeat: true }),
    g.control("Drop", " "),
    g.control("Hold · C", "c"),
  );
  function tile(v, c, r, alpha = 1) {
    ctx.globalAlpha = alpha;
    rr(ctx, ox + c * z + 1, oy + r * z + 1, z - 2, z - 2, 3, palette[v - 1]);
    line(
      ctx,
      [
        [ox + c * z + 4, oy + r * z + 4],
        [ox + (c + 1) * z - 5, oy + r * z + 4],
      ],
      "#ffffff65",
      2,
    );
    ctx.globalAlpha = 1;
  }
  function preview(v, px, py) {
    if (v === null) return;
    shapes[v].forEach((row, r) =>
      row.forEach((n, c) => {
        if (n) rr(ctx, px + c * 18, py + r * 18, 16, 16, 3, palette[v]);
      }),
    );
  }
  s.frame((dt) => {
    if (!ended) {
      if (clearTimer > 0) {
        clearTimer -= dt;
        if (clearTimer <= 0) {
          board = clearBlockRows(board).board;
          clearing = [];
          spawn();
        }
      } else if (piece) {
        drop += dt;
        const period = Math.max(0.085, 0.65 - (level - 1) * 0.045);
        if (drop >= period) {
          drop = 0;
          if (blockFits(board, piece, x, y + 1)) y++;
        }
        if (!blockFits(board, piece, x, y + 1)) {
          lockDelay += dt;
          if (lockDelay > 0.35) lock();
        } else lockDelay = 0;
      }
    }
    g.clear("#e9edde");
    rr(ctx, ox - 3, oy - 3, 246, 486, 8, C.dark);
    for (let r = 0; r < 20; r++)
      for (let c = 0; c < 10; c++) {
        if (board[r][c]) tile(board[r][c], c, r);
        else
          rr(ctx, ox + c * z + 1, oy + r * z + 1, z - 2, z - 2, 1, "#233b2d");
      }
    if (clearing.length) {
      ctx.globalAlpha = Math.sin(clearTimer * 40) * 0.3 + 0.5;
      for (const r of clearing) rr(ctx, ox, oy + r * z, 240, z, 0, C.paper);
      ctx.globalAlpha = 1;
    }
    if (piece) {
      let gy = y;
      while (blockFits(board, piece, x, gy + 1)) gy++;
      piece.forEach((row, r) =>
        row.forEach((n, c) => {
          if (n) tile(type + 1, x + c, gy + r, 0.2);
        }),
      );
      piece.forEach((row, r) =>
        row.forEach((n, c) => {
          if (n) tile(type + 1, x + c, y + r);
        }),
      );
    }
    text(ctx, "NEXT UP", 302, 42, 11, C.muted);
    queue.slice(0, 3).forEach((v, i) => preview(v, 306, 73 + i * 86));
    text(ctx, "HOLD", 302, 351, 11, C.muted);
    preview(hold, 306, 380);
    text(ctx, "C TO SWAP", 302, 435, 10, C.muted);
    text(ctx, "MAKE A LITTLE SPACE.", 230, 531, 10, C.muted, "center");
    g.effects(dt);
    hud({ score, level, lines, best: s.best() });
  });
  spawn();
  s.message(
    "Build complete rows. The shadow shows where your piece will land.",
  );
}
