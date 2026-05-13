You are climbing a staircase that has `n` steps. Each time you can climb **1** or **2** steps. In how many **distinct** ways can you reach the top?

**Example 1**

- Input: `n = 2`
- Output: `2`
- Explanation: `1 + 1` and `2`.

**Example 2**

- Input: `n = 3`
- Output: `3`
- Explanation: `1 + 1 + 1`, `1 + 2`, `2 + 1`.

**Example 3**

- Input: `n = 5`
- Output: `8`

**Constraints**

- `1 <= n <= 45`

**Why it matters**

This is the Fibonacci recurrence in disguise. To reach step `n`, your last move was either a 1-step (from step `n-1`) or a 2-step (from step `n-2`), so `f(n) = f(n-1) + f(n-2)`. It is the perfect bridge from recursion to dynamic programming.
