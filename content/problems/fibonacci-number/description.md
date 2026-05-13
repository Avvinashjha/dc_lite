The **Fibonacci numbers**, commonly denoted `F(n)`, form a sequence where each number is the sum of the two preceding ones, starting from `0` and `1`.

Formally:

```
F(0) = 0
F(1) = 1
F(n) = F(n - 1) + F(n - 2)   for n >= 2
```

Given `n`, compute `F(n)`.

**Example 1**

- Input: `n = 2`
- Output: `1`
- Explanation: `F(2) = F(1) + F(0) = 1 + 0 = 1`.

**Example 2**

- Input: `n = 4`
- Output: `3`
- Explanation: `F(4) = F(3) + F(2) = 2 + 1 = 3`.

**Example 3**

- Input: `n = 10`
- Output: `55`

**Constraints**

- `0 <= n <= 30`

**Why it matters**

Fibonacci is the textbook example of a recursion whose naive form is **exponential** but whose memoized form is **linear**. Writing all three common solutions — naive, memoized, iterative — on the same function is one of the fastest ways to internalize the memoization technique.
