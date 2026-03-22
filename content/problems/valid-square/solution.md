## Distance Check

A valid square has 4 equal sides and 2 equal diagonals.

```javascript
function validSquare(p1, p2, p3, p4) {
  function dist(a, b) { return (a[0]-b[0])**2 + (a[1]-b[1])**2; }
  const dists = [dist(p1,p2),dist(p1,p3),dist(p1,p4),dist(p2,p3),dist(p2,p4),dist(p3,p4)].sort((a,b)=>a-b);
  return dists[0] > 0 && dists[0]===dists[1] && dists[1]===dists[2] && dists[2]===dists[3] && dists[4]===dists[5];
}
```

**Time:** O(1) | **Space:** O(1)
