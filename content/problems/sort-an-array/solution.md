## Merge sort (stable, O(n log n) worst-case time)

Uses an auxiliary buffer for merging.

```javascript
function sortArray(nums) {
  const n = nums.length;
  const aux = new Array(n);

  function merge(lo, mid, hi) {
    let i = lo, j = mid + 1, k = lo;
    while (i <= mid && j <= hi) {
      if (nums[i] <= nums[j]) aux[k++] = nums[i++];
      else aux[k++] = nums[j++];
    }
    while (i <= mid) aux[k++] = nums[i++];
    while (j <= hi) aux[k++] = nums[j++];
    for (let t = lo; t <= hi; t++) nums[t] = aux[t];
  }

  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = (lo + hi) >>> 1;
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  sort(0, n - 1);
  return nums;
}
```

**Time:** O(n log n) &nbsp; **Space:** O(n) for `aux` (plus O(log n) recursion stack).

## Note

Quicksort (with random pivot) or heapsort are valid alternatives when you want different space trade-offs; merge sort above matches stable O(n log n) worst-case time with clear merge logic.
