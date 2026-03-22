## For Each Point, Count Slopes

```javascript
function maxPoints(points) {
  if (points.length <= 2) return points.length;
  let max = 2;
  for (let i = 0; i < points.length; i++) {
    const slopes = new Map();
    for (let j = i+1; j < points.length; j++) {
      const dx = points[j][0]-points[i][0], dy = points[j][1]-points[i][1];
      const key = dx === 0 ? 'inf' : (dy/dx).toFixed(10);
      slopes.set(key, (slopes.get(key)||1) + 1);
      max = Math.max(max, slopes.get(key));
    }
  }
  return max;
}
```

**Time:** O(n²) | **Space:** O(n)
