# Iteration, Indexing, and Off-by-One Errors

Most array bugs are not mysterious algorithms — they are **wrong boundaries**: looping one step too far, mixing `<=` with `<`, or confusing `length` with the last index.

## Three ways to iterate

### Indexed `for` loop

```javascript
const nums = [10, 20, 30];
for (let i = 0; i < nums.length; i++) {
  console.log(i, nums[i]);
}
```

Use this when you need **the index** (two pointers, sliding window, merging by position).

### `for...of` (values only)

```javascript
for (const x of nums) {
  console.log(x);
}
```

Clean when you do not need the index. You cannot get the index without `entries()`.

### `for...of` with `entries()`

```javascript
for (const [i, x] of nums.entries()) {
  console.log(i, x);
}
```

## The classic bounds pattern

For an array of length `n`, valid indices are `0 .. n-1`. The idiomatic loop is:

```javascript
for (let i = 0; i < n; i++) { ... }   // i runs 0, 1, ..., n-1
```

**Never** write `i <= nums.length` unless you deliberately want to access `nums[length]` (almost always `undefined`).

```text
Wrong:  i <= nums.length  -->  i takes values 0..length (one too many)
Right:  i < nums.length   -->  i takes values 0..length-1
```

## Off-by-one with slices

Remember `slice(start, end)` — **`end` is exclusive**:

```javascript
const a = [0, 1, 2, 3, 4];
a.slice(1, 4);  // indices 1,2,3  NOT including 4
```

If you want "from `i` to `j` inclusive," use `slice(i, j + 1)`.

## Empty arrays and edge cases

Always ask: what if `length === 0`? What if `length === 1`?

```javascript
function secondLargest(nums) {
  if (nums.length < 2) return undefined;
  // ...
}
```

Interviewers often start with the empty or single-element case to see if you thought about boundaries.

## Nested loops and complexity

A double loop over an array often means **O(n²)** time:

```javascript
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) {
    // pair (i, j)
  }
}
```

Many problems that look like they need this can be reduced with sorting, hash maps, or two pointers — topics coming next.

:::quiz
question: For `const a = [1,2,3];` how many times does the body run in `for (let i = 0; i <= a.length; i++)`?
options:
  - 3 times
  - 4 times
  - 2 times
  - Infinite loop
answer: 1
explanation: i takes 0, 1, 2, 3 — four iterations. When i is 3, a[3] is undefined. Using <= length is usually a bug.
:::

:::quiz
question: Which loop form is best when you need both index and value?
options:
  - `for (const x of arr)` only
  - `for (let i = 0; i < arr.length; i++)` or `for (const [i, x] of arr.entries())`
  - `while (true)` only
  - `arr.forEach` — it always returns the index as the second argument without extra setup
answer: 1
explanation: Indexed for-loops and `entries()` give you both. `for...of` over values alone hides the index unless you use `entries()`.
:::

:::quiz
question: `arr.slice(i, j)` includes the element at index j.
options:
  - True
  - False — the end index is exclusive, so index j is not included.
answer: 1
explanation: `slice` follows the half-open interval [i, j): start inclusive, end exclusive.
:::

:::exercise
title: Count pairs with given sum
description: Write `countPairs(nums, target)` that returns how many pairs of **distinct indices** (i, j) with i < j satisfy `nums[i] + nums[j] === target`. Use a nested loop O(n²). We will optimize with hash maps in a later lesson.
starterCode: |
  function countPairs(nums, target) {
    let count = 0;
    // nested loops: i from 0 to n-2, j from i+1 to n-1
    return count;
  }

  console.log(countPairs([1, 2, 3, 4], 5)); // 2  -> (0,3) and (1,2)
:::

## Practice

- [Two Sum](/problems/two-sum) — start with the brute-force double loop, then compare with a hash map.
- [Remove Duplicates from Sorted Array](/problems/remove-duplicates-from-sorted-array) — careful write index boundaries.
