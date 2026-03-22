## Approach: DFS

Start from the source pixel and recursively fill all 4-directional neighbors that share the same original color. Skip if the new color equals the original color to avoid infinite loops.

```javascript
function floodFill(image, sr, sc, color) {
  const orig = image[sr][sc];
  if (orig === color) return image;
  function dfs(r, c) {
    if (r < 0 || r >= image.length || c < 0 || c >= image[0].length) return;
    if (image[r][c] !== orig) return;
    image[r][c] = color;
    dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
  }
  dfs(sr, sc);
  return image;
}
```

**Time Complexity:** O(m × n)

**Space Complexity:** O(m × n) for recursion stack
