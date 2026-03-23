## Approach: Recursive Pick / Skip

At each index, decide: include this element in the current combination or skip it. Move forward either way. When you've picked `r` elements, record the combination. Stop early if there aren't enough elements left to fill the remaining slots.

```javascript
function combinations(arr, r) {
  const results = [];

  function combine(start, current) {
    if (current.length === r) {
      results.push([...current]);
      return;
    }
    if (start >= arr.length) return;
    if (arr.length - start < r - current.length) return;

    current.push(arr[start]);
    combine(start + 1, current);
    current.pop();
    combine(start + 1, current);
  }

  combine(0, []);
  return results;
}
```

**Time Complexity:** O(C(n, r) × r) — generating all C(n, r) combinations, each of size r

**Space Complexity:** O(r) for the recursion depth (excluding output storage)
