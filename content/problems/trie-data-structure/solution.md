## Trie with Object Nodes

```javascript
class Trie {
  constructor() { this.root = {}; }
  insert(word) {
    let node = this.root;
    for (const c of word) { if (!node[c]) node[c] = {}; node = node[c]; }
    node.$ = true;
  }
  search(word) {
    let node = this.root;
    for (const c of word) { if (!node[c]) return false; node = node[c]; }
    return !!node.$;
  }
  startsWith(prefix) {
    let node = this.root;
    for (const c of prefix) { if (!node[c]) return false; node = node[c]; }
    return true;
  }
}
```

**Time:** O(L) per operation | **Space:** O(total characters)
