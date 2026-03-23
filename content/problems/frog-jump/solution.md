## Approach: DP with HashMap

Map each stone position to a set of possible jump sizes that can reach it. Starting from stone 0 with jump 0, for each stone try jumps of k-1, k, and k+1. If the destination exists, add the jump size to that stone's set.

```javascript
function frogJump(stones) {
  const map = new Map();
  for (const s of stones) map.set(s, new Set());
  map.get(0).add(0);
  for (const s of stones) {
    for (const k of map.get(s)) {
      for (const jump of [k-1, k, k+1]) {
        if (jump > 0 && map.has(s + jump)) map.get(s + jump).add(jump);
      }
    }
  }
  return map.get(stones[stones.length - 1]).size > 0;
}
```

**Time Complexity:** O(n²)

**Space Complexity:** O(n²)
