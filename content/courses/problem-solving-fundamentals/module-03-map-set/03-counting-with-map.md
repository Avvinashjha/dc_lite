# Counting with Map

**Frequency maps** answer "how many times did we see each key?" In JavaScript, `Map` is ideal when keys are not plain strings or when you will delete entries frequently.

## Pattern: increment default

```javascript
function countOccurrences(arr) {
  const counts = new Map();
  for (const x of arr) {
    counts.set(x, (counts.get(x) || 0) + 1);
  }
  return counts;
}
```

```text
arr = [a, b, a, a, c]

Map:  a -> 3
      b -> 1
      c -> 1
```

## Characters in a string

```javascript
function countChars(s) {
  const m = new Map();
  for (const ch of s) {
    m.set(ch, (m.get(ch) || 0) + 1);
  }
  return m;
}
```

For lowercase English only, a **length-26 array** can be faster than Map — same O(n) time, O(1) space for the alphabet.

## Compare two frequency maps

After counting `a` and `b`, compare sizes and each count — or increment for one string and decrement for the other and check all values are 0 (single pass variant).

## Multiplicity queries

- **Mode**: key with maximum count — one pass over `Map` entries.
- **k most frequent**: often paired with a heap (later module) or bucket sort by frequency.

:::quiz
question: Building a frequency Map over n array elements takes what average time?
options:
  - O(n²)
  - O(n)
  - O(1)
answer: 1
explanation: One pass; each map update is O(1) average.
:::

:::quiz
question: Why use a fixed array of length 26 instead of Map for counting lowercase a-z only?
options:
  - Same asymptotic time but simpler and cache-friendly with O(1) space for the alphabet.
  - Arrays cannot count characters.
answer: 0
explanation: Both are O(n) time; the array avoids hash overhead for a tiny fixed key space.
:::

:::quiz
question: counts.get(k) || 0 handles missing keys because...
options:
  - undefined is falsy, so || 0 yields 0 for the increment base.
  - get always returns 0 for missing keys.
answer: 0
explanation: Missing keys yield undefined; `undefined || 0` is 0 before adding 1.
:::

:::exercise
title: Most frequent element
description: Write `mode(nums)` returning the value that appears most often (any tie — return one of them). Use a Map for counts.
starterCode: |
  function mode(nums) {
    // Build counts, then scan for max.
  }

  console.log(mode([1, 2, 2, 3, 2])); // 2
:::

## Practice

- [Valid Anagram](/problems/valid-anagram) — frequency vectors.
- [Print All the Duplicate Characters in a String](/problems/print-all-the-duplicate-characters-in-a-string) — frequency first, then filter.
