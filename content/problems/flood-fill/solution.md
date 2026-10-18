## Iterative Flood Fill

Record the source color. If it already equals the replacement, return immediately. Otherwise, repaint each pixel when adding it to the stack so it cannot be added twice. Explore only its four orthogonal neighbors.

```javascript
function floodFill(image, sr, sc, color) {
  const original = image[sr][sc];
  if (original === color) return image;
  const stack = [[sr, sc]];
  image[sr][sc] = color;
  const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (stack.length) {
    const [r, c] = stack.pop();
    for (const [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nr >= image.length || nc < 0 || nc >= image[0].length) continue;
      if (image[nr][nc] !== original) continue;
      image[nr][nc] = color;
      stack.push([nr, nc]);
    }
  }
  return image;
}
```

**Time:** O(m × n) worst case | **Space:** O(m × n) for the explicit stack.
