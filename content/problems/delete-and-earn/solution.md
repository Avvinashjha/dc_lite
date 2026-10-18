## House Robber on Frequency Array

Once you choose a value, choosing all its remaining occurrences can only help: the neighboring values have already been removed. Group their points into sums[value]. Then select nonadjacent values using the House Robber recurrence.

```javascript
function deleteAndEarn(nums) {
  let max = 0;
  for (const value of nums) max = Math.max(max, value);
  const sums = Array(max + 1).fill(0);
  for (const n of nums) sums[n] += n;
  let prev = 0, curr = 0;
  for (let i = 0; i <= max; i++) [prev, curr] = [curr, Math.max(curr, prev + sums[i])];
  return curr;
}
```

**Time:** O(n + max) | **Space:** O(max)
