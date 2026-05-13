# Quicksort: Randomized Pivot and Worst-Case Behavior

The plain "last element as pivot" quicksort from the previous lesson hits **O(n^2)** on adversarial inputs — notably **already sorted** arrays, the case most likely to appear in a benchmarking judge. The standard fix is to **randomize the pivot**, which makes bad inputs statistically unlikely regardless of what the adversary provides.

## Why last-element-as-pivot is fragile

On `[1, 2, 3, 4, 5]`:

```text
partition: pivot = 5, everything stays put  [1,2,3,4,5]  pivot index 4
quickSort(0, 3):
  partition: pivot = 4, everything stays    pivot index 3
quickSort(0, 2):
  partition: pivot = 3, ...
... recursion depth n, each partition does O(n) work -> O(n^2).
```

The adversary only needs a sorted (or reverse-sorted) input. Random pivots break that predictability.

## Randomized pivot

Pick a uniformly random index in `[lo, hi]` and **swap it to `hi`** before running the standard Lomuto partition.

```javascript
function randomPivot(arr, lo, hi) {
  const k = lo + Math.floor(Math.random() * (hi - lo + 1));
  [arr[k], arr[hi]] = [arr[hi], arr[k]];
}

function partition(arr, lo, hi) {
  const pivot = arr[hi];
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  return i + 1;
}

function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  randomPivot(arr, lo, hi);
  const p = partition(arr, lo, hi);
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
  return arr;
}
```

## Expected complexity

- **Time:** O(n log n) **expected**, regardless of input. The probability of a run of bad pivots drops exponentially.
- **Worst time:** still O(n^2) in theory, but only with astronomically bad luck (not an adversarial input).
- **Space:** O(log n) expected recursion stack.

## The duplicates trap

Even with random pivots, an array of **all equal values** still gives O(n^2): every pivot is equal to every element, and Lomuto puts everything into the "≤ pivot" side, leaving an empty right partition. The fix is **3-way partitioning** (the Dutch National Flag scheme in the next lesson), which creates three regions: `< pivot`, `== pivot`, `> pivot`, and recurses only on the outer two.

## Median-of-three (briefly)

An alternative to randomization: pick three candidate pivots (first, middle, last), and use the **median** as the actual pivot. Defeats the sorted-input adversary without a random source. Many production sorts combine median-of-three with a cutoff to insertion sort.

## Recursion depth worst case

With pure randomized quicksort, recursion depth is expected O(log n) but can be O(n) on unlucky splits. For very large inputs you can guard against stack overflow by always recursing on the **smaller** side and looping on the larger one:

```javascript
function quickSortSafe(arr, lo, hi) {
  while (lo < hi) {
    randomPivot(arr, lo, hi);
    const p = partition(arr, lo, hi);
    if (p - lo < hi - p) {
      quickSortSafe(arr, lo, p - 1);
      lo = p + 1;
    } else {
      quickSortSafe(arr, p + 1, hi);
      hi = p - 1;
    }
  }
}
```

This guarantees stack depth **O(log n)** even on bad luck.

## Interview talking points

When you write quicksort in an interview, mention:

1. "I'll use a random pivot so a sorted input doesn't hit O(n^2)."
2. "With a 3-way partition (Dutch flag) we'd also handle heavy duplicates efficiently."
3. Optional: "If stack depth matters I'd recurse on the smaller side and loop on the larger."

This signals production awareness beyond the textbook algorithm.

:::quiz
question: Randomizing the pivot in quicksort changes:
options:
  - The algorithm's expected complexity from O(n log n) on "random inputs only" to O(n log n) on any input.
  - The worst-case theoretical complexity — it becomes O(n log n) guaranteed.
answer: 0
explanation: Randomization moves the "worst case" into the realm of unlucky randomness, not adversarial input; the theoretical worst case is still O(n^2) with vanishing probability.
:::

:::quiz
question: Why does an all-equal-elements array still trigger O(n^2) with Lomuto partition (even with random pivots)?
options:
  - Lomuto puts every element into the <= pivot side, leaving an empty right partition and recursing on size n - 1.
  - Random numbers bias toward duplicates.
answer: 0
explanation: With all values equal, the pivot's final position is always at the far end; the recursion degenerates.
:::

:::quiz
question: What is one way to guarantee O(log n) recursion stack depth regardless of splits?
options:
  - Always recurse on the smaller half and loop on the larger.
  - Use a larger recursion limit.
answer: 0
explanation: Tail-recursing on the larger side means the explicit recursive call always shrinks the problem by at least half.
:::

:::exercise
title: Implement randomized quicksort
description: Implement `quickSort(arr)` using a random pivot. The random pivot helper should uniformly pick an index in `[lo, hi]` and swap it to `hi` before Lomuto partition.
starterCode: |
  function randomPivot(arr, lo, hi) {
    // pick k uniformly in [lo, hi], swap arr[k] with arr[hi]
  }

  function partition(arr, lo, hi) {
    // Lomuto partition, returns final pivot index
  }

  function quickSort(arr, lo = 0, hi = arr.length - 1) {
    if (lo >= hi) return arr;
    // randomPivot then partition then two recursive calls
    return arr;
  }

  const a = [5, 1, 4, 2, 8, 3, 3, 3];
  console.log(quickSort(a)); // [1, 2, 3, 3, 3, 4, 5, 8]
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — randomized quicksort reliably passes within the time limits.
