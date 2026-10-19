import { el, button, random } from "../runtime.js";
import { mergeMove, mergeCanMove } from "../rules/merge.mjs";
export function mount(s) {
  const hud = s.hud({ score: "SCORE", best: "PERSONAL BEST", moves: "MOVES" }),
    ui = el("div", { class: "arc-game-ui" }),
    grid = el("div", {
      class: "arc-merge",
      tabindex: "0",
      role: "group",
      "aria-label": "2048 board. Use arrow keys to slide.",
    }),
    background = el("div", { class: "arc-merge-grid" });
  for (let i = 0; i < 16; i++) background.append(el("span"));
  grid.append(background);
  ui.append(grid);
  s.mount.append(ui);
  let board = Array(16).fill(0),
    score = 0,
    moves = 0,
    undo = null,
    busy = false,
    ended = false,
    won = false;
  let tiles = [];
  function add() {
    const empty = board.map((v, i) => (v ? null : i)).filter((v) => v !== null);
    if (empty.length)
      board[empty[Math.floor(random(0, empty.length))]] =
        Math.random() < 0.9 ? 2 : 4;
  }
  function render() {
    tiles.forEach((n) => n.remove());
    tiles = [];
    for (let i = 0; i < 16; i++)
      if (board[i]) {
        const node = el("span", {
          class: "arc-merge-tile",
          text: String(board[i]),
          "data-value": board[i],
          "data-index": i,
          role: "img",
          "aria-label": `${board[i]}, row ${Math.floor(i / 4) + 1}, column ${(i % 4) + 1}`,
        });
        node.style.setProperty("--x", String(i % 4));
        node.style.setProperty("--y", String(Math.floor(i / 4)));
        grid.append(node);
        tiles.push(node);
      }
    hud({ score, moves, best: s.best() });
  }
  function move(direction) {
    if (busy || ended || s.paused) return;
    const result = mergeMove(board, direction);
    if (!result.changed) return;
    undo = { board: [...board], score, moves };
    busy = true;
    const old = [...board];
    board = result.board;
    score += result.score;
    moves++;
    s.best(score);
    for (const transition of result.transitions) {
      const node =
        tiles.find((n) => Number(n.dataset.index) === transition.from) ||
        Array.from(grid.querySelectorAll(".arc-merge-tile")).find((n) =>
          n
            .getAttribute("aria-label")
            ?.includes(
              `row ${Math.floor(transition.from / 4) + 1}, column ${(transition.from % 4) + 1}`,
            ),
        );
      if (node) {
        node.style.setProperty("--x", String(transition.to % 4));
        node.style.setProperty("--y", String(Math.floor(transition.to / 4)));
      }
    }
    s.tone(result.score ? 570 : 260, 0.05, "triangle", 0.018);
    s.defer(
      () => {
        add();
        render();
        busy = false;
        s.announce(`Score ${score}. Largest tile ${Math.max(...board)}.`);
        if (!won && board.includes(2048)) {
          won = true;
          s.message("2048! Beautifully done. Keep going for a bigger tile.");
        }
        if (!mergeCanMove(board)) {
          ended = true;
          s.result(
            "A board full of good ideas.",
            `${score} points · Largest tile ${Math.max(...board)}`,
            ui,
          );
        }
      },
      s.reduced ? 0.01 : 0.14,
    );
  }
  s.on(grid, "keydown", (e) => {
    const direction = {
      ArrowLeft: "left",
      a: "left",
      ArrowRight: "right",
      d: "right",
      ArrowUp: "up",
      w: "up",
      ArrowDown: "down",
      s: "down",
    }[e.key];
    if (direction) {
      e.preventDefault();
      move(direction);
    }
  });
  let start = null;
  s.on(grid, "pointerdown", (e) => {
    start = { x: e.clientX, y: e.clientY };
    grid.setPointerCapture(e.pointerId);
  });
  s.on(grid, "pointercancel", () => {
    start = null;
  });
  s.on(grid, "pointerup", (e) => {
    if (!start) return;
    const dx = e.clientX - start.x,
      dy = e.clientY - start.y;
    start = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 20)
      move(
        Math.abs(dx) > Math.abs(dy)
          ? dx > 0
            ? "right"
            : "left"
          : dy > 0
            ? "down"
            : "up",
      );
  });
  s.actions([
    ["←", () => move("left"), { "aria-label": "Slide left" }],
    ["↑", () => move("up"), { "aria-label": "Slide up" }],
    ["↓", () => move("down"), { "aria-label": "Slide down" }],
    ["→", () => move("right"), { "aria-label": "Slide right" }],
    [
      "Undo",
      () => {
        if (!undo || busy) return;
        board = undo.board;
        score = undo.score;
        moves = undo.moves;
        undo = null;
        ended = false;
        ui.querySelector(".arc-result")?.remove();
        render();
      },
    ],
  ]);
  add();
  add();
  render();
  grid.focus({ preventScroll: true });
  s.message("Slide matching numbers together. One merge per tile, per move.");
}
