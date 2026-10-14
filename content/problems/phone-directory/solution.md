## Trie with Prefix Search

```javascript
function phoneDirectory(contacts, query) {
  const trie = {};
  for (const c of contacts) {
    let node = trie;
    for (const ch of c) { if (!node[ch]) node[ch] = {}; node = node[ch]; node.words = (node.words||[]); node.words.push(c); }
  }
  const results = [];
  let node = trie;
  for (let i = 0; i < query.length; i++) {
    node = node?.[query[i]];
    results.push(node?.words?.sort() || []);
  }
  return results;
}
```

**Time:** O(N × L + Q × N log N × L) as a loose upper bound including sorting suggestion lists | **Space:** O(N × L + Q × N), including returned suggestions
