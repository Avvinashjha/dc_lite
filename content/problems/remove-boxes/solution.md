## 3D Interval DP

dp[l][r][k] = max points from boxes[l..r] with k extra boxes same as boxes[r] appended.

```javascript
function removeBoxes(boxes) {
  const n = boxes.length;
  const dp = Array.from({length:n}, ()=>Array.from({length:n}, ()=>Array(n).fill(0)));
  function solve(l, r, k) {
    if (l > r) return 0;
    if (dp[l][r][k]) return dp[l][r][k];
    let res = solve(l, r-1, 0) + (k+1)*(k+1);
    for (let i = l; i < r; i++)
      if (boxes[i] === boxes[r])
        res = Math.max(res, solve(l, i, k+1) + solve(i+1, r-1, 0));
    return dp[l][r][k] = res;
  }
  return solve(0, n-1, 0);
}
```

**Time:** O(n⁴) | **Space:** O(n³)
