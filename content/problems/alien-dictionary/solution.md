## Topological Sort

Build a directed graph from adjacent word comparisons, then perform topological sort.

```javascript
function alienDictionary(words) {
  const graph = new Map(), inDeg = new Map();
  for (const w of words) for (const c of w) { graph.set(c, new Set()); inDeg.set(c, 0); }
  for (let i = 0; i < words.length - 1; i++) {
    const [a, b] = [words[i], words[i+1]];
    const minLen = Math.min(a.length, b.length);
    if (a.length > b.length && a.slice(0, minLen) === b.slice(0, minLen)) return "";
    for (let j = 0; j < minLen; j++) {
      if (a[j] !== b[j]) {
        if (!graph.get(a[j]).has(b[j])) { graph.get(a[j]).add(b[j]); inDeg.set(b[j], inDeg.get(b[j])+1); }
        break;
      }
    }
  }
  const q = [...inDeg.keys()].filter(c => inDeg.get(c) === 0), res = [];
  while (q.length) {
    const c = q.shift(); res.push(c);
    for (const n of graph.get(c)) { inDeg.set(n, inDeg.get(n)-1); if (inDeg.get(n)===0) q.push(n); }
  }
  return res.length === inDeg.size ? res.join('') : "";
}
```

**Time:** O(C) where C = total chars | **Space:** O(U + min(U², N)) where U = unique chars
