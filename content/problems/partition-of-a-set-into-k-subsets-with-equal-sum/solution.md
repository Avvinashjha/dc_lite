## Approach: Backtracking with Pruning

Sort the array in descending order to fail faster. Maintain `k` buckets — try placing each element into a bucket, and if the bucket sum would exceed the target, skip it. Also skip buckets that have the same current sum as a previously tried bucket (symmetry pruning).

```javascript
function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;

  nums.sort((a, b) => b - a);
  if (nums[0] > target) return false;

  const buckets = new Array(k).fill(0);

  function backtrack(idx) {
    if (idx === nums.length) return buckets.every(b => b === target);

    const seen = new Set();
    for (let i = 0; i < k; i++) {
      if (buckets[i] + nums[idx] > target) continue;
      if (seen.has(buckets[i])) continue;
      seen.add(buckets[i]);

      buckets[i] += nums[idx];
      if (backtrack(idx + 1)) return true;
      buckets[i] -= nums[idx];
    }
    return false;
  }

  return backtrack(0);
}
```

**Time Complexity:** O(k^n) worst case, but pruning drastically reduces this

**Space Complexity:** O(n) for recursion stack
