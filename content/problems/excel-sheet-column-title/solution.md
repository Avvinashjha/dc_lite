## Base-26 Conversion

```javascript
function convertToTitle(columnNumber) {
  let result = '';
  while (columnNumber > 0) {
    columnNumber--;
    result = String.fromCharCode(65 + (columnNumber % 26)) + result;
    columnNumber = Math.floor(columnNumber / 26);
  }
  return result;
}
```

**Time:** O(log n) | **Space:** O(log n), including the output string
