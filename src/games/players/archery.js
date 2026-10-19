import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  random,
  clamp,
  lerp,
} from "../runtime.js";
export function mount(s) {
  const mode = s.choice(
    "Mode",
    [
      ["score", "Ten-arrow score attack"],
      ["chase", "Chase 60 points"],
      ["duel", "Duel the computer"],
    ],
    "score",
  );
  const difficulty = s.choice(
    "Difficulty",
    [
      ["relaxed", "Relaxed"],
      ["regular", "Regular"],
      ["expert", "Expert"],
    ],
    "regular",
  );
  const hud = s.hud({
    score: "YOUR SCORE",
    arrows: "ARROWS LEFT",
    streak: "BULLSEYES",
    best: "PERSONAL BEST",
  });
  s.options(mode.label, difficulty.label);
  const g = canvasGame(s, { width: 800, height: 450, portraitWidth: 480 }),
    { ctx } = g;
  let score = 0,
    shots = 0,
    bulls = 0,
    arrow = null,
    stuck = [],
    cooldown = 0,
    recoil = 0,
    ended = false,
    cpu = 0,
    round = 0,
    targetY = 225,
    hitShake = 0,
    history = [];
  const speed = { relaxed: 1.05, regular: 1.65, expert: 2.25 }[
    difficulty.value
  ];
  const phase = random(0, Math.PI * 2),
    tempo = random(0.9, 1.15),
    sway = random(18, 35);
  const targetAt = (t) =>
    225 +
    Math.sin(t * speed * tempo + phase) * 96 +
    Math.sin(t * speed * tempo * 0.57 + phase * 0.3) * sway;
  function update() {
    hud({
      score: mode.value === "duel" ? `${score} : ${cpu}` : score,
      arrows: 10 - shots,
      streak: bulls,
      best: s.best(undefined, mode.value + "_" + difficulty.value),
    });
  }
  function finish() {
    ended = true;
    s.best(score, mode.value + "_" + difficulty.value);
    update();
    s.result(
      mode.value === "duel"
        ? score > cpu
          ? "You win the duel!"
          : score === cpu
            ? "A perfectly even duel."
            : "The computer takes this one."
        : mode.value === "chase"
          ? score >= 60
            ? "Target reached!"
            : "Close. Try another quiver."
          : "A quiver well spent.",
      `${score} points · ${bulls} bullseyes${mode.value === "duel" ? ` · Computer ${cpu}` : ""}`,
      g.wrap,
      true,
    );
  }
  function shoot() {
    if (ended || s.paused || arrow || cooldown > 0 || shots >= 10) return;
    shots++;
    recoil = 0.2;
    arrow = { x: 145, y: 225, oldX: 145 };
    s.tone(240, 0.12, "triangle");
    update();
  }
  g.tap(shoot);
  g.key((key, repeat) => {
    if ((key === " " || key === "Enter") && !repeat) shoot();
  });
  g.controls(g.control("Release arrow · Space", " "));
  s.frame((dt, t) => {
    targetY = targetAt(t);
    cooldown = Math.max(0, cooldown - dt);
    recoil = Math.max(0, recoil - dt);
    hitShake = Math.max(0, hitShake - dt);
    if (arrow && !ended) {
      arrow.oldX = arrow.x;
      arrow.x += 950 * dt;
      if (arrow.oldX < 670 && arrow.x >= 670) {
        // Interpolate target at the actual crossing time, independent of frame rate.
        const crossingTime = t - (arrow.x - 670) / 950,
          offset = arrow.y - targetAt(crossingTime),
          distance = Math.abs(offset);
        const points =
          distance < 12
            ? 10
            : distance < 28
              ? 7
              : distance < 46
                ? 4
                : distance < 66
                  ? 1
                  : 0;
        score += points;
        if (points === 10) bulls++;
        if (points) {
          stuck.push({ offset, life: 1 });
          hitShake = 0.18;
          g.burst(g.viewWidth < 800 ? 390 : 670, arrow.y, C.butter, 18);
          g.float(
            points === 10 ? "BULLSEYE!" : `+${points}`,
            g.viewWidth < 800 ? 240 : 520,
            155,
            points === 10 ? C.green : C.ink,
          );
          s.tone(points === 10 ? 880 : 620, 0.13);
          s.message(
            points === 10
              ? "Right in the middle. Ten points."
              : `${points} points. Lead the moving target.`,
          );
        } else {
          s.message(
            "Miss. Watch where the target will be when the arrow arrives.",
          );
          s.tone(150, 0.1);
        }
        history.push(points);
        if (mode.value === "duel") {
          const ai = [0, 1, 4, 4, 7, 7, 10][Math.floor(random(0, 7))];
          cpu += ai;
          s.message(
            `Your shot: ${points}. Computer: ${ai}. ${shots < 10 ? "Next arrow is yours." : ""}`,
          );
        }
        arrow = null;
        cooldown = 0.6;
        round++;
        update();
        if (shots >= 10) s.defer(finish, 0.8);
      }
    }
    if (g.viewWidth < 800) {
      g.clear("#f5f1e4");
      for (let x = 24; x < 480; x += 32)
        for (let y = 24; y < 440; y += 32) circle(ctx, x, y, 1, "#d9decb");
      text(ctx, "LEAD THE TARGET", 240, 35, 14, C.muted, "center");
      line(
        ctx,
        [
          [410, 70],
          [410, 390],
        ],
        "#b1b8a5",
        5,
      );
      ctx.save();
      ctx.translate(390, targetY);
      [66, 47, 29, 12].forEach((r, i) => {
        ctx.save();
        ctx.scale(0.6, 1);
        circle(ctx, 0, 0, r, [C.green, C.paper, C.peach, C.red][i]);
        ctx.restore();
      });
      stuck.slice(-4).forEach((a) =>
        line(
          ctx,
          [
            [-38, a.offset],
            [0, a.offset],
          ],
          C.ink,
          2,
        ),
      );
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(80, 155);
      ctx.quadraticCurveTo(135, 225, 80, 295);
      ctx.strokeStyle = C.ink;
      ctx.lineWidth = 5;
      ctx.stroke();
      line(
        ctx,
        [
          [80, 155],
          [60 - recoil * 40, 225],
          [80, 295],
        ],
        C.ink,
        2,
      );
      const ax = arrow ? 90 + ((arrow.x - 145) * 300) / 525 : 95;
      if (arrow || shots < 10) {
        line(
          ctx,
          [
            [ax - 40, 225],
            [ax, 225],
          ],
          C.ink,
          3,
        );
        line(
          ctx,
          [
            [ax - 7, 220],
            [ax, 225],
            [ax - 7, 230],
          ],
          C.ink,
          2,
        );
      }
      for (let i = 0; i < 10; i++)
        circle(
          ctx,
          128 + i * 25,
          390,
          5,
          i < shots ? (history[i] ? C.green : C.red) : "#c8cbbc",
        );
      g.effects(dt);
      return;
    }
    g.clear("#f5f1e4");
    for (let x = 35; x < 800; x += 34)
      for (let y = 35; y < 440; y += 34) {
        ctx.globalAlpha = 0.13;
        circle(ctx, x, y, 0.8, C.ink);
      }
    ctx.globalAlpha = 1;
    text(ctx, "THE QUIET RANGE", 400, 38, 11, C.muted, "center");
    line(
      ctx,
      [
        [702, 65],
        [702, 400],
      ],
      "#b1b8a5",
      3,
    );
    rr(ctx, 699, 60, 7, 345, 3, "#a6ad9a");
    ctx.save();
    ctx.translate(670, targetY);
    if (hitShake && !s.reduced) ctx.translate(Math.sin(hitShake * 70) * 3, 0);
    rr(ctx, -8, -69, 16, 138, 4, C.ink);
    [66, 47, 29, 12].forEach((r, i) => {
      ctx.save();
      ctx.scale(0.32, 1);
      circle(ctx, 0, 0, r, [C.green, C.paper, C.peach, C.red][i]);
      ctx.restore();
    });
    stuck.slice(-5).forEach((a, i) =>
      line(
        ctx,
        [
          [-48 - i * 3, a.offset],
          [-1, a.offset],
        ],
        C.ink,
        2,
      ),
    );
    ctx.restore();
    ctx.save();
    ctx.translate(132, 225);
    const pull = recoil > 0 ? Math.sin((recoil / 0.2) * Math.PI) * 14 : 0;
    ctx.beginPath();
    ctx.moveTo(0, -87);
    ctx.quadraticCurveTo(65, 0, 0, 87);
    ctx.strokeStyle = C.ink;
    ctx.lineWidth = 5;
    ctx.stroke();
    line(
      ctx,
      [
        [0, -87],
        [-20 - pull, 0],
        [0, 87],
      ],
      C.ink,
      1.5,
    );
    if (!arrow && shots < 10) {
      line(
        ctx,
        [
          [-35, 0],
          [56, 0],
        ],
        C.ink,
        2,
      );
      line(
        ctx,
        [
          [48, -5],
          [58, 0],
          [48, 5],
        ],
        C.ink,
        2,
      );
    }
    ctx.restore();
    if (arrow) {
      line(
        ctx,
        [
          [arrow.x - 85, 225],
          [arrow.x, 225],
        ],
        C.ink,
        2,
      );
      line(
        ctx,
        [
          [arrow.x - 9, 220],
          [arrow.x, 225],
          [arrow.x - 9, 230],
        ],
        C.ink,
        2,
      );
      line(
        ctx,
        [
          [arrow.x - 72, 220],
          [arrow.x - 65, 225],
          [arrow.x - 72, 230],
        ],
        C.peach,
        3,
      );
    }
    ctx.setLineDash([3, 12]);
    line(
      ctx,
      [
        [210, 225],
        [624, 225],
      ],
      "#c4c6b6",
      1,
    );
    ctx.setLineDash([]);
    for (let i = 0; i < 10; i++) {
      const x = 280 + i * 25;
      circle(
        ctx,
        x,
        386,
        5,
        i < shots ? (history[i] ? C.green : C.red) : "#c8cbbc",
      );
    }
    text(
      ctx,
      "TIME THE FLIGHT, NOT JUST THE RELEASE.",
      400,
      420,
      10,
      C.muted,
      "center",
    );
    g.effects(dt);
  });
  update();
  s.message(
    "Your arrow takes half a second to reach the target. Lead the bullseye.",
  );
}
