## Count Cross-Half Pairs During Merge Sort

Recursively sort each half while counting pairs entirely within it. Before merging, count pairs whose first index belongs to the left half and second index to the right half; their original index ordering is guaranteed by that split.

For each sorted left value, advance a right pointer while `leftValue > 2 * rightValue`. Because left values increase, that pointer never needs to move backward. Add the number of qualifying right values, then perform an ordinary sorted merge for the parent call.

Every pair is counted once at the split where its indices first fall into different halves. Count before merging: afterward, the original half membership is lost. The algorithm sorts the input as a side effect.

Use arithmetic multiplication by `2`, not a bit shift. Doubling a signed 32-bit value is exact as a JavaScript Number, while a bit shift would wrap at 32 bits.

```javascript
function reversePairs(nums) {
  let count = 0;

  function mergeSort(arr, lo, hi) {
    if (lo >= hi) return;
    const mid = (lo + hi) >> 1;
    mergeSort(arr, lo, mid);
    mergeSort(arr, mid + 1, hi);

    let j = mid + 1;
    for (let i = lo; i <= mid; i++) {
      while (j <= hi && arr[i] > 2 * arr[j]) j++;
      count += j - (mid + 1);
    }

    const temp = [];
    let l = lo,
      r = mid + 1;
    while (l <= mid && r <= hi) {
      if (arr[l] <= arr[r]) temp.push(arr[l++]);
      else temp.push(arr[r++]);
    }
    while (l <= mid) temp.push(arr[l++]);
    while (r <= hi) temp.push(arr[r++]);
    for (let i = lo; i <= hi; i++) arr[i] = temp[i - lo];
  }

  mergeSort(nums, 0, nums.length - 1);
  return count;
}
```

**Time:** O(n log n)
**Space:** O(n)
