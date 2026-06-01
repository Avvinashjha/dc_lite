## Approach: Bit Manipulation + Palindrome Check

A string of length `n` has `n - 1` possible cut positions between characters. Each bitmask from `0` to `2^(n-1) - 1` represents one way to partition the string — a set bit means "cut here." For each bitmask, extract the substrings and check if all of them are palindromes.

```javascript
function allPalindromicPartitions(s) {
  const n = s.length;
  const results = [];

  function isPalin(str) {
    let l = 0, r = str.length - 1;
    while (l < r) {
      if (str[l] !== str[r]) return false;
      l++;
      r--;
    }
    return true;
  }

  for (let mask = 0; mask < (1 << (n - 1)); mask++) {
    const parts = [];
    let start = 0;
    let valid = true;

    for (let i = 0; i < n - 1; i++) {
      if (mask & (1 << i)) {
        const part = s.substring(start, i + 1);
        if (!isPalin(part)) { valid = false; break; }
        parts.push(part);
        start = i + 1;
      }
    }

    if (!valid) continue;
    const last = s.substring(start);
    if (isPalin(last)) {
      parts.push(last);
      results.push(parts);
    }
  }
  return results;
}
```

**Time Complexity:** O(2^(n-1) × n) — iterate all bitmasks and check palindromes

**Space Complexity:** O(n) per partition stored, O(2^n × n) total for results
