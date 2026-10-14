## Sort by Ratio + Max-Heap

Sort by wage/quality ratio. Use max-heap to maintain k smallest qualities.

```javascript
function mincostToHireWorkers(quality, wage, k) {
  const workers = quality.map((q,i) => [wage[i]/q, q]).sort((a,b) => a[0]-b[0]);

  const heap = [];
  function push(value) {
    heap.push(value); let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i-1)/2); if (heap[p] >= heap[i]) break;
      [heap[p],heap[i]] = [heap[i],heap[p]]; i = p;
    }
  }
  function pop() {
    const max = heap[0], last = heap.pop();
    if (heap.length) {
      heap[0] = last; let i = 0;
      while (2*i+1 < heap.length) {
        let child = 2*i+1;
        if (child+1 < heap.length && heap[child+1] > heap[child]) child++;
        if (heap[i] >= heap[child]) break;
        [heap[i],heap[child]] = [heap[child],heap[i]]; i = child;
      }
    }
    return max;
  }
  let qualSum = 0, min = Infinity;
  for (const [ratio, q] of workers) {
    push(q); qualSum += q;
    if (heap.length > k) { qualSum -= pop(); }
    if (heap.length === k) min = Math.min(min, qualSum * ratio);
  }
  return min;
}
```

**Time:** O(n log n) | **Space:** O(n)
