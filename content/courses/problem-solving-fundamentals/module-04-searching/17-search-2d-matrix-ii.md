# Search a 2D Matrix II (Staircase Walk)

**LeetCode 240.** Rows are sorted left-to-right, columns are sorted top-to-bottom. Unlike LC 74, there is **no** guarantee that rows stitch together into a single sorted sequence — the flattening trick does **not** apply here.

The standard solution is a **staircase walk** from the top-right corner, eliminating one row or one column per step. **O(m + n)** time, O(1) space.

## The key property

From the **top-right** corner `(r = 0, c = n - 1)`:

- Everything **below** the current cell is **greater-or-equal** in its column.
- Everything **to the left** of the current cell is **less-or-equal** in its row.

So at each step we have an unambiguous direction:

- `matrix[r][c] === target` → found.
- `matrix[r][c] > target` → current column is too big; move **left** (`c--`).
- `matrix[r][c] < target` → current row is too small; move **down** (`r++`).

## The code

```javascript
function searchMatrix(matrix, target) {
  if (!matrix.length || !matrix[0].length) return false;
  const m = matrix.length;
  const n = matrix[0].length;
  let r = 0;
  let c = n - 1;
  while (r < m && c >= 0) {
    const v = matrix[r][c];
    if (v === target) return true;
    if (v > target) c--;
    else r++;
  }
  return false;
}
```

## Walkthrough

```text
matrix = [[1,  4,  7, 11, 15],
          [2,  5,  8, 12, 19],
          [3,  6,  9, 16, 22],
          [10,13, 14,17, 24],
          [18,21, 23,26, 30]]   target = 5

start at (0, 4) = 15 > 5 -> c-- -> (0, 3) = 11 > 5 -> c--
(0, 2) = 7  > 5 -> c--
(0, 1) = 4  < 5 -> r++
(1, 1) = 5  == 5 -> return true
```

## Why O(m + n)?

Each step either decreases `c` by 1 or increases `r` by 1. `c` starts at `n - 1` and cannot go below 0; `r` starts at 0 and cannot exceed `m - 1`. So the total number of moves is at most `m + n`.

## Why start top-right?

Top-right has exactly one "smaller" direction (left) and one "larger" direction (down). **Top-left** is the minimum of the matrix — both neighbors are larger, so the comparison gives no direction. **Bottom-right** is the maximum — symmetric failure. **Bottom-left** is symmetric to top-right and also works; pick one and stick with it.

## Complexity

- **Time:** O(m + n).
- **Space:** O(1).

## Contrast with LC 74

| Property | LC 74 | LC 240 |
| --- | --- | --- |
| Row sorted | Yes | Yes |
| Column sorted | (implied by stronger rule) | Yes |
| First of each row > last of previous | **Yes** | No |
| Best time | O(log(m · n)) | O(m + n) |

Always check the stronger guarantee before choosing the flattening trick.

:::quiz
question: Why is starting at the top-right corner correct but starting at the top-left is not?
options:
  - Top-right has exactly one "smaller" and one "larger" neighbor, giving an unambiguous move; top-left has two "larger" neighbors, so we cannot decide.
  - Top-left has a negative value.
answer: 0
explanation: The comparison must resolve into a single discard direction; top-right and bottom-left are the two corners with that property.
:::

:::quiz
question: Total number of steps in the staircase walk for an m x n matrix is at most:
options:
  - m * n
  - m + n
  - log(m + n)
answer: 1
explanation: Each step decreases c by 1 or increases r by 1; together they are bounded by m + n.
:::

:::quiz
question: Can the LC 74 flattening trick (binary search on row-major index) be used here?
options:
  - No — LC 240 does not guarantee the matrix is a single sorted sequence in row-major order.
  - Yes — it always works for any matrix.
answer: 0
explanation: Without the "first of each row > last of previous" guarantee, the flat sequence is not monotonic.
:::

:::exercise
title: Implement staircase search
description: Implement `searchMatrix(matrix, target)` starting from the top-right corner. Return true/false.
starterCode: |
  function searchMatrix(matrix, target) {
    if (!matrix.length) return false;
    const m = matrix.length;
    const n = matrix[0].length;
    let r = 0, c = n - 1;
    // while (r < m && c >= 0) ...
    return false;
  }

  console.log(searchMatrix(
    [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]],
    5
  )); // true
  console.log(searchMatrix([[1]], 2)); // false
:::

## Practice

- [Search a 2D Matrix](/problems/search-a-2d-matrix) — if the input satisfies the stronger LC 74 rule, use the row-major binary search from the previous lesson; otherwise apply the staircase.
