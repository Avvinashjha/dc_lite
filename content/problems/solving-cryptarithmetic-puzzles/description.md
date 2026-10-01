In a cryptarithmetic puzzle, every letter in an arithmetic expression stands for one fixed, unique digit from 0 through 9, and no word may begin with a letter mapped to 0. Given a word-based equation such as `SEND + MORE = MONEY`, work out a digit-to-letter mapping that makes the arithmetic correct.

**Example 1:**
```
Input: "SEND + MORE = MONEY"
Output: {S:9, E:5, N:6, D:7, M:1, O:0, R:8, Y:2}
Explanation: With this mapping, 9567 + 1085 = 10652.
```

**Example 2:**
```
Input: "TWO + TWO = FOUR"
Output: {T:7, W:3, O:4, F:1, U:6, R:8}
Explanation: With this mapping, 734 + 734 = 1468.
```

**Edge cases:** If no mapping satisfies the equation, indicate that no solution exists. Since only 10 digits are available, a puzzle can involve at most 10 distinct letters.
