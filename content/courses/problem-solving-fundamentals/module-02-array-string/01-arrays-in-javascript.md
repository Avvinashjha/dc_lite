# Arrays in JavaScript

An **array** is an ordered list of values. In JavaScript, arrays are **dynamic** (they grow and shrink), **mutable** (you can change elements in place), and **heterogeneous** (you can mix types, though sticking to one type keeps code clearer).

## Indices and length

Valid indices run from `0` to `length - 1`. The `length` property is always one more than the last index.

```javascript
const nums = [10, 20, 30];
console.log(nums[0]);    // 10
console.log(nums.length); // 3
console.log(nums[3]);    // undefined (out of range)
```

```text
index:   0    1    2
       [10, 20, 30]
length = 3   (last index is 2)
```

## Creating and copying

```javascript
const a = [1, 2, 3];
const b = [...a];        // shallow copy — new array, same element references
const c = a.slice();     // another common copy
```

**Shallow copy** means nested objects or arrays inside are still shared. For flat numbers, spread and `slice` are perfect.

## Mutating the end: push and pop

`push` appends to the end; `pop` removes the last element. Both mutate the array.

```javascript
const stack = [1, 2];
stack.push(3);   // [1, 2, 3], returns new length
stack.pop();      // returns 3, stack is [1, 2]
```

## Mutating the front: shift and unshift

`shift` removes the first element (slow for large arrays — everything shifts). `unshift` inserts at the front.

```javascript
const q = [2, 3];
q.unshift(1);   // [1, 2, 3]
q.shift();      // returns 1, q is [2, 3]
```

## slice vs splice (easy to confuse)

| Method   | Mutates? | Purpose |
| -------- | -------- | ------- |
| `slice(start, end)` | No | Returns a **copy** of a sub-range. `end` is exclusive. |
| `splice(start, deleteCount, ...items)` | Yes | Removes/replaces/inserts **in place**. |

```javascript
const nums = [1, 2, 3, 4, 5];

nums.slice(1, 4);   // [2, 3, 4] — nums unchanged

nums.splice(2, 1);  // removes one element at index 2
// nums is now [1, 2, 4, 5]
```

When a problem says "do not allocate extra space," read the statement carefully — sometimes `splice`-style in-place work is allowed; sometimes you must use two pointers instead.

## map, filter, reduce (preview)

These return **new** arrays (or a single value for `reduce`) and do not mutate the original:

```javascript
[1, 2, 3].map(n => n * 2);           // [2, 4, 6]
[1, 2, 3, 4].filter(n => n % 2);     // [1, 3]
[1, 2, 3].reduce((s, n) => s + n, 0); // 6
```

You used these in Module 01; here the focus is the **underlying array** you are transforming.

:::quiz
question: After `const a = [1, 2, 3]; const b = a; b.push(4);` what is `a.length`?
options:
  - 3 — push only affected b.
  - 4 — a and b reference the same array.
  - 0 — push cleared the array.
  - 1 — JavaScript copies arrays on assignment.
answer: 1
explanation: `b` is not a copy of `a`; it is another variable pointing to the same array object. Mutating through `b` changes `a` too.
:::

:::quiz
question: Which call returns a new array and leaves the original unchanged?
options:
  - `arr.splice(0, 1)`
  - `arr.push(5)`
  - `arr.slice(1, 3)`
  - `arr.sort()`
answer: 2
explanation: `slice` is non-mutating. `splice`, `push`, and `sort` mutate the array in place (unless you copy first).
:::

:::quiz
question: For an array of length `n`, what is the index of the last element?
options:
  - n
  - n - 1
  - n + 1
  - 0
answer: 1
explanation: Zero-based indexing means the last index is always `length - 1`. This is the root of most off-by-one bugs.
:::

:::exercise
title: Rotate the first element to the end
description: Write a function `rotateLeft(arr)` that mutates `arr` by moving the first element to the end. If `arr` is empty, do nothing. Do not use `splice` — use `shift` and `push` only.
starterCode: |
  function rotateLeft(arr) {
    // Your code here.
  }

  const a = [1, 2, 3, 4];
  rotateLeft(a);
  console.log(a); // [2, 3, 4, 1]
:::

## Practice

- [Merge Sorted Array](/problems/merge-sorted-array) — practice index arithmetic on two arrays.
- [Best Time to Buy and Sell Stock](/problems/best-time-to-buy-and-sell-stock) — scan an array while tracking a running minimum.
