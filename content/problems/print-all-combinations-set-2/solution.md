## Backtracking over Increasing Indices

Build a combination by choosing its next index from the unused suffix. Recurse from the following index so no entry is reused and original order is preserved. After returning, remove the last choice before trying another index.

If `needed` positions remain, the next index cannot exceed `arr.length - needed`; later indices would leave too few entries to complete the combination. When no positions remain, save a copy of the current values.

Different increasing index sequences produce different branches, even when their values match. Do not deduplicate the output. With `r = 0`, the initial empty path is saved immediately; with `r > arr.length`, return no combinations.

```javascript
function combinations(arr, r) {
  if (r > arr.length) return [];
  const results = [];
  const current = [];
  function combine(start) {
    const needed = r - current.length;
    if (needed === 0) {
      results.push([...current]);
      return;
    }
    for (let i = start; i <= arr.length - needed; i++) {
      current.push(arr[i]);
      combine(i + 1);
      current.pop();
    }
  }
  combine(0);
  return results;
}
```

**Time:** O(1 + C(n, r) × (r + 1)), including copying returned combinations. Here n is arr.length, and C(n, r) is zero when r > n.

**Space:** O(r + 1) auxiliary space for recursion and the current combination, plus O(C(n, r) × (r + 1)) for the output arrays.
