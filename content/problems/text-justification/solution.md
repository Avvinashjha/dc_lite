## Greedy Line Packing + Space Distribution

```javascript
function fullJustify(words, maxWidth) {
  const result = [];
  let i = 0;
  while (i < words.length) {
    let j = i, lineLen = 0;
    while (j < words.length && lineLen + words[j].length + (j-i) <= maxWidth) lineLen += words[j++].length;
    const numWords = j - i, numSpaces = maxWidth - lineLen;
    let line = words[i];
    if (numWords === 1 || j === words.length) {
      for (let k = i+1; k < j; k++) line += ' ' + words[k];
      line += ' '.repeat(maxWidth - line.length);
    } else {
      const gaps = numWords - 1, spacePerGap = Math.floor(numSpaces / gaps), extra = numSpaces % gaps;
      for (let k = 1; k < numWords; k++) line += ' '.repeat(spacePerGap + (k <= extra ? 1 : 0)) + words[i+k];
    }
    result.push(line); i = j;
  }
  return result;
}
```

**Time:** O(n) | **Space:** O(n)
