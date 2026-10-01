You're given an `m x n` board made up of the characters `'X'` and `'O'`. Any region of connected `'O'` cells that is fully enclosed by `'X'` cells should be captured — flip every `'O'` in such a region over to `'X'`. An `'O'` sitting on the board's edge, or connected to one that is, is never considered enclosed and must stay as-is. Return the updated board.

**Example:**
```
Input: [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
```
