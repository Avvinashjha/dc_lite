## Pop and Push Digits

```javascript
function reverse(x) {
  let result = 0;
  while (x !== 0) {
    result = result * 10 + x % 10;
    x = Math.trunc(x / 10);
  }
  return result > 2**31 - 1 || result < -(2**31) ? 0 : result;
}
```

**Time:** O(log x) | **Space:** O(1)
