import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { games } from "../src/games/catalog.mjs";
import {
  battingOutcome,
  deliveryPoint,
  overs,
} from "../src/games/rules/cricket.mjs";
import {
  generateArrows,
  solveArrows,
  arrowBlocked,
} from "../src/games/rules/arrows.mjs";
import {
  generateSudoku,
  countSudokuSolutions,
  validSudoku,
} from "../src/games/rules/sudoku.mjs";
import { mergeMove, mergeCanMove } from "../src/games/rules/merge.mjs";
import {
  farkleScore,
  hasFarkleScore,
  yatzyScore,
  yatzyTotal,
} from "../src/games/rules/dice.mjs";
import {
  fromFen,
  chessMoves,
  applyChess,
  chessStatus,
  squareIndex,
  perft,
} from "../src/games/rules/chess.mjs";
import {
  ludoCanMove,
  ludoMove,
  ludoPosition,
  ludoPath,
} from "../src/games/rules/ludo.mjs";
import {
  dealSolitaire,
  solitaireCanMove,
  solitaireMove,
  solitaireDraw,
} from "../src/games/rules/solitaire.mjs";
import {
  legalTrickCards,
  trickWinner,
  scoreHearts,
  scoreSpades,
  heartsPoints,
} from "../src/games/rules/tricks.mjs";

