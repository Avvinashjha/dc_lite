## Approach: Rolling Dynamic Programming

For each element of the first array, `dp[j]` records the length of the matching run ending at that element and at position `j - 1` of the second array. Matching values extend the previous row's diagonal by one; a mismatch resets the run to zero.

Update columns from right to left so `dp[j - 1]` still belongs to the previous row. Track the maximum over all positions, since the best run need not end at either array's final element. Use the shorter array for the DP columns to reduce memory.

```javascript
function maximumLengthOfRepeatedSubarray(nums1, nums2) {
  if (nums1.length < nums2.length) [nums1, nums2] = [nums2, nums1];
  const dp = new Array(nums2.length + 1).fill(0);
  let best = 0;
  for (const value of nums1) {
    for (let j = nums2.length; j >= 1; j--) {
      dp[j] = value === nums2[j - 1] ? dp[j - 1] + 1 : 0;
      best = Math.max(best, dp[j]);
    }
  }
  return best;
}
```

**Time Complexity:** O(m × n), where m and n are the input lengths.

**Space Complexity:** O(min(m, n)) auxiliary space. Neither input array is modified.
