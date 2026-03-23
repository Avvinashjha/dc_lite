## DP

```javascript
function numDecodings(s) {
  if (s[0] === '0') return 0;
  const n = s.length;
  let prev2 = 1, prev1 = 1;
  for (let i = 1; i < n; i++) {
    let curr = 0;
    if (s[i] !== '0') curr += prev1;
    const two = parseInt(s.slice(i-1, i+1));
    if (two >= 10 && two <= 26) curr += prev2;
    prev2 = prev1; prev1 = curr;
  }
  return prev1;
}
```

**Time:** O(n) | **Space:** O(1)
