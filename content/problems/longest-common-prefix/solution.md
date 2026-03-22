## Approach: Horizontal Scan

Take the first string as the initial prefix. Compare it against each subsequent string, trimming from the end until it matches the beginning of that string. If the prefix ever becomes empty, short-circuit and return `""`.

```javascript
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let prefix = strs[0];

  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, -1);
      if (!prefix) return '';
    }
  }
  return prefix;
}
```

**Time Complexity:** O(S) where S is the total number of characters across all strings

**Space Complexity:** O(1)
