Build a Trie from the word list, then DFS from every cell on the board. Traverse the Trie simultaneously — when a Trie node marks a complete word, add it to results. Prune branches to avoid redundant searches.

```javascript
function findWords(board, words) {
  const root = {};
  for (const word of words) {
    let node = root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node.word = word;
  }

  const rows = board.length, cols = board[0].length;
  const result = [];

  function dfs(r, c, node) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    const ch = board[r][c];
    if (ch === '#' || !node[ch]) return;

    node = node[ch];
    if (node.word) {
      result.push(node.word);
      node.word = null;
    }

    board[r][c] = '#';
    dfs(r + 1, c, node);
    dfs(r - 1, c, node);
    dfs(r, c + 1, node);
    dfs(r, c - 1, node);
    board[r][c] = ch;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, root);
    }
  }
  return result;
}
```

**Time:** O(m·n·4·3^(L-1)) where L is max word length
**Space:** O(total characters in all words) for the Trie
