Sort the array first so duplicates are adjacent. During backtracking, skip an element if it's the same as the previous one at the same recursion depth — this prevents duplicate subsets from being generated.

```javascript
function subsetsWithDup(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  function backtrack(start, current) {
    result.push([...current]);
    for (let i = start; i < nums.length; i++) {
      if (i > start && nums[i] === nums[i - 1]) continue;
      current.push(nums[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}
```

**Time:** O(n * 2^n) — up to 2^n subsets, each copied in O(n).
**Space:** O(n) for the recursion stack.
