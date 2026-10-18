## BFS with compact boundary states

Every move leaves a jug empty or full. Thus every reachable state `(a, b)` lies on the boundary of `0 ≤ a ≤ x`, `0 ≤ b ≤ y`; the interior never needs storage.

Assign consecutive IDs to four disjoint groups: `a = 0`, `a = x`, then `b = 0` and `b = y` with `0 < a < x`. These contain exactly `2(x + y)` states. Use a byte array for visited flags and an integer array as a queue. Mark a state when enqueuing it so it enters the queue only once.

For each state, check the target and explore the two fill, two empty, and two maximal-pour moves.

```javascript
function canMeasureWater(x, y, target) {
  if (target === 0) return true;
  if (target > x + y) return false;
  const edge = 2 * (y + 1);
  const size = 2 * (x + y);
  const visited = new Uint8Array(size);
  const queue = new Int32Array(size);
  let head = 0, tail = 0;

  function enqueue(a, b) {
    let id;
    if (a === 0) id = b;
    else if (a === x) id = y + 1 + b;
    else id = edge + a - 1 + (b === y ? x - 1 : 0);
    if (!visited[id]) {
      visited[id] = 1;
      queue[tail++] = id;
    }
  }

  enqueue(0, 0);
  while (head < tail) {
    const id = queue[head++];
    let a, b;
    if (id <= y) { a = 0; b = id; }
    else if (id < edge) { a = x; b = id - y - 1; }
    else if (id < edge + x - 1) { a = id - edge + 1; b = 0; }
    else { a = id - edge - x + 2; b = y; }

    if (a === target || b === target || a + b === target) return true;
    enqueue(x, b);
    enqueue(a, y);
    enqueue(0, b);
    enqueue(a, 0);
    const toSecond = Math.min(a, y - b);
    enqueue(a - toSecond, b + toSecond);
    const toFirst = Math.min(b, x - a);
    enqueue(a + toFirst, b - toFirst);
  }
  return false;
}
```

**Time:** O(x + y), including array initialization.

**Space:** O(x + y); the two typed arrays use `10(x + y)` bytes, at most 20 MB under the stated bounds.
