## Approach: Histogram per Row + Stack

Build a heights array where `heights[j]` is the number of consecutive 1s above (inclusive) for each row. Apply the largest-rectangle-in-histogram algorithm using a monotonic stack for each row.

```javascript
function maximumSizeRectangleBinarySubMatrixWithAll1s(matrix) {
  if (!matrix.length) return 0;
  const n = matrix[0].length;
  const heights = new Array(n).fill(0);
  let max = 0;
  for (const row of matrix) {
    for (let j = 0; j < n; j++) heights[j] = row[j] === 1 ? heights[j] + 1 : 0;
    const stack = [-1];
    for (let j = 0; j <= n; j++) {
      const h = j === n ? 0 : heights[j];
      while (stack.length > 1 && heights[stack[stack.length-1]] > h) {
        const height = heights[stack.pop()];
        const width = j - stack[stack.length-1] - 1;
        max = Math.max(max, height * width);
      }
      stack.push(j);
    }
  }
  return max;
}
```

**Time Complexity:** O(m × n)

**Space Complexity:** O(n)
