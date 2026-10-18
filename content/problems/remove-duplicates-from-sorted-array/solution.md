## Two Pointers

Since the array is sorted, duplicates are always adjacent. Keep a slow pointer `k` that marks where the next unique value should go. Walk a fast pointer through the array — whenever you see a value different from `nums[k-1]`, write it at position `k` and advance `k`.

The invariant is that `nums[0..k-1]` contains the distinct values from all entries already scanned. Because the input is sorted, a different value starts a new group and can be written at the next free position. The write index never passes the read index, so overwriting the prefix does not destroy unread values.

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let k = 1;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[k - 1]) {
      nums[k] = nums[i];
      k++;
    }
  }
  return k;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(1)
