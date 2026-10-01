You're given an array `nums` holding `n` distinct integers, with every value falling somewhere in the inclusive range `[0, n]`. Out of all the integers in that range, exactly one does not appear in the array — figure out which one and return it.

The complete range spans `n + 1` values, `{0, 1, …, n}`, while the array only holds `n` of them.

**Example 1**

- Input: `nums = [3, 0, 1]`
- Output: `2`

**Example 2**

- Input: `nums = [0, 1]`
- Output: `2` (numbers present are `0` and `1`; `n = 2`, so missing is `2`)

**Example 3**

- Input: `nums = [9, 6, 4, 2, 3, 5, 7, 0, 1]`
- Output: `8`

**Constraints**

- `n == nums.length`
- `1 <= n <= 10^4`
- `0 <= nums[i] <= n`
- All values in `nums` are distinct
