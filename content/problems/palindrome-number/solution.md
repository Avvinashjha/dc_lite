## Reverse Half

Reject negative numbers. Also reject a nonzero number ending in zero: its reverse would need a leading zero.

Move the last digit of `x` onto `rev` until the remaining prefix is no larger than the reversed suffix. For an even number of digits, the two halves must be equal. For an odd number, remove the middle digit from `rev` before comparing. For example, `12321` finishes with `x = 12` and `rev = 123`, so compare `12` with `floor(123 / 10)`.

Only about half the digits are reversed, and no string or digit array is needed. Zero passes because both halves are initially zero.

```javascript
function isPalindrome(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let rev = 0;
  while (x > rev) {
    rev = rev * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === rev || x === Math.floor(rev / 10);
}
```

**Time:** O(d), where d is the number of decimal digits | **Space:** O(1)
