import { el, button, random, clamp } from "../runtime.js";
export function mount(s) {
  const hud = s.hud({
      time: "SECONDS LEFT",
      score: "SCORE",
      streak: "STREAK",
      accuracy: "ACCURACY",
    }),
    gallery = el("div", {
      class: "arc-gallery",
      role: "group",
      "aria-label": "Moving target gallery",
    });
  s.mount.append(gallery);
  let left = 30,
    score = 0,
    hits = 0,
    shots = 0,
    streak = 0,
    bestStreak = 0,
    ended = false,
    targets = [],
    serial = 0;
  const update = () =>
    hud({
      time: Math.ceil(left),
      score,
      streak,
      accuracy: shots ? `${Math.round((hits / shots) * 100)}%` : "—",
    });
  function spawn() {
    if (ended) return;
    const id = ++serial,
      t = {
        x: random(12, 88),
        y: random(18, 82),
        phase: random(0, 6),
        size: random(46, 72),
        age: 0,
        life: random(1.9, 2.6) - Math.min(score / 3000, 0.6),
        node: null,
        id,
      };
    const bounds = gallery.getBoundingClientRect();
    for (
      let attempt = 0;
      attempt < 30 &&
      targets.some(
        (other) =>
          Math.hypot(
            ((other.x - t.x) * bounds.width) / 100,
            ((other.y - t.y) * bounds.height) / 100,
          ) < 85,
      );
      attempt++
    ) {
      t.x = random(12, 88);
      t.y = random(18, 82);
    }
    const node = button("", (e) => hit(t, e), {
      class: "arc-target",
      "aria-label": `Hit target ${id}`,
    });
    node.style.width = `${t.size}px`;
    node.style.height = `${t.size}px`;
    node.append(el("span", { "aria-hidden": "true" }));
    t.node = node;
    targets.push(t);
    gallery.append(node);
  }
  function hit(t, e) {
    if (ended || s.paused || !targets.includes(t)) return;
    e.stopPropagation();
    shots++;
    hits++;
    streak++;
    bestStreak = Math.max(bestStreak, streak);
    const r = t.node.getBoundingClientRect(),
      keyboard = e.detail === 0,
      dist = keyboard
        ? 0
        : Math.hypot(
            e.clientX - r.left - r.width / 2,
            e.clientY - r.top - r.height / 2,
          ),
      base = dist < t.size * 0.17 ? 30 : dist < t.size * 0.34 ? 20 : 10,
      multiplier = 1 + Math.min(3, Math.floor(streak / 5));
    score += base * multiplier;
    const pop = el("span", {
      class: "arc-target-points",
      text: `+${base * multiplier}`,
    });
    pop.style.left = t.node.style.left;
    pop.style.top = t.node.style.top;
    gallery.append(pop);
    s.defer(() => pop.remove(), 0.6);
    s.tone(550 + Math.min(streak, 12) * 35, 0.05);
    remove(t);
    s.defer(spawn, 0.15);
    update();
  }
  function remove(t) {
    targets = targets.filter((v) => v !== t);
    t.node.remove();
  }
  s.on(gallery, "click", (e) => {
    if (ended || s.paused || e.target.closest("button")) return;
    shots++;
    streak = 0;
    s.tone(130, 0.05);
    update();
  });
  function end() {
    ended = true;
    s.best(score);
    targets.forEach((t) => t.node.remove());
    targets = [];
    s.result(
      "A moment of focus.",
      `${score} points · ${shots ? Math.round((hits / shots) * 100) : 0}% accuracy · Best streak ${bestStreak} · Best score ${s.best()}`,
      gallery,
      true,
    );
  }
  s.frame((dt, t) => {
    if (ended) return;
    left = Math.max(0, left - dt);
    for (const target of [...targets]) {
      target.age += dt;
      target.node.style.left = `${target.x + Math.sin(t * 1.6 + target.phase) * 4}%`;
      target.node.style.top = `${target.y + Math.cos(t * 1.2 + target.phase) * 3}%`;
      target.node.style.setProperty(
        "--life",
        String(1 - target.age / target.life),
      );
      if (target.age > target.life) {
        remove(target);
        streak = 0;
        spawn();
      }
    }
    if (left === 0) end();
    update();
  });
  spawn();
  spawn();
  spawn();
  update();
  s.message(
    "Hit the centre for more points. Tab and Enter work on every target.",
  );
}
