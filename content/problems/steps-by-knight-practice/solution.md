## Breadth-First Search

Every legal move has equal cost, so BFS visits squares in increasing move count. Mark a square when it is enqueued to avoid repeated work. Process one queue layer per distance.

Encode `[row, column]` as `row * n + column`. Typed arrays store visited flags and queue entries compactly, avoiding a separate coordinate array for each of up to one million squares.

```javascript
function minSteps(n, src, dest) {
  if (src[0] === dest[0] && src[1] === dest[1]) return 0;
  const moves = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  const visited = new Uint8Array(n * n);
  const queue = new Int32Array(n * n);
  const start = src[0] * n + src[1];
  const target = dest[0] * n + dest[1];
  let head = 0, tail = 1, distance = 0;
  queue[0] = start;
  visited[start] = 1;
  while (head < tail) {
    const end = tail;
    distance++;
    while (head < end) {
      const cell = queue[head++];
      const row = Math.floor(cell / n), col = cell % n;
      for (const [dr, dc] of moves) {
        const r = row + dr, c = col + dc;
        if (r < 0 || r >= n || c < 0 || c >= n) continue;
        const next = r * n + c;
        if (visited[next]) continue;
        if (next === target) return distance;
        visited[next] = 1;
        queue[tail++] = next;
      }
    }
  }
  return -1;
}
```

**Time:** O(n²), with at most eight neighbors per square.

**Space:** O(n²). The typed-array storage uses about 5 MB at n = 1000.
