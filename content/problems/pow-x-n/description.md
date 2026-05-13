Implement `myPow(x, n)`, which calculates `x` raised to the power `n` (that is, `x^n`).

**Example 1**

- Input: `x = 2.00000, n = 10`
- Output: `1024.00000`

**Example 2**

- Input: `x = 2.10000, n = 3`
- Output: `9.26100`

**Example 3**

- Input: `x = 2.00000, n = -2`
- Output: `0.25000`
- Explanation: `2^(-2) = 1 / (2^2) = 1 / 4 = 0.25`.

**Constraints**

- `-100.0 < x < 100.0`
- `-2^31 <= n <= 2^31 - 1`
- Either `x != 0` or `n > 0`
- The result is guaranteed to fit inside a 64-bit floating-point number.

**Why it matters**

A naive O(n) loop is easy, but you can do much better. The identity `x^n = x^(n/2) * x^(n/2)` (with a fix-up for odd n) turns the problem into a classic divide-and-conquer recursion with time complexity O(log n). It is one of the cleanest examples of halving recursion in existence.
