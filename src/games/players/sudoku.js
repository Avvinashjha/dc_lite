import { el, button } from "../runtime.js";
import {
  generateSudoku,
  sudokuCandidates,
  validSudoku,
} from "../rules/sudoku.mjs";
export function mount(s) {
  const difficulty = s.choice(
      "Difficulty",
      [
        ["easy", "Easy"],
        ["medium", "Medium"],
        ["hard", "Hard"],
      ],
      "medium",
    ),
    hud = s.hud({
      time: "TIME",
      remaining: "EMPTY CELLS",
      hints: "HINTS USED",
      best: "BEST TIME",
    });
  s.options(difficulty.label);
  const puzzle = generateSudoku(difficulty.value),
    initial = [...puzzle.board];
  let board = [...initial],
    notes = Array.from({ length: 81 }, () => []),
    selected = initial.findIndex((n) => !n),
    noteMode = false,
    history = [],
    seconds = 0,
    hints = 0,
    ended = false;
  const ui = el("div", { class: "arc-game-ui" }),
    grid = el("div", {
      class: "arc-board arc-sudoku",
      role: "group",
      "aria-label": "Sudoku board",
    }),
    cells = [];
  ui.append(grid);
  s.mount.append(ui);
  for (let i = 0; i < 81; i++) {
    const cell = button(
      "",
      () => {
        selected = i;
        render();
      },
      {
        class: "arc-su-cell",
        "aria-label": `Row ${Math.floor(i / 9) + 1}, column ${(i % 9) + 1}`,
      },
    );
    if (i % 9 === 2 || i % 9 === 5) cell.classList.add("arc-su-right");
    if (Math.floor(i / 9) === 2 || Math.floor(i / 9) === 5)
      cell.classList.add("arc-su-bottom");
    cells.push(cell);
    grid.append(cell);
  }
  const tools = el("div", { class: "arc-toolbar" }),
    notesButton = button(
      "Notes",
      () => {
        noteMode = !noteMode;
        render();
      },
      { "aria-pressed": "false" },
    );
  tools.append(
    notesButton,
    button("Undo", () => {
      if (history.length && !ended) {
        const old = history.pop();
        board = old.board;
        notes = old.notes;
        selected = old.selected;
        render();
      }
    }),
    button("Erase", () => enter(0)),
    button("Hint", () => {
      if (ended) return;
      if (initial[selected] || board[selected] === puzzle.solution[selected])
        selected = board.findIndex(
          (v, i) => !initial[i] && v !== puzzle.solution[i],
        );
      if (selected < 0) return;
      save();
      board[selected] = puzzle.solution[selected];
      notes[selected] = [];
      hints++;
      render();
      s.message("A little help. Try the connected row and column next.");
    }),
    button("Check", check),
  );
  ui.append(tools);
  const pad = el("div", { class: "arc-numpad" });
  for (let n = 1; n <= 9; n++)
    pad.append(
      button(String(n), () => enter(n), { "aria-label": `Enter ${n}` }),
    );
  ui.append(pad);
  function save() {
    history.push({
      board: [...board],
      notes: notes.map((a) => [...a]),
      selected,
    });
    if (history.length > 150) history.shift();
  }
  function enter(n) {
    if (ended || initial[selected]) return;
    save();
    if (noteMode && n) {
      notes[selected] = notes[selected].includes(n)
        ? notes[selected].filter((v) => v !== n)
        : [...notes[selected], n].sort();
      board[selected] = 0;
    } else {
      board[selected] = n;
      notes[selected] = [];
      if (n) {
        const row = Math.floor(selected / 9),
          col = selected % 9;
        notes = notes.map((entry, i) =>
          Math.floor(i / 9) === row ||
          i % 9 === col ||
          (Math.floor(i / 27) === Math.floor(row / 3) &&
            Math.floor((i % 9) / 3) === Math.floor(col / 3))
            ? entry.filter((v) => v !== n)
            : entry,
        );
      }
    }
    s.tone(300 + n * 20, 0.025, "sine", 0.01);
    render();
    if (board.every(Boolean) && validSudoku(board)) check();
  }
  function check() {
    if (ended) return;
    if (!board.every(Boolean)) {
      s.message("There are still a few empty cells. Keep going.");
      return;
    }
    if (!validSudoku(board)) {
      s.message(
        "A row, column, or box has a conflict. Highlighted cells can help.",
      );
      return;
    }
    ended = true;
    if (!hints) s.best(Math.floor(seconds), difficulty.value, true);
    s.result(
      "Everything in its right place.",
      `Solved in ${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s · ${hints} hints`,
      ui,
    );
  }
  function render() {
    cells.forEach((cell, i) => {
      const row = Math.floor(i / 9),
        col = i % 9,
        r = Math.floor(selected / 9),
        c = selected % 9,
        same =
          row === r ||
          col === c ||
          (Math.floor(row / 3) === Math.floor(r / 3) &&
            Math.floor(col / 3) === Math.floor(c / 3));
      cell.classList.toggle("arc-su-given", Boolean(initial[i]));
      cell.classList.toggle("arc-su-related", same);
      cell.classList.toggle("arc-su-selected", selected === i);
      const copy = [...board],
        v = copy[i];
      copy[i] = 0;
      cell.classList.toggle(
        "arc-su-conflict",
        !!v && !sudokuCandidates(copy, i).includes(v),
      );
      cell.setAttribute(
        "aria-label",
        `Row ${row + 1}, column ${col + 1}, ${v || "empty"}${initial[i] ? ", given" : ""}${notes[i].length ? ", notes " + notes[i].join(", ") : ""}`,
      );
      cell.tabIndex = i === selected ? 0 : -1;
      cell.replaceChildren();
      if (v) cell.textContent = String(v);
      else if (notes[i].length) {
        const small = el("span", { class: "arc-su-notes" });
        for (let n = 1; n <= 9; n++)
          small.append(
            el("span", { text: notes[i].includes(n) ? String(n) : "" }),
          );
        cell.append(small);
      }
    });
    notesButton.setAttribute("aria-pressed", String(noteMode));
    hud({ remaining: board.filter((n) => !n).length, hints });
  }
  s.on(ui, "keydown", (e) => {
    if (e.target.closest("select") || s.paused) return;
    if (/^[1-9]$/.test(e.key)) {
      e.preventDefault();
      enter(Number(e.key));
    } else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      enter(0);
    } else {
      const change = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: -9,
        ArrowDown: 9,
      }[e.key];
      if (change) {
        e.preventDefault();
        selected = Math.max(0, Math.min(80, selected + change));
        render();
        cells[selected].focus();
      }
    }
  });
  s.frame((dt) => {
    if (!ended) seconds += dt;
    const best = s.best(undefined, difficulty.value);
    hud({
      time: `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`,
      best: best ? `${Math.floor(best / 60)}m ${best % 60}s` : "—",
    });
  });
  render();
  s.message(
    "Select a cell, then enter a number. Every puzzle has exactly one solution.",
  );
}
