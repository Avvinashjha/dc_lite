Use a hash map to store prefix sums and their frequencies. At each index, check if `currentSum - k` exists in the map — if so, those many subarrays ending here sum to `k`.

```javascript
function subarraySum(nums, k) {
  const prefixCount = new Map([[0, 1]]);
  let sum = 0, count = 0;

  for (const num of nums) {
    sum += num;
    if (prefixCount.has(sum - k)) {
      count += prefixCount.get(sum - k);
    }
    prefixCount.set(sum, (prefixCount.get(sum) || 0) + 1);
  }

  return count;
}
```

**Time:** O(n)
**Space:** O(n)
