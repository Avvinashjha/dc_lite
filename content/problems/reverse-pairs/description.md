Given an integer array `nums`, count all pairs of original indices `(i, j)` satisfying both:

- `i < j`
- `nums[i] > 2 * nums[j]`

Return the count, not the pairs themselves. The comparison is **strict**: equality does not qualify. The values may be negative or repeated, and different index pairs count separately. You may modify the array while computing the answer.

For `[1, 3, 2, 3, 1]`, the two qualifying pairs are `(1, 4)` and `(3, 4)`, using zero-based indices. For `[-5, -5]`, the answer is `1` because `-5 > -10`; equal values can qualify when they are negative.
