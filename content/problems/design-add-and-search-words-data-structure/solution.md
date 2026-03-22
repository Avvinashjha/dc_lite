## Trie with DFS for Wildcards

```javascript
class WordDictionary {
  constructor() { this.root = {}; }
  addWord(word) {
    let node = this.root;
    for (const c of word) { if (!node[c]) node[c] = {}; node = node[c]; }
    node.$ = true;
  }
  search(word) {
    function dfs(node, i) {
      if (!node) return false;
      if (i === word.length) return !!node.$;
      if (word[i] === '.') return Object.keys(node).some(k => k !== '$' && dfs(node[k], i+1));
      return dfs(node[word[i]], i+1);
    }
    return dfs(this.root, 0);
  }
}
```

**Time:** addWord O(L), search O(26^L) worst | **Space:** O(total chars)
