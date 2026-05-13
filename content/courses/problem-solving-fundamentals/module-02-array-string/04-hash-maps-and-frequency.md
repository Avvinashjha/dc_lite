# Hash Maps and Frequency Counting

A **hash map** (in JavaScript, a plain object `{}` or a `Map`) lets you store **key → value** pairs with average **O(1)** insert and lookup. For interviews, the most common key is a number or character; the value is often a **count** or **last seen index**.

## Object vs Map

| Feature | Object `{}` | `Map` |
| ------- | ----------- | ----- |
| Keys | Strings/symbols (numbers get stringified) | Any type |
| Iteration order | insertion order (modern engines) | insertion order |
| Size | `Object.keys(o).length` | `map.size` |

For counting characters in a string, objects are fine because keys are `"a"`, `"b"`, etc.

```javascript
function charCounts(s) {
  const counts = {};
  for (const ch of s) {
    counts[ch] = (counts[ch] || 0) + 1;
  }
  return counts;
}

charCounts("hello"); // { h:1, e:1, l:2, o:1 }
```

## Frequency → anagrams

Two strings are **anagrams** if they have the same character counts:

```javascript
function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const ca = charCounts(a);
  const cb = charCounts(b);
  for (const ch of Object.keys(ca)) {
    if (ca[ch] !== cb[ch]) return false;
  }
  return Object.keys(cb).length === Object.keys(ca).length;
}
```

(Sorting both strings also works in O(n log n) — good backup when maps feel heavy.)

## Complement pattern (toward Two Sum)

Given `target` and current value `x`, the **complement** is `target - x`. If you have seen complement before, you found a pair.

```javascript
function twoSum(nums, target) {
  const indexByValue = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (indexByValue.has(need)) {
      return [indexByValue.get(need), i];
    }
    indexByValue.set(nums[i], i);
  }
  return [];
}
```

The map stores **value → index** so you can return positions. This turns O(n²) nested loops into **O(n)** time and O(n) space.

```text
nums = [2, 7, 11, 15], target = 9

i=0: value 2, need 7, map empty -> store 2 -> index 0
i=1: value 7, need 2, map has 2 -> return [0, 1]
```

## When hashing helps

- Counting occurrences, mode, uniqueness.
- Detecting duplicates in one pass.
- Trading **space for time** when a slow nested loop is the bottleneck.

:::quiz
question: Average-case time to check if a key exists in a JavaScript Map with n entries?
options:
  - O(n)
  - O(1)
  - O(log n)
  - O(n²)
answer: 1
explanation: Hash maps are designed for average O(1) get/set. Worst-case collisions can degrade, but interview analysis assumes good hashing.
:::

:::quiz
question: Two strings of equal length are anagrams if and only if what?
options:
  - They sort to the same string.
  - They have identical character frequency counts.
  - They share the same first character.
  - They have the same SHA-256 hash.
answer: 1
explanation: Anagrams are permutations of the same multiset of characters — same frequencies. Sorting both strings is an equivalent test.
:::

:::quiz
question: In the hash-map Two Sum approach, what does the map store?
options:
  - target minus each index
  - each value seen so far mapped to its index (or indices)
  - the sorted order of nums
  - only duplicate values
answer: 1
explanation: You need to look up whether the complement was seen and at which index, so you map value -> index (for the first occurrence).
:::

:::exercise
title: First unique character index
description: Write `firstUniqChar(s)` returning the index of the first non-repeating character, or -1 if none. First pass: count. Second pass: find first count 1.
starterCode: |
  function firstUniqChar(s) {
    // Use an object or Map for counts.
  }

  console.log(firstUniqChar("leetcode")); // 0 ('l' at 0 is unique? actually 'l' appears once - check: l,e,e,t,c,o,d,e -> first unique is l at 0)
  console.log(firstUniqChar("loveleetcode")); // 2 ('v')
:::

## Practice

- [Two Sum](/problems/two-sum) — implement both brute force and hash map.
- [Valid Anagram](/problems/valid-anagram) — frequency or sort.
- [Find the Duplicate Number](/problems/find-the-duplicate-number) — many approaches; counting is one angle (if allowed).
