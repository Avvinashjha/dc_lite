## Approach: Floyd's Cycle Detection

Use slow and fast pointers on the digit-square-sum sequence. Compute the next number by summing squares of digits. If fast reaches 1, the number is happy. If slow meets fast without reaching 1, there is a cycle and the number is not happy.

```javascript
function happyNumber(n) {
  function getNext(num) {
    let sum = 0;
    while (num > 0) {
      const d = num % 10;
      sum += d * d;
      num = Math.floor(num / 10);
    }
    return sum;
  }
  let slow = n, fast = getNext(n);
  while (fast !== 1 && slow !== fast) {
    slow = getNext(slow);
    fast = getNext(getNext(fast));
  }
  return fast === 1;
}
```

**Time Complexity:** O(log n)

**Space Complexity:** O(1)
