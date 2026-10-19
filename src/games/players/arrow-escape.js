import { el, button, store } from "../runtime.js";
import { generateArrows, arrowBlocked } from "../rules/arrows.mjs";
const ns = "http://www.w3.org/2000/svg";
function svg(tag, attrs) {
  const node = document.createElementNS(ns, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  return node;
}
export function mount(s) {
  let level = Math.max(1, Number(store.get("arrows_level", 1)) || 1),
    hearts = 3,
    data = null,
    left = [],
    busy = new Set(),
    moves = 0,
    finished = false,
    version = 0,
    zoom = 1;
  const hud = s.hud({
      level: "LEVEL",
      remaining: "ARROWS LEFT",
      hearts: "HEARTS",
      moves: "MOVES",
    }),
    ui = el("div", { class: "arc-game-ui" }),
    board = svg("svg", {
      viewBox: "0 0 540 540",
      class: "arc-arrows-board",
      "aria-label": "Arrow puzzle board",
    }),
    area = el("div", { class: "arc-arrow-wrap" }, board);
  ui.append(area);
  s.mount.append(ui);
  function update() {
    hud({
      level,
      remaining: left.length,
      hearts: "♥".repeat(hearts) + "♡".repeat(3 - hearts),
      moves,
    });
  }
  function point([x, y]) {
    return [
      48 + (x + 0.5) * (444 / data.size),
      48 + (y + 0.5) * (444 / data.size),
    ];
  }
  function draw() {
    board.replaceChildren();
    for (let x = 0; x < data.size; x++)
      for (let y = 0; y < data.size; y++) {
        const p = point([x, y]);
        board.append(
          svg("circle", { cx: p[0], cy: p[1], r: 1.5, fill: "#c7cebb" }),
        );
      }
    for (const arrow of left) {
      const group = svg("g", {
        tabindex: 0,
        role: "button",
        "aria-label": `Arrow ${arrow.id + 1}, points ${arrow.direction[0] === 1 ? "right" : arrow.direction[0] === -1 ? "left" : arrow.direction[1] === 1 ? "down" : "up"}`,
        class: "arc-arrow arc-arrow-enter",
        "data-arrow-id": arrow.id,
      });
      const points = arrow.cells.map(point);
      const p = svg("polyline", {
        points: points.map((p) => p.join(",")).join(" "),
        fill: "none",
        stroke: "#293f33",
        "stroke-width": 9,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      });
      p.setAttribute("pointer-events", "none");
      group.style.animationDelay = `${Math.min(arrow.id * 0.014, 0.35)}s`;
      group.append(p);
      const head = points.at(-1),
        [dx, dy] = arrow.direction,
        perp = [-dy, dx];
      const tip = svg("path", {
        d: `M${head[0] - dx * 13 + perp[0] * 10} ${head[1] - dy * 13 + perp[1] * 10} L${head[0]} ${head[1]} L${head[0] - dx * 13 - perp[0] * 10} ${head[1] - dy * 13 - perp[1] * 10}`,
        fill: "none",
        stroke: "#293f33",
        "stroke-width": 7,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      });
      tip.setAttribute("pointer-events", "none");
      const hit = svg("polyline", {
        points: points.map((p) => p.join(",")).join(" "),
        fill: "none",
        stroke: "transparent",
        "stroke-width": 26,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        class: "arc-arrow-hit",
      });
      group.append(tip, hit);
      board.append(group);
      s.on(group, "click", () => remove(arrow, group));
      s.on(group, "keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          remove(arrow, group);
        }
      });
    }
  }
  function reset() {
    version++;
    data = generateArrows(level);
    left = structuredClone(data.arrows);
    hearts = 3;
    moves = 0;
    busy.clear();
    finished = false;
    ui.querySelectorAll(".arc-result").forEach((n) => n.remove());
    draw();
    update();
    s.message("Find an arrow with a clear exit. Every board has a solution.");
  }
  function remove(arrow, node) {
    if (finished || s.paused || busy.has(arrow.id) || !left.includes(arrow))
      return;
    moves++;
    if (arrowBlocked(arrow, left, data.size)) {
      hearts--;
      node.classList.add("arc-arrow--blocked");
      s.tone(150, 0.08);
      s.defer(() => node.classList.remove("arc-arrow--blocked"), 0.35);
      if (hearts <= 0) {
        finished = true;
        s.defer(() => {
          s.message("Three collisions. Same puzzle, fresh eyes.");
          reset();
        }, 0.7);
      } else {
        s.message("That exit is blocked. Follow the path to its blocker.");
      }
      update();
      return;
    }
    busy.add(arrow.id);
    left = left.filter((a) => a !== arrow);
    s.tone(430 + left.length * 9, 0.06);
    const cells = arrow.cells.map(point),
      head = cells.at(-1),
      [dx, dy] = arrow.direction;
    const cell = 444 / data.size;
    const extension = [];
    for (let i = 1; i <= data.size + arrow.cells.length + 2; i++)
      extension.push([head[0] + dx * cell * i, head[1] + dy * cell * i]);
    const full = [...cells, ...extension],
      length = (cells.length - 1) * cell,
      start = s.time,
      duration = s.reduced ? 0.05 : 1.05;
    node.classList.remove("arc-arrow-enter");
    node.style.animationDelay = "0s";
    node.removeAttribute("tabindex");
    node.setAttribute("aria-hidden", "true");
    const poly = node.querySelector("polyline"),
      tip = node.querySelector("path");
    const position = (distance) => {
      const i = Math.floor(distance / cell),
        a = full[Math.min(i, full.length - 1)],
        b = full[Math.min(i + 1, full.length - 1)],
        t = distance / cell - i;
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    };
    const ticket = version;
    const stop = s.frame(() => {
      if (ticket !== version) {
        stop();
        return;
      }
      const t = Math.min(1, (s.time - start) / duration),
        distance = t * (data.size + cells.length + 1) * cell,
        tail = position(distance),
        front = position(distance + length);
      const points = [tail];
      for (
        let i = Math.floor(distance / cell) + 1;
        i < full.length && i * cell < distance + length;
        i++
      )
        points.push(full[i]);
      points.push(front);
      node
        .querySelectorAll("polyline")
        .forEach((poly) =>
          poly.setAttribute("points", points.map((p) => p.join(",")).join(" ")),
        );
      tip.setAttribute(
        "d",
        `M${front[0] - dx * 13 - dy * 10} ${front[1] - dy * 13 + dx * 10} L${front[0]} ${front[1]} L${front[0] - dx * 13 + dy * 10} ${front[1] - dy * 13 - dx * 10}`,
      );
      if (t >= 1) {
        node.remove();
        busy.delete(arrow.id);
        stop();
        if (!left.length && !busy.size) {
          finished = true;
          store.set("arrows_level", level + 1);
          s.result(
            "A lovely little untangle.",
            `Level ${level} cleared in ${moves} moves.`,
            ui,
          );
          const again = ui.querySelector(".arc-result button");
          again.textContent = "Next puzzle ↗";
          again.replaceWith(
            button(
              "Next puzzle ↗",
              () => {
                level++;
                reset();
              },
              { class: "arc-button arc-button--primary" },
            ),
          );
        }
      }
    });
    update();
    s.message(`${left.length} arrows left.`);
  }
  s.actions([
    [
      "Zoom in",
      () => {
        zoom = Math.min(1.8, zoom + 0.2);
        board.style.width = `${zoom * 100}%`;
      },
    ],
    [
      "Zoom out",
      () => {
        zoom = Math.max(1, zoom - 0.2);
        board.style.width = `${zoom * 100}%`;
      },
    ],
    [
      "Hint",
      () => {
        if (finished || s.paused) return;
        const arrow = left.find((a) => !arrowBlocked(a, left, data.size));
        if (!arrow) return;
        const nodes = board.querySelectorAll(".arc-arrow");
        const index = left.indexOf(arrow);
        const target = Array.from(nodes).find((n) =>
          n.getAttribute("aria-label").startsWith(`Arrow ${arrow.id + 1},`),
        );
        target?.classList.add("arc-arrow--hint");
        target?.focus();
        s.message("The highlighted arrow has a clear exit.");
        s.defer(() => target?.classList.remove("arc-arrow--hint"), 1.2);
      },
    ],
    ["Retry puzzle", reset],
    [
      "First puzzle",
      () => {
        level = 1;
        store.set("arrows_level", 1);
        reset();
      },
    ],
  ]);
  reset();
}
