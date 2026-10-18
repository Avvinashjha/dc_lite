Maximize `(yi + yj) + |xi - xj|`. Since points are sorted by x, this simplifies to maximizing `(yj + xj) + (yi - xi)` where `j > i`. Use a deque to maintain the maximum `yi - xi` for points within x-distance `k`.

The active deque is the slice starting at `head`. Remove expired points from its front and weaker candidates from its back, never popping behind `head`. A newer point with at least as large a `y - x` dominates an older point because it also expires no earlier. Evaluate the current point before inserting it so the two points are distinct.

```javascript
function findMaxValueOfEquation(points, k) {
  const deque = []; let head = 0;
  let result = -Infinity;

  for (const [xj, yj] of points) {
    while (deque.length > head && xj - deque[head][1] > k) {
      head++;
    }

    if (deque.length > head) {
      result = Math.max(result, yj + xj + deque[head][0]);
    }

    const val = yj - xj;
    while (deque.length > head && deque[deque.length - 1][0] <= val) {
      deque.pop();
    }
    deque.push([val, xj]);
  }

  return result;
}
```

**Time:** O(n)
**Space:** O(n)
