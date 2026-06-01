Use a modified merge sort. During the merge step, for each element in the left half, count how many elements in the right half satisfy `nums[i] > 2 * nums[j]` before performing the standard merge.

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
    let l = lo, r = mid + 1;
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
