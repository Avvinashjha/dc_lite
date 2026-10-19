import { el, button, makeDice, random } from "../runtime.js";
import { farkleScore, hasFarkleScore } from "../rules/dice.mjs";
export function mount(s) {
  const hud = s.hud({
      you: "YOU",
      cpu: "COMPUTER",
      turn: "THIS TURN",
      goal: "TARGET",
    }),
    ui = el("div", { class: "arc-game-ui" }),
    diceArea = el("div", { class: "arc-dice" }),
    actions = el("div", { class: "arc-toolbar" });
  ui.append(diceArea, actions);
  s.mount.append(ui);
  let scores = [0, 0],
    player = 0,
    dice = [],
    selected = [],
    turn = 0,
    remaining = 6,
    busy = false,
    ended = false,
    finalStarter = null,
    lastRoll = false,
    rollSerial = 0;
  function render() {
    hud({
      you: scores[0],
      cpu: scores[1],
      turn,
      goal: finalStarter === null ? 5000 : "Final round",
    });
    diceArea.replaceChildren();
    dice.forEach((n, i) => {
      const d = makeDice(
        n,
        selected[i],
        () => {
          if (player === 0 && !busy && !ended) {
            selected[i] = !selected[i];
            render();
          }
        },
        `Die ${i + 1}: ${n}${selected[i] ? ", selected" : ""}`,
      );
      d.disabled = player !== 0 || busy || ended;
      diceArea.append(d);
    });
    actions.replaceChildren();
    if (ended) return;
    if (player === 0 && !busy) {
      if (!dice.length)
        actions.append(
          button("Roll dice ↗", () => roll(remaining), {
            class: "arc-button arc-button--primary",
          }),
        );
      else {
        const sel = dice.filter((_, i) => selected[i]),
          score = farkleScore(sel),
          valid = sel.length > 0 && score.valid;
        actions.append(
          button(
            `Keep & roll${valid ? ` · +${score.score}` : ""}`,
            () => keep(false),
            { disabled: !valid },
          ),
          button(`Bank ${turn + (valid ? score.score : 0)}`, () => keep(true), {
            class: "arc-button arc-button--primary",
            disabled: sel.length ? !score.valid : turn === 0,
          }),
        );
      }
    }
  }
  function finish() {
    ended = true;
    render();
    s.best(scores[0]);
    s.result(
      scores[0] > scores[1]
        ? "A well-timed bank."
        : scores[0] === scores[1]
          ? "A perfect tie."
          : "The dice have other ideas.",
      `You ${scores[0]} · Computer ${scores[1]}`,
      ui,
    );
  }
  function endTurn() {
    if (finalStarter !== null && player !== finalStarter) return finish();
    if (finalStarter === null && scores[player] >= 5000) {
      finalStarter = player;
      s.message(
        `${player === 0 ? "You reached" : "Computer reached"} 5000. The other player gets one final turn.`,
      );
    }
    player = 1 - player;
    turn = 0;
    dice = [];
    selected = [];
    remaining = 6;
    busy = false;
    render();
    if (player === 1) s.defer(() => roll(6), 0.65);
  }
  function roll(count) {
    if (ended || s.paused) return;
    busy = true;
    remaining = count || 6;
    dice = Array(remaining).fill(0);
    selected = dice.map(() => false);
    render();
    diceArea.classList.remove("arc-rolling");
    void diceArea.offsetWidth;
    diceArea.classList.add("arc-rolling");
    s.tone(240, 0.1, "triangle", 0.018);
    const ticket = ++rollSerial;
    s.defer(() => {
      if (ended || ticket !== rollSerial) return;
      dice = Array.from({ length: remaining }, () => Math.floor(random(1, 7)));
      selected = dice.map(() => false);
      if (!hasFarkleScore(dice)) {
        turn = 0;
        busy = true;
        render();
        s.message(
          `${player === 0 ? "Farkle!" : "Computer farkled."} No scoring dice. Turn points lost.`,
        );
        s.tone(120, 0.13);
        s.defer(endTurn, 1.0);
        return;
      }
      busy = false;
      render();
      s.message(
        player === 0
          ? "Select scoring dice. Every selected die must count."
          : "Computer is weighing its luck…",
      );
      if (player === 1) s.defer(ai, 0.65);
    }, 0.25);
  }
  function keep(bank) {
    if (ended || busy || s.paused) return;
    const sel = dice.filter((_, i) => selected[i]),
      result = farkleScore(sel);
    if (sel.length && !result.valid) return;
    if (!sel.length && !bank) return;
    const kept = sel.length;
    if (kept) turn += result.score;
    remaining = dice.length - kept;
    if (bank) {
      if (!turn) return;
      scores[player] += turn; // Exactly once: selection points enter turn, then turn enters the bank.
      turn = 0;
      s.message(
        `${player === 0 ? "You" : "Computer"} banked. Time for the next turn.`,
      );
      s.tone(680, 0.09);
      endTurn();
    } else {
      if (!kept) return;
      const count = remaining || 6;
      roll(count);
    }
  }
  function ai() {
    if (ended || player !== 1 || busy) return;
    let bestMask = 0,
      bestScore = -1;
    for (let mask = 1; mask < 1 << dice.length; mask++) {
      const sel = dice.filter((_, i) => mask & (1 << i)),
        result = farkleScore(sel);
      if (result.valid && result.score > bestScore) {
        bestMask = mask;
        bestScore = result.score;
      }
    }
    selected = dice.map((_, i) => Boolean(bestMask & (1 << i)));
    render();
    const left = dice.filter((_, i) => !selected[i]).length,
      bank =
        turn + bestScore >= 450 ||
        left <= 2 ||
        (finalStarter === 0 && scores[1] + turn + bestScore > scores[0]);
    s.defer(() => keep(bank), 0.45);
  }
  render();
  s.message(
    "First to 5000 triggers a final turn. Bank when the risk feels big enough.",
  );
}
