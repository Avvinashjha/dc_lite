# Map for Indices and Lookup

Maps excel at **associating a key with the latest (or first) index**, or answering **"have we seen this value before?"** in O(1) average time per query.

## Value to last index

```javascript
function lastIndexMap(nums) {
  const m = new Map();
  for (let i = 0; i < nums.length; i++) {
    m.set(nums[i], i);
  }
  return m;
}
```

If duplicates matter, store **arrays of indices** or only update when needed.

## Two Sum (hash map)

```javascript
function twoSum(nums, target) {
  const indexByValue = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (indexByValue.has(need)) return [indexByValue.get(need), i];
    indexByValue.set(nums[i], i);
  }
  return [];
}
```

```text
target = 9, nums = [2, 7, 11, 15]

i=0: need=7, map empty -> set 2 -> 0
i=1: need=2, map has 2 -> [0, 1]
```

The map stores **complement lookup**: "value needed" → index where we saw the partner.

## First occurrence only

Use `if (!map.has(x)) map.set(x, i)` so earlier indices win.

## Why not always object?

For integer keys, `Map` avoids subtle key coercion. For string keys, `{}` is often fine — choose based on ergonomics and whether you need non-string keys.

:::quiz
question: In twoSum with a Map, why store nums[i] -> i instead of target - nums[i] -> i?
options:
  - We look up the complement need = target - nums[i]; we need to know if "need" was seen and at which index.
  - We must store the target in the map.
answer: 0
explanation: At each step you compute what value would complete the pair; you check if that value exists as a key (the value you stored earlier).
:::

:::quiz
question: Map.get returns undefined for a missing key. Combined with twoSum, what ensures we do not pair an index with itself incorrectly?
options:
  - We always check has(need) before set(nums[i], i) on the same iteration — actually we set after check, so the same element cannot be used twice in one step.
  - We use only sorted arrays.
answer: 0
explanation: You first ask if the complement exists from a **previous** index; only then you record the current value. So each index pairs only with earlier indices.
:::

:::quiz
question: Average time for each Map.set and Map.get in typical interview analysis?
options:
  - O(1)
  - O(n)
  - O(log n)
answer: 0
explanation: Hash tables give expected O(1) for get/set under standard assumptions.
:::

:::exercise
title: First unique index
description: Return the index of the first element in `nums` whose value appears exactly once. If none, return -1. Use a Map: first pass count, second pass find first count 1.
starterCode: |
  function firstUniqueIndex(nums) {
    // Two passes with a Map for counts.
  }

  console.log(firstUniqueIndex([2, 3, 2, 4, 4, 5])); // index of 3 -> 1
:::

## Practice

- [Two Sum](/problems/two-sum)
- [Find the Index of the First Occurrence in a String](/problems/find-the-index-of-the-first-occurrence-in-a-string) — different technique, but "first occurrence" theme
