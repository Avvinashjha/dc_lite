import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  person,
  random,
  clamp,
  lerp,
} from "../runtime.js";
import {
  battingOutcome,
  deliveryPoint,
  overs,
  makeDelivery,
} from "../rules/cricket.mjs";
export function mount(s) {
  const mode = s.choice(
    "Mode",
    [
      ["attack", "Score attack"],
      ["chase", "Chase 36 in 4 overs"],
      ["match", "Bat & bowl · 1 over"],
    ],
    "attack",
  );
  const difficulty = s.choice(
    "Difficulty",
    [
      ["relaxed", "Relaxed"],
      ["regular", "Regular"],
      ["fast", "Fast"],
    ],
    "regular",
  );
  const hud = s.hud({
    score: "RUNS / WICKETS",
    balls: "OVERS",
    target: "THE CHALLENGE",
    best: "YOUR BEST",
  });
  s.options(mode.label, difficulty.label);
  const g = canvasGame(s, { width: 800, height: 450, portraitWidth: 480 }),
    { ctx } = g;
  let runs = 0,
    wickets = 0,
    balls = 0,
    cpu = 0,
    cpuWickets = 0,
    bowlBalls = 0,
    phase = "ready",
    phaseTime = 0,
    roundTime = 0,
    elapsed = 0,
    delivery = null,
    swing = -1,
    struck = false,
    outcome = null,
    ball = null,
    trail = [],
    flight = 0,
    ended = false,
    batting = true,
    meter = 0,
    pace = 0.5,
    bounce = 0.5,
    wicketAnim = 0;
  const windowSize = { relaxed: 0.17, regular: 0.105, fast: 0.065 }[
    difficulty.value
  ];
  const button = g.control("Swing · Space", " ");
  const row = g.controls(button);
  function updateHud() {
    hud({
      score: batting ? `${runs} / ${wickets}` : `CPU ${cpu} / ${cpuWickets}`,
      balls: overs(batting ? balls : bowlBalls),
      target:
        mode.value === "chase"
          ? `${Math.max(0, 36 - runs)} from ${24 - balls} balls`
          : mode.value === "match"
            ? batting
              ? "Set a 1-over target"
              : `Defend ${runs + 1}`
            : "3 wickets",
      best: s.best(undefined, mode.value + "_" + difficulty.value),
    });
  }
  function finish(title) {
    ended = true;
    phase = "end";
    button.disabled = true;
    s.best(runs, mode.value + "_" + difficulty.value);
    updateHud();
    s.result(
      title,
      mode.value === "match"
        ? `You ${runs}/${wickets} · Computer ${cpu}/${cpuWickets}`
        : `${runs} runs from ${balls} balls. Best: ${s.best(undefined, mode.value + "_" + difficulty.value)}`,
      g.wrap,
      true,
    );
  }
  function next() {
    if (ended) return;
    if (batting && mode.value === "chase" && runs >= 36)
      return finish("Target chased!");
    if (
      batting &&
      (wickets >= 3 ||
        (mode.value === "chase" && balls >= 24) ||
        (mode.value === "match" && balls >= 6))
    ) {
      if (mode.value === "match") {
        batting = false;
        phase = "pace";
        phaseTime = 0;
        button.textContent = "Set pace · Space";
        s.message(
          `Your innings: ${runs}. Now bowl one over and defend ${runs + 1}. Tap to set pace, then bounce.`,
        );
        updateHud();
        return;
      }
      return finish(
        mode.value === "chase" ? "A chase for another day" : "A good innings.",
      );
    }
    if (!batting && (bowlBalls >= 6 || cpuWickets >= 3 || cpu > runs))
      return finish(
        cpu > runs
          ? "The computer takes it."
          : cpu === runs
            ? "Scores level."
            : "You win the match!",
      );
    if (!batting) {
      phase = "pace";
      phaseTime = 0;
      button.textContent = "Set pace · Space";
      button.disabled = false;
      s.message("Tap to lock the pace, then set the bounce.");
      return;
    }
    phase = "windup";
    phaseTime = 0;
    swing = -1;
    struck = false;
    outcome = null;
    trail = [];
    wicketAnim = 0;
    button.disabled = true;
    button.textContent = "Watch the delivery";
    delivery = makeDelivery(Math.random, difficulty.value, balls);
  }
  function deliver() {
    phase = "delivery";
    phaseTime = 0;
    elapsed = 0;
    button.disabled = false;
    button.textContent = batting ? "Swing · Space" : "Watch your delivery";
  }
  function act() {
    if (ended || s.paused) return;
    if (phase === "ready") {
      next();
      return;
    }
    if (phase === "pace") {
      pace = meter;
      phase = "bounce";
      phaseTime = 0;
      button.textContent = "Set bounce · Space";
      s.tone(330);
      return;
    }
    if (phase === "bounce") {
      bounce = meter;
      delivery = {
        duration: 2.05 - pace * 0.8,
        bounceAt: 0.56 + bounce * 0.19,
        bounceHeight: 35 + bounce * 58,
      };
      phase = "windup";
      phaseTime = 0;
      struck = false;
      outcome = null;
      trail = [];
      wicketAnim = 0;
      swing = -1;
      button.disabled = true;
      button.textContent = "Bowling…";
      return;
    }
    if (phase !== "delivery" || !batting || swing >= 0) return;
    swing = 0;
    button.disabled = true;
  }
  g.key((key, repeat) => {
    if ((key === " " || key === "Enter") && !repeat) act();
  });
  g.tap(act);
  function resolve(error) {
    outcome = battingOutcome(error, windowSize);
    struck = true;
    if (batting) {
      balls++;
      if (outcome.wicket) wickets++;
      else runs += outcome.runs;
    } else {
      bowlBalls++;
      if (outcome.wicket) cpuWickets++;
      else cpu += outcome.runs;
    }
    if (outcome.wicket) {
      phase = "miss";
      phaseTime = 0;
      wicketAnim = 0.01;
      g.float("BOWLED!", 145, 225, C.red);
      s.message(
        `${outcome.label}. ${batting ? "A wicket falls." : "You take a wicket!"}`,
      );
      s.tone(120, 0.2, "triangle");
    } else {
      phase = "flight";
      phaseTime = 0;
      flight = 0;
      const p = deliveryPoint(elapsed / delivery.duration, delivery);
      ball = { ...p };
      g.burst(p.x, p.y, C.butter, 22);
      g.float(
        outcome.runs === 6
          ? "SIX!"
          : outcome.runs === 4
            ? "FOUR!"
            : `+${outcome.runs}`,
        300,
        155,
        C.green,
      );
      s.message(`${batting ? "" : "Computer: "}${outcome.label}`);
      s.tone(outcome.runs === 6 ? 780 : 560, 0.14, "triangle");
    }
    updateHud();
  }
  s.frame((dt, t) => {
    roundTime = t;
    phaseTime += dt;
    if (phase === "ready" && phaseTime > 0.8) next();
    if (phase === "windup" && phaseTime > (delivery.windup || 0.9)) deliver();
    if (phase === "delivery") {
      elapsed += dt;
      if (swing >= 0) swing += dt;
      if (!batting && swing < 0 && elapsed > delivery.duration * 0.96 - 0.095) {
        swing = 0;
      }
      if (!struck && swing >= 0.095) {
        let error = elapsed - delivery.duration * 0.96;
        if (!batting) {
          const difficultyBoost =
            Math.abs(pace - 0.5) * 0.09 + Math.abs(bounce - 0.5) * 0.09;
          error = random(-0.18 - difficultyBoost, 0.18 + difficultyBoost);
        }
        resolve(error);
      }
      if (!struck && elapsed > delivery.duration * 1.06) resolve(1);
    } else if (phase === "flight" && phaseTime > 1.15) {
      phase = "settle";
      phaseTime = 0;
    } else if (phase === "miss" && phaseTime > 1) {
      phase = "settle";
      phaseTime = 0;
    } else if (phase === "settle" && phaseTime > 0.6) next();
    if (wicketAnim) wicketAnim += dt;
    draw(dt, t);
  });
  function drawPortrait(dt, t) {
    g.clear("#f5f1df");
    ctx.fillStyle = "#e1e8d0";
    ctx.beginPath();
    ctx.ellipse(250, 355, 340, 160, 0, Math.PI, 0);
    ctx.fill();
    for (let i = 0; i < 12; i++)
      rr(ctx, i * 44, 175 - Math.sin(i * 0.7) * 20, 27, 9, 3, "#cfdac0");
    rr(ctx, 32, 357, 416, 16, 4, "#d1b884");
    line(
      ctx,
      [
        [16, 355],
        [465, 355],
      ],
      C.ink,
      2,
    );
    text(
      ctx,
      delivery?.style || "THE BOUNDARY CLUB",
      240,
      45,
      16,
      C.green,
      "center",
    );
    const swingP = swing >= 0 ? clamp(swing / 0.35, 0, 1) : 0;
    person(ctx, 78, 354, 1.3, 0);
    ctx.save();
    ctx.translate(96, 294);
    ctx.rotate(
      swing < 0 ? 0.6 : lerp(0.7, -2.3, Math.sin(swingP * Math.PI * 0.7)),
    );
    line(
      ctx,
      [
        [0, 0],
        [16, 24],
      ],
      C.ink,
      7,
    );
    line(
      ctx,
      [
        [16, 24],
        [33, 64],
      ],
      "#b18a56",
      13,
    );
    ctx.restore();
    person(
      ctx,
      410,
      354,
      1.18,
      phase === "windup" ? Math.sin(phaseTime * 15) : 0,
    );
    if (phase === "windup") {
      const arm = -1.7 + Math.sin(phaseTime * 6) * 1.2;
      line(
        ctx,
        [
          [410, 281],
          [410 + Math.cos(arm) * 38, 281 + Math.sin(arm) * 38],
        ],
        C.ink,
        7,
      );
      circle(ctx, 410 + Math.cos(arm) * 40, 281 + Math.sin(arm) * 40, 7, C.red);
    }
    ctx.save();
    ctx.translate(45, 354);
    if (wicketAnim) ctx.rotate(Math.min(0.9, wicketAnim));
    for (let i = 0; i < 3; i++)
      line(
        ctx,
        [
          [i * 8, 0],
          [i * 8, -41],
        ],
        C.ink,
        3,
      );
    line(
      ctx,
      [
        [-3, -43],
        [19, -43],
      ],
      C.ink,
      3,
    );
    ctx.restore();
    if (phase === "delivery" || phase === "miss") {
      const progress =
          elapsed / delivery.duration +
          (phase === "miss" ? phaseTime * 0.45 : 0),
        p = deliveryPoint(progress, delivery);
      circle(ctx, 410 - 330 * progress, p.y, 8, C.red);
      line(
        ctx,
        [
          [408 - 330 * progress, p.y - 4],
          [412 - 330 * progress, p.y + 4],
        ],
        C.paper,
        1,
      );
    }
    if (phase === "flight" && ball) {
      const u = clamp(phaseTime / 1.1, 0, 1),
        high = outcome.runs >= 4;
      circle(
        ctx,
        lerp(80, high ? 495 : 310, u),
        ball.y - (high ? 400 : 180) * u + (high ? 140 : 210) * u * u,
        7,
        C.red,
      );
    }
    if (phase === "pace" || phase === "bounce") {
      meter = (Math.sin(phaseTime * (phase === "pace" ? 3.4 : 4.2)) + 1) / 2;
      text(
        ctx,
        phase === "pace" ? "SET PACE" : "SET BOUNCE",
        240,
        110,
        18,
        C.ink,
        "center",
      );
      rr(ctx, 110, 150, 260, 12, 6, "#cbd6ba");
      rr(ctx, 110, 150, 260 * meter, 12, 6, C.green);
      circle(ctx, 110 + 260 * meter, 156, 9, C.ink);
    }
    if (phase === "ready")
      text(
        ctx,
        "Watch the bounce. Time your swing.",
        240,
        125,
        17,
        C.ink,
        "center",
      );
    g.effects(dt);
    text(
      ctx,
      batting ? "ONE TAP. ONE SHOT." : "YOUR PACE. YOUR BOUNCE.",
      240,
      414,
      12,
      C.muted,
      "center",
    );
  }
  function draw(dt, t) {
    if (g.viewWidth < 800) return drawPortrait(dt, t);
    g.clear("#f5f1df");
    // Quiet stadium: graphic hills, boundary rope, pitch, and a side-on silhouette cast.
    ctx.fillStyle = "#e5ead6";
    ctx.beginPath();
    ctx.ellipse(430, 360, 530, 140, 0, Math.PI, 0);
    ctx.fill();
    line(
      ctx,
      [
        [25, 355],
        [775, 355],
      ],
      "#a5b191",
      2,
    );
    line(
      ctx,
      [
        [35, 362],
        [765, 362],
      ],
      C.ink,
      3,
    );
    rr(ctx, 65, 362, 670, 13, 3, "#d1b884");
    line(
      ctx,
      [
        [105, 356],
        [190, 356],
      ],
      "#fffdf3",
      3,
    );
    line(
      ctx,
      [
        [659, 356],
        [730, 356],
      ],
      "#fffdf3",
      3,
    );
    ctx.fillStyle = "#dce3cd";
    for (let i = 0; i < 22; i++)
      rr(ctx, i * 39, 172 - Math.sin(i * 0.5) * 18, 24, 8, 3, "#dce3cd");
    text(
      ctx,
      mode.value === "match" && !batting ? "YOUR OVER" : "THE BOUNDARY CLUB",
      400,
      45,
      11,
      C.muted,
      "center",
    );
    // Batter, arm, and a bat that anticipates, connects, then follows through.
    const swingP = swing >= 0 ? clamp(swing / 0.35, 0, 1) : 0;
    person(ctx, 137, 354, 1.25, 0);
    ctx.save();
    ctx.translate(155, 294);
    const angle =
      swing < 0 ? 0.6 : lerp(0.7, -2.3, Math.sin(swingP * Math.PI * 0.7));
    ctx.rotate(angle);
    line(
      ctx,
      [
        [0, 0],
        [16, 24],
      ],
      C.ink,
      7,
    );
    line(
      ctx,
      [
        [16, 24],
        [29, 58],
      ],
      "#b18a56",
      13,
    );
    line(
      ctx,
      [
        [28, 56],
        [33, 64],
      ],
      "#d4b47c",
      14,
    );
    ctx.restore();
    const run = phase === "windup" ? Math.sin(phaseTime * 15) : 0;
    person(
      ctx,
      700 - (phase === "windup" ? Math.sin(phaseTime * 3) * 12 : 0),
      354,
      1.18,
      run,
    );
    if (phase === "windup") {
      const arm = -1.7 + Math.sin(phaseTime * 6) * 1.2;
      line(
        ctx,
        [
          [700, 281],
          [700 + Math.cos(arm) * 38, 281 + Math.sin(arm) * 38],
        ],
        C.ink,
        7,
      );
      circle(ctx, 700 + Math.cos(arm) * 40, 281 + Math.sin(arm) * 40, 5, C.red);
    }
    ctx.save();
    ctx.translate(105, 354);
    if (wicketAnim) {
      ctx.rotate(Math.min(0.9, wicketAnim));
    }
    for (let i = 0; i < 3; i++)
      line(
        ctx,
        [
          [i * 8, 0],
          [i * 8, -41],
        ],
        C.ink,
        3,
      );
    line(
      ctx,
      [
        [-3, -43],
        [19, -43],
      ],
      C.ink,
      3,
    );
    ctx.restore();
    if (phase === "delivery" || phase === "miss") {
      const p = deliveryPoint(
        elapsed / delivery.duration + (phase === "miss" ? phaseTime * 0.45 : 0),
        delivery,
      );
      trail.push(p);
      if (trail.length > 9) trail.shift();
      trail.forEach((v, i) => {
        ctx.globalAlpha = (i / trail.length) * 0.22;
        circle(ctx, v.x, v.y, 4, C.red);
      });
      ctx.globalAlpha = 1;
      circle(ctx, p.x, p.y, g.compact ? 8 : 5.5, C.red);
      line(
        ctx,
        [
          [p.x - 2, p.y - 3],
          [p.x + 2, p.y + 3],
        ],
        "#fff",
        1,
      );
    }
    if (phase === "flight" && ball) {
      const u = clamp(phaseTime / 1.1, 0, 1),
        high = outcome.runs >= 4;
      const p = {
        x: lerp(ball.x, high ? 810 : 460, u),
        y: high
          ? ball.y - 400 * u + 140 * u * u
          : ball.y - 180 * u + 210 * u * u,
      };
      circle(ctx, p.x, p.y, g.compact ? 7.5 : 5, C.red);
      if (!s.reduced) {
        line(
          ctx,
          [
            [p.x - 24, p.y + 11],
            [p.x - 8, p.y + 4],
          ],
          "#bd7b6d",
          2,
        );
      }
    }
    if (phase === "pace" || phase === "bounce") {
      meter = (Math.sin(phaseTime * (phase === "pace" ? 3.4 : 4.2)) + 1) / 2;
      const y = phase === "pace" ? 174 : 215;
      text(
        ctx,
        phase === "pace" ? "SET YOUR PACE" : "SET THE BOUNCE",
        400,
        130,
        15,
        C.ink,
        "center",
      );
      rr(ctx, 260, y, 280, 11, 6, "#d6dcc9");
      rr(ctx, 260, y, 280 * meter, 11, 6, C.green);
      circle(ctx, 260 + 280 * meter, y + 5, 9, C.ink);
      text(ctx, phase === "pace" ? "SLOW" : "LOW", 260, y + 33, 10, C.muted);
      text(
        ctx,
        phase === "pace" ? "FAST" : "HIGH",
        540,
        y + 33,
        10,
        C.muted,
        "right",
      );
    }
    if (phase === "ready")
      text(
        ctx,
        "Watch the bounce. Time your swing.",
        400,
        155,
        21,
        C.ink,
        "center",
      );
    if (phase === "delivery" && batting) {
      ctx.globalAlpha = 0.15;
      rr(ctx, 134, 255, 25, 94, 5, C.green);
      ctx.globalAlpha = 1;
    }
    if (delivery && ["windup", "delivery"].includes(phase))
      text(
        ctx,
        delivery.style || "YOUR DELIVERY",
        400,
        78,
        15,
        C.green,
        "center",
      );
    g.effects(dt);
    text(
      ctx,
      batting ? "ONE TAP. ONE SHOT." : "YOUR PACE. YOUR BOUNCE.",
      400,
      413,
      10,
      C.muted,
      "center",
    );
  }
  updateHud();
  s.message("Watch the run-up, then tap or press Space to swing.");
  g.wrap.focus({ preventScroll: true });
}
