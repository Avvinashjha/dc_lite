Backtrack through choices starting from 1. At each step, pick a number greater than the last chosen one and recurse with `k - 1`. When `k` reaches 0, save the current combination. An optimization: stop early if there aren't enough numbers left to fill the remaining slots.

```javascript
function combine(n, k) {
  const result = [];

  function backtrack(start, current) {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    const remaining = k - current.length;
    for (let i = start; i <= n - remaining + 1; i++) {
      current.push(i);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(1, []);
  return result;
}
```

**Time:** O(C(n, k) * k) — there are C(n, k) combinations, each taking O(k) to copy.
**Space:** O(k) for the recursion stack.
