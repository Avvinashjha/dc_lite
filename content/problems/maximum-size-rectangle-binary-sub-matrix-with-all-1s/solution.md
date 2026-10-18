## Approach: Histogram per Row + Stack

Build a heights array where `heights[j]` is the number of consecutive 1s above (inclusive) for each row. Reset a column height to zero when its current cell is zero. Apply the largest-rectangle-in-histogram algorithm using a non-decreasing stack of height indices for each row.

When a shorter height arrives, pop taller bars. The popped height spans from just after the remaining stack top to just before the current column. The -1 sentinel supplies the left boundary when no earlier bar remains. A final zero height flushes pending positive bars. Each index is pushed and popped at most once per row.

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
