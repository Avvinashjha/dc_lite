## Merge Sort with Index Tracking

Merge the index ranges in descending value order while retaining original indices. When a left value exceeds the current right value, it also exceeds all remaining right values, so add hi - j to its count. On equality, take the right value first without increasing the count; equal values must not count as smaller.

```javascript
function countSmaller(nums) {
  const n = nums.length,
    counts = Array(n).fill(0);
  const indices = nums.map((_, i) => i);
  function mergeSort(lo, hi) {
    if (hi - lo <= 1) return;
    const mid = (lo + hi) >> 1;
    mergeSort(lo, mid);
    mergeSort(mid, hi);
    const temp = [];
    let i = lo,
      j = mid;
    while (i < mid && j < hi) {
      if (nums[indices[i]] > nums[indices[j]]) {
        counts[indices[i]] += hi - j;
        temp.push(indices[i++]);
      } else temp.push(indices[j++]);
    }
    while (i < mid) temp.push(indices[i++]);
    while (j < hi) temp.push(indices[j++]);
    for (let k = lo; k < hi; k++) indices[k] = temp[k - lo];
  }
  mergeSort(0, n);
  return counts;
}
```

**Time:** O(n log n) | **Space:** O(n)
