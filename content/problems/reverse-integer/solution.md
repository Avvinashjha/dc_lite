## Pop and Push Digits

Take the final digit with `x % 10` and append it to the answer using `result * 10 + digit`. Remove that digit from `x` with `Math.trunc(x / 10)` and repeat until no digits remain.

JavaScript's remainder keeps the sign of the dividend, so negative inputs build a negative result directly. Truncation toward zero is essential: `Math.floor` would handle negative values incorrectly.

Finally check the signed 32-bit limits. A 32-bit input has at most ten decimal digits, so its full reversal remains exactly representable by JavaScript's Number type before this range check. Trailing input zeros contribute nothing before the first nonzero reversed digit.

```javascript
function reverse(x) {
  let result = 0;
  while (x !== 0) {
    result = result * 10 + (x % 10);
    x = Math.trunc(x / 10);
  }
  return result > 2 ** 31 - 1 || result < -(2 ** 31) ? 0 : result;
}
```

**Time:** O(d), where d is the number of decimal digits | **Space:** O(1)
