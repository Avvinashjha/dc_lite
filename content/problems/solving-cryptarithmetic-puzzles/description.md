A cryptarithmetic puzzle replaces digits with letters in an arithmetic equation. Each letter stands for a unique digit (0–9), and the leading letter of any word cannot be zero. Given an equation like `SEND + MORE = MONEY`, find a digit assignment that satisfies it.

**Example 1:**
```
Input: "SEND + MORE = MONEY"
Output: {S:9, E:5, N:6, D:7, M:1, O:0, R:8, Y:2}
Explanation: 9567 + 1085 = 10652
```

**Example 2:**
```
Input: "TWO + TWO = FOUR"
Output: {T:7, W:3, O:4, F:1, U:6, R:8}
Explanation: 734 + 734 = 1468
```

**Edge cases:** No valid assignment exists (return null or indicate no solution). Up to 10 unique letters is the maximum since there are only 10 digits.
