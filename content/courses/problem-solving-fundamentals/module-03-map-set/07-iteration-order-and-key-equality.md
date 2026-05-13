# Iteration Order and Key Equality

**Map** and **Set** in JavaScript iterate in **insertion order** (for ES2015+). That predictability matters when problems ask for "first unique" or stable output.

## Map iteration order

```javascript
const m = new Map();
m.set("z", 1);
m.set("a", 2);
for (const k of m.keys()) console.log(k); // z, then a
```

Re-setting an existing key **does not** change its position — the key keeps its original slot.

```text
set z -> set a -> set z (update value)
order of keys: z, a  (z still first)
```

## Set iteration order

```javascript
const s = new Set([3, 1, 2]);
[...s];  // [3, 1, 2] — insertion order
```

## SameValueZero equality

Map and Set use **SameValueZero** (like `Object.is` except `+0` and `-0` are treated as equal in some edge cases — be careful with `-0` in rare contests).

- `NaN` equals `NaN` for Set/Map.
- Two different `{}` are different keys.

## Object key order

Plain objects with only **string** keys iterate in: integer-like keys ascending, then other strings in insertion order, then symbols — a different set of rules than Map. Relying on object key order for algorithms is fragile; **use Map** when order is part of the logic.

:::quiz
question: After m.set('a',1); m.set('b',2); m.set('a',99); what order do keys appear when iterating m.keys()?
options:
  - a, b — updating 'a' moves it to the end.
  - a, b — 'a' keeps its original position; only the value updates.
answer: 1
explanation: Updating an existing key does not reorder it in Map.
:::

:::quiz
question: Two Set instances with the same values inserted in different orders — are [...s1] and [...s2] always equal as arrays?
options:
  - Yes — Set ignores order.
  - No — iteration order follows insertion order, so arrays can differ unless contents and insertion order match.
answer: 1
explanation: Set iteration is insertion-ordered; different insertion sequences can yield different iteration orders for the same multiset... Actually same multiset inserted different order: e.g. Set([1,2]) vs Set([2,1]) gives different iteration order [1,2] vs [2,1].
:::

:::quiz
question: For algorithm problems requiring sorted key output, what should you do?
options:
  - Rely on Map's default iteration order always being alphabetical.
  - Sort keys explicitly: [...m.keys()].sort() or sort with a comparator.
answer: 1
explanation: Map order is insertion order, not sorted order.
:::

:::exercise
title: Stable unique
description: Given `arr`, return a new array of unique values in **first occurrence** order. Use Set and a single pass: for each x, if not in set, add and push to result.
starterCode: |
  function stableUnique(arr) {
    const seen = new Set();
    const out = [];
    // ...
    return out;
  }

  console.log(stableUnique([4, 2, 4, 1, 2])); // [4, 2, 1]
:::

## Practice

- [Longest Substring Without Repeating Characters](/problems/longest-substring-without-repeating-characters) — last-seen index Map with ordered window logic.
