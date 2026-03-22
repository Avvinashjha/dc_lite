Walk through the string character by character, tracking three boolean flags: whether a digit has been seen, whether a dot has been seen, and whether an exponent has been seen. Apply the rules at each character — signs are only valid at the start or right after `e`/`E`, dots can't appear after an exponent, and `e`/`E` requires a preceding digit.

```javascript
function isNumber(s) {
  let seenDigit = false;
  let seenDot = false;
  let seenE = false;

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];

    if (ch >= '0' && ch <= '9') {
      seenDigit = true;
    } else if (ch === '+' || ch === '-') {
      if (i > 0 && s[i - 1] !== 'e' && s[i - 1] !== 'E') return false;
    } else if (ch === '.') {
      if (seenDot || seenE) return false;
      seenDot = true;
    } else if (ch === 'e' || ch === 'E') {
      if (seenE || !seenDigit) return false;
      seenE = true;
      seenDigit = false;
    } else {
      return false;
    }
  }

  return seenDigit;
}
```

**Time:** O(n) — single pass through the string.
**Space:** O(1) — only boolean flags.
