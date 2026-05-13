# Grouping Patterns

Many problems ask you to **bucket** items that share a **signature**: same sorted letters (anagrams), same remainder mod k, same row in a matrix pattern. A `Map` from **signature → array of items** is the standard shape.

## Group anagrams (idea)

Words that are anagrams share the same sorted letters (or same frequency vector).

```javascript
function signature(word) {
  return [...word].sort().join("");
}

function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const sig = signature(w);
    if (!groups.has(sig)) groups.set(sig, []);
    groups.get(sig).push(w);
  }
  return [...groups.values()];
}
```

```text
words: ["eat","tea","tan","ate","nat","bat"]

sig "aet" -> [eat, tea, ate]
sig "ant" -> [tan, nat]
sig "abt" -> [bat]
```

**Time:** O(n * L log L) for n words of max length L if sorting each word. Frequency-based signatures can improve to O(n * L).

## Canonical key choices

| Problem idea | Possible signature |
| ------------ | ------------------ |
| Anagrams | sorted string, or 26-length count string |
| Same digits frequency | count array joined |
| Buckets by sum / mod | `String(num % k)` |

## Map of Set

Sometimes each group should stay unique: use `Map<key, Set<item>>` and `.add` instead of array push.

:::quiz
question: Why is sorting the word to form a signature valid for grouping anagrams?
options:
  - Anagrams have identical sorted character sequences.
  - Sorting makes every word identical.
answer: 0
explanation: Permutations of the same letters sort to the same string, so they share one signature key.
:::

:::quiz
question: Using a Map of arrays for groups, what does groups.values() yield?
options:
  - An iterator of each group's array of items
  - A single flattened array
answer: 0
explanation: Each value is the array you pushed into; values() iterates those arrays.
:::

:::quiz
question: If signatures collide for different inputs, what goes wrong?
options:
  - Items are incorrectly placed in the same bucket — the signature function must be injective for the problem's equivalence relation.
  - Nothing — collisions are always impossible.
answer: 0
explanation: The signature must capture exactly the equivalence you need; a bad hash groups unrelated items.
:::

:::exercise
title: Group by first letter
description: Write `groupByFirstLetter(words)` returning a Map from single-character string key to array of words starting with that letter (assume non-empty words, lowercase).
starterCode: |
  function groupByFirstLetter(words) {
    const m = new Map();
    for (const w of words) {
      const k = w[0];
      // ...
    }
    return m;
  }

  console.log([...groupByFirstLetter(["apple", "ark", "banana"]).entries()]);
:::

## Practice

- [Group Anagrams](/problems/group-anagrams)
- [Valid Anagram](/problems/valid-anagram) — signature comparison for two words
