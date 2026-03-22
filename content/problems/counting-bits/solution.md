## DP with Bit Trick

ans[i] = ans[i >> 1] + (i & 1).

```javascript
function countBits(n) {
  const ans = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) ans[i] = ans[i >> 1] + (i & 1);
  return ans;
}
```

**Time:** O(n) | **Space:** O(n)
