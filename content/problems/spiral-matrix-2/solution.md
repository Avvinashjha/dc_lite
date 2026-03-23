## Boundary Shrinking

```javascript
function spiralOrder(matrix) {
  const res = [];
  let top=0, bot=matrix.length-1, left=0, right=matrix[0].length-1;
  while (top<=bot && left<=right) {
    for (let i=left;i<=right;i++) res.push(matrix[top][i]); top++;
    for (let i=top;i<=bot;i++) res.push(matrix[i][right]); right--;
    if (top<=bot) { for (let i=right;i>=left;i--) res.push(matrix[bot][i]); bot--; }
    if (left<=right) { for (let i=bot;i>=top;i--) res.push(matrix[i][left]); left++; }
  }
  return res;
}
```

**Time:** O(mn) | **Space:** O(1)
