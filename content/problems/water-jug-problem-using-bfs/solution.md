## BFS on States

```javascript
function canMeasureWater(x, y, target) {
  if (target > x + y) return false;
  const visited = new Set(), q = [[0, 0]];
  visited.add('0,0');
  while (q.length) {
    const [a, b] = q.shift();
    if (a===target||b===target||a+b===target) return true;
    const states = [[x,b],[a,y],[0,b],[a,0],
      [a-Math.min(a,y-b), b+Math.min(a,y-b)],
      [a+Math.min(b,x-a), b-Math.min(b,x-a)]];
    for (const [na,nb] of states) {
      const key = na+','+nb;
      if (!visited.has(key)) { visited.add(key); q.push([na,nb]); }
    }
  }
  return false;
}
```

**Time:** O(x × y) | **Space:** O(x × y)
