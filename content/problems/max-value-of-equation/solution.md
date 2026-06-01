Maximize `(yi + yj) + |xi - xj|`. Since points are sorted by x, this simplifies to maximizing `(yj + xj) + (yi - xi)` where `j > i`. Use a deque to maintain the maximum `yi - xi` for points within x-distance `k`.

```javascript
function findMaxValueOfEquation(points, k) {
  const deque = [];
  let result = -Infinity;

  for (const [xj, yj] of points) {
    while (deque.length && xj - deque[0][1] > k) {
      deque.shift();
    }

    if (deque.length) {
      result = Math.max(result, yj + xj + deque[0][0]);
    }

    const val = yj - xj;
    while (deque.length && deque[deque.length - 1][0] <= val) {
      deque.pop();
    }
    deque.push([val, xj]);
  }

  return result;
}
```

**Time:** O(n)
**Space:** O(n)
