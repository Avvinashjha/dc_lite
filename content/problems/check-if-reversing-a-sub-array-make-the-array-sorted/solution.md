## Compare with the Sorted Order

Find the first and last indices that differ from a sorted copy. If one reversal can sort the array, reversing that complete interval must produce the sorted order. This also handles duplicate values at the interval boundaries.

```javascript
function canSortByReversing(arr) {
  const sorted = [...arr].sort((a,b)=>a-b);
  let left = 0, right = arr.length - 1;
  while (left < arr.length && arr[left] === sorted[left]) left++;
  while (right > left && arr[right] === sorted[right]) right--;
  for (let i = left; i <= right; i++) if (arr[left + right - i] !== sorted[i]) return false;
  return true;
}
```

**Time:** O(n log n) | **Space:** O(n)
