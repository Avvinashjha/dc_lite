## House Robber on Frequency Array

Transform to a frequency-weighted array and solve like House Robber.

```javascript
function deleteAndEarn(nums) {
  const max = Math.max(...nums);
  const sums = Array(max + 1).fill(0);
  for (const n of nums) sums[n] += n;
  let prev = 0, curr = 0;
  for (let i = 0; i <= max; i++) [prev, curr] = [curr, Math.max(curr, prev + sums[i])];
  return curr;
}
```

**Time:** O(n + max) | **Space:** O(max)
