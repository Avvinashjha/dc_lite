import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  clamp,
  random,
} from "../runtime.js";
export const caveAt = (x) => ({
  centre: 225 + Math.sin(x / 390) * 48 + Math.sin(x / 810) * 30,
  gap: 250,
});
export function mount(s) {
  const hud = s.hud({ distance: "DISTANCE", best: "PERSONAL BEST" }),
    g = canvasGame(s, { portraitWidth: 480 }),
    { ctx } = g;
  const terrainOffset = random(0, 12000),
    cave = (x) => caveAt(x + terrainOffset);
  let y = cave(170).centre,
    vy = 0,
    world = 0,
    ended = false,
    started = false,
    time = 0,
    pillars = [],
    next = 720,
    smoke = [];
  const go = () => {
    started = true;
  };
  g.controls(
    g.control("Hold to lift · Space", " ", { hold: true, action: go }),
  );
  g.tap(go);
  g.key((key) => {
    if (key === " ") go();
  });
  function end() {
    if (ended) return;
    ended = true;
    const score = Math.floor(world / 10);
    s.best(score);
    g.burst(170, y, C.peach, 35);
    s.message("A close shave. Ready for another flight?");
    s.defer(
      () =>
        s.result(
          "A little further next time.",
          `${score} metres · Best ${s.best()} m`,
          g.wrap,
          true,
        ),
      0.25,
    );
  }
  function step(dt) {
    if (!started || ended) return;
    const speed = 150 + Math.min(world / 80, 120);
    world += speed * dt;
    const lift = g.held || g.keys.has(" ");
    vy = clamp(vy + (lift ? -540 : 340) * dt, -210, 230);
    y += vy * dt;
    const c = cave(world + 170);
    if (y - 16 < c.centre - c.gap / 2 || y + 16 > c.centre + c.gap / 2) end();
    for (const p of pillars) {
      const x = p.x - world;
      if (
        x < 195 &&
        x + 28 > 148 &&
        (y - 14 < p.centre - 85 || y + 14 > p.centre + 85)
      )
        end();
    }
    if (world + 900 > next) {
      pillars.push({ x: next, centre: cave(next).centre + random(-22, 22) });
      next += random(430, 540);
    }
    pillars = pillars.filter((p) => p.x > world - 50);
  }
  s.frame((dt, t) => {
    time = t;
    let rest = dt;
    while (rest > 0) {
      const d = Math.min(rest, 1 / 120);
      step(d);
      rest -= d;
    }
    g.clear("#e5edf0");
    // Parallax rock faces and foreground cave walls.
    for (let layer = 0; layer < 2; layer++) {
      ctx.fillStyle = layer ? "#b9c9bc" : "#cedbd0";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      for (let x = 0; x <= 820; x += 20) {
        const c = cave(x + world * (layer ? 0.65 : 0.3));
        ctx.lineTo(x, c.centre - c.gap / 2 - 40 - layer * 4);
      }
      ctx.lineTo(820, 0);
      ctx.fill();
    }
    ctx.fillStyle = C.ink;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    for (let x = 0; x <= 820; x += 10) {
      const c = cave(x + world);
      ctx.lineTo(x, c.centre - c.gap / 2);
    }
    ctx.lineTo(820, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, 450);
    for (let x = 0; x <= 820; x += 10) {
      const c = cave(x + world);
      ctx.lineTo(x, c.centre + c.gap / 2);
    }
    ctx.lineTo(820, 450);
    ctx.fill();
    for (const p of pillars) {
      const x = p.x - world,
        c = cave(p.x);
      rr(
        ctx,
        x,
        c.centre - c.gap / 2,
        28,
        p.centre - 85 - (c.centre - c.gap / 2),
        6,
        C.ink,
      );
      rr(
        ctx,
        x,
        p.centre + 85,
        28,
        c.centre + c.gap / 2 - p.centre - 85,
        6,
        C.ink,
      );
      line(
        ctx,
        [
          [x + 6, p.centre - 105],
          [x + 22, p.centre - 105],
        ],
        C.butter,
        3,
      );
      line(
        ctx,
        [
          [x + 6, p.centre + 105],
          [x + 22, p.centre + 105],
        ],
        C.butter,
        3,
      );
    }
    if (started && !ended && !s.reduced) {
      smoke.push({ x: 140, y, life: 0.6 });
    }
    smoke = smoke.filter((p) => p.life > 0);
    smoke.forEach((p) => {
      p.x -= dt * 170;
      p.life -= dt;
      ctx.globalAlpha = p.life * 0.45;
      circle(ctx, p.x, p.y, 4 + (1 - p.life) * 8, "#b6c1b3");
    });
    ctx.globalAlpha = 1;
    if (!ended) {
      ctx.save();
      ctx.translate(170, y);
      ctx.rotate(clamp(vy * 0.001, -0.25, 0.25));
      rr(ctx, -28, -16, 60, 33, 15, C.peach);
      rr(ctx, 5, -13, 24, 23, 9, "#f8f4df");
      line(
        ctx,
        [
          [-27, -2],
          [-60, -11],
          [-60, 9],
          [-27, 6],
        ],
        C.ink,
        5,
      );
      line(
        ctx,
        [
          [-5, -17],
          [-5, -29],
        ],
        C.ink,
        3,
      );
      const blade = started ? Math.cos(time * 50) * 43 : 43;
      line(
        ctx,
        [
          [-5 - blade, -29],
          [-5 + blade, -29],
        ],
        C.ink,
        3,
      );
      line(
        ctx,
        [
          [-18, 18],
          [-18, 26],
          [25, 26],
          [25, 18],
        ],
        C.ink,
        3,
      );
      ctx.restore();
    }
    if (!started)
      text(
        ctx,
        "Hold to lift. Release to drift.",
        g.viewWidth / 2,
        220,
        g.viewWidth < 800 ? 17 : 22,
        C.ink,
        "center",
      );
    g.effects(dt);
    hud({ distance: `${Math.floor(world / 10)} m`, best: `${s.best()} m` });
  });
  s.message("Hold the playfield, Lift, or Space to fly. Release to descend.");
}
