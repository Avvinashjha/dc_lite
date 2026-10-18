Build a Trie from the word list, then DFS from every cell on the board. Traverse the Trie simultaneously — when a Trie node marks a complete word, add it to results. Delete a found word marker to avoid duplicate results, but continue exploring its longer-word descendants. After backtracking, remove an exhausted trie branch only when it has neither a word marker nor children. Always restore the board cell before returning.

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

    const parent = node;
    node = node[ch];
    if (node.word) {
      result.push(node.word);
      delete node.word;
    }

    board[r][c] = '#';
    dfs(r + 1, c, node);
    dfs(r - 1, c, node);
    dfs(r, c + 1, node);
    dfs(r, c - 1, node);
    board[r][c] = ch;
    if (Object.keys(node).length === 0) delete parent[ch];
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dfs(r, c, root);
    }
  }
  return result;
}
```

**Time:** O(D + m·n·4·3^(L-1)), where D is the total dictionary characters and L is the maximum word length. Prefix and exhausted-branch pruning reduce the actual search.
**Space:** O(D + L), excluding the returned words, for the trie and recursion stack.
