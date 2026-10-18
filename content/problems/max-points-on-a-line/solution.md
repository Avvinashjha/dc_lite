## Approach: Slope Counting with GCD

For each point, compute slopes to all other points. Use GCD to represent slopes as reduced fractions to avoid floating-point issues. Use a hashmap to count points sharing the same slope. Normalize the sign so opposite directions along the same line use the same key. Vertical lines become `(0, 1)` and horizontal lines become `(1, 0)`. The stored count includes the anchor itself. Scanning only later points is sufficient: the earliest input point on any optimal line sees every other point on that line. Track the global maximum.

```javascript
function maxPointsOnALine(points) {
  if (points.length <= 2) return points.length;
  function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }
  let max = 2;
  for (let i = 0; i < points.length; i++) {
    const map = new Map();
    for (let j = i + 1; j < points.length; j++) {
      let dx = points[j][0] - points[i][0];
      let dy = points[j][1] - points[i][1];
      const g = gcd(Math.abs(dx), Math.abs(dy));
      dx /= g; dy /= g;
      if (dx < 0 || (dx === 0 && dy < 0)) { dx = -dx; dy = -dy; }
      const key = dx + "," + dy;
      map.set(key, (map.get(key) || 1) + 1);
      max = Math.max(max, map.get(key));
    }
  }
  return max;
}
```

**Time Complexity:** O(n² log C), including Euclidean GCD, where C is the maximum absolute coordinate difference (use at least 2). With the fixed coordinate bounds, this is commonly written O(n²).

**Space Complexity:** O(n)
