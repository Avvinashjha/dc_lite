## Trie with Prefix Search

```javascript
function phoneDirectory(contacts, query) {
  const trie = {};
  for (const c of contacts) {
    let node = trie;
    for (const ch of c) { if (!node[ch]) node[ch] = {}; node = node[ch]; node.words = (node.words||[]).concat(c); }
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

**Time:** O(n × L + q × L) | **Space:** O(n × L)
