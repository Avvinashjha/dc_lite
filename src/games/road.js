import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  lerp,
  random,
} from "./runtime.js";
export function mountRoad(s, twin) {
  const g = canvasGame(s, { width: twin ? 540 : 420, height: 570 }),
    { ctx } = g;
  const hud = s.hud({
    score: twin ? "TOKENS" : "SCORE",
    distance: "DISTANCE",
    best: "PERSONAL BEST",
  });
  let lanes = twin ? [0, 1] : [1],
    positions = twin ? [100, 440] : [210],
    objects = [],
    spawn = twin ? [1.3, 1.8] : [1.5],
    distance = 0,
    score = 0,
    bonus = 0,
    ended = false,
    started = false,
    time = 0;
  const xs = twin
      ? [
          [100, 200],
          [340, 440],
        ]
      : [[100, 210, 320]],
    carY = 470;
  function change(road, dir = 0) {
    if (ended) return;
    if (!started) {
      started = true;
      return;
    }
    lanes[road] = twin
      ? 1 - lanes[road]
      : Math.max(0, Math.min(2, lanes[road] + dir));
    s.tone(200, 0.035, "triangle", 0.012);
  }
  g.key((key, repeat) => {
    if (repeat) return;
    if (key === "ArrowLeft" || key.toLowerCase() === "a") change(0, -1);
    if (key === "ArrowRight" || key.toLowerCase() === "d")
      change(twin ? 1 : 0, 1);
  });
  let startPoint = null;
  g.tap((p) => {
    if (!started) {
      started = true;
      return;
    }
    startPoint = p;
    if (twin) change(p.x < 270 ? 0 : 1);
  });
  g.release((p) => {
    if (!twin && startPoint && Math.abs(p.x - startPoint.x) > 20)
      change(0, p.x > startPoint.x ? 1 : -1);
    startPoint = null;
  });
  g.controls(
    g.control(twin ? "Left car · A" : "← Left", "ArrowLeft"),
    g.control(twin ? "Right car · D" : "Right →", "ArrowRight"),
  );
  function end(message) {
    if (ended) return;
    ended = true;
    if (!twin) score = Math.floor(distance / 12) + bonus;
    s.best(score);
    s.message(message);
    g.burst(positions[0], carY, C.peach, 25);
    s.defer(
      () =>
        s.result(
          twin ? "Two hands, one more try." : "A good little drive.",
          `${message} Score ${score}. Best ${s.best()}.`,
          g.wrap,
          true,
        ),
      0.25,
    );
  }
  const car = (x, y, color) => {
    ctx.save();
    ctx.translate(x, y);
    rr(ctx, -24, -39, 48, 78, 12, color);
    rr(ctx, -17, -24, 34, 21, 5, C.dark);
    rr(ctx, -17, 17, 34, 13, 3, C.dark);
    rr(ctx, -29, -23, 6, 17, 2, "#15251f");
    rr(ctx, 23, -23, 6, 17, 2, "#15251f");
    rr(ctx, -29, 13, 6, 17, 2, "#15251f");
    rr(ctx, 23, 13, 6, 17, 2, "#15251f");
    line(
      ctx,
      [
        [-18, -32],
        [-9, -32],
      ],
      "#fff5d4",
      3,
    );
    line(
      ctx,
      [
        [9, -32],
        [18, -32],
      ],
      "#fff5d4",
      3,
    );
    ctx.restore();
  };
  s.frame((dt, t) => {
    time = t;
    const speed = 170 + Math.min(distance / 130, 160);
    if (!ended && started) {
      distance += speed * dt;
      for (let r = 0; r < lanes.length; r++) {
        positions[r] = lerp(
          positions[r],
          xs[r][lanes[r]],
          1 - Math.exp(-dt * 22),
        );
        spawn[r] -= dt;
        if (spawn[r] <= 0) {
          spawn[r] = twin ? random(1.0, 1.3) : random(0.8, 1.12);
          objects.push({
            road: r,
            lane: Math.floor(random(0, xs[r].length)),
            y: -30,
            type: twin ? (Math.random() < 0.55 ? "coin" : "block") : "traffic",
            passed: false,
          });
          if (!twin && Math.random() < 0.6) {
            const free = objects.at(-1).lane;
            objects.push({
              road: 0,
              lane: (free + 1 + Math.floor(random(0, 2))) % 3,
              y: -130,
              type: "coin",
              passed: false,
            });
          }
        }
      }
      for (const o of objects) {
        const old = o.y;
        o.y += speed * dt;
        const ox = xs[o.road][o.lane],
          px = positions[o.road];
        if (
          Math.abs(o.y - carY) < (o.type === "coin" ? 35 : 65) &&
          Math.abs(ox - px) < (o.type === "coin" ? 34 : 44) &&
          !o.passed
        ) {
          if (o.type === "coin") {
            o.passed = true;
            if (twin) score++;
            else bonus += 25;
            g.burst(ox, o.y, C.butter, 10);
            s.tone(710, 0.06);
          } else end("A roadblock got you.");
        }
        if (o.type === "coin" && o.y > carY + 50 && !o.passed && twin)
          end("A token slipped past. Collect every circle.");
      }
      objects = objects.filter((o) => o.y < 650);
      if (!twin) score = Math.floor(distance / 12) + bonus;
    }
    g.clear("#23382f");
    if (twin) {
      rr(ctx, 265, 0, 10, 570, 0, "#e3d7b6");
      line(
        ctx,
        [
          [150, 0],
          [150, 570],
        ],
        "#6d8171",
        2,
      );
      line(
        ctx,
        [
          [390, 0],
          [390, 570],
        ],
        "#6d8171",
        2,
      );
    } else {
      [155, 265].forEach((x) => {
        for (let y = -80; y < 600; y += 90)
          rr(ctx, x, y + (distance % 90), 3, 44, 0, "#91a48d");
      });
    }
    for (let y = -80; y < 600; y += 80) {
      rr(ctx, 20, y + (distance % 80), 5, 42, 2, C.butter);
      rr(ctx, g.width - 25, y + (distance % 80), 5, 42, 2, C.butter);
    }
    for (const o of objects) {
      if (o.passed) continue;
      const x = xs[o.road][o.lane];
      if (o.type === "coin") {
        circle(ctx, x, o.y, 15, C.butter);
        circle(ctx, x, o.y, 9, "#23382f");
      } else if (o.type === "traffic") car(x, o.y, C.red);
      else {
        rr(ctx, x - 21, o.y - 21, 42, 42, 7, C.red);
        line(
          ctx,
          [
            [x - 9, o.y - 9],
            [x + 9, o.y + 9],
          ],
          "#efc4bc",
          3,
        );
      }
    }
    positions.forEach((x, i) => car(x, carY, i ? C.lavender : C.peach));
    if (!started) {
      rr(ctx, 45, 170, g.width - 90, 100, 15, "#23382fe8");
      text(ctx, "READY FOR A DRIVE?", g.width / 2, 205, 18, C.paper, "center");
      text(
        ctx,
        "Tap the road to start",
        g.width / 2,
        240,
        14,
        C.sage,
        "center",
      );
    }
    g.effects(dt);
    hud({ score, distance: `${Math.floor(distance / 10)} m`, best: s.best() });
  });
  s.message(
    twin
      ? "Switch each car separately. Collect circles, avoid squares."
      : "Change lanes to avoid traffic. Collect the golden tokens.",
  );
}
