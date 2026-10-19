import { el, button, makeDice, random } from "../runtime.js";
import { yatzyNames, yatzyScore, yatzyTotal } from "../rules/dice.mjs";
export function mount(s) {
  const hud = s.hud({
      total: "TOTAL",
      round: "ROUND",
      rolls: "ROLLS LEFT",
      best: "PERSONAL BEST",
    }),
    ui = el("div", { class: "arc-game-ui arc-yatzy" }),
    diceArea = el("div", { class: "arc-dice" }),
    roll = button("Roll the dice ↗", rollDice, {
      class: "arc-button arc-button--primary",
    }),
    bar = el("div", { class: "arc-toolbar" }, roll),
    table = el("table", { class: "arc-score-table" });
  ui.append(diceArea, bar, table);
  s.mount.append(ui);
  let dice = [0, 0, 0, 0, 0],
    held = [false, false, false, false, false],
    rolls = 3,
    scores = Array(13).fill(null),
    bonus = 0,
    busy = false,
    ended = false;
  function rollDice() {
    if (ended || busy || rolls <= 0 || s.paused) return;
    busy = true;
    roll.disabled = true;
    s.tone(250, 0.12, "triangle", 0.02);
    s.defer(
      () => {
        dice = dice.map((n, i) => (held[i] ? n : Math.floor(random(1, 7))));
        rolls--;
        busy = false;
        render();
        s.announce(`Rolled ${dice.join(", ")}. ${rolls} rolls left.`);
      },
      s.reduced ? 0.01 : 0.24,
    );
    diceArea.classList.remove("arc-rolling");
    void diceArea.offsetWidth;
    diceArea.classList.add("arc-rolling");
  }
  function choose(index) {
    if (ended || busy || rolls === 3 || scores[index] !== null) return;
    const five = dice.every((n) => n === dice[0]);
    if (five && scores[11] === 50) bonus += 100;
    scores[index] = yatzyScore(dice, index);
    s.tone(620, 0.08);
    rolls = 3;
    dice = [0, 0, 0, 0, 0];
    held = held.map(() => false);
    render();
    if (scores.every((n) => n !== null)) {
      ended = true;
      roll.disabled = true;
      const total = yatzyTotal(scores, bonus);
      s.best(total.total);
      s.result(
        "Thirteen good decisions.",
        `${total.total} points · Upper bonus ${total.upperBonus} · Extra five-of-a-kind bonus ${bonus} · Best ${s.best()}`,
        ui,
      );
    }
  }
  function render() {
    diceArea.replaceChildren();
    dice.forEach((n, i) => {
      const d = makeDice(
        n,
        held[i],
        () => {
          if (rolls < 3 && !busy && !ended) {
            held[i] = !held[i];
            render();
          }
        },
        n
          ? `Die ${i + 1}: ${n}, ${held[i] ? "held" : "not held"}`
          : `Die ${i + 1}, not rolled`,
      );
      d.disabled = !n || busy || ended;
      diceArea.append(d);
    });
    roll.disabled = rolls <= 0 || busy || ended;
    roll.textContent =
      rolls === 3 ? "Roll the dice ↗" : `Roll again · ${rolls} left`;
    table.replaceChildren();
    table.append(
      el(
        "thead",
        {},
        el("tr", {}, [
          el("th", { text: "Category" }),
          el("th", { text: "Score" }),
          el("th", { text: "This roll" }),
        ]),
      ),
    );
    const body = el("tbody");
    yatzyNames.forEach((name, index) => {
      const value = rolls < 3 ? yatzyScore(dice, index) : null;
      body.append(
        el("tr", {}, [
          el("td", { text: name }),
          el("td", {
            text: scores[index] === null ? "—" : String(scores[index]),
          }),
          el(
            "td",
            {},
            scores[index] === null && value !== null
              ? button(String(value), () => choose(index), {
                  "aria-label": `Score ${value} in ${name}`,
                })
              : "",
          ),
        ]),
      );
    });
    const total = yatzyTotal(scores, bonus);
    body.append(
      el("tr", {}, [
        el("th", { text: `Upper bonus (${total.upper}/63)` }),
        el("td", { text: String(total.upperBonus) }),
        el("td"),
      ]),
      el("tr", {}, [
        el("th", { text: "Five-of-a-kind bonuses" }),
        el("td", { text: String(bonus) }),
        el("td"),
      ]),
    );
    table.append(body);
    hud({
      total: total.total,
      round: `${Math.min(13, scores.filter((n) => n !== null).length + 1)} / 13`,
      rolls,
      best: s.best(),
    });
  }
  render();
  s.message(
    "Roll, hold the dice you like, and choose a category. The scoring variant is listed below.",
  );
}
