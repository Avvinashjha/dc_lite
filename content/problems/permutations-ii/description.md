You're given an array `nums` that may contain repeated values. Generate every distinct permutation of its elements, in any order.

The tricky part is filtering out duplicate arrangements. For instance, when two `1`s exist in the input, swapping those two shouldn't be treated as producing a separate permutation.

### Examples

```
Input: nums = [1, 1, 2]
Output: [[1, 1, 2], [1, 2, 1], [2, 1, 1]]
```

```
Input: nums = [1, 2, 3]
Output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
```

### Constraints

- `1 <= nums.length <= 8`
- `-10 <= nums[i] <= 10`
