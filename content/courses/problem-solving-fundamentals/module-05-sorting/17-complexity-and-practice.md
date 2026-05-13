# Choosing a Sort, Complexity, and Practice Ladder

## Complexity cheat sheet

| Algorithm | Best | Average | Worst | Extra space | Stable | In-place |
| --- | --- | --- | --- | --- | --- | --- |
| Bubble sort (optimized) | O(n) | O(n^2) | O(n^2) | O(1) | Yes | Yes |
| Selection sort | O(n^2) | O(n^2) | O(n^2) | O(1) | No (std.) | Yes |
| Insertion sort | O(n) | O(n^2) | O(n^2) | O(1) | Yes | Yes |
| Merge sort | O(n log n) | O(n log n) | O(n log n) | O(n) | Yes | No |
| Quicksort (random pivot) | O(n log n) | O(n log n) | O(n^2) rare | O(log n) stack | No | Yes |
| Heapsort | O(n log n) | O(n log n) | O(n log n) | O(1) | No | Yes |
| Counting sort | O(n + k) | O(n + k) | O(n + k) | O(n + k) | Yes (stable version) | No |
| Dutch flag | O(n) | O(n) | O(n) | O(1) | No | Yes |

## Decision guide

Pick the first row that matches your situation:

| You need | Algorithm |
| --- | --- |
| Tiny array (n < ~16) | Insertion sort |
| Nearly sorted data | Insertion sort (O(n)) |
| Guaranteed O(n log n), stable, RAM OK | Merge sort |
| Guaranteed O(n log n), minimum memory | Heap sort |
| Fastest in practice, no stability needed | Quicksort (random pivot) |
| Integer keys in `[0, k]` with small k | Counting sort |
| Sort an array of 0, 1, 2 (or 3-way partition) | Dutch National Flag |
| Multi-key sort in JavaScript with readable code | `Array.prototype.sort` + comparator |

## Common pitfalls (ranked by how often they bite)

1. **Calling `.sort()` on numbers without a comparator.** `[10, 2, 1].sort()` yields `[1, 10, 2]`. Always `sort((a, b) => a - b)` for numbers.
2. **Assuming quicksort is always O(n log n).** The last-element pivot on sorted input is O(n^2). Randomize or use median-of-three.
3. **Forgetting stability.** If you're sorting by multiple keys, stability of the last sort matters. Merge sort is stable; quicksort and heap sort are not.
4. **Counting sort on huge key ranges.** Allocating a `count` array of size `k = 10^9` is a non-starter. Counting sort requires bounded `k`.
5. **Skipping the `if (!swapped) break` optimization in bubble sort.** Makes best-case O(n) instead of O(n^2) — matters if the question asks about adaptive behavior.
6. **Using Lomuto partition on arrays with heavy duplicates.** Degenerates to O(n^2). Use 3-way partitioning (Dutch flag) when duplicates are common.

## Interview talking-points cheat sheet

When asked to sort, mention these quickly to show depth:

- "I'll use **merge sort** for a guaranteed O(n log n) worst case, or **quicksort with a random pivot** for the best constants in practice."
- "If stability matters (multi-key sort), merge sort is the safe choice."
- "For bounded integer keys I'd use **counting sort** in O(n + k)."
- "For heavy duplicates I'd switch to **3-way partitioning**."
- "For small sub-arrays I'd fall back to **insertion sort** — that's what production sorts like Timsort do."

## Practice ladder

**Warm-up — stability and correctness**

1. [Sort an Array](/problems/sort-an-array) — implement one O(n log n) sort end-to-end (merge or randomized quick).

**Core — partitioning**

2. [Sort Colors](/problems/sort-colors) — Dutch National Flag.
3. [Merge Sorted Array](/problems/merge-sorted-array) — merge step (write it both forward and backward).

**Linked lists**

4. [Merge Two Sorted Lists](/problems/merge-two-sorted-lists) — same merge idea on linked nodes.

Finish items 1–3 before moving on; item 4 is optional for breadth.

## What was deliberately left out

Per the awareness lesson (16), this module skipped:

- Full radix / bucket implementations.
- MSD radix for strings.
- Smoothsort, Shell sort, and other curiosities.
- External sorting.
- Parallel sort algorithms.

These appear in specialized courses; they are almost never asked in coding interviews.

## Closing advice

- Pick **merge sort** and **randomized quicksort** as your two default implementations; you will reach for one of them 90% of the time.
- Always verify your sort with **pathological inputs**: empty array, single element, all equal, already sorted, reverse sorted.
- When a problem looks O(n^2), ask **"would sorting make this easier?"** It often does — sort-then-solve (lesson 15) is one of the highest-leverage patterns in interviews.

:::quiz
question: Which sort combines guaranteed O(n log n) worst-case time with O(1) extra space?
options:
  - Merge sort
  - Heap sort
  - Quick sort
answer: 1
explanation: Heap sort is the standard answer — in-place and worst-case O(n log n).
:::

:::quiz
question: Your interviewer says "sort this 10-element array that's mostly already sorted." Best choice:
options:
  - Heap sort
  - Insertion sort
  - Radix sort
answer: 1
explanation: Insertion sort is O(n) on nearly-sorted data and has tiny constants.
:::

:::quiz
question: You must sort 10 million ints, all in [0, 255]. Best choice:
options:
  - Counting sort (O(n + k), k = 256).
  - Quicksort.
answer: 0
explanation: Bounded integer keys are exactly where counting sort shines.
:::

:::exercise
title: Match the problem to the sort
description: For each situation, name one reasonable algorithm from this module in a single sentence (no code): (a) in-place sort 1e6 random ints with worst-case O(n log n); (b) multi-key stable sort of records; (c) sort 5e4 integers with many duplicates; (d) sort an array of 0s, 1s, and 2s in a single pass.
starterCode: |
  // (a)
  // (b)
  // (c)
  // (d)
:::

## What's next

With searching and sorting behind you, you have the two primitives that appear in almost every other algorithm. The rest of the course builds on top: linked lists, stacks and queues, trees, graphs, and dynamic programming all reuse these patterns. Revisit the cheat sheet above any time a problem "feels sortable" or "feels like binary search."
