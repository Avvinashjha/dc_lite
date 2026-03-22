## Greedy with Max-Heap

As you pass stations, add their fuel to a max-heap. When empty, refuel from the largest available.

```javascript
function minRefuelStops(target, startFuel, stations) {
  const heap = []; let fuel = startFuel, stops = 0, i = 0;
  while (fuel < target) {
    while (i < stations.length && stations[i][0] <= fuel) heap.push(stations[i++][1]);
    if (!heap.length) return -1;
    heap.sort((a,b) => b-a);
    fuel += heap.shift(); stops++;
  }
  return stops;
}
```

**Time:** O(n log n) | **Space:** O(n)
