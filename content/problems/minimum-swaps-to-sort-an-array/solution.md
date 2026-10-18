## Cycle Detection

Sorting a copy identifies the unique target position of every value. Map values to their original indices, then follow the resulting permutation cycles. A cycle of length L needs exactly L - 1 swaps: each swap can increase the number of resolved cycles by at most one, and repeatedly placing one cycle element achieves that bound. Sum the costs of disjoint cycles; fixed points cost zero. The distinct-value constraint makes the position mapping unambiguous.

```javascript
function minSwaps(arr) {
  const sorted = [...arr].sort((a,b)=>a-b);
  const idx = new Map(); arr.forEach((v,i)=>idx.set(v,i));
  const visited = Array(arr.length).fill(false);
  let swaps = 0;
  for (let i = 0; i < arr.length; i++) {
    if (visited[i] || arr[i]===sorted[i]) continue;
    let cycleLen = 0, j = i;
    while (!visited[j]) { visited[j]=true; j=idx.get(sorted[j]); cycleLen++; }
    swaps += cycleLen - 1;
  }
  return swaps;
}
```

**Time:** O(n log n) | **Space:** O(n)
