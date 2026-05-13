# 2D Arrays, Complexity, and Practice

A **2D array** (matrix) is often represented as an **array of rows**, each row an array: `matrix[row][col]`. Many grid problems are graph problems in disguise — for this module we focus on **indexing**, **boundaries**, and **complexity** so you can read solutions confidently.

## Row-major layout

```javascript
const grid = [
  [1, 2, 3],
  [4, 5, 6],
];

const rows = grid.length;       // 2
const cols = grid[0].length;    // 3 — assume rectangular

console.log(grid[1][2]);        // 6
```

```text
      col0  col1  col2
row0   1     2     3
row1   4     5     6
```

Always verify `0 <= r < rows` and `0 <= c < cols` before access in DFS/BFS — out-of-bounds crashes or wrong answers.

## Walking neighbors

Four-directional neighbors of `(r, c)`:

```javascript
const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
for (const [dr, dc] of dirs) {
  const nr = r + dr, nc = c + dc;
  if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
  // visit (nr, nc)
}
```

## Spiral / layer patterns (preview)

Spiral matrix walks fix **four boundaries** (top, bottom, left, right) and shrink them after each side — a structured same-direction pointer pattern in 2D.

## Big-O recap for this module

| Technique | Time (typical) | Space (typical) |
| --------- | -------------- | ---------------- |
| Single scan | O(n) | O(1) |
| Hash map | O(n) | O(n) |
| Sort + two pointers | O(n log n) | O(1) or O(n) |
| Sliding window | O(n) | O(1) or O(k) |
| Prefix + map | O(n) | O(n) |
| Nested loops | O(n²) | O(1) |

**n** usually means array length or string length; **state** the variable when you analyze.

## Curated practice ladder

**Warmup — APIs and scanning**

1. [Merge Sorted Array](/problems/merge-sorted-array)
2. [Remove Duplicates from Sorted Array](/problems/remove-duplicates-from-sorted-array)
3. [Longest Common Prefix](/problems/longest-common-prefix)

**Core — maps and two pointers**

4. [Two Sum](/problems/two-sum)
5. [Valid Anagram](/problems/valid-anagram)
6. [Best Time to Buy and Sell Stock](/problems/best-time-to-buy-and-sell-stock)
7. [Container With Most Water](/problems/container-with-most-water)

**Windows and subarrays**

8. [Longest Substring Without Repeating Characters](/problems/longest-substring-without-repeating-characters)
9. [Subarray Sum Equals K](/problems/subarray-sum-equals-k)

**Stretch — strings and structure**

10. [Valid Parentheses](/problems/valid-parentheses)

Work top to bottom; if you stall, re-read the lesson that matches the tag (hash map, two pointers, window, prefix).

:::quiz
question: For an R x C matrix stored as an array of R arrays, what is the valid range for column index c on row r?
options:
  - 0 <= c < grid[r].length (often C if rectangular)
  - 0 <= c <= R
  - 0 <= c < R
answer: 0
explanation: Column indices run along the inner array; for rectangular grids, each row has length C, so c is in [0, C).
:::

:::quiz
question: Why declare four-direction neighbor checks with bounds tests?
options:
  - To avoid accessing indices outside the grid, which would read undefined or throw.
  - Because JavaScript arrays cannot be nested.
answer: 0
explanation: Out-of-bounds access is a frequent bug in grid DFS/BFS; explicit checks keep the walk valid.
:::

:::quiz
question: Combining two nested loops over an n-element array is typically what time complexity?
options:
  - O(n)
  - O(n log n)
  - O(n²)
answer: 2
explanation: Roughly n choices for the outer index and n for the inner gives quadratic behavior unless early exit dominates.
:::

:::exercise
title: Sum a matrix
description: Write `matrixSum(grid)` that returns the sum of all numbers in a rectangular 2D array using nested loops.
starterCode: |
  function matrixSum(grid) {
    // Assume grid is non-empty and rectangular.
  }

  console.log(matrixSum([[1, 2], [3, 4]])); // 10
:::

## Where next

Module 03 will deepen **searching and sorting** on arrays. For now, finish the ladder above — you will reuse every pattern in harder problems.
