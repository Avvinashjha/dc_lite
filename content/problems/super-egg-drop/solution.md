## Count Floors Covered by a Drop Budget

Let covered[e] be the maximum number of floors distinguishable with the current number of moves and e eggs. One more drop splits the possibilities:

- If the egg breaks, cover the lower floors with one fewer egg.
- If it survives, cover the higher floors with the same number of eggs.
- The tested floor contributes one more.

Thus newCovered[e] = oldCovered[e - 1] + oldCovered[e] + 1. Update egg counts downward so both inputs still refer to the previous move budget. Stop when k eggs cover at least n floors.

```javascript
function superEggDrop(k, n) {
  const covered = Array(k + 1).fill(0);
  let moves = 0;
  while (covered[k] < n) {
    moves++;
    for (let eggs = k; eggs >= 1; eggs--) {
      covered[eggs] = Math.min(n, covered[eggs - 1] + covered[eggs] + 1);
    }
  }
  return moves;
}
```

Capping counts at n preserves the feasibility decision and avoids storing irrelevant large coverage values.

**Time:** O(k × M), where M is the answer and M ≤ n.

**Space:** O(k). Only the previous move budget is needed.
