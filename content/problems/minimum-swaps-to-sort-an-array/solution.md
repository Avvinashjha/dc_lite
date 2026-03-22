## Cycle Detection

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
