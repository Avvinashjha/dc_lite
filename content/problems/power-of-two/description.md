You get an integer `n`. Decide whether `n` is a power of two: there must exist some integer `k >= 0` with `n = 2^k`. Return `true` or `false`.

Powers of two are `1, 2, 4, 8, ...`. Zero and negative integers are not powers of two in the usual sense for this problem.

**Example 1**

- Input: `n = 1`
- Output: `true` (since `2^0 = 1`)

**Example 2**

- Input: `n = 16`
- Output: `true` (since `2^4 = 16`)

**Example 3**

- Input: `n = 3`
- Output: `false`

**Constraints**

- `-2^31 <= n <= 2^31 - 1`
