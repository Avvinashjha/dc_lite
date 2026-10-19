import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  random,
  clamp,
} from "../runtime.js";
import { runnerHit } from "../rules/runner.mjs";
export function mount(s) {
  const g = canvasGame(s, { width: 800, height: 350, portraitWidth: 500 }),
    { ctx } = g,
    hud = s.hud({ score: "DISTANCE", best: "PERSONAL BEST" });
  let y = 277,
    vy = 0,
    grounded = true,
    started = false,
    ended = false,
    world = 0,
    obstacles = [],
    spawn = 1.6,
    jumpHeld = false,
    duck = false,
    blink = 0;
  function jump() {
    if (ended) return;
    started = true;
    if (grounded && !duck) {
      vy = -420;
      grounded = false;
      s.tone(420, 0.05, "triangle", 0.018);
    }
  }
  g.key((key, repeat) => {
    if (
      (key === " " || key === "ArrowUp" || key.toLowerCase() === "w") &&
      !repeat
    )
      jump();
  });
  g.keyUp((key) => {
    if (
      (key === " " || key === "ArrowUp" || key.toLowerCase() === "w") &&
      vy < -140
    )
      vy = -140;
  });
  g.tap(jump);
  g.release(() => {
    if (vy < -140) vy = -140;
  });
  g.controls(
    g.control("Jump · Space", " "),
    g.control("Hold to duck · ↓", "ArrowDown", { hold: true }),
  );
  function end() {
    if (ended) return;
    ended = true;
    s.best(Math.floor(world / 10));
    g.burst(115, y - 24, C.peach, 22);
    s.defer(
      () =>
        s.result(
          "Small dino. Big ambition.",
          `${Math.floor(world / 10)} metres · Best ${s.best()} m`,
          g.wrap,
          true,
        ),
      0.2,
    );
  }
  function step(dt) {
    if (!started || ended) return;
    const speed = 230 + Math.min(world / 110, 190);
    world += speed * dt;
    duck = (g.keys.has("arrowdown") || g.keys.has("s")) && grounded;
    vy += 1100 * dt;
    y += vy * dt;
    if (y >= 277) {
      y = 277;
      vy = 0;
      grounded = true;
    }
    spawn -= dt;
    if (spawn <= 0) {
      const bird = world > 2500 && Math.random() < 0.32;
      obstacles.push({
        x: 840,
        y: bird ? 225 : 277,
        w: bird ? 40 : random(21, 33),
        h: bird ? 23 : random(30, 48),
        bird,
      });
      spawn = random(1.05, 1.65);
    }
    for (const o of obstacles) {
      o.x -= speed * dt;
      if (runnerHit(y, duck, o)) end();
    }
    obstacles = obstacles.filter((o) => o.x > -70);
  }
  s.frame((dt, t) => {
    for (let d = dt; d > 0; d -= 1 / 120) step(Math.min(d, 1 / 120));
    g.clear("#f3eddb");
    circle(ctx, 665, 70, 28, "#e9d6a1");
    for (let i = 0; i < 4; i++) {
      const x = (i * 270 - world * 0.16) % 1080;
      rr(ctx, x, 75 + (i % 2) * 33, 80, 13, 9, "#e2decb");
    }
    line(
      ctx,
      [
        [0, 279],
        [800, 279],
      ],
      "#a7b297",
      2,
    );
    for (let i = 0; i < 18; i++) {
      const x = (i * 57 - world) % 880;
      line(
        ctx,
        [
          [x, 296],
          [x + 13, 296],
        ],
        "#c6cbb7",
        1,
      );
    }
    // A shaped dinosaur, not a rectangle: snout, tail, tiny arms, and a two-leg gait.
    ctx.save();
    ctx.translate(117, y);
    const bob = grounded && started && !duck ? Math.sin(t * 20) * 1.5 : 0;
    ctx.translate(0, bob);
    if (duck) {
      rr(ctx, -23, -24, 61, 20, 10, C.green);
      rr(ctx, 17, -30, 31, 17, 5, C.green);
      circle(ctx, 38, -25, 2, C.paper);
    } else {
      rr(ctx, -16, -36, 32, 32, 11, C.green);
      rr(ctx, 2, -61, 37, 31, 7, C.green);
      line(
        ctx,
        [
          [3, -8],
          [-28, -34],
          [-31, -19],
        ],
        C.green,
        10,
      );
      circle(ctx, 28, -51, 3, C.paper);
      circle(ctx, 29, -51, 1, C.ink);
      line(
        ctx,
        [
          [17, -28],
          [28, -20],
          [33, -21],
        ],
        C.green,
        4,
      );
    }
    const leg = grounded && started ? Math.sin(t * 22) * 8 : 3;
    line(
      ctx,
      [
        [-8, -8],
        [-12 + leg, 0],
        [-4 + leg, 0],
      ],
      C.green,
      5,
    );
    line(
      ctx,
      [
        [10, -8],
        [16 - leg, 0],
        [24 - leg, 0],
      ],
      C.green,
      5,
    );
    ctx.restore();
    for (const o of obstacles) {
      if (o.bird) {
        ctx.save();
        ctx.translate(o.x + 20, o.y - 10);
        line(
          ctx,
          [
            [-19, 0],
            [0, -Math.sin(t * 18) * 12],
            [19, 0],
          ],
          "#7f8874",
          6,
        );
        circle(ctx, 15, -3, 5, "#7f8874");
        ctx.restore();
      } else {
        rr(ctx, o.x + o.w * 0.35, o.y - o.h, o.w * 0.4, o.h, 5, C.green);
        line(
          ctx,
          [
            [o.x + o.w * 0.5, o.y - o.h * 0.45],
            [o.x, o.y - o.h * 0.45],
            [o.x, o.y - o.h * 0.7],
          ],
          C.green,
          6,
        );
        line(
          ctx,
          [
            [o.x + o.w * 0.5, o.y - o.h * 0.6],
            [o.x + o.w, o.y - o.h * 0.6],
            [o.x + o.w, o.y - o.h * 0.85],
          ],
          C.green,
          6,
        );
      }
    }
    if (!started)
      text(
        ctx,
        "A little leap starts a long adventure.",
        g.viewWidth / 2,
        160,
        g.viewWidth < 800 ? 15 : 20,
        C.ink,
        "center",
      );
    g.effects(dt);
    hud({ score: `${Math.floor(world / 10)} m`, best: `${s.best()} m` });
  });
  s.message(
    "Hold Jump or Space for a higher leap; release for a short hop. Hold Down to duck under birds.",
  );
}
