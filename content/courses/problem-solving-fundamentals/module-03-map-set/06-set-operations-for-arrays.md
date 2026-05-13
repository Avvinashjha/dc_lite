# Set Operations for Arrays

Treat arrays as **sets of values** (ignoring multiplicity) to test membership, intersection, and difference in average **linear** time.

## Membership test

```javascript
const allowed = new Set([1, 2, 3, 4]);
allowed.has(3);  // true O(1) average
```

Converting a large array to Set once, then many `has` checks, beats repeated `array.includes` (O(n) per check).

## Intersection

```javascript
function intersection(a, b) {
  const sb = new Set(b);
  return a.filter(x => sb.has(x));
}
```

For **unique** results: `new Set(intersection(a,b))`.

```text
A = {1,2,3}   B = {2,3,4}
intersection -> values in A that appear in B -> [2,3]
```

## Union

```javascript
function union(a, b) {
  return [...new Set([...a, ...b])];
}
```

## Difference (A minus B)

```javascript
function difference(a, b) {
  const sb = new Set(b);
  return a.filter(x => !sb.has(x));
}
```

## Symmetric difference

Elements in exactly one of A or B — combine difference both ways and unique.

:::quiz
question: Why is `x in Set` implemented as Set.has(x) and not `Set[x]`?
options:
  - Set is not keyed like an array; .has uses the hash structure.
  - Set does not support membership testing.
answer: 0
explanation: Sets are not ordinary objects; use the `.has` API for membership.
:::

:::quiz
question: Building a Set from array B then filtering A by B.has is what time complexity for lengths n and m?
options:
  - O(n + m) average
  - O(n * m)
  - O(n²)
answer: 0
explanation: O(m) to build the set, O(n) to scan A — linear in total input size.
:::

:::quiz
question: If you need intersection counts per element (multiset intersection), is a plain Set enough?
options:
  - No — use Maps counting frequencies or sort both arrays with two pointers.
  - Yes — Set always preserves counts.
answer: 0
explanation: Set collapses duplicates; multiset operations need counts or sorting.
:::

:::exercise
title: Is subset?
description: Write `isSubset(a, b)` returning true if every value in array `a` appears in array `b` (treat as sets — ignore how many times). Use a Set for `b`.
starterCode: |
  function isSubset(a, b) {
    const sb = new Set(b);
    // every element of a in sb?
  }

  console.log(isSubset([1, 2], [2, 1, 3])); // true
  console.log(isSubset([1, 4], [2, 3]));     // false
:::

## Practice

- [Two Sum](/problems/two-sum) — complement in a logical "set" of seen values.
- [Find All Duplicates in an Array](/problems/find-all-duplicates-in-an-array) — if present in catalog.
