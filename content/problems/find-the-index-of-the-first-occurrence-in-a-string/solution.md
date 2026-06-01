Scan through the haystack checking for a substring match at each position. For a simple approach, use the built-in `indexOf`. For larger inputs, KMP or Rabin-Karp provide better worst-case performance.

```javascript
function strStr(haystack, needle) {
  if (needle === '') return 0;
  return haystack.indexOf(needle);
}
```

**Time:** O(n × m) for naive approach; O(n + m) with KMP
**Space:** O(1) for naive; O(m) for KMP
