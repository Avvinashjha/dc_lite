import { el, button, random, pick } from "../runtime.js";
export function mount(s) {
  const difficulty = s.choice(
      "Difficulty",
      [
        ["easy", "Easy"],
        ["medium", "Medium"],
        ["hard", "Hard"],
      ],
      "easy",
    ),
    hud = s.hud({
      time: "SECONDS",
      score: "POINTS",
      streak: "STREAK",
      best: "PERSONAL BEST",
    });
  s.options(difficulty.label);
  const ui = el("div", { class: "arc-math arc-game-ui" }),
    question = el("div", { class: "arc-math-question", "aria-live": "polite" }),
    label = el("label", {
      class: "sr-only",
      for: "math-answer",
      text: "Your answer",
    }),
    input = el("input", {
      id: "math-answer",
      type: "text",
      inputmode: "none",
      autocomplete: "off",
      "aria-label": "Your answer",
      class: "arc-math-input",
      placeholder: "?",
    }),
    form = el("form", {}, [
      label,
      input,
      button("Submit answer ↗", () => {}, {
        type: "submit",
        class: "arc-button arc-button--primary",
      }),
    ]),
    feedback = el("p", { class: "arc-message", "aria-live": "polite" });
  ui.append(question, form, feedback);
  s.mount.append(ui);
  let answer = 0,
    score = 0,
    streak = 0,
    correct = 0,
    questions = 0,
    left = 60,
    ended = false,
    locked = false,
    serial = 0;
  function next() {
    serial++;
    const range = { easy: 20, medium: 35, hard: 80 }[difficulty.value],
      op = pick(
        difficulty.value === "hard"
          ? ["+", "−", "×", "÷"]
          : difficulty.value === "medium"
            ? ["+", "−", "×"]
            : ["+", "−"],
      );
    let a = Math.floor(random(1, range + 1)),
      b = Math.floor(random(1, range + 1));
    if (op === "−" && a < b) [a, b] = [b, a];
    if (op === "×") {
      a = Math.floor(random(2, difficulty.value === "hard" ? 20 : 13));
      b = Math.floor(random(2, 13));
    }
    if (op === "÷") {
      b = Math.floor(random(2, 13));
      a = b * Math.floor(random(2, 13));
    }
    answer =
      op === "+" ? a + b : op === "−" ? a - b : op === "×" ? a * b : a / b;
    question.textContent = `${a} ${op} ${b}`;
    question.classList.remove("arc-pop");
    void question.offsetWidth;
    question.classList.add("arc-pop");
    input.value = "";
    input.disabled = false;
    locked = false;
  }
  function submit(e) {
    e?.preventDefault();
    if (ended || locked || s.paused || !/^\d+$/.test(input.value.trim()))
      return;
    locked = true;
    input.disabled = true;
    questions++;
    const right = Number(input.value) === answer;
    if (right) {
      streak++;
      correct++;
      const points = 10 + Math.min(4, Math.floor(streak / 5)) * 5;
      score += points;
      feedback.textContent = `Correct. +${points}${streak > 1 ? ` · ${streak} in a row` : ""}`;
      feedback.dataset.correct = "true";
      s.tone(580 + Math.min(streak, 10) * 25, 0.07);
    } else {
      streak = 0;
      feedback.textContent = `The answer was ${answer}. Fresh question coming up.`;
      feedback.dataset.correct = "false";
      s.tone(150, 0.08);
    }
    const ticket = serial;
    s.defer(() => {
      if (ended || ticket !== serial) return;
      next();
      input.focus({ preventScroll: true });
    }, 0.22);
  }
  s.on(form, "submit", submit);
  const pad = el("div", { class: "arc-math-pad" });
  for (const value of [
    "7",
    "8",
    "9",
    "4",
    "5",
    "6",
    "1",
    "2",
    "3",
    "⌫",
    "0",
    "Enter",
  ])
    pad.append(
      button(value, () => {
        if (locked || ended || s.paused) return;
        if (value === "Enter") submit();
        else if (value === "⌫") input.value = input.value.slice(0, -1);
        else input.value += value;
      }),
    );
  ui.append(pad);
  s.frame((dt) => {
    if (ended) return;
    left = Math.max(0, left - dt);
    hud({
      time: Math.ceil(left),
      score,
      streak,
      best: s.best(undefined, difficulty.value),
    });
    if (left === 0) {
      ended = true;
      input.disabled = true;
      pad.querySelectorAll("button").forEach((b) => (b.disabled = true));
      s.best(score, difficulty.value);
      s.result(
        "A minute well spent.",
        `${score} points · ${correct}/${questions} correct · Best ${s.best(undefined, difficulty.value)}`,
        ui,
      );
    }
  });
  next();
  input.focus({ preventScroll: true });
  s.message("Sixty seconds. Accuracy first, then find your pace.");
}
