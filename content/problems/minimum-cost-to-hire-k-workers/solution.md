## Sort by Ratio + Max-Heap

A selected group needs a rate at least as large as every member’s wage/quality ratio. Sort workers by that ratio. At each rate, all workers seen so far are affordable; retain the k smallest qualities using a max-heap, removing the largest quality when necessary. Their sum multiplied by the current rate is a feasible total. The optimal group is considered when its largest required ratio is reached.

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
