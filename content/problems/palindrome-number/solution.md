## Reverse Half

```javascript
function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let rev = 0;
  while (x > rev) { rev = rev * 10 + x % 10; x = Math.floor(x / 10); }
  return x === rev || x === Math.floor(rev / 10);
}
```

**Time:** O(log n) | **Space:** O(1)
