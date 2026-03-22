Given an `m x n` matrix filled with 'X' and 'O', capture all regions that are completely surrounded by 'X'. A region of 'O' is captured by flipping all 'O's into 'X's in that surrounded region. An 'O' on the border or connected to a border 'O' cannot be captured. Return the modified matrix.

**Example:**
```
Input: [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]
Output: [["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]
```
