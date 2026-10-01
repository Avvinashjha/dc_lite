Imagine a chess knight set down on a phone keypad instead of a chessboard. Starting from any digit cell 0-9, it hops around using its usual L-shaped chess move, and each cell it lands on gets appended as a digit to the number being dialed. For a given length `n`, count how many distinct `n`-digit numbers the knight could produce this way. Since the count can get huge, return it modulo 10^9 + 7. Note that the knight has nowhere to jump from cell 5.

**Example 1:**
```
Input: n = 1
Output: 10
```

**Example 2:**
```
Input: n = 2
Output: 20
```
