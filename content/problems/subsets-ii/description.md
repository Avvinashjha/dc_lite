You're given an integer array `nums` that might contain repeated values. Generate every possible subset (the power set), making sure no two subsets in the result are identical. The subsets can be returned in any order.

### Examples

```
Input: nums = [1, 2, 2]
Output: [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]
```

```
Input: nums = [0]
Output: [[], [0]]
```

### Constraints

- `1 <= nums.length <= 10`
- `-10 <= nums[i] <= 10`
