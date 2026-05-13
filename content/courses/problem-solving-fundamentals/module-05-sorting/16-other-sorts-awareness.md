# Other Sorts: Radix and Bucket (Awareness)

This lesson is **awareness-only**. Radix and bucket sort show up in textbooks and occasional systems-design discussions, but in coding interviews the algorithms from lessons 02–14 are what you'll actually use. Read through once so the names are familiar; do not spend drill time here.

## Radix sort (LSD: Least Significant Digit)

**Use case:** sorting large numbers of integers with a bounded digit count (e.g., 32-bit integers). Non-comparison; can be faster than comparison sorts on some hardware.

**Idea:** sort by the least significant digit first, then the next, and so on, using a **stable** sort (typically counting sort) at each digit. Because the inner sort is stable, ordering from earlier digit passes survives into later ones.

```text
input:         170, 45, 75, 90, 802, 24, 2, 66

after 1s pass: 170, 90, 802, 2, 24, 45, 75, 66
after 10s pass: 802, 2, 24, 45, 66, 170, 75, 90
after 100s pass: 2, 24, 45, 66, 75, 90, 170, 802
```

**Time:** O(d * (n + b)) where `d` is the number of digits and `b` the base (radix).
**Space:** O(n + b).

For 32-bit integers with byte-wise radix (b = 256), d = 4: effectively linear. The catch: it needs **stable counting sort at each pass** and allocates buffers — not in-place, and the constants can beat or lose to a good quicksort depending on hardware.

## Bucket sort

**Use case:** sorting numbers **uniformly distributed** over a known range.

**Idea:** create `m` buckets spanning the range, distribute each number into its bucket, sort each bucket individually (often with insertion sort since buckets stay small), then concatenate.

```text
range [0, 1) split into 5 buckets
input: 0.42, 0.08, 0.91, 0.23, 0.55, 0.67, 0.17

distribute -> [ [0.08], [0.17], [0.23], [0.42, 0.55], [0.67], [0.91] ]
sort each (trivial), concatenate.
```

**Time:**
- **Average:** O(n) under uniform distribution (each bucket has O(1) expected size).
- **Worst:** O(n^2) if all values fall into one bucket (insertion sort on n elements).

**Space:** O(n + m).

Bucket sort is rarely used for general-purpose sorting because the "uniform distribution" assumption is fragile. It powers specialized tools like histogramming and external sorts where distribution is known.

## MSD radix (Most Significant Digit first)

A recursive cousin of LSD radix: partition by the most significant digit, recurse within each partition. Useful for **strings**, where LSD doesn't obviously apply to variable-length keys. You will not be asked to implement this in a typical coding interview.

## What about TimSort, IntroSort, SmoothSort, and friends?

- **TimSort:** hybrid of merge sort and insertion sort; Python and modern JS engines use variants. Adaptive — fast on real-world partially-sorted inputs.
- **IntroSort:** quicksort that switches to heapsort when recursion gets too deep; widely used as `std::sort` in C++.
- **SmoothSort, Cocktail Shaker Sort, etc.:** academic curiosities.

You don't implement these in interviews — you use the language's built-in sort. Knowing the names and one-liners about each lets you nod along in design discussions.

## What to remember

- **Comparison sorts** (merge, quick, heap, insertion) cover 99% of interview questions.
- **Counting sort** (lesson 13) is the non-comparison sort you will actually use, when key range is small.
- **Radix** and **bucket** are nice to recognize; do not memorize implementations for interviews unless the role is systems / databases / performance-critical.

:::quiz
question: Radix sort's inner passes rely on which property of the underlying digit sort?
options:
  - Stability — so order from earlier digit passes is preserved.
  - In-place operation.
answer: 0
explanation: Without stability, a later digit pass could shuffle equal-later-digit items in ways that undo earlier passes.
:::

:::quiz
question: Bucket sort's average-case O(n) relies on what assumption?
options:
  - Values are uniformly distributed over the chosen bucket range.
  - Values fit in a single integer.
answer: 0
explanation: Non-uniform data can funnel everything into one bucket, degrading to O(n^2).
:::

:::quiz
question: For general-purpose interview problems, the recommended sort is:
options:
  - Write your own radix or bucket sort.
  - Use the language's built-in sort (typically TimSort / IntroSort), with a comparator if needed.
answer: 1
explanation: Hand-rolled sorts are warranted only when you need a specific algorithm the question asks for (e.g., "implement quicksort"), or for a narrow performance optimization.
:::

## Practice

No required practice for this lesson. The final lesson (17) has the curated practice ladder across the module.
