## Histogram per Row

Build histogram heights row by row, apply largest rectangle in histogram.

```javascript
function maxRectangle(matrix) {
  const m = matrix.length, n = matrix[0].length, h = Array(n).fill(0);
  let max = 0;
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) h[j] = matrix[i][j] ? h[j]+1 : 0;
    const stack = [];
    for (let j = 0; j <= n; j++) {
      while (stack.length && (j===n || h[j] < h[stack[stack.length-1]])) {
        const height = h[stack.pop()], w = stack.length ? j-stack[stack.length-1]-1 : j;
        max = Math.max(max, height*w);
      }
      stack.push(j);
    }
  }
  return max;
}
```

**Time:** O(mn) | **Space:** O(n)