test("catalogue preserves all fourteen legacy URLs and has a player, art, and unique metadata for every game", () => {
  const legacy = [
    "snake",
    "tetris",
    "sudoku",
    "chess",
    "ludo",
    "math-puzzles",
    "dino-runner",
    "car-dodge",
    "cricket",
    "solitaire",
    "hearts",
    "spades",
    "farkle",
    "yatzy",
  ];
  for (const slug of legacy)
    assert.ok(
      games.some((g) => g.slug === slug),
      slug,
    );
  assert.equal(new Set(games.map((g) => g.slug)).size, games.length);
  assert.equal(new Set(games.map((g) => g.description)).size, games.length);
  for (const game of games) {
    assert.ok(fs.existsSync(`src/games/players/${game.slug}.js`), game.slug);
    assert.ok(fs.existsSync(`public/games/art/${game.slug}.svg`));
    assert.ok(fs.existsSync(`public/games/art/${game.slug}-share.png`));
    assert.equal(game.rules.length, 3);
  }
});
test("cricket timing rewards skill, cannot score a miss, and ball flight has a continuous bounce", () => {
  assert.equal(battingOutcome(0).runs, 6);
  assert.equal(battingOutcome(0.06).runs, 4);
  assert.equal(battingOutcome(0.11).runs, 2);
  assert.equal(battingOutcome(0.18).runs, 1);
  assert.equal(battingOutcome(0.3).wicket, true);
  assert.equal(battingOutcome(-0.3).wicket, true);
  assert.ok(
    Math.abs(deliveryPoint(0.64 - 1e-6).y - deliveryPoint(0.64 + 1e-6).y) <
      0.01,
  );
  assert.equal(overs(8), "1.2");
  assert.ok(deliveryPoint(0.9).x < deliveryPoint(0.5).x);
});
test("all 150 arrow levels are nonoverlapping, solvable, and deterministic", () => {
  for (let level = 1; level <= 150; level++) {
    const { size, arrows } = generateArrows(level),
      cells = arrows.flatMap((a) => a.cells.map((p) => p.join(",")));
    assert.ok(arrows.length > 3);
    assert.equal(new Set(cells).size, cells.length);
    const order = solveArrows(arrows, size);
    assert.equal(order.length, arrows.length);
    assert.deepEqual(generateArrows(level), { size, arrows });
  }
  const a = {
      id: 1,
      cells: [
        [0, 0],
        [1, 0],
      ],
      direction: [1, 0],
    },
    b = {
      id: 2,
      cells: [
        [3, 0],
        [3, 1],
      ],
      direction: [0, 1],
    };
  assert.equal(arrowBlocked(a, [a, b], 5), true);
  assert.equal(arrowBlocked(a, [a], 5), false);
});
test("Sudoku gives each of thirty puzzles exactly one solution", () => {
  for (const difficulty of ["easy", "medium", "hard"])
    for (let seed = 1; seed <= 10; seed++) {
      const g = generateSudoku(difficulty, seed);
      assert.ok(validSudoku(g.solution));
      assert.equal(countSudokuSolutions(g.board), 1);
      assert.ok(g.board.every((v, i) => !v || v === g.solution[i]));
    }
});
test("2048 merges once per tile, never merges through a different value, and detects stuck boards", () => {
  const board = Array(16).fill(0);
  board.splice(0, 4, 2, 2, 2, 2);
  const left = mergeMove(board, "left");
  assert.deepEqual(left.board.slice(0, 4), [4, 4, 0, 0]);
  assert.equal(left.score, 8);
  assert.deepEqual(
    mergeMove(left.board, "right").board.slice(0, 4),
    [0, 0, 0, 8],
  );
  assert.equal(
    mergeMove([2, 4, 2, 0, ...Array(12).fill(0)], "left").changed,
    false,
  );
  assert.equal(
    mergeCanMove([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2]),
    false,
  );
});
test("Farkle validates every selected die and scores advertised combinations exactly once", () => {
  assert.deepEqual(farkleScore([1]), { score: 100, valid: true });
  assert.equal(farkleScore([1, 2]).valid, false);
  assert.equal(farkleScore([1, 2, 3, 4, 5, 6]).score, 1500);
  assert.equal(farkleScore([2, 2, 3, 3, 6, 6]).score, 1500);
  assert.equal(farkleScore([2, 2, 2, 2]).score, 400);
  assert.equal(farkleScore([1, 1, 1]).score, 1000);
  assert.equal(farkleScore([1, 1, 1, 1, 1, 1]).score, 8000);
  assert.equal(hasFarkleScore([2, 3, 4, 6]), false);
  assert.equal(hasFarkleScore([2, 2, 3, 3, 6, 6]), true);
  assert.equal(hasFarkleScore([2, 2, 2]), true);
  const turn = 0 + farkleScore([1]).score;
  assert.equal(turn, 100);
});
test("Yatzy handles duplicate straight dice, full houses, and upper bonus", () => {
  assert.equal(yatzyScore([1, 2, 3, 4, 4], 9), 30);
  assert.equal(yatzyScore([1, 2, 3, 4, 4], 10), 0);
  assert.equal(yatzyScore([2, 2, 5, 5, 5], 8), 25);
  assert.equal(yatzyScore([2, 2, 2, 2, 2], 11), 50);
  assert.equal(yatzyScore([0, 0, 0, 0, 0], 12), 0);
  assert.deepEqual(yatzyTotal([3, 6, 9, 12, 15, 18, ...Array(7).fill(0)]), {
    upper: 63,
    upperBonus: 35,
    total: 98,
  });
});
test("chess legal move trees match published reference counts including castling and en passant positions", () => {
  assert.equal(perft(fromFen(), 1), 20);
  assert.equal(perft(fromFen(), 2), 400);
  assert.equal(perft(fromFen(), 3), 8902);
  assert.equal(
    perft(
      fromFen(
        "r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1",
      ),
      2,
    ),
    2039,
  );
  assert.equal(
    perft(fromFen("8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1"), 3),
    2812,
  );
});
test("chess disallows castling through pawn attacks and updates rights when a rook is captured", () => {
  const state = fromFen("4k3/8/8/8/8/8/4p3/4K2R w K - 0 1");
  assert.ok(!chessMoves(state).some((m) => m.castle));
  const rook = fromFen("r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1"),
    move = chessMoves(rook, 56).find((m) => m.to === 0),
    next = applyChess(rook, move);
  assert.ok(!next.castle.includes("q"));
  assert.ok(!next.castle.includes("Q"));
});
test("chess promotion, en passant self-check, checkmate, repetition, and fifty-move draws", () => {
  assert.equal(
    chessMoves(fromFen("4k3/P7/8/8/8/8/8/4K3 w - - 0 1"), 8).filter(
      (m) => m.to === 0,
    ).length,
    4,
  );
  assert.ok(
    !chessMoves(fromFen("8/8/8/8/k2pP2R/8/8/4K3 b - e3 0 1")).some((m) => m.ep),
  );
  let state = fromFen();
  for (const [from, to] of [
    ["f2", "f3"],
    ["e7", "e5"],
    ["g2", "g4"],
    ["d8", "h4"],
  ]) {
    const move = chessMoves(state, squareIndex(from)).find(
      (m) => m.to === squareIndex(to),
    );
    state = applyChess(state, move);
  }
  assert.match(chessStatus(state).label, /Checkmate/);
  assert.match(
    chessStatus(fromFen("4k3/8/8/8/8/8/8/R3K3 w - - 100 60")).label,
    /fifty/,
  );
  state = fromFen();
  for (let repeat = 0; repeat < 2; repeat++)
    for (const [from, to] of [
      ["g1", "f3"],
      ["g8", "f6"],
      ["f3", "g1"],
      ["f6", "g8"],
    ])
      state = applyChess(
        state,
        chessMoves(state, squareIndex(from)).find(
          (m) => m.to === squareIndex(to),
        ),
      );
  assert.match(chessStatus(state).label, /threefold/);
});
test("Ludo requires six to enter, exact home rolls, safe squares, captures, and a full winner", () => {
  assert.equal(ludoPath.length, 52);
  assert.equal(ludoCanMove(-1, 5), false);
  assert.equal(ludoCanMove(-1, 6), true);
  assert.equal(ludoCanMove(55, 2), false);
  assert.equal(ludoCanMove(55, 1), true);
  let players = Array.from({ length: 4 }, () => Array(4).fill(-1));
  players[0][0] = 3;
  players[1][0] = 43;
  let result = ludoMove(players, 0, 0, 1);
  assert.equal(result.players[1][0], -1);
  players[0] = [56, 56, 56, 55];
  result = ludoMove(players, 0, 3, 1);
  assert.equal(result.won, true);
  assert.deepEqual(ludoPosition(0, 0, 0), [6, 1]);
});
test("Solitaire deals 52 unique cards with only exposed tableau cards face up, and can recycle", () => {
  let state = dealSolitaire(Array.from({ length: 52 }, (_, i) => i));
  assert.equal(state.stock.length, 24);
  assert.deepEqual(
    state.tableau.map((p) => p.length),
    [1, 2, 3, 4, 5, 6, 7],
  );
  for (const p of state.tableau) {
    assert.ok(p.at(-1).up);
    assert.ok(p.slice(0, -1).every((c) => !c.up));
  }
  for (let i = 0; i < 24; i++) state = solitaireDraw(state);
  assert.equal(state.waste.length, 24);
  state = solitaireDraw(state);
  assert.equal(state.stock.length, 24);
  assert.ok(state.stock.every((c) => !c.up));
});
test("Solitaire rejects partial/same-colour/invalid sequences and reveals an uncovered card", () => {
  const state = {
    stock: [],
    waste: [{ id: 0, up: true }],
    foundations: [[], [], [], []],
    tableau: [
      [
        { id: 15, up: false },
        { id: 12, up: true },
      ],
      [],
      [],
      [],
      [],
      [],
      [],
    ],
    moves: 0,
  };
  assert.ok(
    solitaireCanMove(
      state,
      { type: "waste", pile: 0 },
      { type: "foundation", pile: 0 },
    ),
  );
  assert.equal(
    solitaireCanMove(
      state,
      { type: "tableau", pile: 0, index: 0 },
      { type: "tableau", pile: 1 },
    ),
    false,
  );
  const moved = solitaireMove(
    state,
    { type: "tableau", pile: 0, index: 1 },
    { type: "tableau", pile: 1 },
  );
  assert.ok(moved.tableau[0][0].up);
  assert.equal(state.tableau[0][0].up, false);
});
test("Hearts follows suit, leads Two of Clubs, restricts first-trick penalties, and scores shooting the moon", () => {
  assert.deepEqual(
    legalTrickCards([40, 11, 13, 4], [], { game: "hearts", first: true }),
    [40],
  );
  assert.deepEqual(
    legalTrickCards([13, 11, 29], [{ player: 1, card: 40 }], {
      game: "hearts",
      first: true,
    }),
    [29],
  );
  assert.deepEqual(
    legalTrickCards([13, 15, 29], [{ player: 1, card: 14 }], {
      game: "hearts",
    }),
    [13, 15],
  );
  assert.deepEqual(scoreHearts([0, 26, 0, 0]), [26, 0, 26, 26]);
  assert.equal(
    Array.from({ length: 52 }, (_, i) => heartsPoints(i)).reduce(
      (a, b) => a + b,
      0,
    ),
    26,
  );
});
test("Spades trump, unbroken leads, partnerships, nil scoring, and bag penalties", () => {
  assert.equal(
    trickWinner(
      [
        { player: 0, card: 25 },
        { player: 1, card: 1 },
      ],
      true,
    ),
    1,
  );
  assert.deepEqual(
    legalTrickCards([1, 2, 14], [], { game: "spades", broken: false }),
    [14],
  );
  let score = scoreSpades([3, 2, 2, 3], [3, 2, 3, 5]);
  assert.deepEqual(score.scores, [51, 52]);
  assert.deepEqual(score.bags, [1, 2]);
  score = scoreSpades([0, 3, 4, 3], [0, 3, 5, 5], [0, 0], [9, 0]);
  assert.equal(score.scores[0], 141 - 100);
  assert.equal(score.bags[0], 0);
  score = scoreSpades([0, 3, 4, 3], [1, 3, 3, 6]);
  assert.equal(score.scores[0], -140);
});

