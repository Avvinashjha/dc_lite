import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  clamp,
  lerp,
  random,
  person,
} from "../runtime.js";
import {
  basketballPower,
  basketballLaunch,
  basketballStep,
} from "../rules/sports.mjs";
export function mount(s) {
  const g = canvasGame(s, { portraitWidth: 480 }),
    { ctx } = g,
    hud = s.hud({
      score: "POINTS",
      streak: "STREAK",
      misses: "MISSES",
      best: "PERSONAL BEST",
    });
  let score = 0,
    streak = 0,
    misses = 0,
    hoop = { x: g.viewWidth < 800 ? 350 : 620, y: 195 },
    power = 0,
    charging = false,
    ball = null,
    ended = false,
    cooldown = 0,
    meterSpeed = random(0.62, 0.98),
    meterDirection = 1,
    net = 0,
    trail = [];
  s.onPause((value) => {
    if (value) {
      charging = false;
      power = 0;
    }
  });
  function start() {
    if (ended || ball || cooldown || s.paused) return;
    charging = true;
    power = 0;
  }
  function release() {
    if (!charging || ended || s.paused) return;
    charging = false;
    ball = {
      ...basketballLaunch(power, hoop, {
        x: g.viewWidth < 800 ? 90 : 190,
        y: 242,
      }),
      t: 0,
      resolved: false,
      bounces: 0,
    };
    trail = [];
    s.tone(220, 0.08, "triangle");
  }
  g.tap(start);
  g.release(release);
  g.key((key, repeat) => {
    if (key === " " && !repeat) start();
  });
  g.keyUp((key) => {
    if (key === " ") release();
  });
  g.controls(
    g.control("Hold, then release · Space", " ", { hold: true, action: start }),
  );
  function next() {
    ball = null;
    cooldown = 0.15;
    power = 0;
    meterSpeed = random(0.65, 1.08) + Math.min(score * 0.008, 0.35);
    meterDirection = 1;
    hoop = {
      x: g.viewWidth < 800 ? random(285, 390) : random(480, 690),
      y: random(130, 225),
    };
  }
  s.frame((dt, t) => {
    cooldown = Math.max(0, cooldown - dt);
    net = Math.max(0, net - dt);
    if (charging) {
      power += dt * meterSpeed * meterDirection;
      if (power >= 1) {
        power = 1;
        meterDirection = -1;
      } else if (power <= 0) {
        power = 0;
        meterDirection = 1;
      }
    }
    if (ball && !ended) {
      ball.t += dt;
      for (let rest = dt; rest > 0; rest -= 1 / 180) {
        const event = basketballStep(ball, Math.min(rest, 1 / 180), hoop);
        if (event.scored && !ball.resolved) {
          ball.resolved = true;
          const points = ball.rim ? 2 : 3;
          score += points;
          streak++;
          net = 0.7;
          g.burst(hoop.x, hoop.y, C.butter, 18);
          g.float(
            points === 3 ? "SWISH!" : "+2",
            hoop.x - 65,
            hoop.y - 60,
            C.green,
          );
          s.message(
            points === 3
              ? "A clean swish. Three points."
              : "In off the rim. Two points.",
          );
          s.tone(700, 0.13);
        }
        if (event.floor) {
          s.tone(160, 0.06, "triangle", 0.02);
          if (!ball.resolved) {
            ball.resolved = true;
            misses++;
            streak = 0;
            s.message(
              ball.x < hoop.x
                ? "Short. Add a little power on the next shot."
                : "Long. Ease off the power next time.",
            );
          }
        }
      }
      if (!s.reduced) {
        trail.push({ x: ball.x, y: ball.y });
        if (trail.length > 12) trail.shift();
      }
      if (ball.t > 3.8 || (ball.bounces >= 2 && ball.t > 2.1)) {
        if (!ball.resolved) {
          ball.resolved = true;
          misses++;
          streak = 0;
        }
        if (misses >= 3) {
          ended = true;
          s.best(score);
          s.result(
            "A quiet court. Another chance.",
            `${score} points · Best ${s.best()}`,
            g.wrap,
            true,
          );
        } else next();
      }
    }
    g.clear("#f2e8d5");
    line(
      ctx,
      [
        [30, 376],
        [g.viewWidth - 30, 376],
      ],
      "#bfae8d",
      2,
    );
    line(
      ctx,
      [
        [hoop.x + 80, 85],
        [hoop.x + 80, 377],
      ],
      C.ink,
      7,
    );
    rr(ctx, hoop.x + 23, hoop.y - 76, 60, 93, 3, "#fffdf5", C.ink);
    rr(ctx, hoop.x + 34, hoop.y - 37, 35, 34, 1, null, C.peach);
    line(
      ctx,
      [
        [hoop.x - 31, hoop.y],
        [hoop.x + 32, hoop.y],
      ],
      C.peach,
      6,
    );
    line(
      ctx,
      [
        [hoop.x - 26, hoop.y + 4],
        [hoop.x - 15, hoop.y + 46],
        [hoop.x + 15, hoop.y + 46],
        [hoop.x + 26, hoop.y + 4],
      ],
      C.ink,
      1.2,
    );
    for (const a of [-13, 0, 13])
      line(
        ctx,
        [
          [hoop.x + a, hoop.y + 5],
          [
            hoop.x + a * 0.6 + Math.sin(net * 22) * net * 8,
            hoop.y + 45 + net * 7,
          ],
        ],
        C.ink,
        1,
      );
    const shift = g.viewWidth < 800 ? -100 : 0;
    person(ctx, 145 + shift, 375, 1.25, 0);
    line(
      ctx,
      [
        [148 + shift, 298],
        [171 + shift, 274],
        [190 + shift, 250],
      ],
      C.ink,
      8,
    );
    let bx = ball ? ball.x : 190 + shift,
      by = ball ? ball.y : 242;
    if (ball) {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.beginPath();
      ctx.ellipse(bx, 376, 18, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = C.ink;
      ctx.fill();
      ctx.restore();
      trail.forEach((p, i) => {
        ctx.globalAlpha = (i / trail.length) * 0.18;
        circle(ctx, p.x, p.y, 9, C.peach);
      });
      ctx.globalAlpha = 1;
    }
    circle(ctx, bx, by, 13, C.peach);
    line(
      ctx,
      [
        [bx - 12, by],
        [bx + 12, by],
      ],
      C.ink,
      1,
    );
    ctx.beginPath();
    ctx.ellipse(bx, by, 5, 13, 0.4, 0, Math.PI * 2);
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 1;
    ctx.stroke();
    rr(ctx, g.viewWidth / 2 - 140, 393, 280, 9, 5, "#d7cbb0");
    rr(
      ctx,
      g.viewWidth / 2 -
        140 +
        280 * (basketballPower(hoop, 190 + shift) - 0.035),
      391,
      19.6,
      13,
      4,
      C.sage,
    );
    if (charging || !ball)
      circle(ctx, g.viewWidth / 2 - 140 + 280 * power, 397, 7, C.ink);
    text(
      ctx,
      "DISTANCE CHANGES POWER · FOLLOW THE GREEN",
      g.viewWidth / 2,
      428,
      10,
      C.muted,
      "center",
    );
    g.effects(dt);
    hud({ score, streak, misses: `${misses} / 3`, best: s.best() });
  });
  s.message(
    "Hold Shoot or Space to build power. Release as the marker crosses the green zone.",
  );
}
