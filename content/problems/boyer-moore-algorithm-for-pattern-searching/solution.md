## Boyer-Moore Bad Character Heuristic

Precompute bad character table to skip alignments.

```javascript
function boyerMoore(text, pattern) {
  const m = pattern.length, n = text.length, result = [];
  const badChar = {};
  for (let i = 0; i < m; i++) badChar[pattern[i]] = i;
  let s = 0;
  while (s <= n - m) {
    let j = m - 1;
    while (j >= 0 && pattern[j] === text[s + j]) j--;
    if (j < 0) { result.push(s); s += (s + m < n) ? m - (badChar[text[s+m]] ?? -1) : 1; }
    else s += Math.max(1, j - (badChar[text[s+j]] ?? -1));
  }
  return result;
}
```

**Time:** O(n/m) best, O(nm) worst | **Space:** O(alphabet size)
