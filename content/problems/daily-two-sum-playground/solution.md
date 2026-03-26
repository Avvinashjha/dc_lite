# Solution

Use a hash map from value to index while scanning left to right.

For each `nums[i]`:

1. Compute `need = target - nums[i]`.
2. If `need` is already in the map, return `[map.get(need), i]`.
3. Otherwise add current value to the map and continue.

This runs in `O(n)` time and `O(n)` space.