test("every lazy player module parses before it is offered in the catalogue", async () => {
  const { parse } = await import("acorn");
  for (const file of fs.readdirSync("src/games/players"))
    parse(fs.readFileSync(`src/games/players/${file}`, "utf8"), {
      ecmaVersion: "latest",
      sourceType: "module",
    });
  for (const file of [
    "runtime.js",
    "launch.js",
    "road.js",
    "trick-table.js",
    "chess.worker.js",
    "expanded.js",
    "preferences.js",
    "shell.js",
  ])
    parse(fs.readFileSync(`src/games/${file}`, "utf8"), {
      ecmaVersion: "latest",
      sourceType: "module",
    });
});

test("one lifecycle clock freezes delays while paused and cancels all scheduled work on destruction", async () => {
  const { createSession } = await import("../src/games/runtime.js");
  const saved = new Map();
  for (const key of [
    "window",
    "document",
    "matchMedia",
    "requestAnimationFrame",
    "cancelAnimationFrame",
  ])
    saved.set(key, globalThis[key]);
  const windowTarget = new EventTarget(),
    documentTarget = new EventTarget(),
    mount = new EventTarget(),
    announcement = { textContent: "" };
  let serial = 0;
  const queue = new Map();
  globalThis.window = windowTarget;
  globalThis.document = documentTarget;
  globalThis.matchMedia = () => ({ matches: false });
  globalThis.requestAnimationFrame = (fn) => {
    queue.set(++serial, fn);
    return serial;
  };
  globalThis.cancelAnimationFrame = (id) => queue.delete(id);
  const drive = (time) => {
    const entries = [...queue];
    queue.clear();
    entries.forEach(([, fn]) => fn(time));
  };
  try {
    const root = Object.assign(new EventTarget(), {
      dataset: { slug: "clock-test" },
      querySelector: (selector) =>
        selector === "[data-game-mount]" ? mount : announcement,
    });
    let cleanup = 0,
      frames = 0,
      fired = 0;
    const pauses = [];
    const session = createSession(root, {
      muted: true,
      onPause() {},
      restart() {},
    });
    session.onPause((value) => pauses.push(value));
    session.frame(() => frames++);
    session.cleanup(() => cleanup++);
    session.defer(() => fired++, 0.1);
    drive(100);
    drive(150);
    assert.equal(fired, 0);
    session.setPaused(true);
    drive(200);
    drive(250);
    assert.equal(fired, 0);
    assert.equal(frames, 2);
    session.setPaused(false);
    drive(300);
    assert.equal(fired, 1);
    assert.deepEqual(pauses, [true, false]);
    session.defer(() => fired++, 0);
    session.destroy();
    assert.equal(cleanup, 1);
    assert.equal(queue.size, 0);
    drive(350);
    assert.equal(fired, 1);
    session.destroy();
    assert.equal(cleanup, 1);
  } finally {
    for (const [key, value] of saved)
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
  }
});

