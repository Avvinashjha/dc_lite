## Greedy Line Packing + Space Distribution

When testing whether another word fits, include one required space for each existing word. Once the line is full, subtract the total word lengths from maxWidth to find the number of spaces.

For fully justified lines, divide that space count by the gap count. Each gap gets the quotient, and the leftmost remainder gaps get one extra. Handle final and single-word lines separately to avoid division by zero and preserve right padding.

```javascript
function fullJustify(words, maxWidth) {
  const result = [];
  let i = 0;
  while (i < words.length) {
    let j = i,
      lineLen = 0;
    while (j < words.length && lineLen + words[j].length + (j - i) <= maxWidth)
      lineLen += words[j++].length;
    const numWords = j - i,
      numSpaces = maxWidth - lineLen;
    let line = words[i];
    if (numWords === 1 || j === words.length) {
      for (let k = i + 1; k < j; k++) line += ' ' + words[k];
      line += ' '.repeat(maxWidth - line.length);
    } else {
      const gaps = numWords - 1,
        spacePerGap = Math.floor(numSpaces / gaps),
        extra = numSpaces % gaps;
      for (let k = 1; k < numWords; k++)
        line += ' '.repeat(spacePerGap + (k <= extra ? 1 : 0)) + words[i + k];
    }
    result.push(line);
    i = j;
  }
  return result;
}
```

**Time:** O(C + W), where C is total input characters and W is total output characters | **Space:** O(W), including output
