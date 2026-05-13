# Why Sort? Stability and the Comparison Model

**Sorting** rearranges a sequence into a chosen order (usually **non-decreasing** for numbers). It is one of the most reused building blocks in interviews: many problems become easy once data is ordered.

## What “sorted” means

For numbers, **ascending** means `a[0] <= a[1] <= ... <= a[n-1]`. For strings, we use **lexicographic** order unless stated otherwise.

## The comparison model

Many classic sorts only use **pairwise comparisons** `compare(x, y)` that returns whether `x` should come before `y`. In that model:

- **Lower bound:** sorting **n** distinct items needs **Omega(n log n)** comparisons in the worst case (decision-tree argument).
- Algorithms that achieve **O(n log n)** worst-case comparisons (like merge sort, heapsort) are **optimal** in this model up to constants.

Some algorithms beat **n log n** when you **do not** rely only on comparisons (for example **counting sort** when key range is small).

## Stability

A sort is **stable** if equal keys keep their **relative order** from the input.

```text
Before:  (A,1) (B,1) (C,2)
After stable by key:  (A,1) (B,1) (C,2)   <- A still before B
After unstable:       (B,1) (A,1) (C,2)   might happen if ties are swapped
```

Stability matters when sorting by **one field** now and another field later, or when preserving user-visible order for ties.

:::quiz
question: In the pure comparison model, what is a tight asymptotic lower bound for worst-case sorting of n distinct elements?
options:
  - O(n)
  - Omega(n log n)
  - O(n^2)
answer: 1
explanation: Any comparison sort must distinguish n! orderings; a binary decision tree needs height at least log2(n!), which is Theta(n log n).
:::

:::quiz
question: A sorting algorithm is stable if which condition holds?
options:
  - It never uses extra memory.
  - Equal keys appear in the output in the same relative order as in the input.
  - It runs in O(n log n) time.
answer: 1
explanation: Stability is about preserving order among equal keys, not time or space alone.
:::

:::quiz
question: Can counting sort beat O(n log n) when sorting n integers with values in a fixed small range [0, k]?
options:
  - No — all sorting is Omega(n log n).
  - Yes — counting sort can run in O(n + k) time because it uses key structure, not only comparisons.
answer: 1
explanation: Non-comparison sorts can exploit bounded range or digit structure.
:::

:::exercise
title: Identify stability from traces
description: You sort `[ (x,0), (x,1) ]` by the first field only. If the output is `[(x,1), (x,0)]`, was the algorithm stable? Explain in one sentence.
starterCode: |
  // No code — answer in comments.
  // Stable? Why?
:::

## Practice

- [Merge Sorted Array](/problems/merge-sorted-array) — two sorted sequences into one order (merge pattern warm-up).
