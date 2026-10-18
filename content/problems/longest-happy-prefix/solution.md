## Approach: KMP Failure Function

This is directly solved by the KMP algorithm's LPS (Longest Proper Prefix which is also Suffix) array. Build the LPS array for the entire string. At a mismatch, fall back to `lps[len - 1]` to try the next shorter border without rescanning characters. The last entry gives the answer length. Because every entry describes a proper prefix, the whole string is excluded while overlapping occurrences remain allowed.

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
