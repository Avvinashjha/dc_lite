## Approach: Layer-by-Layer Boundaries

Track four boundaries — top, bottom, left, right — and peel off one layer of the spiral per iteration. After each direction traversal, shrink the corresponding boundary and check whether you've crossed over.

```javascript
function spiralOrder(matrix) {
  const result = [];
  if (!matrix.length) return result;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) result.push(matrix[top][i]);
    top++;
    for (let i = top; i <= bottom; i++) result.push(matrix[i][right]);
    right--;
    if (top <= bottom) {
      for (let i = right; i >= left; i--) result.push(matrix[bottom][i]);
      bottom--;
    }
    if (left <= right) {
      for (let i = bottom; i >= top; i--) result.push(matrix[i][left]);
      left++;
    }
  }
  return result;
}
```

**Time Complexity:** O(m × n) — every element is visited once

**Space Complexity:** O(1) extra space (excluding the output array)
