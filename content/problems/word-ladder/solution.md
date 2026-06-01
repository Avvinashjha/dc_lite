## BFS

```javascript
function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const q = [[beginWord, 1]];
  const visited = new Set([beginWord]);
  while (q.length) {
    const [word, len] = q.shift();
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        const next = word.slice(0,i) + String.fromCharCode(c) + word.slice(i+1);
        if (next === endWord) return len + 1;
        if (wordSet.has(next) && !visited.has(next)) {
          visited.add(next); q.push([next, len + 1]);
        }
      }
    }
  }
  return 0;
}
```

**Time:** O(M² × N) where M=word length, N=word list size | **Space:** O(M × N)
