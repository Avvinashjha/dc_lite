## Approach: Dynamic Programming

`dp[i][j]` stores the length of the longest common subarray ending at `nums1[i-1]` and `nums2[j-1]`. If the values match, `dp[i][j] = dp[i-1][j-1] + 1`. Track the maximum.

```javascript
function maximumLengthOfRepeatedSubarray(nums1, nums2) {
  const m = nums1.length, n = nums2.length;
  const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));
  let max = 0;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      if (nums1[i-1] === nums2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        max = Math.max(max, dp[i][j]);
      }
  return max;
}
```

**Time Complexity:** O(m × n)

**Space Complexity:** O(m × n)
