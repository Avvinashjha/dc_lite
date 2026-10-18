## Approach: Horizontal Scan

Take the first string as the initial prefix. Compare it against each subsequent string, comparing corresponding characters to find the matching prefix length. If the prefix ever becomes empty, short-circuit and return `""`.

```javascript
function longestCommonPrefix(strs) {
  if (!strs.length) return '';
  let length = strs[0].length;
  for (let i = 1; i < strs.length; i++) {
    let j = 0;
    while (j < length && j < strs[i].length && strs[0][j] === strs[i][j]) j++;
    length = j;
    if (length === 0) return '';
  }
  return strs[0].slice(0, length);
}
```

**Time Complexity:** O(N + S), where N is the number of strings and S is their total character count (including the empty-string case)

**Space Complexity:** O(p) for the returned prefix of length p, with O(1) auxiliary space
