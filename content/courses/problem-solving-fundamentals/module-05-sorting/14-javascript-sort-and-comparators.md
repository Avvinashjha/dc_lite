# JavaScript sort() and Comparator Pitfalls

`Array.prototype.sort` is the shortest correct sort you can write in JavaScript — **as long as you pass a comparator**. The default behavior hides a classic gotcha that shows up in almost every interview sanity check.

## The default-sort footgun

```javascript
const nums = [10, 2, 1];
nums.sort();
console.log(nums); // [1, 10, 2]  — not what you want!
```

Without a comparator, `sort()` **coerces every element to a string** and compares lexicographically. `"10"` sorts before `"2"` because `'1' < '2'`. This is in the ECMAScript spec, not a bug.

## The fix: pass a comparator

```javascript
const nums = [10, 2, 1];
nums.sort((a, b) => a - b);
console.log(nums); // [1, 2, 10]
```

A comparator returns:

- A **negative** number if `a` should come **before** `b`.
- A **positive** number if `a` should come **after** `b`.
- `0` if they are equal (engines preserve input order for equals — sort is **stable** since ES2019).

`a - b` sorts **ascending** for numbers; `b - a` sorts **descending**.

## Sorting objects by a field

```javascript
const people = [
  { name: "Ada",  age: 36 },
  { name: "Lin",  age: 23 },
  { name: "Bob",  age: 36 },
];

people.sort((p, q) => p.age - q.age);
// Ada (36) and Bob (36) keep their input order thanks to stable sort.
```

## Multi-key sort (primary then tiebreaker)

Use the short-circuit **`||`** trick:

```javascript
people.sort(
  (p, q) =>
    p.age - q.age ||                   // primary: age ascending
    p.name.localeCompare(q.name)       // tiebreaker: name alphabetical
);
```

`a || b` returns the first truthy (non-zero) result; a comparator returning 0 falls through to the next.

## Comparator bugs to avoid

1. **`(a, b) => a > b`.** This returns a **boolean** (`true`/`false`) which JS coerces to `1`/`0`. The comparator never returns a negative number, so the sort is incorrect. Always return a signed number (`a - b`, or a ternary).
2. **Subtracting non-numbers.** `(a, b) => a - b` on strings gives `NaN`. Use `a.localeCompare(b)` or `a < b ? -1 : a > b ? 1 : 0` for strings.
3. **Unstable tiebreakers.** If you forget the `|| secondaryKey` and expect ties to follow input order, remember this is guaranteed only since ES2019 — but well-supported everywhere modern.
4. **Mutating during sort.** The comparator must be **pure**; don't touch external state.

## Case-insensitive string sort

```javascript
const words = ["banana", "Apple", "cherry"];
words.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
// ["Apple", "banana", "cherry"]
```

`localeCompare` respects locale rules (accents, case, numeric runs with `{ numeric: true }`). For ASCII-only code, `a.toLowerCase() < b.toLowerCase()` inside a ternary works too.

## Performance

V8 (Chrome/Node) uses **Timsort** — an adaptive merge sort with insertion-sort base cases. Expect O(n log n) time, O(n) aux memory, stable. Safari and Firefox use similar hybrid approaches. You can treat `Array.prototype.sort` as the go-to sort in production JavaScript.

## Sorting numbers you shouldn't sort as strings

```javascript
["10", "2", "1"].sort();          // ["1", "10", "2"]  — already strings, result is "correct"
[10, 2, 1].sort();                // [1, 10, 2]        — but default stringifies!
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]
```

Rule of thumb: **every call to `sort` for numbers needs a comparator**.

:::quiz
question: Why does `[10, 2, 1].sort()` without a comparator produce `[1, 10, 2]`?
options:
  - Because the default comparator stringifies elements and compares lexicographically.
  - Because sort is broken in JavaScript.
answer: 0
explanation: "10" < "2" lexicographically, so stringified numbers sort in non-numeric order.
:::

:::quiz
question: Which comparator sorts numbers in descending order?
options:
  - `(a, b) => a - b`
  - `(a, b) => b - a`
answer: 1
explanation: `b - a` returns positive when `b > a`, placing `a` after `b`, which is descending.
:::

:::quiz
question: What is wrong with `(a, b) => a > b` as a comparator?
options:
  - It returns booleans that coerce to 0 or 1, never a negative value — the sort decides incorrectly.
  - Nothing, it works.
answer: 0
explanation: Comparators must return a signed number; booleans do not express "a < b".
:::

:::exercise
title: Multi-key sort
description: Given `rows = [{ id, score }]`, sort descending by `score`, and ascending by `id` for equal scores. Use a single comparator with the `||` trick.
starterCode: |
  const rows = [
    { id: 3, score: 90 },
    { id: 1, score: 90 },
    { id: 2, score: 70 },
  ];

  // rows.sort(...)

  console.log(rows.map(r => r.id)); // [1, 3, 2]
:::

## Practice

- [Sort an Array](/problems/sort-an-array) — `Array.prototype.sort` passes trivially; the point of the problem is to implement a sort yourself to practice the earlier lessons.
