## Binary Search on Answer

```javascript
function aggressiveCows(stalls, c) {
  stalls.sort((a,b)=>a-b);
  let lo = 1, hi = stalls[stalls.length-1] - stalls[0];
  while (lo <= hi) {
    const mid = (lo+hi)>>1;
    let cows = 1, last = stalls[0];
    for (let i = 1; i < stalls.length; i++) {
      if (stalls[i] - last >= mid) { cows++; last = stalls[i]; }
    }
    if (cows >= c) lo = mid + 1; else hi = mid - 1;
  }
  return hi;
}
```

**Time:** O(n log(max_dist)) | **Space:** O(1)
