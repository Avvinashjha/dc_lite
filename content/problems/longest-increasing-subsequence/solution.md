## Approach: Binary Search (Patience Sort)

Maintain a `tails` array where `tails[i]` is the smallest tail element of all increasing subsequences of length `i+1`. For each number, find the first tail greater than or equal to it. Replace that tail, or append if all tails are smaller. An equal value replaces an existing tail instead of extending the sequence, enforcing strict increase. A smaller tail preserves more opportunities to extend a subsequence later.

The `tails` entries need not themselves form a subsequence of the input; only the array length is the answer.

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
