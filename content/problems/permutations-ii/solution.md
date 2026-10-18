## Backtracking with Value Frequencies

Count each distinct value in a frequency map. At each position, choose any value with a positive remaining count, decrement its count, and append it to the current path. After exploring that choice, remove it and restore the count.

When the path contains as many entries as the input, save a copy. The frequency counts guarantee that every entry is used exactly once. Choosing by value rather than by original index avoids duplicate arrangements: equal entries do not create separate branches for the same position.

Every possible arrangement can be reached by choosing its values in order, so the search is complete. The input array is not modified.

```javascript
function permuteUnique(nums) {
  const result = [];
  const freq = new Map();
  for (const n of nums) freq.set(n, (freq.get(n) || 0) + 1);

  function backtrack(path) {
    if (path.length === nums.length) {
      result.push([...path]);
      return;
    }
    for (const [num, count] of freq) {
      if (count === 0) continue;
      freq.set(num, count - 1);
      path.push(num);
      backtrack(path);
      path.pop();
      freq.set(num, count);
    }
  }

  backtrack([]);
  return result;
}
```

**Time:** O(n! * n) — at most n! permutations, each taking O(n) to copy.
**Space:** O(n) auxiliary space for the working path, recursion, and frequency map, plus O(P × n) for P returned permutations. If value frequencies are c₁, c₂, …, then P = n! / (c₁! × c₂! × …).
