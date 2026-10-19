import {
  canvasGame,
  colors as C,
  rr,
  line,
  circle,
  text,
  clamp,
} from "../runtime.js";
const names = [
  "A friendly first step",
  "Don’t get too comfortable",
  "A moving target",
  "A little patience",
  "Look before you leap",
  "The floor has opinions",
  "Almost trustworthy",
  "One last little jump",
];
export function mount(s) {
  const g = canvasGame(s, { portraitWidth: 480 }),
    { ctx } = g,
    hud = s.hud({
      room: "ROOM",
      deaths: "ATTEMPTS",
      time: "TIME",
      best: "ROOMS CLEARED",
    });
  let room = 0,
    deaths = 0,
    ended = false,
    respawn = 0,
    transition = 0,
    player = { x: 46, y: 356, vx: 0, vy: 0 },
    platforms = [],
    ground = -1,
    coyote = 0,
    buffer = 0,
    time = 0;
  function reset() {
    player = { x: 46, y: 356, vx: 0, vy: 0 };
    ground = -1;
    coyote = 0;
    buffer = 0;
    const layouts = [
      [
        [165, 321, 110],
        [335, 253, 115],
        [510, 190, 110],
      ],
      [
        [185, 320, 100],
        [360, 250, 100],
        [525, 186, 100],
      ],
      [
        [150, 316, 125],
        [335, 249, 105],
        [520, 185, 100],
      ],
      [
        [205, 323, 100],
        [370, 253, 110],
        [545, 188, 100],
      ],
      [
        [165, 315, 100],
        [345, 249, 100],
        [515, 187, 110],
      ],
      [
        [180, 323, 125],
        [380, 251, 100],
        [550, 186, 95],
      ],
      [
        [150, 315, 110],
        [340, 245, 100],
        [520, 183, 100],
      ],
      [
        [195, 322, 105],
        [370, 251, 95],
        [540, 185, 95],
      ],
    ];
    platforms = [
      ...layouts[Math.min(room, 7)].map(([base, y, w]) => ({ base, y, w })),
      { base: 681, y: 130, w: 110 },
    ].map((p, i) => ({
      ...p,
      x: p.base,
      old: p.base,
      crumble: 0,
      fallen: false,
      moving: room >= 2 && i === 2,
    }));
    s.message(`Room ${room + 1}: ${names[room]}. Reach the little flag.`);
  }
  function jump() {
    buffer = 0.13;
  }
  g.key((key, repeat) => {
    if ([" ", "ArrowUp", "w"].includes(key) && !repeat) jump();
  });
  g.tap(jump);
  g.controls(
    g.control("← Left", "ArrowLeft", { hold: true }),
    g.control("Jump · Space", " "),
    g.control("Right →", "ArrowRight", { hold: true }),
  );
  function die() {
    if (respawn || ended) return;
    deaths++;
    respawn = 0.45;
    g.burst(player.x + 12, player.y + 18, C.red, 15);
    s.tone(150, 0.1);
    s.message("That was educational. Same room, fresh attempt.");
  }
  function advance() {
    if (transition || ended) return;
    room++;
    s.best(room, "rooms");
    if (room === 8) {
      ended = true;
      s.result(
        "You trusted the right jumps.",
        `All eight rooms · ${deaths + 1} attempts · ${Math.floor(time)} seconds`,
        g.wrap,
        true,
      );
    } else {
      transition = 0.4;
      g.burst(730, 80, C.butter, 25);
      s.tone(780, 0.12);
    }
  }
  function step(dt, t) {
    if (ended) return;
    time += dt;
    if (respawn > 0) {
      respawn -= dt;
      if (respawn <= 0) reset();
      return;
    }
    if (transition > 0) {
      transition -= dt;
      if (transition <= 0) reset();
      return;
    }
    buffer = Math.max(0, buffer - dt);
    coyote = Math.max(0, coyote - dt);
    for (const p of platforms) {
      p.old = p.x;
      p.x = p.base + (p.moving ? Math.sin(t * 1.2) * 28 : 0);
      if (p.crumble > 0) {
        p.crumble += dt;
        if (p.crumble > 0.65) p.fallen = true;
      }
    }
    if (ground >= 0 && platforms[ground] && !platforms[ground].fallen)
      player.x += platforms[ground].x - platforms[ground].old;
    const movement =
      (g.keys.has("arrowright") || g.keys.has("d") ? 1 : 0) -
      (g.keys.has("arrowleft") || g.keys.has("a") ? 1 : 0);
    player.vx += clamp(movement * 235 - player.vx, -dt * 2100, dt * 2100);
    if (buffer > 0 && coyote > 0) {
      player.vy = -455;
      ground = -1;
      coyote = 0;
      buffer = 0;
      s.tone(380, 0.045, "triangle", 0.014);
    }
    const oldBottom = player.y + 34;
    player.x = clamp(player.x + player.vx * dt, 0, 776);
    player.vy += 1180 * dt;
    player.y += player.vy * dt;
    ground = -1;
    const surfaces = [{ x: 0, y: 392, w: 800, fallen: false }, ...platforms];
    for (let i = 0; i < surfaces.length; i++) {
      const p = surfaces[i];
      if (
        !p.fallen &&
        player.vy >= 0 &&
        oldBottom <= p.y + 1 &&
        player.y + 34 >= p.y &&
        player.x + 23 > p.x &&
        player.x < p.x + p.w
      ) {
        player.y = p.y - 34;
        player.vy = 0;
        ground = i - 1;
        coyote = 0.085;
        if (room >= 1 && i === 2 && !p.crumble) p.crumble = 0.001;
      }
    }
    // Marked floor spikes and a predictable patrolling orb are the only lethal geometry.
    if (player.y + 34 > 375 && player.x + 22 > 310 && player.x < 640) die();
    if (room >= 3) {
      const sx = 420 + Math.sin(t * (room >= 6 ? 1.8 : 1.25)) * 90,
        sy = room >= 5 ? 240 : 292;
      if (Math.hypot(player.x + 12 - sx, player.y + 17 - sy) < 25) die();
    }
    if (player.y > 460) die();
    if (player.x > 713 && player.y + 34 <= 135) advance();
  }
  s.frame((dt, t) => {
    for (let d = dt; d > 0; d -= 1 / 120) step(Math.min(d, 1 / 120), t);
    g.camera(player.x - 130);
    g.clear("#eee8f1");
    circle(ctx, 660, 80, 39, "#e0d4e9");
    text(
      ctx,
      `${String(Math.min(room + 1, 8)).padStart(2, "0")} / ${names[Math.min(room, 7)]}`,
      Math.max(35, player.x - 95),
      35,
      13,
      "#7d698b",
    );
    rr(ctx, 0, 392, 800, 58, 0, "#c7baa9");
    line(
      ctx,
      [
        [0, 392],
        [800, 392],
      ],
      C.ink,
      3,
    );
    for (const [i, p] of platforms.entries()) {
      if (p.fallen) continue;
      const shaky = p.crumble && !s.reduced ? Math.sin(t * 65) * 2 : 0;
      rr(
        ctx,
        p.x + shaky,
        p.y,
        p.w,
        14,
        4,
        i === 1 && room >= 1 ? C.peach : C.lavender,
      );
      line(
        ctx,
        [
          [p.x + 8, p.y + 3],
          [p.x + p.w - 8, p.y + 3],
        ],
        C.ink,
        2,
      );
      if (i === 1 && room >= 1)
        text(ctx, "!", p.x + p.w / 2, p.y + 30, 14, "#886548", "center");
    }
    for (let x = 310; x < 640; x += 22) {
      ctx.beginPath();
      ctx.moveTo(x, 391);
      ctx.lineTo(x + 11, 372);
      ctx.lineTo(x + 22, 391);
      ctx.fillStyle = C.red;
      ctx.fill();
    }
    if (room >= 3) {
      const x = 420 + Math.sin(t * (room >= 6 ? 1.8 : 1.25)) * 90,
        y = room >= 5 ? 240 : 292;
      circle(ctx, x, y, 17, C.red);
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4 + t * 3;
        line(
          ctx,
          [
            [x + Math.cos(a) * 16, y + Math.sin(a) * 16],
            [x + Math.cos(a) * 23, y + Math.sin(a) * 23],
          ],
          C.red,
          4,
        );
      }
    }
    line(
      ctx,
      [
        [750, 130],
        [750, 72],
      ],
      C.ink,
      3,
    );
    ctx.beginPath();
    ctx.moveTo(750, 72);
    ctx.lineTo(785, 84 + Math.sin(t * 3) * 3);
    ctx.lineTo(750, 98);
    ctx.fillStyle = C.green;
    ctx.fill();
    if (!respawn && !ended) {
      ctx.save();
      ctx.translate(player.x + 12, player.y + 17);
      const squash = ground >= 0 ? 1 : 1.03;
      ctx.scale(1 / squash, squash);
      rr(ctx, -12, -17, 24, 34, 7, C.ink);
      circle(ctx, -4, -7, 2.5, C.paper);
      circle(ctx, 5, -7, 2.5, C.paper);
      const gait =
        ground >= 0
          ? Math.sin(t * 20) * Math.min(4, Math.abs(player.vx) / 50)
          : 1;
      line(
        ctx,
        [
          [-6, 17],
          [-6 + gait, 22],
        ],
        C.ink,
        3,
      );
      line(
        ctx,
        [
          [6, 17],
          [6 - gait, 22],
        ],
        C.ink,
        3,
      );
      ctx.restore();
    }
    g.effects(dt);
    hud({
      room: `${Math.min(room + 1, 8)} / 8`,
      deaths: deaths + 1,
      time: `${Math.floor(time)}s`,
      best: `${s.best(undefined, "rooms")} / 8`,
    });
  });
  reset();
}
