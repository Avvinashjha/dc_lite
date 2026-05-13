# Set Basics and Deduplication

A **Set** stores **unique** values. Insertion order is remembered. Duplicate adds are ignored.

## Core API

```javascript
const s = new Set();
s.add(1);
s.add(2);
s.add(1);      // ignored — already present
console.log(s.size);  // 2
console.log(s.has(2)); // true
s.delete(2);
```

Initialize from iterable:

```javascript
const s = new Set([1, 2, 2, 3]);
[...s];  // [1, 2, 3]
```

```text
Set:  [ 1, 2, 3 ]   (each value appears at most once)
```

## Deduplicate an array

```javascript
const nums = [1, 2, 2, 3, 1];
const unique = [...new Set(nums)];
```

**Time:** O(n) average for building the set. **Space:** O(n).

## Set vs filter for uniqueness

`filter` with `indexOf` is O(n²). Set-based dedup is linear — prefer Set when order of first occurrence must be preserved (`[...new Set(arr)]` keeps first-seen order).

## Values compared like Map keys

`NaN` is considered equal to `NaN` in a Set. Two different object references are **two different** entries unless they are the same reference.

:::quiz
question: After `const s = new Set([1,1,2]); s.add(2);` what is s.size?
options:
  - 2
  - 3
  - 4
answer: 0
explanation: The set contains 1 and 2 only. Adding 2 again does not increase size.
:::

:::quiz
question: What is the simplest way to remove duplicates from an array while keeping first-occurrence order in modern JavaScript?
options:
  - Sort then dedupe
  - [...new Set(array)]
  - array.filter((x,i) => array.indexOf(x) === i) only
answer: 1
explanation: Set iteration order follows insertion order; spreading preserves first-seen order for primitives.
:::

:::quiz
question: Can a Set store two different empty objects {} as two separate elements?
options:
  - Yes — they are different references.
  - No — Set merges all objects.
answer: 0
explanation: Set uses SameValueZero; two distinct object literals are not equal, so both can be stored.
:::

:::exercise
title: Unique in order
description: Implement `uniqueInOrder(arr)` returning a new array with duplicates removed, preserving the first occurrence order of each value. Hint: use a Set only to test membership while pushing to a result array, or spread `new Set(arr)` after one pass.
starterCode: |
  function uniqueInOrder(arr) {
    // Your implementation
  }

  console.log(uniqueInOrder([3, 1, 3, 2, 1])); // [3, 1, 2]
:::

## Practice

- [Contains Duplicate](/problems/contains-duplicate) — Set or sort.
- [Find the Duplicate Number](/problems/find-the-duplicate-number) — many techniques; Set is one.
