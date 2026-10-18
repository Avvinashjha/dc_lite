## Convert 0→-1 then Largest Zero-Sum Submatrix

Replace 0s with -1s. For each pair of rows, accumulate each column’s sum across those rows, then find the longest zero-sum interval of columns. Store the earliest index for each running sum; repeating that sum identifies a zero-sum interval. Multiply its width by the selected row count.

```javascript
function largestAreaEqual(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let maxArea = 0;
  for (let top = 0; top < m; top++) {
    const colSum = Array(n).fill(0);
    for (let bot = top; bot < m; bot++) {
      for (let j = 0; j < n; j++) colSum[j] += matrix[bot][j] === 0 ? -1 : 1;
      const map = new Map([[0, -1]]);
      let sum = 0;
      for (let j = 0; j < n; j++) {
        sum += colSum[j];
        if (map.has(sum)) maxArea = Math.max(maxArea, (bot-top+1) * (j - map.get(sum)));
        else map.set(sum, j);
      }
    }
  }
  return maxArea;
}
```

**Time:** O(m²n) | **Space:** O(n)
