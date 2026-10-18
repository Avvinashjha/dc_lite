## Greedy with Max-Heap

Treat fuel as the farthest distance reachable from the origin using the fuel selected so far, not the fuel currently left in a moving car. Add every station within that reach to a max-heap. If the target is still beyond reach, take the largest available fuel amount and count one stop. If none is available, the trip is impossible.

This retrospectively chooses which reachable station to stop at; it does not require driving backward. Among candidates already reachable, the largest fuel amount extends reach the most for one extra stop, so choosing it cannot require more stops than choosing a smaller amount. Each station enters and leaves the heap at most once.

```javascript
function minRefuelStops(target, startFuel, stations) {

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
  let fuel = startFuel, stops = 0, i = 0;
  while (fuel < target) {
    while (i < stations.length && stations[i][0] <= fuel) push(stations[i++][1]);
    if (!heap.length) return -1;
    fuel += pop(); stops++;
  }
  return stops;
}
```

**Time:** O(n log n) | **Space:** O(n)
