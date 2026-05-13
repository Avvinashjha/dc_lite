# Counting Sort (Bounded Integer Keys)

**Counting sort** sorts integers in a **known, small range** `[minVal, maxVal]` in **O(n + k)** time, where `k = maxVal - minVal + 1`. It is a **non-comparison** sort: it uses the values themselves as array indices, so the Ω(n log n) comparison lower bound does not apply.

Use it when:

- Keys are integers (or map cheaply to integers).
- The range `k` is comparable to `n` — sorting 10 million integers in `[0, 99]` is O(n); sorting them with values up to 10^18 would waste O(10^18) space and is a no-go.

## The simple version (value only, not stable)

```javascript
function countingSort(nums, minVal, maxVal) {
  const k = maxVal - minVal + 1;
  const count = new Array(k).fill(0);
  for (const x of nums) count[x - minVal]++;

  let idx = 0;
  for (let v = 0; v < k; v++) {
    while (count[v] > 0) {
      nums[idx++] = v + minVal;
      count[v]--;
    }
  }
  return nums;
}
```

Three passes: count, emit, overwrite. Output is sorted ascending. This version loses any "attached data" because we rebuild from counts.

## The stable version (needed for radix sort or attached payloads)

When you are sorting **records** keyed by an integer (e.g., `(key, name)` pairs), plain counting loses the relative order of records with equal keys. The stable version uses **prefix sums** to compute the output position of each element.

```javascript
function countingSortStable(input, key, k) {
  const n = input.length;
  const count = new Array(k).fill(0);
  for (const x of input) count[key(x)]++;

  for (let i = 1; i < k; i++) count[i] += count[i - 1];

  const output = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    const bucket = key(input[i]);
    count[bucket]--;
    output[count[bucket]] = input[i];
  }
  return output;
}
```

Two details that matter:

- After the prefix-sum pass, `count[b]` is the number of keys **≤ b**. So the last element whose key is `b` goes at index `count[b] - 1`.
- We scan the input **right-to-left** and decrement `count[bucket]` before writing. This preserves input order among equal keys — the definition of stable.

## Walkthrough

```text
input keys:     [2, 5, 3, 0, 2, 3, 0, 3]    k = 6 (values in [0, 5])

count:          [2, 0, 2, 3, 0, 1]
prefix sum:     [2, 2, 4, 7, 7, 8]

scan right-to-left:
  key=3 -> count[3]=7->6, output[6] = 3
  key=0 -> count[0]=2->1, output[1] = 0
  key=3 -> count[3]=6->5, output[5] = 3
  key=2 -> count[2]=4->3, output[3] = 2
  key=0 -> count[0]=1->0, output[0] = 0
  key=3 -> count[3]=5->4, output[4] = 3
  key=5 -> count[5]=8->7, output[7] = 5
  key=2 -> count[2]=3->2, output[2] = 2

output: [0, 0, 2, 2, 3, 3, 3, 5]
```

## Complexity

- **Time:** O(n + k).
- **Space:** O(n + k) for `count` and `output`.

## When does `k` become a dealbreaker?

- Integer grades (0..100): `k` is tiny; counting sort wins.
- 32-bit integers: `k = 2^32 ≈ 4 billion` — counting sort would allocate 4 GB. Do not use.
- Strings or floats: no integer key without transformation; use comparison sort or radix.

## Counting sort is the backbone of radix sort

Radix sort sorts multi-digit keys by running **stable counting sort** once per digit. The awareness lesson at the end of this module (lesson 16) touches on that; for interviews, knowing plain counting sort is usually enough.

:::quiz
question: The total time complexity of counting sort is:
options:
  - O(n + k) where k is the key range.
  - O(n log n).
answer: 0
explanation: Counting, prefix sum, and placement all run in O(n + k) total.
:::

:::quiz
question: Why does plain counting sort break when each element carries attached data (like `(key, record)` pairs)?
options:
  - Because rebuilding the array from counts discards the original records.
  - Because JavaScript arrays cannot hold objects.
answer: 0
explanation: The simple version reconstructs the array using only values; stable counting sort with prefix sums is needed to preserve attached data and input order for equal keys.
:::

:::quiz
question: Why does the stable version scan the input from right to left?
options:
  - Decrementing `count[bucket]` before placing the element, while reading right-to-left, preserves input order among equal keys.
  - It is arbitrary.
answer: 0
explanation: Right-to-left combined with decrement-then-place is the standard way to get stability using prefix sums.
:::

:::exercise
title: Implement counting sort for grades
description: Implement `sortGrades(grades)` that sorts an array of integers in `[0, 100]` in ascending order using counting sort. Assume all values are in range.
starterCode: |
  function sortGrades(grades) {
    const count = new Array(101).fill(0);
    // pass 1: count
    // pass 2: rebuild grades in place
    return grades;
  }

  console.log(sortGrades([80, 70, 90, 80, 100])); // [70, 80, 80, 90, 100]
  console.log(sortGrades([]));                    // []
:::

## Practice

- [Sort Colors](/problems/sort-colors) — with only three values, a two-pass counting sort is a valid solution. The Dutch flag (lesson 10) is usually preferred because it is one-pass and in-place without an extra count array.
