**Approach: Hash Map**

For each number, check if `target - num` exists in a map of value → index. If it does, return the two indices. Otherwise store the current value and its index.

```javascript
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}
```

Time: O(n), Space: O(n).
