Use three pointers starting from the end of both arrays and the end of `nums1`. Fill `nums1` from the back by comparing elements, which avoids overwriting elements that still need to be processed.

```javascript
function merge(nums1, m, nums2, n) {
  let i = m - 1, j = n - 1, k = m + n - 1;

  while (i >= 0 && j >= 0) {
    if (nums1[i] > nums2[j]) {
      nums1[k--] = nums1[i--];
    } else {
      nums1[k--] = nums2[j--];
    }
  }

  while (j >= 0) {
    nums1[k--] = nums2[j--];
  }
}
```

**Time:** O(m + n)
**Space:** O(1)
