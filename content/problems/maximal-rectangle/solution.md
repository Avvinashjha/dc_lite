## Histogram per Row + Largest Rectangle in Histogram

```javascript
function maximalRectangle(matrix) {
  if (!matrix.length) return 0;
  const n = matrix[0].length, heights = Array(n).fill(0);
  let max = 0;
  for (const row of matrix) {
    for (let j = 0; j < n; j++) heights[j] = row[j] === '1' ? heights[j] + 1 : 0;
    max = Math.max(max, largestRect(heights));
  }
  return max;
}
function largestRect(h) {
  const stack = [], n = h.length;
  let max = 0;
  for (let i = 0; i <= n; i++) {
    while (stack.length && (i === n || h[i] < h[stack[stack.length-1]])) {
      const height = h[stack.pop()];
      const width = stack.length ? i - stack[stack.length-1] - 1 : i;
      max = Math.max(max, height * width);
    }
    stack.push(i);
  }
  return max;
}
```

**Time:** O(mn) | **Space:** O(n)
