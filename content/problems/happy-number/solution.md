## Floyd's Cycle Detection

```javascript
function isHappy(n) {
  function next(num) {
    let sum = 0;
    while (num > 0) { sum += (num % 10) ** 2; num = Math.floor(num / 10); }
    return sum;
  }
  let slow = n, fast = next(n);
  while (fast !== 1 && slow !== fast) { slow = next(slow); fast = next(next(fast)); }
  return fast === 1;
}
```

**Time:** O(log n) | **Space:** O(1)
