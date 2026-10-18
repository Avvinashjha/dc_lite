## Scan Words from Right to Left

Start at the end of the string. Skip spaces, then scan left across the next word. Copy that word in its original character order into a result array, and continue from the preceding space.

The scan discovers words in reverse order without reversing their characters. Joining the collected words with one space normalizes every separator. When the input contains only spaces, no words are collected and joining the empty array returns an empty string.

```javascript
function reverseWords(s) {
  const words = [];
  let i = s.length - 1;
  while (i >= 0) {
    while (i >= 0 && s[i] === " ") i--;
    if (i < 0) break;
    const end = i + 1;
    while (i >= 0 && s[i] !== " ") i--;
    words.push(s.slice(i + 1, end));
  }
  return words.join(" ");
}
```

**Time:** O(n) for scanning and joining | **Space:** O(n) for the collected words and result. JavaScript strings are immutable, so this is not an in-place string operation.
