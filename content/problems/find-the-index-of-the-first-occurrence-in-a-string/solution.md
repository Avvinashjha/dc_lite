## Knuth–Morris–Pratt Search

Build `lps[i]`, the length of the longest proper prefix of `needle[0..i]` that is also a suffix. On a mismatch, this table tells us how much of the current match can be reused without moving backward through `haystack`.

Return as soon as the complete pattern matches; this is its first occurrence.

```javascript
function strStr(haystack, needle) {
  const lps = Array(needle.length).fill(0);
  for (let i = 1, matched = 0; i < needle.length;) {
    if (needle[i] === needle[matched]) {
      lps[i++] = ++matched;
    } else if (matched > 0) {
      matched = lps[matched - 1];
    } else {
      i++;
    }
  }

  for (let i = 0, matched = 0; i < haystack.length;) {
    if (haystack[i] === needle[matched]) {
      i++;
      matched++;
      if (matched === needle.length) return i - matched;
    } else if (matched > 0) {
      matched = lps[matched - 1];
    } else {
      i++;
    }
  }
  return -1;
}
```

**Time:** O(n + m) | **Space:** O(m), where `n` and `m` are the haystack and needle lengths.
