Use two pointers from both ends moving inward. When a mismatch is found, try skipping either the left or right character and check if the remaining substring is a palindrome. If either works, return true.

```javascript
function validPalindrome(s) {
  function isPalin(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }

  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return isPalin(left + 1, right) || isPalin(left, right - 1);
    }
    left++;
    right--;
  }
  return true;
}
```

**Time:** O(n) — each character is visited at most twice.
**Space:** O(1) — no extra data structures.
