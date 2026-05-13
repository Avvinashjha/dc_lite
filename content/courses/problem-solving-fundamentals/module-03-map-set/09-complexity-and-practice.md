# Complexity and Practice

**Map** and **Set** operations (`get`, `set`, `has`, `delete`) are **O(1) average** time and **O(n)** space for storing n entries. Iterating all entries is **O(n)**.

## Comparison with arrays

| Operation | Array (unsorted) | Set / Map |
| --------- | ---------------- | --------- |
| Find value | O(n) | O(1) avg |
| Insert end | O(1) amortized | O(1) avg |
| Check duplicate | O(n) | O(1) avg with Set |

## When extra space buys time

Problems that are O(n²) with nested loops often become **O(n)** with a Map/Set trading **O(n)** memory — the classic time–space tradeoff.

## Practice ladder

**Warmup**

1. [Contains Duplicate](/problems/contains-duplicate)
2. [Valid Anagram](/problems/valid-anagram)
3. [Two Sum](/problems/two-sum)

**Core Map patterns**

4. [Group Anagrams](/problems/group-anagrams)
5. [Find the Duplicate Number](/problems/find-the-duplicate-number) — try Set or Floyd; compare space.

**Stretch**

6. [Longest Substring Without Repeating Characters](/problems/longest-substring-without-repeating-characters)
7. [Minimum Window Substring](/problems/minimum-window-substring) — advanced; Map for character counts.

Work the list in order. After each problem, write one sentence: **what key did the map use, and what did the value mean?**

## Module recap

- Use **Map** for arbitrary keys, frequency, indices, grouping, and caches.
- Use **Set** for uniqueness and fast membership.
- Know **insertion order** for Map/Set iteration — sort explicitly when you need sorted output.
- Memoize only **pure** functions; pick cache keys carefully.

Next module in the course track (when you continue): **searching** on sorted data — binary search connects cleanly with ordered arrays and two pointers.

:::quiz
question: Expected average time for n calls to Map.set with distinct keys?
options:
  - O(n)
  - O(n²)
  - O(1) total
answer: 0
explanation: Each insertion is O(1) average; n insertions → O(n) total.
:::

:::quiz
question: Space complexity of a Set built from an array of n elements?
options:
  - O(1)
  - O(n)
  - O(log n)
answer: 1
explanation: The set stores up to n distinct elements — linear space.
:::

:::quiz
question: Replacing an array.includes inside a loop with a Set built once changes typical complexity from...
options:
  - O(n) per check to O(1) per check after O(n) preprocessing.
  - O(1) to O(n).
answer: 0
explanation: includes is O(n); after building a Set from the searched collection, each has is O(1) average.
:::

:::exercise
title: Character counts with Map
description: Implement `countChars(s)` returning a Map from character to count for string `s`. Then implement `mapsEqual(a, b)` for two Map objects with the same key type, returning true if every key has the same count (use `a.size === b.size` and iterate `a` entries).
starterCode: |
  function countChars(s) {
    const m = new Map();
    // ...
    return m;
  }

  function mapsEqual(a, b) {
    // ...
  }

  console.log(mapsEqual(countChars("ab"), countChars("ba"))); // true
:::

## Practice

Use the ladder above; aim to complete at least through **Group Anagrams** before moving on.
