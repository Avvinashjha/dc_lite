## Distance Check

Compute all six pairwise **squared** distances and sort them. A square has four equal, nonzero side distances and two equal diagonal distances, each exactly twice a side distance. These checks are independent of input order and reject repeated points.

Squared distances avoid square roots and floating-point tolerance. Under the coordinate bounds, every squared distance is at most `800000000`, which is exactly representable as a JavaScript integer.

```javascript
function validSquare(p1, p2, p3, p4) {
  function dist(a, b) { return (a[0]-b[0])**2 + (a[1]-b[1])**2; }
  const dists = [dist(p1,p2),dist(p1,p3),dist(p1,p4),dist(p2,p3),dist(p2,p4),dist(p3,p4)].sort((a,b)=>a-b);
  return dists[0] > 0 && dists[0]===dists[1] && dists[1]===dists[2] && dists[2]===dists[3] && dists[4]===dists[5] && dists[4]===2*dists[0];
}
```

**Time:** O(1) | **Space:** O(1)
