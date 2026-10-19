import { el, button } from "../runtime.js";
import {
  fromFen,
  chessMoves,
  applyChess,
  chessStatus,
  squareName,
  inCheck,
} from "../rules/chess.mjs";
const names = {
    k: "King",
    q: "Queen",
    r: "Rook",
    b: "Bishop",
    n: "Knight",
    p: "Pawn",
  },
  glyph = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" };
export function mount(s) {
  const mode = s.choice(
      "Players",
      [
        ["cpu", "You vs computer"],
        ["local", "Two players · same device"],
      ],
      "cpu",
    ),
    difficulty = s.choice(
      "Computer",
      [
        ["casual", "Casual"],
        ["thoughtful", "Thoughtful"],
      ],
      "casual",
    );
  s.options(mode.label, difficulty.label);
  const hud = s.hud({
      turn: "AT THE BOARD",
      moves: "MOVE",
      captured: "CAPTURED",
    }),
    ui = el("div", { class: "arc-chess-ui arc-game-ui" }),
    grid = el("div", {
      class: "arc-board arc-chess",
      role: "group",
      "aria-label": "Chessboard",
    }),
    aside = el("div", { class: "arc-chess-aside" }),
    log = el("ol", { "aria-label": "Move history", class: "arc-chess-log" }),
    promotion = el("div", {
      class: "arc-promotion",
      role: "group",
      "aria-label": "Choose pawn promotion",
      hidden: true,
    }),
    cells = [];
  aside.append(
    el("h3", { text: "At your own pace." }),
    el("p", {
      text: "White at the bottom. Take your time, or take back a turn.",
    }),
    log,
  );
  ui.append(grid, aside, promotion);
  s.mount.append(ui);
  let state = fromFen(),
    selected = null,
    legal = [],
    history = [],
    notation = [],
    lastMove = null,
    thinking = false,
    pending = null,
    animation = null,
    request = 0,
    worker = null,
    cancelThink = null,
    ended = false;
  function startWorker() {
    worker?.terminate();
    worker = new Worker(new URL("../chess.worker.js", import.meta.url), {
      type: "module",
    });
    worker.onmessage = ({ data }) => {
      if (s.dead || data.id !== request || state.turn !== "b" || !thinking)
        return;
      thinking = false;
      if (data.move) play(data.move);
    };
    worker.onerror = () => {
      thinking = false;
      s.message(
        "Computer could not start. You can restart or choose local two-player mode.",
      );
      render();
    };
  }
  if (mode.value === "cpu") startWorker();
  s.onPause((value) => {
    if (mode.value !== "cpu" || !thinking || ended) return;
    request++;
    cancelThink?.();
    cancelThink = null;
    worker?.terminate();
    if (!value) {
      startWorker();
      const id = request;
      worker.postMessage({
        state,
        depth: difficulty.value === "thoughtful" ? 3 : 2,
        id,
      });
    }
  });
  s.cleanup(() => {
    worker?.terminate();
    animation?.cancel();
  });
  for (let i = 0; i < 64; i++) {
    const cell = button("", () => select(i), {
      class: `arc-chess-square ${(Math.floor(i / 8) + (i % 8)) % 2 ? "arc-chess-dark" : "arc-chess-light"}`,
    });
    s.on(cell, "keydown", (e) => {
      const delta = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -8, ArrowDown: 8 }[
        e.key
      ];
      if (delta) {
        e.preventDefault();
        cells[Math.max(0, Math.min(63, i + delta))].focus();
      }
    });
    cells.push(cell);
    grid.append(cell);
  }
  function select(i) {
    if (ended || thinking || pending || s.paused || animation) return;
    const choices = legal.filter((move) => move.to === i);
    if (selected !== null && choices.length) {
      if (choices.length > 1) {
        pending = choices;
        promotion.hidden = false;
        promotion.replaceChildren(el("p", { text: "Choose your promotion" }));
        for (const p of ["q", "r", "b", "n"])
          promotion.append(
            button(names[p], () => {
              const move = pending.find((m) => m.promotion === p);
              pending = null;
              promotion.hidden = true;
              play(move);
            }),
          );
        promotion.querySelector("button").focus();
      } else play(choices[0]);
      return;
    }
    const piece = state.board[i];
    if (piece && (piece === piece.toUpperCase() ? "w" : "b") === state.turn) {
      selected = i;
      legal = chessMoves(state, i);
    } else {
      selected = null;
      legal = [];
    }
    render();
  }
  function play(move) {
    if (!move) return;
    const old = state,
      piece = state.board[move.from],
      capture = state.board[move.to] || move.ep;
    history.push(state);
    state = applyChess(state, move);
    lastMove = move;
    selected = null;
    legal = [];
    notation.push(
      `${old.turn === "w" ? `${old.full}. ` : ""}${move.castle ? (move.to > move.from ? "O-O" : "O-O-O") : `${piece.toLowerCase() === "p" ? "" : piece.toUpperCase()}${squareName(move.from)}${capture ? "×" : "–"}${squareName(move.to)}${move.promotion ? "=" + move.promotion.toUpperCase() : ""}`}`,
    );
    s.tone(capture ? 260 : 450, 0.07, "triangle", 0.02);
    render();
    if (!s.reduced) {
      const from = cells[move.from].getBoundingClientRect(),
        to = cells[move.to].getBoundingClientRect(),
        token = cells[move.to].querySelector(".arc-chess-piece");
      if (token) {
        animation = token.animate(
          [
            {
              transform: `translate(${from.left - to.left}px,${from.top - to.top}px)`,
            },
            { transform: "translate(0,0)" },
          ],
          { duration: 200, easing: "ease-out" },
        );
        animation.onfinish = () => {
          animation = null;
        };
      }
    }
    const status = chessStatus(state);
    s.announce(status.label);
    if (status.over) {
      ended = true;
      s.result(status.label, `${history.length} moves played.`, aside);
      return;
    }
    if (mode.value === "cpu" && state.turn === "b") {
      thinking = true;
      render();
      const id = ++request;
      cancelThink = s.defer(
        () =>
          worker?.postMessage({
            state,
            depth: difficulty.value === "thoughtful" ? 3 : 2,
            id,
          }),
        0.25,
      );
    }
  }
  function render() {
    const status = chessStatus(state);
    cells.forEach((cell, i) => {
      const p = state.board[i],
        isWhite = p === p?.toUpperCase();
      cell.replaceChildren();
      cell.setAttribute(
        "aria-label",
        `${squareName(i)}${p ? `, ${isWhite ? "White" : "Black"} ${names[p.toLowerCase()]}` : ", empty"}${legal.some((m) => m.to === i) ? ", legal destination" : ""}`,
      );
      cell.classList.toggle("arc-chess-selected", selected === i);
      cell.classList.toggle(
        "arc-chess-last",
        !!lastMove && (i === lastMove.from || i === lastMove.to),
      );
      cell.classList.toggle(
        "arc-chess-check",
        p?.toLowerCase() === "k" && inCheck(state, isWhite ? "w" : "b"),
      );
      if (p)
        cell.append(
          el("span", {
            class: `arc-chess-piece ${isWhite ? "arc-piece-white" : "arc-piece-black"}`,
            text: glyph[p.toLowerCase()],
            "aria-hidden": "true",
          }),
        );
      if (legal.some((m) => m.to === i))
        cell.append(
          el("span", { class: "arc-chess-dot", "aria-hidden": "true" }),
        );
      if (i % 8 === 0)
        cell.append(
          el("small", {
            class: "arc-chess-rank",
            text: 8 - Math.floor(i / 8),
            "aria-hidden": "true",
          }),
        );
      if (i >= 56)
        cell.append(
          el("small", {
            class: "arc-chess-file",
            text: "abcdefgh"[i % 8],
            "aria-hidden": "true",
          }),
        );
    });
    log.replaceChildren(...notation.map((t) => el("li", { text: t })));
    log.scrollTop = log.scrollHeight;
    hud({
      turn: thinking ? "Computer thinking…" : status.label,
      moves: state.full,
      captured: history.length
        ? `${32 - state.board.filter(Boolean).length} pieces`
        : "—",
    });
  }
  s.actions([
    [
      "Undo turn",
      () => {
        if (!history.length) return;
        request++;
        cancelThink?.();
        cancelThink = null;
        thinking = false;
        animation?.cancel();
        animation = null;
        pending = null;
        promotion.hidden = true;
        if (mode.value === "cpu") startWorker();
        state = history.pop();
        notation.pop();
        if (mode.value === "cpu" && state.turn === "b" && history.length) {
          state = history.pop();
          notation.pop();
        }
        selected = null;
        legal = [];
        lastMove = null;
        ended = false;
        aside.querySelector(".arc-result")?.remove();
        render();
      },
    ],
  ]);
  render();
  s.message("You play White. Select a piece to see its legal moves.");
}
