## Approach: Prefix Sum Remainders

If two prefix sums have the same remainder when divided by `k`, the subarray between them sums to a multiple of `k`. Count remainder frequencies as you go. Be careful with negative remainders — add `k` and mod again to normalize.

```javascript
function subarraysDivByK(nums, k) {
  const count = new Array(k).fill(0);
  count[0] = 1;
  let prefixSum = 0;
  let result = 0;

  for (const num of nums) {
    prefixSum += num;
    let rem = ((prefixSum % k) + k) % k;
    result += count[rem];
    count[rem]++;
  }
  return result;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(k)
