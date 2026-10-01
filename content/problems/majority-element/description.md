You're given an array `nums` of length `n`. Return its majority element — the value that shows up more than `⌊n / 2⌋` times. You can assume such an element always exists in the input.

Because it has to appear in more than half the positions, there can only ever be one candidate that qualifies.

### Examples

```
Input: nums = [3, 2, 3]
Output: 3
```

```
Input: nums = [2, 2, 1, 1, 1, 2, 2]
Output: 2
```

### Constraints

- `n == nums.length`
- `1 <= n <= 5 * 10^4`
- `-10^9 <= nums[i] <= 10^9`
