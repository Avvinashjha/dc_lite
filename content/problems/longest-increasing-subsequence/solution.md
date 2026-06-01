## Approach: Binary Search (Patience Sort)

Maintain a `tails` array where `tails[i]` is the smallest tail element of all increasing subsequences of length `i+1`. For each number, use binary search to find its position in tails. This gives O(n log n) time.

```javascript
function longestIncreasingSubsequence(nums) {
  const tails = [];
  for (const num of nums) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < num) lo = mid + 1;
      else hi = mid;
    }
    tails[lo] = num;
  }
  return tails.length;
}
```

**Time Complexity:** O(n log n)

**Space Complexity:** O(n)
