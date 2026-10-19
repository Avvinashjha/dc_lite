import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  clamp,
  random,
  lerp,
} from "../runtime.js";
export function mount(s) {
  const difficulty = s.choice(
      "Opponent",
      [
        ["relaxed", "Relaxed"],
        ["regular", "Regular"],
        ["fast", "Fast"],
      ],
      "regular",
    ),
    hud = s.hud({
      you: "YOU",
      cpu: "COMPUTER",
      rally: "RALLY",
      best: "LONGEST RALLY",
    });
  s.options(difficulty.label);
  const g = canvasGame(s, { width: 800, height: 450, portraitRotate: true }),
    { ctx } = g;
  let py = 225,
    ay = 225,
    target = 225,
    ball = { x: 400, y: 225, vx: 300, vy: 70 },
    you = 0,
    cpu = 0,
    rally = 0,
    longest = s.best(),
    ended = false,
    wait = 1,
    trail = [];
  const aiSpeed = { relaxed: 155, regular: 225, fast: 300 }[difficulty.value];
  function serve(direction) {
    wait = 0.8;
    ball = {
      x: 400,
      y: random(150, 300),
      vx: direction * 300,
      vy: random(-120, 120),
    };
    trail = [];
    rally = 0;
  }
  function point(player) {
    if (player) you++;
    else cpu++;
    s.tone(player ? 760 : 190, 0.13);
    g.float(
      player ? "YOUR POINT" : "A POINT AWAY",
      400,
      125,
      player ? C.butter : C.peach,
    );
    if (you >= 7 || cpu >= 7) {
      ended = true;
      s.best(longest);
      s.result(
        you >= 7 ? "A lovely win." : "Another rally awaits.",
        `${you}–${cpu} · Longest rally: ${longest}`,
        g.wrap,
        true,
      );
    } else serve(player ? -1 : 1);
  }
  g.move((p) => {
    target = clamp(p.y, 55, 395);
  });
  g.tap((p) => {
    target = clamp(p.y, 55, 395);
  });
  g.controls(
    g.control(g.rotated ? "← Paddle" : "↑ Up", "ArrowUp", { hold: true }),
    g.control(g.rotated ? "Paddle →" : "↓ Down", "ArrowDown", { hold: true }),
  );
  function step(dt) {
    if (ended) return;
    if (g.keys.has("arrowup") || g.keys.has("w"))
      target = clamp(target - dt * 400, 55, 395);
    if (g.keys.has("arrowdown") || g.keys.has("s"))
      target = clamp(target + dt * 400, 55, 395);
    py = lerp(py, target, 1 - Math.exp(-dt * 20));
    const desired = ball.vx > 0 ? ball.y + Math.sin(s.time * 2) * 22 : 225;
    ay += clamp(desired - ay, -aiSpeed * dt, aiSpeed * dt);
    ay = clamp(ay, 55, 395);
    if (wait > 0) {
      wait -= dt;
      return;
    }
    const prev = ball.x;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;
    if (ball.y < 20) {
      ball.y = 20;
      ball.vy = Math.abs(ball.vy);
    }
    if (ball.y > 430) {
      ball.y = 430;
      ball.vy = -Math.abs(ball.vy);
    }
    const left =
        ball.vx < 0 && prev >= 55 && ball.x <= 55 && Math.abs(ball.y - py) < 57,
      right =
        ball.vx > 0 &&
        prev <= 745 &&
        ball.x >= 745 &&
        Math.abs(ball.y - ay) < 57;
    if (left || right) {
      const centre = left ? py : ay,
        angle = clamp((ball.y - centre) / 51, -1, 1) * 1.0,
        speed = Math.min(620, Math.hypot(ball.vx, ball.vy) + 20);
      ball.vx = (left ? 1 : -1) * speed * Math.cos(angle);
      ball.vy = speed * Math.sin(angle);
      ball.x = left ? 56 : 744;
      rally++;
      longest = Math.max(longest, rally);
      g.burst(ball.x, ball.y, C.butter, 7);
      s.tone(350 + rally * 20, 0.04, "triangle", 0.02);
    }
    if (ball.x < 0) point(false);
    else if (ball.x > 800) point(true);
  }
  s.frame((dt, t) => {
    for (let d = dt; d > 0; d -= 1 / 120) step(Math.min(d, 1 / 120));
    g.clear("#41634e");
    rr(ctx, 18, 18, 764, 414, 4, null, "#bed0ae");
    ctx.setLineDash([7, 13]);
    line(
      ctx,
      [
        [400, 22],
        [400, 428],
      ],
      "#9bb58f",
      2,
    );
    ctx.setLineDash([]);
    circle(ctx, 400, 225, 48, "#446952");
    if (!s.reduced) {
      trail.push({ x: ball.x, y: ball.y });
      if (trail.length > 9) trail.shift();
      trail.forEach((p, i) => {
        ctx.globalAlpha = (i / trail.length) * 0.25;
        circle(ctx, p.x, p.y, 6, C.paper);
      });
      ctx.globalAlpha = 1;
    }
    rr(ctx, 35, py - 49, 13, 98, 6, C.paper);
    rr(ctx, 752, ay - 49, 13, 98, 6, C.peach);
    circle(ctx, ball.x, ball.y, 7, C.paper);
    if (wait > 0 && !ended)
      text(ctx, "NEXT SERVE", 400, 75, 12, "#d9e3cc", "center");
    g.effects(dt);
    hud({ you, cpu, rally, best: longest });
  });
  s.message(
    "First to seven. Aim with the edge of your paddle to change the angle.",
  );
}
