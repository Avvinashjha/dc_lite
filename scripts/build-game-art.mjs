import fs from "node:fs";
import { Resvg } from "@resvg/resvg-js";
import { games } from "../src/games/catalog.mjs";
const palette = {
  sage: ["#e3ecd9", "#426348"],
  butter: ["#f5eccd", "#79612d"],
  peach: ["#f3e0ce", "#976349"],
  sky: ["#e0eaf1", "#52758c"],
  lavender: ["#e9e4f3", "#7b6695"],
  rose: ["#f1dfe3", "#a36b7c"],
};
const ink = "#253a31",
  paper = "#fffdf5";
const rect = (x, y, w, h, fill, rx = 12, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
const circle = (x, y, r, fill, extra = "") =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const path = (d, color = ink, width = 8, fill = "none", extra = "") =>
  `<path d="${d}" stroke="${color}" stroke-width="${width}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const text = (x, y, t, size = 30, color = ink, extra = "") =>
  `<text x="${x}" y="${y}" font-family="sans-serif" font-size="${size}" font-weight="600" fill="${color}" ${extra}>${t}</text>`;
const person = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})">${circle(0, -115, 19, ink)}${path("M0 -88 L-7 -32 M-7 -32 L-30 12 M-7 -32 L22 12 M-1 -78 L30 -50 L50 -63", ink, 14)}</g>`;
function scene(g) {
  const [bg, accent] = palette[g.accent];
  let art = "";
  if (g.slug === "cricket")
    art =
      path("M100 550 H1100", ink, 4) +
      rect(120, 545, 960, 18, accent) +
      person(285, 532, 1.5) +
      person(980, 532, 1.25) +
      path("M365 475 L414 410", "#b88955", 21) +
      path("M217 545 V490 M231 545 V490 M245 545 V490", ink, 5) +
      path(
        "M815 341 Q685 227 536 337 T383 434",
        accent,
        4,
        "none",
        'stroke-dasharray="7 13"',
      ) +
      circle(535, 340, 13, "#b44f50") +
      circle(845, 280, 65, "none", `stroke="${accent}" stroke-width="1"`) +
      text(829, 297, "6", 50, accent);
  else if (g.slug === "archery")
    art =
      path("M224 205 Q421 353 224 530", ink, 14) +
      path("M224 205 L187 367 L224 530", ink, 4) +
      path("M179 367 H612", ink, 7) +
      path("M590 353 L617 367 L590 381", ink, 6) +
      path("M365 352 L384 367 L365 382", accent, 7) +
      path("M932 201 V540", ink, 10) +
      [105, 75, 43, 14]
        .map((r, i) =>
          circle(933, 369, r, [accent, paper, accent, "#b44f50"][i]),
        )
        .join("") +
      path("M911 545 L955 545", ink, 7);
  else if (g.slug === "helicopter")
    art =
      path(
        "M0 0 H1200 V200 L1020 160 L890 243 L700 140 L490 203 L300 150 L0 200 Z",
        accent,
        0,
        accent,
      ) +
      path(
        "M0 720 H1200 V590 L1000 550 L850 605 L680 563 L470 610 L220 548 L0 590 Z",
        accent,
        0,
        accent,
      ) +
      `<g transform="translate(460 363) rotate(-7)">${rect(-80, -45, 170, 85, ink, 35)}${rect(20, -32, 58, 51, bg, 24)}${path("M-79 -3 L-194 -24 L-188 17 L-80 20", ink, 13)}${path("M-12 -45 V-72 M-128 -76 H135", ink, 8)}${path("M-54 44 V63 M48 40 V63 M-80 63 H78", ink, 7)}</g>` +
      path("M112 360 H236 M156 396 H277 M91 420 H206", accent, 6);
  else if (["two-cars", "car-dodge"].includes(g.slug)) {
    art = rect(240, 0, 720, 720, ink, 0);
    for (let x = 260; x < 960; x += 170)
      for (let y = 0; y < 720; y += 100) art += rect(x, y, 4, 46, "#75877a", 0);
    art +=
      rect(272, 418, 100, 160, "#dbb889", 25) +
      rect(288, 446, 68, 38, ink, 10) +
      rect(614, 418, 100, 160, "#c7c0df", 25) +
      rect(630, 446, 68, 38, ink, 10) +
      rect(785, 170, 98, 155, "#9d6d70", 22) +
      circle(492, 225, 27, "#e1c56e") +
      circle(661, 100, 27, "#e1c56e");
  } else if (g.slug === "ping-pong")
    art =
      rect(155, 125, 890, 465, accent, 30) +
      rect(
        178,
        148,
        844,
        419,
        "none",
        8,
        `stroke="${paper}" stroke-width="4"`,
      ) +
      path("M600 150 V567", paper, 4, "none", 'stroke-dasharray="10 14"') +
      rect(215, 290, 20, 132, paper, 9) +
      rect(964, 208, 20, 132, paper, 9) +
      path("M460 405 L673 315", paper, 3, "none", 'stroke-dasharray="6 10"') +
      circle(700, 303, 16, paper);
  else if (["dino-runner", "trap-tower"].includes(g.slug)) {
    art =
      path("M50 560 H1150", ink, 5) +
      rect(410, 459, 185, 35, accent, 4) +
      rect(772, 365, 205, 35, accent, 4) +
      rect(1058, 260, 25, 300, ink, 1) +
      path("M1083 260 L1157 285 L1083 310", accent, 3, accent) +
      rect(240, 385, 65, 112, ink, 12) +
      rect(260, 355, 80, 55, ink, 10) +
      circle(318, 375, 5, paper) +
      path("M253 497 L235 544 M288 497 L311 544", ink, 12) +
      path("M625 558 L646 513 L667 558 L688 513 L710 558", accent, 5, accent);
  } else if (g.slug === "target-rush")
    art =
      [
        [340, 330, 125],
        [780, 232, 83],
        [820, 495, 104],
      ]
        .map(([x, y, r]) =>
          [r, r * 0.7, r * 0.4, r * 0.15]
            .map((rr, i) => circle(x, y, rr, i % 2 ? paper : accent))
            .join(""),
        )
        .join("") + path("M548 400 H640 M594 354 V446", ink, 5);
  else if (g.slug === "football") {
    art = path("M273 181 H927 V524 H273 Z", ink, 12);
    for (let x = 290; x < 925; x += 47)
      art += path(`M${x} 185 V520`, accent, 2);
    for (let y = 200; y < 525; y += 44)
      art += path(`M277 ${y} H923`, accent, 2);
    art +=
      person(630, 450, 1.5) +
      circle(447, 579, 46, paper, `stroke="${ink}" stroke-width="4"`) +
      path("M431 560 L457 560 L469 585 L445 601 L423 581 Z", ink, 2, ink) +
      path(
        "M492 543 Q550 443 818 277",
        ink,
        3,
        "none",
        'stroke-dasharray="7 13"',
      );
  } else if (g.slug === "basketball")
    art =
      path("M904 155 V562", ink, 10) +
      rect(790, 164, 126, 142, paper, 6, `stroke="${ink}" stroke-width="5"`) +
      rect(822, 211, 65, 62, "none", 2, `stroke="${accent}" stroke-width="4"`) +
      path("M779 284 H879", accent, 10) +
      path(
        "M786 290 L800 348 H855 L871 290 M801 290 L812 344 M822 290 V348 M847 290 L838 344",
        ink,
        3,
      ) +
      path(
        "M260 485 Q500 55 815 278",
        accent,
        4,
        "none",
        'stroke-dasharray="7 14"',
      ) +
      circle(295, 425, 47, "#c68f5a") +
      path(
        "M250 425 H340 M295 379 V471 M260 394 Q310 419 260 457 M329 394 Q281 423 329 457",
        ink,
        3,
      );
  else if (g.slug === "snake")
    art =
      path("M254 463 H404 V290 H620 V462 H796 V346", accent, 63) +
      circle(796, 326, 38, accent) +
      circle(783, 318, 6, paper) +
      circle(807, 318, 6, paper) +
      circle(945, 245, 26, "#b44f50") +
      path("M945 215 Q957 186 975 199", ink, 6) +
      circle(254, 463, 32, accent);
  else if (g.slug === "tetris") {
    art = rect(300, 76, 600, 590, ink, 18);
    let blocks = [
      [0, 7],
      [1, 7],
      [2, 7],
      [3, 7],
      [4, 7],
      [5, 7],
      [0, 6],
      [1, 6],
      [4, 6],
      [5, 6],
      [0, 5],
      [4, 5],
      [5, 5],
      [2, 1],
      [3, 1],
      [3, 2],
      [4, 2],
    ];
    art += blocks
      .map(([x, y], i) =>
        rect(
          320 + x * 92,
          92 + y * 70,
          84,
          62,
          ["#a5b990", "#d6b47b", "#b4a1ca", "#90b1bf"][i % 4],
          7,
        ),
      )
      .join("");
  } else if (
    ["sudoku", "2048", "math-puzzles", "arrow-escape"].includes(g.slug)
  ) {
    let size = g.slug === "sudoku" ? 9 : 4,
      w = g.slug === "sudoku" ? 53 : 120;
    art = rect(327, 92, 550, 550, paper, 18);
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        let x = 350 + c * w,
          y = 115 + r * w;
        if (g.slug === "arrow-escape") {
          art += path(
            `M${x + 15} ${y + 65} H${x + 75} V${y + 22} M${x + 63} ${y + 35} L${x + 75} ${y + 20} L${x + 87} ${y + 35}`,
            accent,
            7,
          );
        } else if (g.slug === "math-puzzles") {
          if (r < 2 && c < 3)
            art += text(
              x + 20,
              y + 65,
              ["12", "+", "8", "=", "20", "!"][r * 3 + c],
              46,
              accent,
            );
        } else {
          art += rect(
            x,
            y,
            w - 6,
            w - 6,
            g.slug === "2048" ? ((r + c) % 3 === 0 ? accent : bg) : bg,
            7,
          );
          if ((r + c) % 3 !== 0 || g.slug === "2048")
            art += text(
              x + w / 2 - 5,
              y + w / 2 + 12,
              g.slug === "2048"
                ? [2, 4, 8, 16, 32, 64, 128, 256][(r * 4 + c) % 8]
                : ((r * 3 + Math.floor(r / 3) + c) % 9) + 1,
              g.slug === "2048" ? 35 : 24,
              g.slug === "2048" && (r + c) % 3 === 0 ? paper : ink,
              'text-anchor="middle"',
            );
        }
      }
  } else if (g.slug === "chess") {
    for (let r = 0; r < 6; r++)
      for (let c = 0; c < 6; c++)
        art += rect(
          300 + c * 100,
          70 + r * 100,
          100,
          100,
          (r + c) % 2 ? accent : paper,
          0,
        );
    art += `<g transform="translate(530 259)">${path("M-57 194 H67 L54 172 H-42 Z", ink, 5, ink)}${path("M-41 168 L-16 110 L-47 95 L-24 48 L7 24 L1 2 L28 12 L58 65 L52 141 L59 166 Z", ink, 7, ink)}${circle(15, 53, 5, paper)}</g>`;
  } else if (g.slug === "ludo") {
    [
      [300, 115],
      [660, 115],
      [300, 405],
      [660, 405],
    ].forEach(([x, y], i) => {
      let co = ["#ab6970", "#7191ad", "#a3b77e", "#d1b363"][i];
      art +=
        rect(x, y, 240, 200, co, 16) +
        rect(x + 25, y + 25, 190, 150, paper, 12);
      [
        [65, 65],
        [170, 65],
        [65, 145],
        [170, 145],
      ].forEach(([a, b]) => (art += circle(x + a, y + b - 15, 24, co)));
    });
    art += path(
      "M590 95 V625 M280 357 H915",
      ink,
      5,
      "none",
      'stroke-dasharray="2 30"',
    );
  } else if (["farkle", "yatzy"].includes(g.slug)) {
    [
      [370, 198, -12],
      [600, 183, 7],
      [790, 342, 14],
      [470, 449, 9],
      [680, 514, -9],
    ].forEach(([x, y, a], i) => {
      art += `<g transform="translate(${x} ${y}) rotate(${a})">${rect(-73, -73, 146, 146, paper, 24, `stroke="${accent}" stroke-width="3"`)}${[
        [0, 0],
        [-35, -35],
        [35, 35],
        [-35, 35],
        [35, -35],
      ]
        .slice(0, i + 1)
        .map(([a, b]) => circle(a, b, 12, ink))
        .join("")}</g>`;
    });
  } else {
    ["A", "K", "Q"].forEach((rank, i) => {
      let suit =
        g.slug === "hearts"
          ? "♥"
          : g.slug === "spades"
            ? "♠"
            : ["♠", "♥", "♣"][i];
      let co = suit === "♥" ? "#aa616b" : ink;
      art += `<g transform="translate(${430 + i * 140} ${360 + i * 8}) rotate(${(i - 1) * 12})">${rect(-125, -178, 250, 356, paper, 20, `stroke="${accent}" stroke-width="3"`)}${text(-96, -118, rank, 44, co)}${text(0, 48, suit, 126, co, 'text-anchor="middle"')}${text(96, 148, rank, 44, co, 'text-anchor="end"')}</g>`;
    });
  }
  return { bg, art };
}
fs.mkdirSync("public/games/art", { recursive: true });
for (const g of games) {
  const { bg, art } = scene(g);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720"><rect width="1200" height="720" fill="${bg}"/><pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="${ink}" opacity=".08"/></pattern><rect width="1200" height="720" fill="url(#dots)"/>${art}</svg>`;
  fs.writeFileSync(`public/games/art/${g.slug}.svg`, svg);
  const share = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${bg}"/><g transform="translate(400 0) scale(.88)">${art}</g>${text(62, 85, "DAILYCODER / PLAY", 22)}${text(62, 285, g.name.replace(/&/g, "&amp;"), 49)}${text(64, 344, "A little play goes a long way.", 25)}${text(64, 560, "Free browser games · dailycoder.in", 22)}</svg>`;
  fs.writeFileSync(
    `public/games/art/${g.slug}-share.png`,
    new Resvg(share).render().asPng(),
  );
}
console.log(
  `Created original vector covers and social images for ${games.length} games.`,
);
