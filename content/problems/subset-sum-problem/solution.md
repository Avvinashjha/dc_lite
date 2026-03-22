## Approach: Dynamic Programming

Build a boolean DP table where `dp[j]` indicates whether a subset summing to `j` is achievable. For each number in the array, iterate backwards through the table to avoid using the same element twice.

```javascript
function isSubsetSum(arr, sum) {
  const dp = new Array(sum + 1).fill(false);
  dp[0] = true;

  for (const num of arr) {
    for (let j = sum; j >= num; j--) {
      if (dp[j - num]) dp[j] = true;
    }
  }
  return dp[sum];
}
```

**Time Complexity:** O(n × sum)

**Space Complexity:** O(sum)
