# Binary Search: Intuition and the Halving Invariant

**Binary search** finds a value in a **sorted** array by repeatedly **halving** the search space. Each comparison eliminates one half — so an array of length `n` needs at most about `log2(n)` steps.

## The core idea

At every step we maintain a **window** `[lo, hi]` that is guaranteed to contain the answer **if** it exists. We look at the middle element:

- If it equals the target — done.
- If it is **smaller** than the target — the answer can only be to the **right**. Move `lo = mid + 1`.
- If it is **larger** than the target — the answer can only be to the **left**. Move `hi = mid - 1`.

The window shrinks by half each step. When the window becomes empty, the target is not in the array.

## Walkthrough

```text
nums = [1, 3, 5, 7, 9, 11]   target = 7

step 1: lo=0, hi=5, mid=2  -> nums[2]=5 < 7 -> go right -> lo=3
step 2: lo=3, hi=5, mid=4  -> nums[4]=9 > 7 -> go left  -> hi=3
step 3: lo=3, hi=3, mid=3  -> nums[3]=7 == target -> return 3
```

Three comparisons for 6 elements — and that scales to **about 20 comparisons for a million elements**.

## Why log2(n)?

Each step the window shrinks from length `L` to `L/2` (give or take one). You can only halve a positive integer about `log2(n)` times before it hits 1.

```text
n = 1_000_000
log2(n) ≈ 20
```

## The two preconditions

Binary search needs:

1. **Random access** — we must be able to read `nums[mid]` in O(1). Arrays qualify; singly-linked lists do **not**.
2. **Monotonic order** — so the comparison at `mid` tells you **which side** is safe to discard. Sorted numeric arrays are the classic case, but any monotone predicate works.

If the data is unsorted, binary search on indices is **invalid** — you must sort first or use a different structure (hash map, linear scan).

:::quiz
question: What is the worst-case number of comparisons binary search performs on a sorted array of length n?
options:
  - About log2(n)
  - About n / 2
  - About n
answer: 0
explanation: Each step halves the window; halvings are logarithmic in n.
:::

:::quiz
question: Why does binary search require the array to be sorted?
options:
  - Because otherwise the random-access cost is too high.
  - Because the comparison at mid must tell us unambiguously which half cannot contain the target; without order that decision is not safe.
answer: 1
explanation: The elimination step depends on knowing that everything left of mid is smaller (or larger) than nums[mid].
:::

:::quiz
question: Which data structure cannot be binary-searched in O(log n) the way an array can?
options:
  - A plain JavaScript array
  - A singly-linked list
answer: 1
explanation: A linked list does not support O(1) access by index; jumping to the middle requires O(n) traversal.
:::

:::exercise
title: Count the halvings
description: Write `countHalvings(n)` that returns how many times you can halve (integer divide by 2) a positive integer `n` before it reaches 1. This is the binary-search depth for length `n`.
starterCode: |
  function countHalvings(n) {
    let count = 0;
    // while n > 1, halve it and increment count
    return count;
  }

  console.log(countHalvings(1)); // 0
  console.log(countHalvings(8)); // 3
  console.log(countHalvings(1000)); // 9
:::

## Practice

- [Binary Search](/problems/binary-search) — the classic implementation. Read the next lesson before attempting; this one was just the intuition.
