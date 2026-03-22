## Sort by Ratio + Max-Heap

Sort by wage/quality ratio. Use max-heap to maintain k smallest qualities.

```javascript
function mincostToHireWorkers(quality, wage, k) {
  const workers = quality.map((q,i) => [wage[i]/q, q]).sort((a,b) => a[0]-b[0]);
  const heap = []; let qualSum = 0, min = Infinity;
  for (const [ratio, q] of workers) {
    heap.push(q); qualSum += q;
    heap.sort((a,b) => b-a);
    if (heap.length > k) { qualSum -= heap.shift(); }
    if (heap.length === k) min = Math.min(min, qualSum * ratio);
  }
  return min;
}
```

**Time:** O(n log n) | **Space:** O(n)
