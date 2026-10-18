## Binary Search on Answer

Sort the coordinates. For a candidate distance, place the first cow at the leftmost stall, then place each next cow in the earliest stall far enough from the previous one. Choosing earlier positions leaves at least as much space for the remaining cows, so this greedy scan determines feasibility.

If a distance allows at least c cows, any smaller distance does too. Binary search for the largest feasible distance. An answer of zero is valid when separate stalls share coordinates.

```javascript
function aggressiveCows(stalls, c) {
  stalls.sort((a,b)=>a-b);
  let lo = 1, hi = stalls[stalls.length-1] - stalls[0];
  while (lo <= hi) {
    const mid = Math.floor(lo + (hi-lo)/2);
    let cows = 1, last = stalls[0];
    for (let i = 1; i < stalls.length; i++) {
      if (stalls[i] - last >= mid) { cows++; last = stalls[i]; }
    }
    if (cows >= c) lo = mid + 1; else hi = mid - 1;
  }
  return hi;
}
```

**Time:** O(n log n + n log(D + 1)), where D is the coordinate range. Sorting is included.

**Auxiliary space:** O(1) for the search itself, plus the JavaScript sorting implementation’s workspace (commonly O(n)).