// Regression coverage for the mobile/gameplay polish pass.
test("Cricket mixes readable delivery types and tighter timing as difficulty increases", async () => {
  const { makeDelivery } = await import("../src/games/rules/cricket.mjs");
  const { seeded } = await import("../src/games/rules/arrows.mjs");
  const rng = seeded(125),
    deliveries = Array.from({ length: 200 }, () =>
      makeDelivery(rng, "regular", 12),
    );
  assert.equal(new Set(deliveries.map((d) => d.style)).size, 4);
  assert.ok(
    Math.max(...deliveries.map((d) => d.duration)) -
      Math.min(...deliveries.map((d) => d.duration)) >
      0.6,
  );
  assert.ok(
    deliveries.every(
      (d) => d.bounceAt > 0.4 && d.bounceAt < 0.85 && d.duration > 0.7,
    ),
  );
  assert.ok(
    makeDelivery(() => 0.5, "fast", 0).duration <
      makeDelivery(() => 0.5, "regular", 0).duration,
  );
  assert.ok(
    makeDelivery(() => 0.5, "regular", 30).duration <
      makeDelivery(() => 0.5, "regular", 0).duration,
  );
  assert.equal(battingOutcome(0.13, 0.105).wicket, true);
  assert.equal(battingOutcome(0.01, 0.105).runs, 6);
});
test("Football keeper saves high shots in two dimensions and cannot teleport to a distant corner", async () => {
  const { keeperStep, footballOutcome } =
    await import("../src/games/rules/sports.mjs");
  let keeper = { x: 400, y: 235 },
    target = { x: 600, y: 135 };
  for (let i = 0; i < 100; i++) keeper = keeperStep(keeper, target, 1 / 120);
  assert.equal(footballOutcome(target, keeper).saved, true);
  assert.equal(footballOutcome(target, { x: 400, y: 235 }).goal, true);
  const next = keeperStep({ x: 400, y: 235 }, target, 1 / 120);
  assert.ok(Math.hypot(next.x - 400, next.y - 235) <= 530 / 120 + 0.0001);
  assert.equal(footballOutcome({ x: 640, y: 130 }, keeper).inside, false);
});
test("Basketball scores once on descent, misses with bad power, reaches the floor and settles", async () => {
  const { basketballPower, basketballLaunch, basketballStep } =
    await import("../src/games/rules/sports.mjs");
  const cases = [
    { hoop: { x: 620, y: 195 }, start: { x: 190, y: 242 } },
    { hoop: { x: 350, y: 160 }, start: { x: 90, y: 242 } },
  ];
  for (const { hoop, start } of cases) {
    for (const error of [0, -0.4, 0.35]) {
      const ball = basketballLaunch(
        basketballPower(hoop, start.x) + error,
        hoop,
        start,
      );
      let baskets = 0,
        floors = 0,
        maxY = 0;
      for (let i = 0; i < 1400; i++) {
        const result = basketballStep(ball, 1 / 180, hoop);
        baskets += Number(result.scored);
        floors += Number(result.floor);
        maxY = Math.max(maxY, ball.y);
      }
      assert.equal(baskets, error === 0 ? 1 : 0);
      assert.ok(floors >= 1);
      assert.equal(maxY, 363);
      assert.equal(ball.settled, true);
      assert.ok(Number.isFinite(ball.x));
    }
  }
  assert.notEqual(
    basketballPower({ x: 300, y: 130 }, 90),
    basketballPower({ x: 390, y: 220 }, 90),
  );
});
test("Arrow puzzles start with a substantial board and remain solvable", () => {
  for (let level = 1; level <= 20; level++) {
    const board = generateArrows(level);
    assert.ok(board.arrows.length >= 18, `level ${level}`);
    assert.ok(solveArrows(board.arrows, board.size));
  }
});
test("Favorites toggle persistently and recover from invalid or unavailable storage", async () => {
  const { favorites, toggleFavorite } =
    await import("../src/games/preferences.js");
  let value = null;
  const storage = {
    getItem: () => value,
    setItem: (_key, next) => {
      value = next;
    },
  };
  assert.equal(toggleFavorite("cricket", storage).has("cricket"), true);
  assert.equal(favorites(storage).has("cricket"), true);
  toggleFavorite("chess", storage);
  toggleFavorite("cricket", storage);
  assert.deepEqual([...favorites(storage)], ["chess"]);
  value = "invalid";
  assert.equal(favorites(storage).size, 0);
  value = '{"bad":1}';
  assert.equal(favorites(storage).size, 0);
  const denied = {
    getItem() {
      throw Error("denied");
    },
    setItem() {
      throw Error("denied");
    },
  };
  assert.equal(favorites(denied).size, 0);
  assert.equal(toggleFavorite("cricket", denied).has("cricket"), true);
});
test("Touch movement normalizes keys, repeats intentionally and clears on pause", async () => {
  const { canvasGame } = await import("../src/games/runtime.js");
  const keys = ["document", "window", "Node", "devicePixelRatio", "matchMedia"],
    saved = new Map(keys.map((k) => [k, globalThis[k]]));
  class FakeNode extends EventTarget {
    constructor(tag) {
      super();
      this.tagName = tag;
      this.children = [];
      this.attrs = {};
      this.style = { setProperty() {} };
    }
    setAttribute(k, v) {
      this.attrs[k] = v;
    }
    removeAttribute(k) {
      delete this.attrs[k];
    }
    append(...nodes) {
      this.children.push(...nodes);
    }
    getContext() {
      return { setTransform() {} };
    }
    getBoundingClientRect() {
      return { left: 0, top: 0, width: 320, height: 300 };
    }
    setPointerCapture() {}
    focus() {}
  }
  try {
    globalThis.Node = FakeNode;
    globalThis.document = Object.assign(new EventTarget(), {
      createElement: (tag) => new FakeNode(tag),
    });
    globalThis.window = new EventTarget();
    globalThis.devicePixelRatio = 1;
    globalThis.matchMedia = () => ({ matches: true });
    const frame = [],
      pauses = [],
      session = {
        root: { dataset: { title: "test" } },
        mount: new FakeNode("div"),
        time: 0,
        paused: false,
        on: (node, event, fn) => node.addEventListener(event, fn),
        frame: (fn) => frame.push(fn),
        onPause: (fn) => pauses.push(fn),
      };
    const game = canvasGame(session, { portraitWidth: 480 });
    let moves = 0;
    game.key(() => moves++);
    const control = game.control("Left", "ArrowLeft", { repeat: true });
    control.dispatchEvent(new Event("pointerdown", { cancelable: true }));
    assert.equal(game.keys.has("arrowleft"), true);
    assert.equal(moves, 1);
    session.time = 0.3;
    frame.forEach((fn) => fn());
    assert.equal(moves, 2);
    control.dispatchEvent(new Event("pointerup"));
    assert.equal(game.keys.has("arrowleft"), false);
    session.time = 0.6;
    frame.forEach((fn) => fn());
    assert.equal(moves, 2);
    control.dispatchEvent(new Event("pointerdown", { cancelable: true }));
    pauses.forEach((fn) => fn(true));
    assert.equal(game.keys.size, 0);
    assert.equal(control.attrs["data-held"], undefined);
  } finally {
    for (const [key, value] of saved)
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
  }
});

