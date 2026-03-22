## DP

```javascript
function longestCommonSubstring(s1, s2) {
  const m = s1.length, n = s2.length;
  let max = 0, prev = Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    const curr = Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (s1[i-1] === s2[j-1]) { curr[j] = prev[j-1] + 1; max = Math.max(max, curr[j]); }
    }
    prev = curr;
  }
  return max;
}
```

**Time:** O(mn) | **Space:** O(n)
