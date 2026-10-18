Use a hash map to store prefix sums and their frequencies. At each index, check if `currentSum - k` exists in the map — if so, those many subarrays ending here sum to `k`.

Seed the empty prefix with frequency 1 so subarrays starting at index 0 are counted. Count matches before recording the current prefix; reversing that order would count an empty subarray. Frequencies, rather than a set, preserve multiple valid starting indices.

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

Negative values mean extending a window can increase or decrease its sum, so a standard positive-only sliding-window method does not apply.
