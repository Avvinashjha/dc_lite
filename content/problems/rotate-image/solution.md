## Transpose, Then Reverse Each Row

First swap every pair across the main diagonal. Visit only positions above it (`j > i`) so each pair is swapped once and diagonal cells stay in place.

Then reverse each row. Transposition sends `(r, c)` to `(c, r)`; reversing rows sends that to `(c, n - 1 - r)`, exactly the clockwise rotation mapping. Reversing columns instead would rotate in the opposite direction.

Both steps mutate the existing matrix and use only constant temporary storage.

```javascript
function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      [matrix[i][j], matrix[j][i]] = [matrix[j][i], matrix[i][j]];
  for (const row of matrix) row.reverse();
}
```

**Time:** O(n²) | **Space:** O(1)
