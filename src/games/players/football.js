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
import { keeperStep, footballOutcome, footballKick } from "../rules/sports.mjs";
export function mount(s) {
  const mode = s.choice(
      "Challenge",
      [
        ["score", "Ten kicks"],
        ["chase", "Score seven in ten"],
      ],
      "score",
    ),
    hud = s.hud({ goals: "GOALS", shots: "KICKS LEFT", best: "PERSONAL BEST" });
  s.options(mode.label);
  const g = canvasGame(s, { portraitWidth: 480 }),
    { ctx } = g;
  let goals = 0,
    kicks = 0,
    aim = { x: 580, y: 145 },
    shot = null,
    keeper = { x: 400, y: 235 },
    power = 0,
    charging = false,
    wind = random(-22, 22),
    ended = false,
    cooldown = 0,
    celebrate = 0;
  function start() {
    if (shot || ended || cooldown > 0 || s.paused) return;
    charging = true;
    power = 0;
  }
  s.onPause((value) => {
    if (value) charging = false;
  });
  function shoot() {
    if (!charging || shot || ended || cooldown > 0 || s.paused) return;
    charging = false;
    kicks++;
    shot = {
      t: 0,
      ...footballKick(power, aim, kicks, wind),
      keeperTarget: { ...aim },
      power,
      resolved: false,
    };
    s.tone(190, 0.07, "triangle");
    s.message("Your shot is on its way.");
  }
  g.tap((p) => {
    if (!shot && !ended)
      aim = {
        x: clamp((p.x * 800) / g.viewWidth, 110, 690),
        y: clamp(p.y, 65, 333),
      };
    start();
  });
  g.release(() => shoot());
  g.move((p) => {
    if (g.held && charging && !shot)
      aim = {
        x: clamp((p.x * 800) / g.viewWidth, 110, 690),
        y: clamp(p.y, 65, 333),
      };
  });
  g.key((key, repeat) => {
    if (key === " " && !repeat) start();
  });
  g.keyUp((key) => {
    if (key === " ") shoot();
  });
  g.controls(
    g.control("Hold & release to shoot", " ", { hold: true, action: start }),
  );
  s.frame((dt, t) => {
    if (!shot && !ended) {
      if (g.keys.has("arrowleft") || g.keys.has("a"))
        aim.x = clamp(aim.x - dt * 180, 110, 690);
      if (g.keys.has("arrowright") || g.keys.has("d"))
        aim.x = clamp(aim.x + dt * 180, 110, 690);
      if (g.keys.has("arrowup") || g.keys.has("w"))
        aim.y = clamp(aim.y - dt * 180, 65, 333);
      if (g.keys.has("arrowdown") || g.keys.has("s"))
        aim.y = clamp(aim.y + dt * 180, 65, 333);
    }
    if (charging) power = Math.min(1, power + dt * 0.82);
    cooldown = Math.max(0, cooldown - dt);
    celebrate = Math.max(0, celebrate - dt);
    if (shot && !ended) {
      shot.t += dt;
      if (shot.t > shot.reaction)
        keeper = keeperStep(keeper, shot.keeperTarget, dt, shot.speed);
      if (shot.t >= shot.duration && !shot.resolved) {
        shot.resolved = true;
        const { inside, saved: save } = footballOutcome(shot, keeper);
        shot.saved = save;
        if (inside && !save) {
          goals++;
          celebrate = 0.5;
          g.burst((shot.x * g.viewWidth) / 800, shot.y, C.butter, 24);
          g.float("GOAL!", g.viewWidth / 2, 57, C.green);
          s.message("Into the net. Beautiful placement.");
          s.tone(760, 0.14);
        } else {
          s.message(
            inside
              ? "Saved! Try a little closer to the corner."
              : "Just outside the frame. Bring your aim inside the posts.",
          );
          s.tone(140, 0.12);
        }
        if (kicks >= 10)
          s.defer(() => {
            ended = true;
            s.best(goals, mode.value);
            s.result(
              mode.value === "chase"
                ? goals >= 7
                  ? "Challenge complete!"
                  : "The goal is still there."
                : "Ten kicks, well taken.",
              `${goals} goals from 10 kicks · Best ${s.best(undefined, mode.value)}`,
              g.wrap,
              true,
            );
          }, 0.8);
      }
      if (shot && shot.t > shot.duration + 0.75) {
        shot = null;
        keeper = { x: 400, y: 235 };
        power = 0;
        wind = random(-22, 22);
        cooldown = 0.1;
      }
    }
    const X = (v) => (v * g.viewWidth) / 800;
    g.clear("#e6ecdb");
    rr(ctx, 0, 310, g.viewWidth, 140, 0, "#c7d7b6");
    ctx.strokeStyle = "#fffdf1";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(X(400), 450, X(280), 95, 0, Math.PI, 0);
    ctx.stroke();
    rr(ctx, X(150), 95, X(500), 230, 2, "#f0f1e5");
    for (let x = 165; x < 650; x += 27)
      line(
        ctx,
        [
          [X(x), 98],
          [X(x), 321],
        ],
        "#ced4bf",
        1,
      );
    for (let y = 110; y < 325; y += 25)
      line(
        ctx,
        [
          [X(153), y],
          [X(648), y],
        ],
        "#ced4bf",
        1,
      );
    rr(ctx, X(150), 95, X(500), 230, 2, null, C.ink);
    ctx.lineWidth = 7;
    line(
      ctx,
      [
        [X(150), 326],
        [X(150), 95],
        [X(650), 95],
        [X(650), 326],
      ],
      C.ink,
      7,
    );
    const dive =
      shot && shot.t > shot.reaction ? clamp((keeper.x - 400) / 180, -1, 1) : 0;
    person(
      ctx,
      X(keeper.x),
      keeper.y + 78,
      g.viewWidth < 800 ? 0.9 : 1.05,
      dive,
    );
    line(
      ctx,
      [
        [X(keeper.x), keeper.y + 18],
        [X(keeper.x - 40 - dive * 20), keeper.y + 1],
        [X(keeper.x - 50 - dive * 20), keeper.y - 22],
      ],
      C.ink,
      7,
    );
    line(
      ctx,
      [
        [X(keeper.x), keeper.y + 18],
        [X(keeper.x + 40 - dive * 20), keeper.y + 1],
        [X(keeper.x + 50 - dive * 20), keeper.y - 22],
      ],
      C.ink,
      7,
    );
    if (!shot && !ended) {
      ctx.strokeStyle = C.red;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(X(aim.x), aim.y, 11, 0, Math.PI * 2);
      ctx.stroke();
      line(
        ctx,
        [
          [X(aim.x - 17), aim.y],
          [X(aim.x + 17), aim.y],
        ],
        C.red,
        1,
      );
      line(
        ctx,
        [
          [X(aim.x), aim.y - 17],
          [X(aim.x), aim.y + 17],
        ],
        C.red,
        1,
      );
    }
    let bx = 400,
      by = 407,
      r = 15;
    if (shot) {
      const u = clamp(shot.t / shot.duration, 0, 1);
      bx = lerp(400, shot.x, u);
      by = lerp(407, shot.y, u) - Math.sin(u * Math.PI) * 58;
      r = lerp(15, 8, u);
      if (shot.resolved && shot.saved)
        by += Math.max(0, shot.t - shot.duration) * 80;
    }
    bx = X(bx);
    circle(ctx, bx, by, r, C.paper);
    circle(ctx, bx, by, r * 0.4, C.ink);
    text(
      ctx,
      `WIND ${wind < 0 ? "←" : "→"} ${Math.abs(Math.round(wind))} · HOLD FOR POWER`,
      g.viewWidth / 2,
      35,
      13,
      C.muted,
      "center",
    );
    rr(ctx, g.viewWidth / 2 - 110, 428, 220, 9, 5, "#c6d1b8");
    rr(
      ctx,
      g.viewWidth / 2 - 110,
      428,
      220 * power,
      9,
      5,
      power > 0.8 ? C.red : C.green,
    );
    g.effects(dt);
    hud({ goals, shots: 10 - kicks, best: s.best(undefined, mode.value) });
  });
  s.message(
    "Aim in the goal, hold to build power, then release. Strong shots beat the keeper but lose precision. Watch the wind.",
  );
}
