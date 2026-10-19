import { el, button, shuffle } from "./runtime.js";
import {
  suit,
  rank,
  trickCardName,
  heartsPoints,
  trickWinner,
  legalTrickCards,
  scoreHearts,
  scoreSpades,
} from "./rules/tricks.mjs";
const names = ["You", "West", "North", "East"];
export function mountTricks(s, game) {
  const isHearts = game === "hearts",
    hud = s.hud(
      isHearts
        ? { you: "YOU", west: "WEST", north: "NORTH", east: "EAST" }
        : {
            you: "YOU + NORTH",
            opponents: "WEST + EAST",
            bags: "TEAM BAGS",
            hand: "HAND",
          },
    ),
    ui = el("div", { class: "arc-game-ui" }),
    table = el("div", { class: "arc-card-table" }),
    info = el("p", { class: "arc-message", role: "status" }),
    trickArea = el("div", { class: "arc-trick" }),
    scoreLine = el("div", { class: "arc-match-scores" }),
    phaseArea = el("div", { class: "arc-trick-phase" }),
    handArea = el("div", { class: "arc-hand", "aria-label": "Your hand" });
  table.append(info, trickArea, scoreLine, phaseArea, handArea);
  ui.append(table);
  s.mount.append(ui);
  let hands = [],
    scores = isHearts ? [0, 0, 0, 0] : [0, 0],
    bags = [0, 0],
    round = 0,
    points = [0, 0, 0, 0],
    taken = [0, 0, 0, 0],
    bids = [null, null, null, null],
    trick = [],
    turn = 0,
    broken = false,
    trickNumber = 0,
    phase = "",
    passSelected = [],
    ended = false,
    history = [];
  function cardNode(card, enabled, fn, selected = false) {
    const node = button("", fn, {
      class: "arc-playing-card",
      "data-trick-card": card,
      "data-red": String(suit(card) === 1 || suit(card) === 2),
      "aria-label": trickCardName(card),
      "aria-pressed": String(selected),
      disabled: !enabled,
    });
    const label = trickCardName(card),
      symbol = ["♠", "♥", "♦", "♣"][suit(card)];
    node.append(
      el("span", {
        class: "arc-card-corner",
        text: label,
        "aria-hidden": "true",
      }),
      el("span", {
        class: "arc-card-center",
        text: symbol,
        "aria-hidden": "true",
      }),
      el("span", {
        class: "arc-card-corner arc-card-corner--bottom",
        text: label,
        "aria-hidden": "true",
      }),
    );
    return node;
  }
  function deal() {
    if (ended) return;
    round++;
    const deck = shuffle(Array.from({ length: 52 }, (_, i) => i));
    hands = Array.from({ length: 4 }, (_, p) =>
      deck
        .slice(p * 13, p * 13 + 13)
        .sort((a, b) => suit(a) - suit(b) || rank(a) - rank(b)),
    );
    points = [0, 0, 0, 0];
    taken = [0, 0, 0, 0];
    trick = [];
    broken = false;
    trickNumber = 0;
    passSelected = [];
    phaseArea.replaceChildren();
    if (isHearts) {
      const direction = [1, -1, 2, 0][(round - 1) % 4];
      if (direction) {
        phase = "pass";
        info.textContent = `Hand ${round}. Choose three cards to pass ${direction === 1 ? "left" : direction === -1 ? "right" : "across"}.`;
        render();
      } else startPlay();
    } else {
      phase = "bid";
      bids = [
        null,
        ...[1, 2, 3].map((p) => {
          const strength = hands[p].reduce(
            (n, c) => n + (rank(c) >= 12 ? 0.7 : 0) + (suit(c) === 0 ? 0.4 : 0),
            0,
          );
          return Math.max(1, Math.min(8, Math.round(strength)));
        }),
      ];
      render();
    }
  }
  function confirmPass() {
    if (phase !== "pass" || passSelected.length !== 3) return;
    const direction = [1, -1, 2, 0][(round - 1) % 4],
      passes = [
        passSelected,
        ...[1, 2, 3].map((p) =>
          [...hands[p]]
            .sort(
              (a, b) =>
                heartsPoints(b) * 4 + rank(b) - (heartsPoints(a) * 4 + rank(a)),
            )
            .slice(0, 3),
        ),
      ];
    const after = hands.map((h, p) => h.filter((c) => !passes[p].includes(c)));
    passes.forEach((cards, p) => after[(p + direction + 4) % 4].push(...cards));
    hands = after.map((h) =>
      h.sort((a, b) => suit(a) - suit(b) || rank(a) - rank(b)),
    );
    startPlay();
  }
  function startPlay() {
    phase = "play";
    turn = isHearts ? hands.findIndex((h) => h.includes(40)) : (round - 1) % 4;
    render();
    queueAI();
  }
  function queueAI() {
    if (phase === "play" && turn !== 0) s.defer(ai, 0.45);
  }
  function playable(player) {
    return legalTrickCards(hands[player], trick, {
      game,
      broken,
      first: trickNumber === 0,
    });
  }
  function play(card) {
    if (phase !== "play" || s.paused || !playable(turn).includes(card)) return;
    const player = turn;
    hands[player] = hands[player].filter((c) => c !== card);
    trick.push({ player, card });
    if (suit(card) === (isHearts ? 1 : 0)) broken = true;
    s.tone(330 + rank(card) * 10, 0.05, "triangle", 0.015);
    if (trick.length === 4) {
      const winner = trickWinner(trick, !isHearts);
      phase = "resolve";
      render();
      info.textContent = `${names[winner]} takes the trick${isHearts ? ` · ${trick.reduce((n, p) => n + heartsPoints(p.card), 0)} points` : ""}.`;
      s.defer(() => {
        taken[winner]++;
        if (isHearts)
          points[winner] += trick.reduce((n, p) => n + heartsPoints(p.card), 0);
        trickNumber++;
        trick = [];
        turn = winner;
        if (trickNumber === 13) endRound();
        else {
          phase = "play";
          render();
          queueAI();
        }
      }, 0.85);
    } else {
      turn = (turn + 1) % 4;
      render();
      queueAI();
    }
  }
  function ai() {
    if (phase !== "play" || turn === 0 || ended) return;
    const hand = playable(turn);
    if (!hand.length) return;
    let choice = hand[0];
    if (isHearts) {
      if (!trick.length)
        choice = [...hand].sort((a, b) => rank(a) - rank(b))[0];
      else {
        const led = suit(trick[0].card);
        if (hand.every((c) => suit(c) !== led))
          choice = [...hand].sort(
            (a, b) => heartsPoints(b) - heartsPoints(a) || rank(b) - rank(a),
          )[0];
        else {
          const high = Math.max(
              ...trick
                .filter((p) => suit(p.card) === led)
                .map((p) => rank(p.card)),
            ),
            losers = hand.filter((c) => suit(c) === led && rank(c) < high);
          choice = (
            losers.length
              ? [...losers].sort((a, b) => rank(b) - rank(a))
              : [...hand].sort((a, b) => rank(a) - rank(b))
          )[0];
        }
      }
    } else {
      const current = trick.length ? trickWinner(trick, true) : null,
        partner = (turn + 2) % 4,
        winners = hand.filter(
          (card) =>
            trickWinner([...trick, { player: turn, card }], true) === turn,
        ),
        need =
          taken[turn] + taken[partner] <
          (bids[turn] || 0) + (bids[partner] || 0);
      if (bids[turn] === 0 || current === partner || !need)
        choice = [...hand].sort(
          (a, b) =>
            (suit(a) === 0 ? 20 : 0) +
            rank(a) -
            ((suit(b) === 0 ? 20 : 0) + rank(b)),
        )[0];
      else
        choice = [...(winners.length ? winners : hand)].sort(
          (a, b) =>
            (suit(a) === 0 ? 20 : 0) +
            rank(a) -
            ((suit(b) === 0 ? 20 : 0) + rank(b)),
        )[0];
    }
    play(choice);
  }
  function endRound() {
    phase = "round";
    let summary = "";
    if (isHearts) {
      const scored = scoreHearts(points),
        shooter = points.indexOf(26);
      scores = scores.map((n, p) => n + scored[p]);
      summary =
        shooter >= 0
          ? `${names[shooter]} shot the moon! Everyone else gains 26.`
          : points.map((n, p) => `${names[p]} +${n}`).join(" · ");
      if (Math.max(...scores) >= 100) {
        ended = true;
        const low = Math.min(...scores),
          winners = scores
            .map((v, p) => (v === low ? names[p] : null))
            .filter(Boolean);
        s.result(
          `${winners.join(" & ")} ${winners.length > 1 ? "tie for the win" : "wins"}!`,
          scores.map((v, p) => `${names[p]} ${v}`).join(" · "),
          ui,
        );
      }
    } else {
      const old = [...scores],
        result = scoreSpades(bids, taken, scores, bags);
      scores = result.scores;
      bags = result.bags;
      summary = `Your team ${scores[0] - old[0] >= 0 ? "+" : ""}${scores[0] - old[0]} · Opponents ${scores[1] - old[1] >= 0 ? "+" : ""}${scores[1] - old[1]}`;
      if (Math.max(...scores) >= 500 && scores[0] !== scores[1]) {
        ended = true;
        s.result(
          scores[0] > scores[1]
            ? "A promise well kept."
            : "The other team takes it.",
          `You + North: ${scores[0]} · West + East: ${scores[1]}`,
          ui,
        );
      }
    }
    history.push({ round, summary });
    render();
    info.textContent = `Hand ${round} complete. ${summary}`;
    s.announce(info.textContent);
    if (!ended)
      phaseArea.append(
        button("Next hand ↗", deal, {
          class: "arc-button arc-button--primary",
        }),
      );
  }
  function render() {
    const previous = new Map(
      [...ui.querySelectorAll("[data-trick-card]")].map((n) => [
        n.dataset.trickCard,
        n.getBoundingClientRect(),
      ]),
    );
    phaseArea.replaceChildren();
    if (isHearts)
      hud({
        you: scores[0],
        west: scores[1],
        north: scores[2],
        east: scores[3],
      });
    else
      hud({
        you: scores[0],
        opponents: scores[1],
        bags: `${bags[0]} / 10`,
        hand: round,
      });
    trickArea.replaceChildren();
    for (let p = 0; p < 4; p++) {
      const played = trick.find((t) => t.player === p),
        slot = el("div", {}, [el("span", { text: names[p] })]);
      if (played) slot.append(cardNode(played.card, false, () => {}));
      trickArea.append(slot);
    }
    scoreLine.replaceChildren(
      ...names.map((name, p) =>
        el("span", {
          text: isHearts
            ? `${name}: ${points[p]} this hand`
            : `${name}: ${taken[p]} / ${bids[p] ?? "—"}`,
        }),
      ),
    );
    if (phase === "play")
      info.textContent = `${turn === 0 ? "Your turn" : names[turn] + " is thinking…"}${broken ? "" : isHearts ? " · Hearts not broken" : " · Spades not broken"}`;
    if (phase === "pass") {
      phaseArea.append(
        button(`Pass ${passSelected.length}/3 cards`, confirmPass, {
          class: "arc-button arc-button--primary",
          disabled: passSelected.length !== 3,
        }),
      );
    }
    if (phase === "bid") {
      info.textContent =
        "You and North are partners. Choose your bid: 0 (nil) to 13.";
      const buttons = el("div", { class: "arc-bids" });
      for (let n = 0; n <= 13; n++)
        buttons.append(
          button(
            n === 0 ? "Nil" : String(n),
            () => {
              if (phase !== "bid") return;
              bids[0] = n;
              startPlay();
            },
            { "aria-label": n === 0 ? "Bid nil" : `Bid ${n} tricks` },
          ),
        );
      phaseArea.append(buttons);
    }
    const available = phase === "play" && turn === 0 ? playable(0) : [];
    handArea.replaceChildren();
    hands[0].forEach((card) => {
      const selected = passSelected.includes(card),
        enabled = phase === "pass" || available.includes(card),
        node = cardNode(
          card,
          enabled,
          () => {
            if (phase === "pass") {
              if (selected)
                passSelected = passSelected.filter((c) => c !== card);
              else if (passSelected.length < 3) passSelected.push(card);
              render();
            } else if (turn === 0) play(card);
          },
          selected,
        );
      handArea.append(node);
    });
    if (!s.reduced)
      ui.querySelectorAll("[data-trick-card]").forEach((node) => {
        const old = previous.get(node.dataset.trickCard),
          current = node.getBoundingClientRect();
        if (
          old &&
          (Math.abs(old.x - current.x) > 1 || Math.abs(old.y - current.y) > 1)
        )
          node.animate(
            [
              {
                transform: `translate(${old.x - current.x}px,${old.y - current.y}px)`,
              },
              { transform: "translate(0,0)" },
            ],
            { duration: 260, easing: "cubic-bezier(.2,.8,.2,1)" },
          );
      });
  }
  deal();
  s.message(
    isHearts
      ? "Lowest score wins. Follow suit and keep an eye on the Queen of Spades."
      : "You and North play together. Your team score carries across hands.",
  );
}
