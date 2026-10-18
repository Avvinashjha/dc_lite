## Trie with Object Nodes

Each character follows one child edge. Shared prefixes reuse those edges. Mark the last node of an inserted word with a terminal flag: reaching a node proves that a prefix exists, but search must also check that flag to distinguish a stored word from an unfinished prefix.

The terminal flag uses a key outside the allowed lowercase alphabet, so it cannot collide with a character edge.

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
