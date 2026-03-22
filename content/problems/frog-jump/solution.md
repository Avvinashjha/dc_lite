## DP with Hash Map

Track possible jump sizes at each stone.

```javascript
function canCross(stones) {
  const map = new Map();
  for (const s of stones) map.set(s, new Set());
  map.get(0).add(0);
  for (const s of stones) {
    for (const k of map.get(s)) {
      for (const step of [k-1, k, k+1]) {
        if (step > 0 && map.has(s + step)) map.get(s + step).add(step);
      }
    }
  }
  return map.get(stones[stones.length - 1]).size > 0;
}
```

**Time:** O(n²) | **Space:** O(n²)
