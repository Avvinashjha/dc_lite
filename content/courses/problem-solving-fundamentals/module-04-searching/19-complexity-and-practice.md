# Complexity, Pitfalls, and Practice Ladder

## Complexity cheat sheet

| Algorithm | Precondition | Time | Extra space |
| --- | --- | --- | --- |
| Linear search | none | O(n) | O(1) |
| Binary search (closed) | sorted | O(log n) | O(1) |
| Binary search (half-open) | sorted | O(log n) | O(1) |
| Lower / upper bound | sorted | O(log n) | O(1) |
| First / last occurrence | sorted | O(log n) | O(1) |
| Floor / ceiling | sorted | O(log n) | O(1) |
| Find min in rotated array | rotated sorted, distinct | O(log n) | O(1) |
| Search in rotated array | rotated sorted, distinct | O(log n) | O(1) |
| Search in rotated array II | rotated sorted, duplicates | O(log n) avg, O(n) worst | O(1) |
| Find peak element | adjacent differ | O(log n) | O(1) |
| Binary search on answer | monotonic predicate | O(T · log U) | O(1) |
| Search 2D matrix (LC 74) | row-major sorted | O(log(mn)) | O(1) |
| Search 2D matrix II (LC 240) | rows + cols sorted | O(m + n) | O(1) |

`T` = cost of one predicate call, `U` = answer-range width.

## Common pitfalls (ranked by how often they bite)

1. **Off-by-one in the loop.** Mixing `[lo, hi]` (closed) with `[lo, hi)` (half-open) templates is the single biggest source of bugs. Pick one and stick with it.
2. **`lo = mid` or `hi = mid` in the closed template.** Causes infinite loops when the window has 1 element. Always use `mid ± 1` in closed intervals; use bare `mid` only in the half-open template when you set `hi = mid`.
3. **Overflow-style midpoint.** Use `(lo + hi) >>> 1` for array indices. For unconstrained values (e.g., `First Bad Version` where `n` can be near `INT_MAX`), use `lo + Math.floor((hi - lo) / 2)` to be safe.
4. **Binary searching unsorted data.** Unsorted arrays need a **monotonic predicate** or a **hash map** — not binary search on the raw index.
5. **Duplicates in a rotated array.** The distinct-elements template gives wrong answers when `nums[lo] === nums[mid] === nums[hi]`; fall back to the shrink-by-one variant (lesson 12).
6. **Using `>>> 1` on negative values.** The unsigned shift treats the sign bit as a huge positive number — wrong midpoint. Use `Math.floor((lo + hi) / 2)` if `lo` or `hi` can be negative.

## Decision guide

Use the first row that matches:

| You need | Template |
| --- | --- |
| Exact match in a sorted array | Closed-interval binary search (lesson 03) |
| First index satisfying a condition | Half-open lower-bound (lesson 05) |
| Count of a value | `upperBound - lowerBound` (lesson 06) |
| Smallest integer where a yes/no check holds | Binary search on the answer (lessons 14–15) |
| Rotated sorted array, find min | `findMin` (lesson 10) |
| Rotated sorted array, search | Sorted-half decision (lessons 11–12) |
| Peak in a bumpy array | Slope comparison (lesson 13) |
| Value in a strictly sorted 2D matrix | Row-major binary search (lesson 16) |
| Value in a row/col sorted matrix | Staircase walk (lesson 17) |

## Practice ladder

**Warm-up — templates**

1. [Binary Search](/problems/binary-search)
2. [Search Insert Position](/problems/search-insert-position)

**Core — bounds and rotated**

3. [First Bad Version](/problems/first-bad-version)
4. [Ceiling in a sorted array](/problems/ceiling-in-a-sorted-array)
5. [Find Peak Element](/problems/find-peak-element)
6. [Search in Rotated Sorted Array](/problems/search-in-rotated-sorted-array)

**2D matrix**

7. [Search a 2D Matrix](/problems/search-a-2d-matrix)

Finish items 1–3 before moving on — they encode the templates every later lesson reuses.

## Closing advice

- Pick **one** binary-search template and memorize it. Most interviewers do not care whether you use closed or half-open; they care that your code is **correct on the first submission**.
- Verbalize the **invariant** before writing the loop. If you can say "everything at index `< lo` is confirmed too small," you almost always write the loop correctly.
- When the problem does not look like binary search, ask: is there a **monotonic predicate** hiding inside? If yes, you probably want lesson 14–15.

:::quiz
question: Which template handles "return nums.length when target is larger than all elements" most naturally?
options:
  - Closed interval [lo, hi].
  - Half-open [lo, hi).
answer: 1
explanation: Half-open can return the past-the-end index `nums.length` as a valid answer.
:::

:::quiz
question: A problem asks for the smallest integer speed satisfying a constraint. The right tool is:
options:
  - Binary search on the answer with a monotonic predicate.
  - Sort the input first.
answer: 0
explanation: The answer space itself is what we binary-search; sorting the input is unrelated.
:::

:::quiz
question: For a rotated sorted array with duplicates, worst-case time of the standard algorithm is:
options:
  - O(log n)
  - O(n)
answer: 1
explanation: Duplicates can force the ambiguity shrink branch on every step.
:::

:::exercise
title: Pick the template in one sentence
description: For each situation, name the lesson / template in one sentence — no code: (a) Count how many times 7 appears in a sorted array; (b) Find the first version that started failing given a monotone isBad API; (c) Search for 9 in a row-column-sorted matrix.
starterCode: |
  // (a)
  // (b)
  // (c)
:::

## What's next

Module **05 (Sorting)** teaches algorithms that produce the sorted arrays this module assumed. Keep these binary-search templates nearby — sorting plus binary search is a powerful interview combination.
