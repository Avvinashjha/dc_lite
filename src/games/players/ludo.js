import { el, button, makeDice, random, lerp } from "../runtime.js";
import {
  ludoPath,
  ludoHome,
  ludoYard,
  ludoPosition,
  ludoCanMove,
  ludoMove,
  ludoSafe,
} from "../rules/ludo.mjs";
const colours = ["#ad5d68", "#648ca6", "#78985d", "#bd9e49"],
  names = ["Red · You", "Blue", "Green", "Yellow"],
  ns = "http://www.w3.org/2000/svg";
const svg = (tag, attrs) => {
  const n = document.createElementNS(ns, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};
export function mount(s) {
  const hud = s.hud({
      turn: "TURN",
      red: "RED HOME",
      blue: "BLUE HOME",
      green: "GREEN HOME",
      yellow: "YELLOW HOME",
    }),
    ui = el("div", { class: "arc-game-ui" }),
    board = el("div", {
      class: "arc-ludo",
      role: "group",
      "aria-label": "Ludo board",
    }),
    art = svg("svg", { viewBox: "0 0 480 480", "aria-hidden": "true" });
  board.append(art);
  ui.append(board);
  s.mount.append(ui);
  let players = Array.from({ length: 4 }, () => Array(4).fill(-1)),
    turn = 0,
    dice = 0,
    phase = "roll",
    sixes = 0,
    animation = null,
    ended = false,
    shownDice = null;
  art.append(
    svg("rect", { x: 0, y: 0, width: 480, height: 480, fill: "#fffdf3" }),
  );
  [
    [0, 0],
    [0, 9],
    [9, 9],
    [9, 0],
  ].forEach(([r, c], p) => {
    art.append(
      svg("rect", {
        x: c * 32,
        y: r * 32,
        width: 192,
        height: 192,
        fill: colours[p],
        opacity: 0.4,
      }),
      svg("rect", {
        x: (c + 1) * 32,
        y: (r + 1) * 32,
        width: 128,
        height: 128,
        rx: 12,
        fill: "#fffdf3",
      }),
    );
  });
  ludoPath.forEach(([r, c], i) => {
    art.append(
      svg("rect", {
        x: c * 32,
        y: r * 32,
        width: 32,
        height: 32,
        fill: ludoSafe.includes(i) ? "#f1e5b7" : "#f8f6e9",
        stroke: "#d6d7c7",
        "stroke-width": 1,
      }),
    );
    if (ludoSafe.includes(i)) {
      const star = svg("text", {
        x: c * 32 + 16,
        y: r * 32 + 21,
        "text-anchor": "middle",
        fill: "#8a7949",
        "font-size": 19,
      });
      star.textContent = "✳";
      art.append(star);
    }
  });
  ludoHome.forEach((path, p) =>
    path.forEach(([r, c]) =>
      art.append(
        svg("rect", {
          x: c * 32,
          y: r * 32,
          width: 32,
          height: 32,
          fill: colours[p],
          opacity: 0.5,
          stroke: "#fffdf3",
          "stroke-width": 1,
        }),
      ),
    ),
  );
  [
    [192, 192, 192, 288],
    [192, 192, 288, 192],
    [288, 192, 288, 288],
    [192, 288, 288, 288],
  ].forEach(([x, y, a, b], i) =>
    art.append(
      svg("path", {
        d: `M240 240L${x} ${y}L${a} ${b}Z`,
        fill: colours[i],
        opacity: 0.85,
      }),
    ),
  );
  const tokens = Array.from({ length: 4 }, (_, p) =>
    Array.from({ length: 4 }, (_, i) => {
      const b = button(String(i + 1), () => move(i), {
        class: "arc-ludo-token",
        "aria-label": `${names[p]} token ${i + 1}`,
      });
      b.style.setProperty("--token", colours[p]);
      board.append(b);
      return b;
    }),
  );
  const bar = el("div", { class: "arc-ludo-control" }),
    die = el("div", { class: "arc-dice" }),
    moveChoices = el("div", {
      class: "arc-toolbar",
      "aria-label": "Available token moves",
    }),
    rollButton = button("Roll the die ↗", () => roll(), {
      class: "arc-button arc-button--primary",
    });
  bar.append(die, rollButton);
  ui.append(bar, moveChoices);
  let choiceSignature = "";
  function update() {
    hud({
      turn: names[turn],
      red: `${players[0].filter((n) => n === 56).length}/4`,
      blue: `${players[1].filter((n) => n === 56).length}/4`,
      green: `${players[2].filter((n) => n === 56).length}/4`,
      yellow: `${players[3].filter((n) => n === 56).length}/4`,
    });
    if (shownDice !== dice) {
      die.replaceChildren(
        makeDice(dice, false, () => {}, `Rolled ${dice || "not yet"}`),
      );
      die.querySelector("button").disabled = true;
      shownDice = dice;
    }
    rollButton.disabled = turn !== 0 || phase !== "roll" || ended;
    rollButton.textContent =
      turn === 0 ? "Roll the die ↗" : `${names[turn]} is playing…`;
    const legal =
      turn === 0 && phase === "choose"
        ? players[0]
            .map((v, i) => (ludoCanMove(v, dice) ? i : -1))
            .filter((i) => i >= 0)
        : [];
    const signature = legal.join(",");
    if (signature !== choiceSignature) {
      choiceSignature = signature;
      moveChoices.replaceChildren(
        ...legal.map((i) => button(`Move token ${i + 1}`, () => move(i))),
      );
    }
    const all = [];
    players.forEach((pieces, p) =>
      pieces.forEach((progress, i) => {
        let [r, c] = ludoPosition(p, i, progress);
        let x = c * 32 + 16,
          y = r * 32 + 16;
        if (animation && animation.p === p && animation.i === i) {
          x = animation.x;
          y = animation.y;
        }
        all.push({ p, i, x, y });
      }),
    );
    all.forEach(({ p, i, x, y }) => {
      const stack = all.filter(
          (v) => Math.abs(v.x - x) < 1 && Math.abs(v.y - y) < 1,
        ),
        index = stack.findIndex((v) => v.p === p && v.i === i),
        offset = stack.length > 1 ? (index - (stack.length - 1) / 2) * 9 : 0,
        b = tokens[p][i];
      b.style.left = `${(x + offset) / 4.8}%`;
      b.style.top = `${y / 4.8}%`;
      b.disabled =
        p !== 0 ||
        turn !== 0 ||
        phase !== "choose" ||
        !ludoCanMove(players[p][i], dice) ||
        ended;
      b.classList.toggle("arc-ludo-movable", !b.disabled);
      b.setAttribute(
        "aria-label",
        `${names[p]} token ${i + 1}, ${players[p][i] < 0 ? "in yard" : players[p][i] === 56 ? "home" : `step ${players[p][i]}`}${!b.disabled ? ", can move" : ""}`,
      );
    });
  }
  function next() {
    if (ended) return;
    phase = "roll";
    if (dice !== 6) {
      turn = (turn + 1) % 4;
      sixes = 0;
    }
    update();
    if (turn !== 0) s.defer(roll, 0.65);
  }
  function roll() {
    if (ended || phase !== "roll" || s.paused) return;
    phase = "rolling";
    die.classList.add("arc-rolling");
    rollButton.disabled = true;
    s.tone(260, 0.1, "triangle", 0.02);
    s.defer(() => {
      die.classList.remove("arc-rolling");
      dice = Math.floor(random(1, 7));
      if (dice === 6) sixes++;
      else sixes = 0;
      if (sixes === 3) {
        s.message(
          `${names[turn]} rolled three sixes. The third roll is forfeited.`,
        );
        dice = 0;
        sixes = 0;
        next();
        return;
      }
      const options = players[turn]
        .map((v, i) => (ludoCanMove(v, dice) ? i : null))
        .filter((v) => v !== null);
      phase = "choose";
      update();
      if (!options.length) {
        s.message(`${names[turn]} rolled ${dice}. No legal move.`);
        s.defer(next, 0.65);
        return;
      }
      s.message(
        `${names[turn]} rolled ${dice}. ${turn === 0 ? "Choose a highlighted token." : ""}`,
      );
      if (turn !== 0) {
        let choice = options[0],
          best = -Infinity;
        for (const token of options) {
          const result = ludoMove(players, turn, token, dice),
            score =
              result.captured.length * 60 +
              (result.to === 56 ? 100 : result.to) +
              (result.from < 0 ? 20 : 0);
          if (score > best) {
            best = score;
            choice = token;
          }
        }
        s.defer(() => move(choice), 0.55);
      }
    }, 0.35);
  }
  function move(i) {
    if (phase !== "choose" || ended || s.paused) return;
    const result = ludoMove(players, turn, i, dice);
    if (!result) return;
    phase = "moving";
    const p = turn,
      steps =
        result.from < 0
          ? [0]
          : Array.from(
              { length: result.to - result.from },
              (_, j) => result.from + j + 1,
            );
    let index = 0;
    const begin = s.time;
    const [r, c] = ludoPosition(p, i, result.from);
    animation = { p, i, x: c * 32 + 16, y: r * 32 + 16 };
    const from = { x: animation.x, y: animation.y };
    const stop = s.frame(() => {
      const duration = s.reduced ? 0.01 : 0.1,
        total = (s.time - begin) / duration,
        index = Math.min(steps.length - 1, Math.floor(total)),
        fraction = Math.min(1, total - index),
        prev =
          index === 0
            ? from
            : (() => {
                const [a, b] = ludoPosition(p, i, steps[index - 1]);
                return { x: b * 32 + 16, y: a * 32 + 16 };
              })(),
        [rr, cc] = ludoPosition(p, i, steps[index]);
      animation.x = lerp(prev.x, cc * 32 + 16, fraction);
      animation.y = lerp(prev.y, rr * 32 + 16, fraction);
      update();
      if (total >= steps.length) {
        stop();
        animation = null;
        players = result.players;
        s.tone(result.captured.length ? 720 : 440, 0.07);
        if (result.won) {
          ended = true;
          phase = "end";
          update();
          s.result(
            `${names[p]} wins!`,
            "Four tokens home. A race well run.",
            ui,
          );
        } else {
          update();
          if (result.captured.length)
            s.message(
              `${names[p]} sent ${result.captured.length} rival token back to the yard.`,
            );
          s.defer(next, 0.3);
        }
      }
    });
    update();
  }
  update();
  s.message("You are Red. Roll a six to bring a token out of the yard.");
}