test("Football balances high saves with achievable strong corner shots", async () => {
  const { footballKick, keeperStep, footballOutcome } =
    await import("../src/games/rules/sports.mjs");
  const { seeded } = await import("../src/games/rules/arrows.mjs");
  function rate(aim, power) {
    const rng = seeded(716);
    let goals = 0,
      misses = 0;
    for (let n = 0; n < 1000; n++) {
      const shot = footballKick(
        power,
        aim,
        (n % 10) + 1,
        (rng() * 2 - 1) * 22,
        rng,
      );
      let keeper = { x: 400, y: 235 };
      for (let time = 0; time < shot.duration; time += 1 / 120)
        if (time > shot.reaction)
          keeper = keeperStep(keeper, aim, 1 / 120, shot.speed);
      const result = footballOutcome(shot, keeper);
      goals += +result.goal;
      misses += +!result.inside;
    }
    return { goals: goals / 1000, misses: misses / 1000 };
  }
  const strong = rate({ x: 600, y: 145 }, 1),
    weak = rate({ x: 600, y: 145 }, 0.5),
    highMiddle = rate({ x: 400, y: 130 }, 1);
  assert.ok(strong.goals > 0.6 && strong.goals < 0.95, JSON.stringify(strong));
  assert.ok(strong.misses < 0.15);
  assert.ok(weak.goals < 0.1);
  assert.ok(highMiddle.goals < 0.1);
});

