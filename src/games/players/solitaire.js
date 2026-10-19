import { el, button, shuffle } from "../runtime.js";
import {
  dealSolitaire,
  solitaireCards,
  solitaireCanMove,
  solitaireMove,
  solitaireDraw,
  cardName,
  cardSuit,
  cardRank,
  cardRed,
} from "../rules/solitaire.mjs";
export function mount(s) {
  const hud = s.hud({
      moves: "MOVES",
      home: "CARDS HOME",
      time: "TIME",
      wins: "YOUR WINS",
    }),
    ui = el("div", { class: "arc-game-ui arc-solitaire" }),
    top = el("div", { class: "arc-sol-top" }),
    table = el("div", { class: "arc-sol-table" });
  ui.append(top, table);
  s.mount.append(ui);
  let state = dealSolitaire(shuffle(Array.from({ length: 52 }, (_, i) => i))),
    selected = null,
    history = [],
    seconds = 0,
    ended = false,
    recordedWin = false;
  const same = (a, b) =>
    a && b && a.type === b.type && a.pile === b.pile && a.index === b.index;
  function cardNode(card, source) {
    const b = button("", () => choose(source), {
      class: `arc-playing-card arc-sol-card${card.up ? "" : " arc-sol-back"}`,
      "data-card-id": card.id,
      "aria-label": card.up
        ? `${cardName(card.id)}${source.type === "tableau" ? `, column ${source.pile + 1}` : ""}`
        : "Face-down card",
      "data-red": String(cardRed(card.id)),
      draggable: card.up ? "true" : "false",
      "aria-pressed": String(same(selected, source)),
    });
    if (card.up) {
      const rank = cardName(card.id).slice(0, -1),
        suit = ["♠", "♥", "♦", "♣"][cardSuit(card.id)];
      const corner = (bottom = false) =>
        el(
          "span",
          {
            class: `arc-card-corner${bottom ? " arc-card-corner--bottom" : ""}`,
            "aria-hidden": "true",
          },
          [el("span", { text: rank }), el("span", { text: suit })],
        );
      b.append(
        corner(),
        el("span", {
          class: "arc-card-center",
          text: suit,
          "aria-hidden": "true",
        }),
        corner(true),
      );
    } else {
      b.disabled = true;
      b.append(el("span", { "aria-hidden": "true", text: "✳" }));
    }
    if (card.up) {
      s.on(b, "dragstart", (e) => {
        selected = source;
        e.dataTransfer.setData("text/plain", String(card.id));
        e.dataTransfer.effectAllowed = "move";
      });
    }
    return b;
  }
  function target(node, dest) {
    s.on(node, "dragover", (e) => {
      if (selected && solitaireCanMove(state, selected, dest)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }
    });
    s.on(node, "drop", (e) => {
      e.preventDefault();
      transfer(dest);
    });
  }
  function choose(source) {
    if (ended || s.paused) return;
    if (selected) {
      const dest =
        source.type === "tableau"
          ? { type: "tableau", pile: source.pile }
          : source.type === "foundation"
            ? { type: "foundation", pile: source.pile }
            : null;
      if (dest && solitaireCanMove(state, selected, dest)) {
        transfer(dest);
        return;
      }
      if (same(selected, source)) {
        selected = null;
        render();
        return;
      }
    }
    selected = source;
    render();
    s.announce(
      `Selected ${cardName(solitaireCards(state, source)[0].id)}. Choose a destination.`,
    );
  }
  function transfer(dest) {
    if (ended || !selected) return;
    const next = solitaireMove(state, selected, dest);
    if (!next) {
      s.message(
        "That pile needs the next rank in an alternating colour, or the next card in its suit.",
      );
      return;
    }
    history.push(state);
    state = next;
    selected = null;
    s.tone(450, 0.06, "triangle", 0.018);
    render();
    const count = state.foundations.reduce((n, p) => n + p.length, 0);
    if (count === 52) {
      ended = true;
      if (!recordedWin) {
        s.best(s.best(undefined, "wins") + 1, "wins");
        recordedWin = true;
      }
      s.result(
        "Everything found its place.",
        `${state.moves} moves · ${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`,
        ui,
      );
    }
  }
  function draw() {
    if (ended) return;
    const next = solitaireDraw(state);
    if (next) {
      history.push(state);
      state = next;
      selected = null;
      render();
    }
  }
  function render() {
    const old = new Map(
      Array.from(ui.querySelectorAll("[data-card-id]")).map((n) => [
        n.dataset.cardId,
        n.getBoundingClientRect(),
      ]),
    );
    top.replaceChildren();
    table.replaceChildren();
    const stock = button(
      state.stock.length ? `Draw · ${state.stock.length}` : "Recycle ↻",
      draw,
      {
        class: "arc-sol-slot arc-sol-stock",
        "aria-label": state.stock.length
          ? `Draw from stock, ${state.stock.length} cards`
          : "Recycle the waste into the stock",
      },
    );
    top.append(stock);
    const waste = el("div", { class: "arc-sol-pile" });
    if (state.waste.length)
      waste.append(cardNode(state.waste.at(-1), { type: "waste", pile: 0 }));
    else
      waste.append(el("span", { class: "arc-sol-placeholder", text: "Waste" }));
    top.append(waste, el("div"));
    for (let i = 0; i < 4; i++) {
      const dest = { type: "foundation", pile: i },
        pile = el("div", { class: "arc-sol-pile" }),
        placeholder = button(["♠", "♥", "♦", "♣"][i], () => transfer(dest), {
          class: "arc-sol-slot",
          "aria-label": `Move selected card to ${["spades", "hearts", "diamonds", "clubs"][i]} foundation`,
        });
      pile.append(placeholder);
      if (state.foundations[i].length) {
        const card = cardNode(state.foundations[i].at(-1), {
          type: "foundation",
          pile: i,
        });
        pile.append(card);
      }
      target(pile, dest);
      top.append(pile);
    }
    state.tableau.forEach((cards, i) => {
      const pile = el("div", { class: "arc-sol-column" }),
        dest = { type: "tableau", pile: i },
        placeholder = button("K", () => transfer(dest), {
          class: "arc-sol-slot",
          "aria-label": `Move selected cards to column ${i + 1}`,
        });
      pile.style.setProperty("--count", String(Math.max(1, cards.length)));
      pile.append(placeholder);
      target(pile, dest);
      cards.forEach((card, j) => {
        const node = cardNode(card, { type: "tableau", pile: i, index: j });
        node.style.setProperty("--index", String(j));
        pile.append(node);
      });
      table.append(pile);
    });
    if (!s.reduced)
      ui.querySelectorAll("[data-card-id]").forEach((node) => {
        const a = old.get(node.dataset.cardId);
        if (!a) return;
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top)
          node.animate(
            [
              {
                transform: `translate(${a.left - b.left}px,${a.top - b.top}px)`,
              },
              { transform: "translate(0,0)" },
            ],
            { duration: 200, easing: "ease-out" },
          );
      });
    hud({
      moves: state.moves,
      home: `${state.foundations.reduce((n, p) => n + p.length, 0)} / 52`,
      wins: s.best(undefined, "wins"),
    });
  }
  function hint() {
    const sources = [];
    if (state.waste.length) sources.push({ type: "waste", pile: 0 });
    state.tableau.forEach((pile, p) =>
      pile.forEach((card, i) => {
        if (card.up) sources.push({ type: "tableau", pile: p, index: i });
      }),
    );
    const targets = [
      ...Array.from({ length: 4 }, (_, pile) => ({ type: "foundation", pile })),
      ...Array.from({ length: 7 }, (_, pile) => ({ type: "tableau", pile })),
    ];
    for (const dest of targets)
      for (const source of sources)
        if (solitaireCanMove(state, source, dest)) {
          if (
            dest.type === "tableau" &&
            source.index === 0 &&
            state.tableau[dest.pile].length === 0
          )
            continue;
          selected = source;
          render();
          s.message(
            `Try ${cardName(solitaireCards(state, source)[0].id)} on ${dest.type === "foundation" ? ["spades", "hearts", "diamonds", "clubs"][dest.pile] + " foundation" : "column " + (dest.pile + 1)}.`,
          );
          return;
        }
    s.message(
      state.stock.length || state.waste.length
        ? "Try drawing from the stock."
        : "No available move found. Undo or start a new deal.",
    );
  }
  s.actions([
    [
      "Undo",
      () => {
        if (history.length) {
          state = history.pop();
          selected = null;
          ended = false;
          ui.querySelector(".arc-result")?.remove();
          render();
        }
      },
    ],
    ["Hint", hint],
    [
      "Send home",
      () => {
        if (ended || s.paused) return;
        const sources = selected
          ? [selected]
          : [
              ...(state.waste.length ? [{ type: "waste", pile: 0 }] : []),
              ...state.tableau.flatMap((pile, p) =>
                pile.length
                  ? [{ type: "tableau", pile: p, index: pile.length - 1 }]
                  : [],
              ),
            ];
        for (const source of sources)
          for (let pile = 0; pile < 4; pile++) {
            const dest = { type: "foundation", pile };
            if (solitaireCanMove(state, source, dest)) {
              selected = source;
              transfer(dest);
              return;
            }
          }
        s.message(
          "No available card can go home yet. Build the next rank in the same suit.",
        );
      },
    ],
    [
      "Cancel selection",
      () => {
        selected = null;
        render();
      },
    ],
  ]);
  s.frame((dt) => {
    if (!ended) seconds += dt;
    hud({
      time: `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`,
    });
  });
  render();
  s.message(
    "Draw from the stock. Click or drag face-up cards to build alternating-colour columns.",
  );
}
