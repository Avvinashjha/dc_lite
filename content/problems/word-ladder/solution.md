## Breadth-first search

Treat words as vertices and one-letter changes as edges. BFS explores all chains of a given length before longer chains, so the first discovery of the end word gives the shortest length. Start at length 1 to count the beginning word.

Generate neighbors by replacing each position with each other lowercase letter. Only dictionary members can be enqueued. Mark words visited when enqueuing them to avoid cycles and repeated work. If the end word is absent from the dictionary, no chain can reach it.

```javascript
function ladderLength(beginWord, endWord, wordList) {
  const wordSet = new Set(wordList);
  if (!wordSet.has(endWord)) return 0;
  const q = [[beginWord, 1]];
  const visited = new Set([beginWord]);
  let head = 0;
  while (head < q.length) {
    const [word, len] = q[head++];
    for (let i = 0; i < word.length; i++) {
      for (let c = 97; c <= 122; c++) {
        if (c === word.charCodeAt(i)) continue;
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
