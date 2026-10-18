## Trie with reachable prefixes

Build a trie of dictionary words, marking complete words separately from intermediate prefixes. Let `reachable[i]` mean that the first `i` characters of `s` can be segmented; initially only `reachable[0]` is true.

From each reachable position, walk forward through the trie. Each terminal node makes the next string position reachable. Stop when an edge is missing. Continue past terminal nodes too: a longer word may also lead to a valid segmentation. This explores all word choices without recursive recomputation or substring creation.

```javascript
function wordBreak(s, wordDict) {
  function node() {
    return { children: new Map(), terminal: false };
  }
  const root = node();
  for (const word of wordDict) {
    let current = root;
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (!current.children.has(char)) current.children.set(char, node());
      current = current.children.get(char);
    }
    current.terminal = true;
  }

  const reachable = Array(s.length + 1).fill(false);
  reachable[0] = true;
  for (let start = 0; start < s.length; start++) {
    if (!reachable[start]) continue;
    let current = root;
    for (let end = start; end < s.length; end++) {
      current = current.children.get(s[end]);
      if (!current) break;
      if (current.terminal) reachable[end + 1] = true;
    }
  }
  return reachable[s.length];
}
```

Let `n` be the string length, `D` the total number of characters in the dictionary, and `L` the longest dictionary word.

**Time:** O(D + n · min(n, L)), assuming constant-time map operations.

**Space:** O(D + n) for the trie and reachability array.
