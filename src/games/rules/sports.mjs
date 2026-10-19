const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export function keeperStep(keeper, target, dt, speed = 530) {
  const dx = target.x - keeper.x,
    dy = target.y - keeper.y,
    distance = Math.hypot(dx, dy);
  const travel = Math.min(distance, speed * dt);
  return {
    x: clamp(keeper.x + (distance ? (dx / distance) * travel : 0), 175, 625),
    y: clamp(keeper.y + (distance ? (dy / distance) * travel : 0), 125, 285),
  };
}
export function footballOutcome(shot, keeper) {
  const inside = shot.x > 166 && shot.x < 634 && shot.y > 110 && shot.y < 312;
  const saved =
    inside &&
    ((shot.x - keeper.x) / 64) ** 2 + ((shot.y - keeper.y) / 57) ** 2 < 1;
  return { inside, saved, goal: inside && !saved };
}
export function basketballPower(hoop, startX = 190) {
  return clamp(
    0.4 + (hoop.x - startX) / 1300 + (195 - hoop.y) / 650,
    0.43,
    0.83,
  );
}
export function basketballLaunch(power, hoop, start = { x: 190, y: 242 }) {
  const error = power - basketballPower(hoop, start.x),
    flight = 1.08;
  return {
    x: start.x,
    y: start.y,
    vx: (hoop.x - start.x) / flight + error * 340,
    vy: (hoop.y - start.y - 350 * flight * flight) / flight - error * 180,
  };
}
export function basketballStep(ball, dt, hoop) {
  if (ball.settled) {
    ball.x += ball.vx * dt;
    ball.vx *= Math.exp(-dt * 3);
    return { scored: false, floor: false };
  }
  const old = { x: ball.x, y: ball.y };
  ball.vy += 700 * dt;
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;
  let scored = false,
    floor = false;
  if (!ball.scored && ball.vy > 0 && old.y <= hoop.y && ball.y > hoop.y) {
    const f = (hoop.y - old.y) / (ball.y - old.y),
      x = old.x + (ball.x - old.x) * f;
    if (Math.abs(x - hoop.x) < 21) {
      ball.scored = true;
      scored = true;
      ball.vx *= 0.3;
    }
  }
  if (!ball.scored) {
    for (const rx of [hoop.x - 32, hoop.x + 32]) {
      const dx = ball.x - rx,
        dy = ball.y - hoop.y,
        d = Math.hypot(dx, dy);
      if (d > 0 && d < 15) {
        const nx = dx / d,
          ny = dy / d,
          dot = ball.vx * nx + ball.vy * ny;
        ball.x = rx + nx * 15;
        ball.y = hoop.y + ny * 15;
        if (dot < 0) {
          ball.vx -= 1.65 * dot * nx;
          ball.vy -= 1.65 * dot * ny;
          ball.rim = true;
        }
      }
    }
    const boardX = hoop.x + 51;
    if (
      old.x < boardX - 13 &&
      ball.x >= boardX - 13 &&
      ball.y > hoop.y - 76 &&
      ball.y < hoop.y + 17
    ) {
      ball.x = boardX - 13;
      ball.vx = -Math.abs(ball.vx) * 0.65;
      ball.rim = true;
    }
  }
  if (ball.y >= 363 && ball.vy > 0) {
    ball.y = 363;
    ball.vy = -ball.vy * 0.53;
    ball.vx *= 0.72;
    ball.bounces = (ball.bounces || 0) + 1;
    if (Math.abs(ball.vy) < 55) {
      ball.vy = 0;
      ball.settled = true;
    }
    floor = true;
  }
  if (ball.x < 14) {
    ball.x = 14;
    ball.vx = Math.abs(ball.vx) * 0.5;
  }
  if (ball.x > 786) {
    ball.x = 786;
    ball.vx = -Math.abs(ball.vx) * 0.5;
  }
  return { scored, floor };
}

export function footballKick(
  power,
  aim,
  kick = 1,
  wind = 0,
  rng = Math.random,
) {
  power = clamp(power, 0, 1);
  return {
    x: aim.x + wind + (rng() * 2 - 1) * (8 + Math.max(0, power - 0.82) * 120),
    y: aim.y + (rng() * 2 - 1) * (6 + Math.max(0, power - 0.82) * 100),
    duration: 1.12 - power * 0.55,
    reaction: 0.28,
    speed: 430 + Math.min(10, kick) * 5,
  };
}
