Build a frequency map of each number. At each recursive step, pick a number that still has remaining count, decrement it, and recurse. This naturally avoids duplicates since you never place the same value at the same position twice.

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
**Space:** O(n) for the recursion stack and frequency map.
