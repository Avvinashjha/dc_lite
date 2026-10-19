import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  random,
  lerp,
} from "../runtime.js";
export function mount(s) {
  const speed = s.choice(
      "Pace",
      [
        ["gentle", "Gentle"],
        ["classic", "Classic"],
        ["quick", "Quick"],
      ],
      "classic",
    ),
    hud = s.hud({ score: "FRUIT PICKED", best: "PERSONAL BEST" });
  s.options(speed.label);
  const g = canvasGame(s, { width: 480, height: 480 }),
    { ctx } = g,
    N = 20,
    Z = 24;
  let body = [
      { x: 7, y: 10 },
      { x: 6, y: 10 },
      { x: 5, y: 10 },
    ],
    previous = body.map((p) => ({ ...p })),
    dir = { x: 1, y: 0 },
    queued = null,
    food = null,
    score = 0,
    clock = 0,
    ended = false,
    started = false;
  const interval = { gentle: 0.19, classic: 0.135, quick: 0.095 }[speed.value];
  function place() {
    const empty = [];
    for (let y = 0; y < N; y++)
      for (let x = 0; x < N; x++)
        if (!body.some((p) => p.x === x && p.y === y)) empty.push({ x, y });
    if (!empty.length) {
      end(true);
      return;
    }
    food = empty[Math.floor(random(0, empty.length))];
  }
  function end(win) {
    if (ended) return;
    ended = true;
    s.best(score, speed.value);
    g.burst(body[0].x * Z + 12, body[0].y * Z + 12, win ? C.butter : C.red, 30);
    s.defer(
      () =>
        s.result(
          win ? "A full and happy garden!" : "A good little wander.",
          `${score} fruit · Best ${s.best(undefined, speed.value)}`,
          g.wrap,
          true,
        ),
      0.2,
    );
  }
  const directions = {
    ArrowUp: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
  };
  function turn(key) {
    const next = directions[key];
    if (!next || queued || ended) return;
    if (next.x === -dir.x && next.y === -dir.y) return;
    queued = next;
    started = true;
  }
  g.key((key) => turn(key));
  s.onPause((value) => {
    if (value) {
      touch = null;
      queued = null;
    }
  });
  let touch = null;
  g.tap((p) => {
    touch = p;
    started = true;
  });
  g.release((p) => {
    if (!touch) return;
    const dx = p.x - touch.x,
      dy = p.y - touch.y;
    touch = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 12) return;
    turn(
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "ArrowRight"
          : "ArrowLeft"
        : dy > 0
          ? "ArrowDown"
          : "ArrowUp",
    );
    touch = null;
  });
  const controls = g.controls(
    g.control("← Left", "ArrowLeft"),
    g.control("↑ Up", "ArrowUp"),
    g.control("↓ Down", "ArrowDown"),
    g.control("Right →", "ArrowRight"),
  );
  controls.classList.add("arc-actions--dpad");
  s.frame((dt, t) => {
    if (started && !ended) {
      clock += dt;
      while (clock >= interval) {
        clock -= interval;
        if (queued) {
          dir = queued;
          queued = null;
        }
        const head = { x: body[0].x + dir.x, y: body[0].y + dir.y },
          eats = food && head.x === food.x && head.y === food.y;
        const collisionBody = eats ? body : body.slice(0, -1);
        if (
          head.x < 0 ||
          head.x >= N ||
          head.y < 0 ||
          head.y >= N ||
          collisionBody.some((p) => p.x === head.x && p.y === head.y)
        ) {
          end(false);
          break;
        }
        previous = body.map((p) => ({ ...p }));
        body.unshift(head);
        if (eats) {
          score++;
          g.burst(food.x * Z + 12, food.y * Z + 12, C.peach, 10);
          s.tone(580 + score * 7, 0.08);
          place();
        } else body.pop();
      }
    }
    g.clear("#edf0df");
    ctx.strokeStyle = "#d9e0cc";
    ctx.lineWidth = 0.6;
    for (let i = 0; i <= N; i++) {
      line(
        ctx,
        [
          [i * Z, 0],
          [i * Z, 480],
        ],
        "#dce3cf",
        0.6,
      );
      line(
        ctx,
        [
          [0, i * Z],
          [480, i * Z],
        ],
        "#dce3cf",
        0.6,
      );
    }
    if (food) {
      const pulse = s.reduced ? 1 : 1 + Math.sin(t * 5) * 0.06;
      circle(ctx, food.x * Z + 12, food.y * Z + 13, 7 * pulse, C.red);
      line(
        ctx,
        [
          [food.x * Z + 12, food.y * Z + 6],
          [food.x * Z + 15, food.y * Z + 3],
        ],
        C.green,
        2,
      );
    }
    const a = started && !ended ? Math.min(clock / interval, 1) : 1;
    const drawn = body.map((p, i) => {
      const from = previous[Math.min(i, previous.length - 1)] || p;
      return {
        x: lerp(from.x, p.x, a) * Z + 12,
        y: lerp(from.y, p.y, a) * Z + 12,
      };
    });
    if (drawn.length > 1)
      line(
        ctx,
        drawn.map((p) => [p.x, p.y]),
        C.green,
        18,
      );
    drawn.forEach((p) => circle(ctx, p.x, p.y, 9, C.green));
    const h = drawn[0],
      side = { x: -dir.y, y: dir.x };
    for (const sign of [-1, 1]) {
      const x = h.x + dir.x * 5 + side.x * sign * 4,
        y = h.y + dir.y * 5 + side.y * sign * 4;
      circle(ctx, x, y, 3, C.paper);
      circle(ctx, x + dir.x, y + dir.y, 1.3, C.ink);
    }
    if (!started)
      text(ctx, "Pick a direction to begin.", 240, 170, 18, C.ink, "center");
    g.effects(dt);
    hud({ score, best: s.best(undefined, speed.value) });
  });
  place();
  s.message(
    "Swipe, use the direction buttons, or press an arrow key to begin.",
  );
}
