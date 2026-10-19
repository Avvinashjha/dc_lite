export const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
export const lerp = (a, b, t) => a + (b - a) * t;
export const random = (min, max) => min + Math.random() * (max - min);
export const pick = (items) => items[Math.floor(Math.random() * items.length)];
export const shuffle = (items) => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
export const store = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(`dc_arcade_${key}`);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`dc_arcade_${key}`, JSON.stringify(value));
    } catch {}
  },
};
export const el = (tag, attrs = {}, children = []) => {
  const node = document.createElement(tag);
  for (const [key, val] of Object.entries(attrs)) {
    if (key === "text") node.textContent = val;
    else if (key === "class") node.className = val;
    else if (key === "html") node.innerHTML = val;
    else if (key.startsWith("on"))
      node.addEventListener(key.slice(2).toLowerCase(), val);
    else if (val !== false && val !== null) node.setAttribute(key, String(val));
  }
  for (const child of Array.isArray(children) ? children : [children])
    if (child !== null && child !== undefined)
      node.append(child instanceof Node ? child : String(child));
  return node;
};
export const button = (label, fn, attrs = {}) =>
  el("button", {
    type: "button",
    class: "arc-button",
    text: label,
    ...attrs,
    onClick: fn,
  });
export const colors = {
  ink: "#293f33",
  muted: "#788572",
  paper: "#fffdf3",
  cream: "#f3efdf",
  sage: "#b5c7a1",
  green: "#52734d",
  peach: "#d4a682",
  red: "#b85b65",
  butter: "#dfc478",
  sky: "#9db9c8",
  lavender: "#b8a9cc",
  dark: "#192c25",
};
export function rr(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}
export function line(ctx, points, color = colors.ink, width = 3) {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
}
export function circle(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, Math.max(0.1, r), 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}
export function text(
  ctx,
  value,
  x,
  y,
  size = 18,
  color = colors.ink,
  align = "left",
) {
  ctx.font = `600 ${size}px "Avenir Next",sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "middle";
  ctx.fillText(String(value), x, y);
}
export function person(ctx, x, y, scale = 1, pose = 0, color = colors.ink) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  circle(ctx, 0, -81, 11, color);
  line(
    ctx,
    [
      [0, -66],
      [-4, -28],
    ],
    color,
    13,
  );
  line(
    ctx,
    [
      [-3, -29],
      [-17 + Math.sin(pose) * 7, 0],
    ],
    color,
    7,
  );
  line(
    ctx,
    [
      [-3, -29],
      [16 - Math.sin(pose) * 7, 0],
    ],
    color,
    7,
  );
  line(
    ctx,
    [
      [0, -57],
      [18, -43],
      [28, -53],
    ],
    color,
    7,
  );
  ctx.restore();
}
export function makeDice(value, selected, click, label) {
  const pips =
    {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8],
    }[value] || [];
  const die = button("", click, {
    "aria-label": label || `${value || "Unrolled"}${selected ? ", held" : ""}`,
    "aria-pressed": String(selected),
  });
  for (let i = 0; i < 9; i++)
    die.append(
      pips.includes(i) ? el("i", { "aria-hidden": "true" }) : el("span"),
    );
  return die;
}

/** One abortable lifecycle and one animation clock per selected game. */
export function createSession(root, host) {
  const mount = root.querySelector("[data-game-mount]"),
    abort = new AbortController(),
    frames = new Set(),
    cleanups = new Set(),
    tasks = new Set(),
    pauseListeners = new Set();
  const slug = root.dataset.slug;
  let dead = false,
    paused = false,
    last = 0,
    raf = 0,
    elapsed = 0,
    muted = host.muted,
    audio = null;
  const announceNode = root.querySelector("[data-announcement]");
  function tick(now) {
    if (dead) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
    last = now;
    if (!paused) {
      elapsed += dt;
      for (const task of [...tasks])
        if (elapsed >= task.at) {
          tasks.delete(task);
          task.fn();
        }
      for (const fn of frames) fn(dt, elapsed);
    }
    raf = requestAnimationFrame(tick);
  }
  const api = {
    root,
    mount,
    slug,
    signal: abort.signal,
    reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
    get paused() {
      return paused;
    },
    get time() {
      return elapsed;
    },
    get dead() {
      return dead;
    },
    on(target, event, fn, opts = {}) {
      target.addEventListener(event, fn, { ...opts, signal: abort.signal });
    },
    frame(fn) {
      frames.add(fn);
      return () => frames.delete(fn);
    },
    defer(fn, seconds = 0.3) {
      const task = { fn, at: elapsed + seconds };
      tasks.add(task);
      return () => tasks.delete(task);
    },
    cleanup(fn) {
      cleanups.add(fn);
    },
    onPause(fn) {
      pauseListeners.add(fn);
      return () => pauseListeners.delete(fn);
    },
    setPaused(value) {
      if (dead) return;
      paused = value;
      for (const fn of pauseListeners) fn(value);
      host.onPause(value);
      if (paused) audio?.suspend().catch(() => {});
      else if (!muted) audio?.resume().catch(() => {});
    },
    setMuted(value) {
      muted = value;
      if (muted) audio?.suspend().catch(() => {});
      else api.audioUnlock();
    },
    audioUnlock() {
      if (muted || dead) return;
      try {
        audio ||= new (window.AudioContext || window.webkitAudioContext)();
        audio.resume().catch(() => {});
      } catch {}
    },
    tone(freq = 440, duration = 0.08, type = "sine", volume = 0.035) {
      if (muted || !audio || paused || dead) return;
      try {
        const osc = audio.createOscillator(),
          gain = audio.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audio.currentTime);
        gain.gain.setValueAtTime(volume, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          audio.currentTime + duration,
        );
        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start();
        osc.stop(audio.currentTime + duration);
      } catch {}
    },
    announce(message) {
      announceNode.textContent = message;
    },
    message(message) {
      let area = mount.querySelector("[data-message]");
      if (!area) {
        area = el("p", { class: "arc-message", "data-message": "" });
        mount.append(area);
      }
      area.textContent = message;
    },
    best(value, mode = "main", lower = false) {
      const key = `best_${slug}_${mode}`,
        old = store.get(key, null);
      if (
        value !== undefined &&
        Number.isFinite(value) &&
        (old === null || (lower ? value < old : value > old))
      )
        store.set(key, value);
      return store.get(key, 0);
    },
    choice(name, items, initial) {
      const label = el("label", { text: name });
      const select = el("select", { "aria-label": name });
      let saved = store.get(`option_${slug}_${name}`, initial || items[0][0]);
      for (const [value, title] of items)
        select.append(el("option", { value, text: title }));
      select.value = items.some((i) => i[0] === saved) ? saved : items[0][0];
      label.append(select);
      api.on(select, "change", () => {
        store.set(`option_${slug}_${name}`, select.value);
        host.restart();
      });
      return { label, value: select.value, select };
    },
    hud(labels) {
      const row = el("div", { class: "arc-hud" }),
        values = {};
      for (const [key, label] of Object.entries(labels)) {
        const value = el("strong", { text: "0" });
        row.append(el("div", { text: label }, value));
        values[key] = value;
      }
      mount.prepend(row);
      return (fields) => {
        for (const [key, value] of Object.entries(fields))
          if (values[key] && values[key].textContent !== String(value))
            values[key].textContent = String(value);
      };
    },
    options(...labels) {
      const row = el("div", { class: "arc-options" }, labels);
      mount.prepend(row);
      return row;
    },
    actions(items) {
      const row = el("div", { class: "arc-actions" });
      for (const [label, fn, attrs] of items)
        row.append(button(label, fn, attrs));
      mount.append(row);
      return row;
    },
    result(title, detail, where = mount, overlay = false) {
      api.announce(`${title}. ${detail}`);
      api.tone(660, 0.16);
      api.defer(() => api.tone(880, 0.2), 0.12);
      const panel = el("div", { class: "arc-result" }, [
        el("span", { class: "arc-eyebrow", text: "A LITTLE WELL PLAYED" }),
        el("h3", { text: title }),
        el("p", { text: detail }),
        button("Play again ↗", () => host.restart(), {
          class: "arc-button arc-button--primary",
        }),
      ]);
      let box = panel;
      if (overlay) {
        box = el("div", { class: "arc-result-overlay" }, panel);
      }
      where.append(box);
      return box;
    },
    restart: host.restart,
    destroy() {
      if (dead) return;
      dead = true;
      cancelAnimationFrame(raf);
      abort.abort();
      frames.clear();
      tasks.clear();
      pauseListeners.clear();
      for (const fn of cleanups) fn();
      cleanups.clear();
      audio?.close().catch(() => {});
      audio = null;
    },
  };
  api.on(document, "visibilitychange", () => {
    if (document.hidden) api.setPaused(true);
  });
  api.on(window, "blur", () => api.setPaused(true));
  api.on(mount, "pointerdown", () => api.audioUnlock());
  api.on(mount, "keydown", () => api.audioUnlock());
  api.on(root, "keydown", (e) => {
    if (e.key === "Escape") {
      api.setPaused(!paused);
      e.preventDefault();
    }
  });
  api.audioUnlock();
  raf = requestAnimationFrame(tick);
  return api;
}

export function canvasGame(
  s,
  {
    width = 800,
    height = 450,
    background = colors.cream,
    portraitWidth = width,
    portraitRotate = false,
  } = {},
) {
  const wrap = el("div", {
      class: "arc-canvas-wrap",
      tabindex: "0",
      role: "group",
      "aria-label": "Game playfield",
    }),
    canvas = el("canvas", {
      width,
      height,
      "aria-label": `${s.root.dataset.title} playfield`,
    });
  const ctx = canvas.getContext("2d");
  canvas.style.setProperty("--canvas-ratio", String(width / height));
  wrap.append(canvas);
  s.mount.append(wrap);
  let viewWidth = width,
    viewHeight = height,
    viewX = 0,
    dpr = 1,
    rotated = false;
  const transform = () =>
    rotated
      ? ctx.setTransform(0, -dpr, dpr, 0, 0, width * dpr)
      : ctx.setTransform(dpr, 0, 0, dpr, -viewX * dpr, 0);
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    const portrait = matchMedia(
      "(max-width:600px) and (orientation:portrait)",
    ).matches;
    rotated = portrait && portraitRotate;
    viewWidth = rotated ? height : portrait ? portraitWidth : width;
    viewHeight = rotated ? width : height;
    viewX = clamp(viewX, 0, width - viewWidth);
    canvas.style.setProperty("--canvas-ratio", String(viewWidth / viewHeight));
    canvas.width = viewWidth * dpr;
    canvas.height = viewHeight * dpr;
    transform();
  };
  size();
  s.on(window, "resize", size);
  const keys = new Set();
  const down = [],
    up = [],
    points = [],
    releases = [],
    moves = [];
  let pointerHeld = false;
  const particles = [],
    floats = [];
  const pos = (e) => {
    const r = canvas.getBoundingClientRect();
    if (rotated)
      return {
        x: width - ((e.clientY - r.top) * width) / r.height,
        y: ((e.clientX - r.left) * height) / r.width,
      };
    return {
      x: viewX + ((e.clientX - r.left) * viewWidth) / r.width,
      y: ((e.clientY - r.top) * height) / r.height,
    };
  };
  s.on(wrap, "keydown", (e) => {
    const relevant = [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      " ",
      "a",
      "d",
      "w",
      "s",
      "c",
      "r",
      "Enter",
    ];
    if (relevant.includes(e.key)) {
      e.preventDefault();
      if (s.paused) return;
      keys.add(e.key.toLowerCase());
      for (const fn of down) fn(e.key, e.repeat);
    }
  });
  s.on(wrap, "keyup", (e) => {
    keys.delete(e.key.toLowerCase());
    for (const fn of up) fn(e.key);
  });
  s.on(wrap, "blur", () => {
    keys.clear();
    pointerHeld = false;
  });
  s.on(canvas, "pointerdown", (e) => {
    if (s.paused) return;
    wrap.focus({ preventScroll: true });
    canvas.setPointerCapture(e.pointerId);
    pointerHeld = true;
    for (const fn of points) fn(pos(e));
  });
  s.on(canvas, "pointerup", (e) => {
    pointerHeld = false;
    for (const fn of releases) fn(pos(e));
  });
  s.on(canvas, "pointercancel", () => {
    pointerHeld = false;
    keys.clear();
  });
  s.on(canvas, "pointermove", (e) => {
    if (!s.paused) for (const fn of moves) fn(pos(e));
  });
  s.on(document, "visibilitychange", () => {
    keys.clear();
    pointerHeld = false;
  });
  s.on(window, "blur", () => {
    keys.clear();
    pointerHeld = false;
  });
  s.onPause((value) => {
    if (value) {
      keys.clear();
      pointerHeld = false;
    }
  });
  const api = {
    canvas,
    wrap,
    ctx,
    width,
    height,
    get viewWidth() {
      return viewWidth;
    },
    get rotated() {
      return rotated;
    },
    camera(x = 0) {
      viewX = clamp(x, 0, width - viewWidth);
      transform();
    },
    get compact() {
      return canvas.getBoundingClientRect().width < 600;
    },
    keys,
    get held() {
      return pointerHeld;
    },
    key: (fn) => down.push(fn),
    keyUp: (fn) => up.push(fn),
    tap: (fn) => points.push(fn),
    release: (fn) => releases.push(fn),
    move: (fn) => moves.push(fn),
    clear(color = background) {
      ctx.fillStyle = color;
      ctx.fillRect(viewX, 0, rotated ? width : viewWidth, height);
    },
    burst(x, y, color = colors.butter, n = 15) {
      if (s.reduced) return;
      for (let i = 0; i < n; i++)
        particles.push({
          x,
          y,
          vx: random(-120, 120),
          vy: random(-160, 50),
          life: random(0.3, 0.7),
          color,
        });
    },
    float(label, x, y, color = colors.ink) {
      floats.push({ label, x, y, color, life: 1 });
    },
    effects(dt) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 260 * dt;
        ctx.globalAlpha = clamp(p.life * 2, 0, 1);
        circle(ctx, p.x, p.y, 3, p.color);
        if (p.life <= 0) particles.splice(i, 1);
      }
      for (let i = floats.length - 1; i >= 0; i--) {
        const f = floats[i];
        f.life -= dt;
        f.y -= dt * 30;
        ctx.globalAlpha = clamp(f.life * 2, 0, 1);
        text(ctx, f.label, f.x, f.y, 23, f.color, "center");
        if (f.life <= 0) floats.splice(i, 1);
      }
      ctx.globalAlpha = 1;
    },
    control(label, key, { hold = false, action = null, repeat = false } = {}) {
      const b = button(label, () => {}, { "aria-label": label });
      const normalized = key.toLowerCase();
      let pressed = false,
        repeatAt = 0;
      const press = () => {
        if (s.paused || pressed || b.disabled) return;
        pressed = true;
        repeatAt = s.time + 0.27;
        b.setAttribute("data-held", "");
        keys.add(normalized);
        action?.();
        if (!hold) for (const fn of down) fn(key, false);
      };
      s.on(b, "pointerdown", (e) => {
        if (s.paused) return;
        e.preventDefault();
        b.setPointerCapture(e.pointerId);
        press();
      });
      const release = () => {
        if (!pressed) return;
        pressed = false;
        b.removeAttribute("data-held");
        keys.delete(normalized);
        for (const fn of up) fn(key);
      };
      s.on(b, "pointerup", release);
      s.on(b, "pointercancel", release);
      s.on(b, "lostpointercapture", release);
      s.on(b, "blur", release);
      s.onPause((value) => {
        if (value) {
          pressed = false;
          keys.delete(normalized);
          b.removeAttribute("data-held");
        }
      });
      if (repeat)
        s.frame(() => {
          if (pressed && !s.paused && s.time >= repeatAt) {
            repeatAt = s.time + 0.075;
            for (const fn of down) fn(key, true);
          }
        });
      s.on(b, "keydown", (e) => {
        if ((e.key === " " || e.key === "Enter") && !e.repeat && !s.paused) {
          e.preventDefault();
          press();
        }
      });
      s.on(b, "keyup", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          release();
        }
      });
      return b;
    },
    controls(...items) {
      const row = el("div", { class: "arc-actions" }, items);
      s.mount.append(row);
      return row;
    },
  };
  return api;
}
