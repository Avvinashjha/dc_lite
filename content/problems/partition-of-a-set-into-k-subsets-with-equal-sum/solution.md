## Backtracking with Symmetry Pruning

Every group must sum to `total / k`. Reject a total that is not divisible by `k`, or an entry larger than the target. Positivity is essential for this capacity check: later entries cannot lower a bucket's sum.

Sort in descending order, then assign each entry to one of `k` buckets without exceeding the target. Large entries are considered first because they have fewer possible placements. Undo each failed placement before trying another bucket.

At a given recursion depth, buckets with equal current sums are interchangeable. Try only one of each sum, using a fresh `seen` set for that depth. This skips equivalent assignments without removing a possible solution.

After all entries are assigned, each bucket must equal the target. Since all values and the target are positive, these groups are also nonempty. Sorting changes the input order but not its values.

```javascript
function canPartitionKSubsets(nums, k) {
  const total = nums.reduce((a, b) => a + b, 0);
  if (total % k !== 0) return false;
  const target = total / k;

  nums.sort((a, b) => b - a);
  if (nums[0] > target) return false;

  const buckets = new Array(k).fill(0);

  function backtrack(idx) {
    if (idx === nums.length) return buckets.every((b) => b === target);

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

**Time:** O(n log n + k^(n + 1)) as a conservative worst-case bound for sorting, at most k^n assignments, and up to k work per search state. Symmetry and capacity checks prune the search.

**Space:** O(n × k) as an upper bound for the recursion stack, per-frame symmetry sets, and buckets. Here n is nums.length.
