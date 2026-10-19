import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { gzipSync } from "node:zlib";
import { parse } from "acorn";
import { games } from "../src/games/catalog.mjs";
const dist = path.resolve("dist"),
  failures = [],
  cache = new Map();
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
}
function check(value, message) {
  if (!value) failures.push(message);
}
function resolveAsset(spec, base) {
  if (!spec || /^(https?:|data:)/.test(spec)) return null;
  const clean = spec.split(/[?#]/)[0];
  return clean.startsWith("/")
    ? path.join(dist, clean)
    : path.resolve(path.dirname(base), clean);
}
function imports(file) {
  if (cache.has(file)) return cache.get(file);
  const info = { static: [], dynamic: [] };
  cache.set(file, info);
  if (!file.endsWith(".js") || !fs.existsSync(file)) return info;
  const source = fs.readFileSync(file, "utf8"),
    ast = parse(source, { ecmaVersion: "latest", sourceType: "module" });
  function walk(node) {
    if (!node || typeof node !== "object") return;
    if (
      node.type === "ImportDeclaration" ||
      node.type === "ExportNamedDeclaration" ||
      node.type === "ExportAllDeclaration"
    ) {
      if (node.source?.value)
        info.static.push(resolveAsset(node.source.value, file));
    }
    if (node.type === "ImportExpression" && node.source?.value)
      info.dynamic.push(resolveAsset(node.source.value, file));
    if (
      node.type === "NewExpression" &&
      node.callee?.name === "URL" &&
      typeof node.arguments?.[0]?.value === "string" &&
      node.arguments[0].value.endsWith(".js")
    )
      info.dynamic.push(resolveAsset(node.arguments[0].value, file));
    for (const [key, value] of Object.entries(node)) {
      if (key === "start" || key === "end") continue;
      if (Array.isArray(value)) value.forEach(walk);
      else if (value && typeof value === "object") walk(value);
    }
  }
  walk(ast);
  info.static = info.static.filter(Boolean);
  info.dynamic = info.dynamic.filter(Boolean);
  return info;
}
function graph(roots, dynamic = false) {
  const seen = new Set(),
    queue = [...roots];
  while (queue.length) {
    const file = queue.pop();
    if (!file || seen.has(file) || !fs.existsSync(file)) continue;
    seen.add(file);
    const deps = imports(file);
    queue.push(...deps.static, ...(dynamic ? deps.dynamic : []));
  }
  return seen;
}
function resources(html, file) {
  const scripts = [],
    styles = [],
    preloads = [];
  for (const tag of html.matchAll(/<(script|link)\b([^>]*?)>/g)) {
    const attrs = Object.fromEntries(
      [...tag[2].matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]),
    );
    if (tag[1] === "script" && attrs.src)
      scripts.push(resolveAsset(attrs.src, file));
    if (attrs.rel === "stylesheet" && attrs.href)
      styles.push(resolveAsset(attrs.href, file));
    if (attrs.rel === "modulepreload" && attrs.href)
      preloads.push(resolveAsset(attrs.href, file));
  }
  return { scripts, styles, preloads };
}
const all = files(dist),
  htmlFiles = all.filter((f) => f.endsWith(".html")),
  launcher = all.find((f) => /GameLayout.*\.js$/.test(f));
check(launcher, "Missing production game launcher");
const launcherStatic = graph([launcher]),
  dynamicRoots = [...launcherStatic].flatMap((f) => imports(f).dynamic),
  privateChunks = graph(dynamicRoots, true);
for (const file of launcherStatic) privateChunks.delete(file);
check(
  privateChunks.size >= games.length,
  "Not all games were emitted as separate lazy chunks",
);
let nonGamePages = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8"),
    relative = path.relative(dist, file),
    isGame = relative.startsWith(`games${path.sep}`),
    r = resources(html, file);
  if (!isGame) {
    nonGamePages++;
    const reachable = graph([...r.scripts, ...r.preloads], true);
    for (const asset of reachable)
      check(
        !privateChunks.has(asset),
        `${relative} can load game engine ${path.basename(asset)}`,
      );
    for (const css of r.styles) {
      if (!fs.existsSync(css) && css.includes(`${path.sep}pagefind${path.sep}`))
        continue;
      check(
        !fs.readFileSync(css, "utf8").includes(".arcade"),
        `${relative} loads arcade-only CSS`,
      );
    }
    check(!html.includes("/games/art/"), `${relative} loads game artwork`);
  }
  if (isGame) {
    const initial = graph([...r.scripts, ...r.preloads]);
    for (const asset of initial)
      check(
        !privateChunks.has(asset),
        `${relative} eagerly loads game engine ${path.basename(asset)}`,
      );
  }
}
const hubPath = path.join(dist, "games/index.html"),
  hub = fs.readFileSync(hubPath, "utf8");
check(
  !resources(hub, hubPath).scripts.includes(launcher),
  "Hub downloads the player launcher",
);
for (const game of games) {
  const file = path.join(dist, `games/${game.slug}/index.html`);
  check(fs.existsSync(file), `Missing ${game.slug} route`);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, "utf8");
  const canonical = html.match(
    /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/,
  )?.[1];
  check(
    canonical === `https://dailycoder.in/games/${game.slug}/`,
    `${game.slug} canonical missing or incorrect`,
  );
  check(
    html.includes(`How to play ${game.name.replace(/&/g, "&amp;")}`) ||
      html.includes(`How to play ${game.name}`),
    `${game.slug} has no server-rendered instructions`,
  );
  const schemas = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => JSON.parse(m[1]));
  check(
    schemas.some((j) =>
      j["@graph"]?.some(
        (n) => n["@type"] === "VideoGame" && n.name === game.name,
      ),
    ),
    `${game.slug} has no VideoGame schema`,
  );
  check(
    html.includes(`/games/art/${game.slug}-share.png`),
    `${game.slug} social image missing`,
  );
  check(
    hub.includes(`/games/${game.slug}`),
    `${game.slug} missing from server-rendered hub`,
  );
}
const baselineIndex = process.argv.indexOf("--baseline");
if (baselineIndex >= 0) {
  const baseline = JSON.parse(
    fs.readFileSync(process.argv[baselineIndex + 1], "utf8"),
  );
  for (const [file, hash] of Object.entries(baseline))
    check(
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(file))
        .digest("hex") === hash,
      `Unrelated baseline source changed: ${file}`,
    );
}
const initialBytes = [...launcherStatic].reduce(
  (n, f) => n + gzipSync(fs.readFileSync(f)).length,
  0,
);
check(
  initialBytes < 12000,
  `Initial game launcher exceeds 12 KB gzip (${initialBytes})`,
);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(
  JSON.stringify(
    {
      gamePages: games.length,
      nonGamePagesChecked: nonGamePages,
      lazyGameChunks: privateChunks.size,
      playerInitialJavaScriptGzipBytes: initialBytes,
      hubHasNoPlayerLauncher: true,
      nonGamePagesHaveNoGameCodeOrStyles: true,
    },
    null,
    2,
  ),
);
