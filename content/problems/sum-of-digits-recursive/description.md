Given a non-negative integer `n`, return the **sum of its decimal digits**, computed recursively.

**Example 1**

- Input: `n = 7`
- Output: `7`

**Example 2**

- Input: `n = 1234`
- Output: `10`
- Explanation: `1 + 2 + 3 + 4 = 10`.

**Example 3**

- Input: `n = 99999`
- Output: `45`

**Constraints**

- `0 <= n <= 10^9`

**What you will practice**

This is the cleanest possible "head and tail" recursion on integers:

- **Head** of `n` = `n % 10` (the last digit).
- **Tail** of `n` = `Math.floor(n / 10)` (everything else).

With those two operations you can peel off one digit at a time — exactly the shape of sequence recursion you learned on arrays and strings, now applied to numbers.
