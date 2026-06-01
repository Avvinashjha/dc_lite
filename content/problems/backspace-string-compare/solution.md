## Two Pointer from End

Process both strings from right to left, skipping characters after backspaces.

```javascript
function backspaceCompare(s, t) {
  let i = s.length - 1, j = t.length - 1;
  while (i >= 0 || j >= 0) {
    let skip = 0;
    while (i >= 0 && (s[i] === '#' || skip > 0)) { skip += s[i] === '#' ? 1 : -1; i--; }
    skip = 0;
    while (j >= 0 && (t[j] === '#' || skip > 0)) { skip += t[j] === '#' ? 1 : -1; j--; }
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if ((i >= 0) !== (j >= 0)) return false;
    i--; j--;
  }
  return true;
}
```

**Time:** O(m + n) | **Space:** O(1)
