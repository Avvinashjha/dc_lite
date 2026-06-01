## Approach: KMP Failure Function

This is directly solved by the KMP algorithm's LPS (Longest Proper Prefix which is also Suffix) array. Build the LPS array for the entire string — the value at the last index gives the length of the longest happy prefix.

```javascript
function longestPrefix(s) {
  const n = s.length;
  const lps = new Array(n).fill(0);
  let len = 0;
  let i = 1;

  while (i < n) {
    if (s[i] === s[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      i++;
    }
  }
  return s.substring(0, lps[n - 1]);
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(n) for the LPS array
