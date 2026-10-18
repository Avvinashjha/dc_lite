## 3D Interval DP

Let `solve(l, r, k)` be the best score for `boxes[l..r]` with `k` extra boxes of the same color as `boxes[r]` attached to its right. The extra count records boxes saved for a future merge; it does not change the input.

There are two choices for the rightmost color:

- Remove it with the carried boxes now, scoring `(k + 1)²`, and solve the remaining interval independently.
- Choose an earlier matching color at index `i`. First clear the intervening interval `[i + 1, r - 1]`, then carry the rightmost box and its `k` companions into `solve(l, i, k + 1)`.

Try every earlier matching position and keep the best score. Keeping equal colors together is sufficient for an optimal solution: combining groups of sizes a and b earns `(a + b)² >= a² + b²`, so splitting an already adjacent same-color group cannot improve the score.

Memoize the interval and carried count. An empty interval scores zero; every nonempty state has a positive score, making zero a safe marker for an uncomputed state.

```javascript
function removeBoxes(boxes) {
  const n = boxes.length;
  const dp = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Array(n).fill(0)),
  );
  function solve(l, r, k) {
    if (l > r) return 0;
    if (dp[l][r][k]) return dp[l][r][k];
    let res = solve(l, r - 1, 0) + (k + 1) * (k + 1);
    for (let i = l; i < r; i++)
      if (boxes[i] === boxes[r])
        res = Math.max(res, solve(l, i, k + 1) + solve(i + 1, r - 1, 0));
    return (dp[l][r][k] = res);
  }
  return solve(0, n - 1, 0);
}
```

**Time:** O(n⁴) | **Space:** O(n³)
