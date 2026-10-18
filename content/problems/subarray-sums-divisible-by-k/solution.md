## Approach: Prefix Sum Remainders

If two prefix sums have the same remainder when divided by `k`, the subarray between them sums to a multiple of `k`. Count remainder frequencies as you go. Be careful with negative remainders — add `k` and mod again to normalize.

Seed the empty prefix with frequency 1 so subarrays starting at index 0 are counted. Count matches before recording the current prefix; reversing that order would count an empty subarray. Frequencies, rather than a set, preserve multiple valid starting indices.

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

**Time Complexity:** O(n + k), including initialization of the k-entry frequency array

**Space Complexity:** O(k)
