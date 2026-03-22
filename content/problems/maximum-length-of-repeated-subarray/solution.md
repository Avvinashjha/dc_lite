## DP

```javascript
function findLength(nums1, nums2) {
  const m = nums1.length, n = nums2.length;
  const dp = Array(n + 1).fill(0);
  let max = 0;
  for (let i = 1; i <= m; i++) {
    for (let j = n; j >= 1; j--) {
      dp[j] = nums1[i-1] === nums2[j-1] ? dp[j-1] + 1 : 0;
      max = Math.max(max, dp[j]);
    }
  }
  return max;
}
```

**Time:** O(mn) | **Space:** O(n)
