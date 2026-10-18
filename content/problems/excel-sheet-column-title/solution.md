## One-Based Base-26 Conversion

Subtract one before extracting each digit, mapping the remainders 0–25 to A–Z. Collect letters from right to left, then reverse once.

```javascript
function convertToTitle(columnNumber) {
  const letters = [];
  while (columnNumber > 0) {
    columnNumber--;
    letters.push(String.fromCharCode(65 + (columnNumber % 26)));
    columnNumber = Math.floor(columnNumber / 26);
  }
  return letters.reverse().join('');
}
```

**Time:** O(log n) | **Space:** O(log n), including the output string