test("Expanded player focuses Resume while paused and Escape exits without resuming", async () => {
  const { expandedPlayer } = await import("../src/games/expanded.js");
  const saved = new Map(
    ["document", "window", "matchMedia"].map((key) => [key, globalThis[key]]),
  );
  class Control extends EventTarget {
    constructor() {
      super();
      this.attrs = {};
    }
    setAttribute(k, v) {
      this.attrs[k] = v;
    }
    removeAttribute(k) {
      delete this.attrs[k];
    }
    toggleAttribute(k, value) {
      if (value) this.attrs[k] = "";
      else delete this.attrs[k];
    }
    focus() {
      globalThis.document.activeElement = this;
    }
    getClientRects() {
      return [{}];
    }
    closest() {
      return null;
    }
  }
  try {
    const machine = new Control(),
      trigger = new Control(),
      close = new Control(),
      resume = new Control(),
      playfield = new Control();
    const documentTarget = Object.assign(new EventTarget(), {
      body: { classList: { toggle() {} } },
      activeElement: trigger,
    });
    globalThis.document = documentTarget;
    globalThis.window = Object.assign(new EventTarget(), {
      scrollY: 80,
      scrollTo() {},
    });
    globalThis.matchMedia = () => ({ matches: true });
    machine.querySelector = (selector) =>
      selector.includes("data-resume") ? resume : playfield;
    machine.querySelectorAll = () => [trigger, close, resume];
    machine.contains = (node) =>
      [trigger, close, resume, playfield].includes(node);
    const root = {
      querySelector: (selector) =>
        ({
          ".arc-machine": machine,
          "[data-fullscreen]": trigger,
          "[data-fullscreen-close]": close,
        })[selector],
    };
    const player = expandedPlayer(root);
    trigger.dispatchEvent(new Event("click"));
    assert.equal(player.active, true);
    assert.equal(documentTarget.activeElement, resume);
    assert.equal(machine.attrs["aria-modal"], "true");
    const escape = new Event("keydown", { cancelable: true });
    Object.defineProperty(escape, "key", { value: "Escape" });
    documentTarget.dispatchEvent(escape);
    assert.equal(player.active, false);
    assert.equal(documentTarget.activeElement, trigger);
    assert.equal(machine.attrs["aria-modal"], undefined);
    trigger.dispatchEvent(new Event("click"));
    close.dispatchEvent(new Event("click"));
    assert.equal(player.active, false);
  } finally {
    for (const [key, value] of saved)
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
  }
});

test("Runner high birds hit a standing dinosaur but clear a ducking one", async () => {
  const { runnerHit } = await import("../src/games/rules/runner.mjs");
  const bird = { x: 120, y: 225, w: 40, h: 23 },
    cactus = { x: 120, y: 277, w: 25, h: 48 };
  assert.equal(runnerHit(277, false, bird), true);
  assert.equal(runnerHit(277, true, bird), false);
  assert.equal(runnerHit(277, false, cactus), true);
  assert.equal(runnerHit(277, true, cactus), true);
  assert.equal(runnerHit(200, false, cactus), false);
  assert.equal(runnerHit(277, false, { ...bird, x: 250 }), false);
});
