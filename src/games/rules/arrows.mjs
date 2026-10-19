export const seeded = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};
const dirs = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];
export function arrowBlocked(arrow, arrows, size) {
  const head = arrow.cells.at(-1),
    occupied = new Set(
      arrows
        .filter((a) => a.id !== arrow.id)
        .flatMap((a) => a.cells.map(([x, y]) => `${x},${y}`)),
    );
  let [x, y] = head;
  const [dx, dy] = arrow.direction;
  for (
    x += dx, y += dy;
    x >= 0 && y >= 0 && x < size && y < size;
    x += dx, y += dy
  )
    if (occupied.has(`${x},${y}`)) return true;
  return false;
}
export function generateArrows(level) {
  const size = Math.min(13, 9 + Math.floor((level - 1) / 2)),
    rng = seeded(level * 17117),
    occupied = new Set(),
    arrows = [];
  for (
    let attempt = 0;
    attempt < 3500 && occupied.size < size * size * 0.9;
    attempt++
  ) {
    const head = [Math.floor(rng() * size), Math.floor(rng() * size)],
      direction = dirs[Math.floor(rng() * 4)];
    if (occupied.has(head.join(","))) continue;
    let [x, y] = head,
      clear = true;
    for (
      x += direction[0], y += direction[1];
      x >= 0 && y >= 0 && x < size && y < size;
      x += direction[0], y += direction[1]
    )
      if (occupied.has(`${x},${y}`)) {
        clear = false;
        break;
      }
    if (!clear) continue;
    const cells = [head],
      used = new Set([head.join(",")]);
    let current = [head[0] - direction[0], head[1] - direction[1]];
    const length = 2 + Math.floor(rng() * Math.min(5, 3 + level / 3));
    for (let i = 1; i < length; i++) {
      if (
        current[0] < 0 ||
        current[1] < 0 ||
        current[0] >= size ||
        current[1] >= size ||
        occupied.has(current.join(",")) ||
        used.has(current.join(","))
      )
        break;
      // A body must never cross its own forward exit ray.
      if (
        (direction[0] &&
          current[1] === head[1] &&
          (current[0] - head[0]) * direction[0] > 0) ||
        (direction[1] &&
          current[0] === head[0] &&
          (current[1] - head[1]) * direction[1] > 0)
      )
        break;
      cells.unshift(current);
      used.add(current.join(","));
      const choices = dirs.filter(
        ([dx, dy]) => !used.has(`${current[0] + dx},${current[1] + dy}`),
      );
      if (!choices.length) break;
      const d = choices[Math.floor(rng() * choices.length)];
      current = [current[0] + d[0], current[1] + d[1]];
    }
    if (cells.length < 2) continue;
    const arrow = { id: arrows.length, cells, direction };
    arrows.push(arrow);
    cells.forEach((c) => occupied.add(c.join(",")));
  }
  return { size, arrows };
}
export function solveArrows(arrows, size) {
  const left = structuredClone(arrows),
    order = [];
  while (left.length) {
    const index = left.findIndex((a) => !arrowBlocked(a, left, size));
    if (index < 0) return null;
    order.push(left[index].id);
    left.splice(index, 1);
  }
  return order;
}
