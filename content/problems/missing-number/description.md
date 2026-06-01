You get an array `nums` of length `n`. It contains `n` distinct integers, each in the range `[0, n]` inclusive. Exactly one integer in that range is missing from the array. Find and return that missing number.

The full set should be `{0, 1, …, n}`; the array lists `n` of them.

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
