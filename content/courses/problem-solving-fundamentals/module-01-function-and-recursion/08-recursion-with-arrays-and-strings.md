# Recursion with Arrays and Strings

Arrays and strings are the two data types you will recurse over most often. Both share the same shape: a sequence you can break into a **head** (the first element/character) and a **tail** (everything else). Once you see this shape, a lot of problems become almost mechanical.

## The "head and tail" recipe

For any sequence `s`:

```text
head = s[0]
tail = s[1..]   // everything after the first element
```

A recursive function on a sequence usually follows one of these two templates:

**Template A — transform the sequence.**

```text
if sequence is empty, return the empty result
else combine(head, recurse(tail))
```

**Template B — scan for a single answer (sum, max, exists).**

```text
if sequence is empty, return the neutral value (0 for sum, -Infinity for max, false for exists)
else combine(head, recurse(tail))
```

Same shape, different choice of `combine`.

## 1. Sum an array

```javascript
function sumArray(arr) {
  if (arr.length === 0) return 0;       // base case: neutral value
  return arr[0] + sumArray(arr.slice(1)); // combine head + sum of tail
}

sumArray([3, 1, 4, 1, 5, 9]); // 23
```

Note: `arr.slice(1)` creates a new array on every call, which is fine for learning but costs memory. A more efficient version passes an **index**:

```javascript
function sumArrayFrom(arr, i = 0) {
  if (i === arr.length) return 0;
  return arr[i] + sumArrayFrom(arr, i + 1);
}
```

No slicing, same O(n) time, `O(n)` stack, but far less array copying. This is the pattern real code uses.

## 2. Find the maximum

```javascript
function maxOf(arr, i = 0) {
  if (i === arr.length - 1) return arr[i];   // one element left — it IS the max
  const restMax = maxOf(arr, i + 1);
  return arr[i] > restMax ? arr[i] : restMax;
}

maxOf([3, 1, 4, 1, 5, 9, 2, 6]); // 9
```

Read it aloud: "the max of `arr` from index `i` is either `arr[i]` or the max of the rest — whichever is bigger."

## 3. Reverse a string

```javascript
function reverseString(s) {
  if (s.length <= 1) return s;                  // empty or single char
  return reverseString(s.slice(1)) + s[0];      // reverse tail, then prepend head
}

reverseString("recursion"); // "noisrucer"
```

The magic: after `reverseString("ecursion")` returns `"noisruce"`, we just stick `"r"` on the end. Every layer does the same tiny thing.

## 4. Palindrome check

Two-pointer style, but recursive:

```javascript
function isPalindrome(s, left = 0, right = s.length - 1) {
  if (left >= right) return true;               // met in the middle — all matches held
  if (s[left] !== s[right]) return false;       // mismatch — not a palindrome
  return isPalindrome(s, left + 1, right - 1);  // check the inner slice
}

isPalindrome("racecar"); // true
isPalindrome("recurse"); // false
```

Notice how early returns are crucial here: the moment we see a mismatch we do not bother recursing. This is how recursion handles "search and short-circuit" cleanly.

## 5. Flatten a nested array

A real-world favorite. Given an array that may contain sub-arrays (which may themselves contain sub-arrays), return a single flat array.

```javascript
function flatten(arr) {
  const result = [];
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item)); // recurse into the sub-array
    } else {
      result.push(item);
    }
  }
  return result;
}

flatten([1, [2, [3, [4, [5]]]], 6]); // [1, 2, 3, 4, 5, 6]
```

Why recursion shines here: the input has **arbitrary depth**. A `for` loop alone cannot know in advance how many levels down to dig. Recursion handles each level identically.

Visualized for `[1, [2, [3]]]`:

```text
flatten([1, [2, [3]]])
  ├─ 1 is not an array → push 1
  └─ [2, [3]] is an array → recurse:
         flatten([2, [3]])
           ├─ 2 is not an array → push 2
           └─ [3] is an array → recurse:
                  flatten([3])
                    └─ 3 is not an array → push 3
                  returns [3]
           returns [2, 3]
  returns [1, 2, 3]
```

## 6. A recursion preview of binary search

Given a sorted array, search for a target in O(log n). We are not going deep here — binary search has its own module — but the recursion is beautiful:

```javascript
function binarySearch(arr, target, low = 0, high = arr.length - 1) {
  if (low > high) return -1;                             // search space empty
  const mid = Math.floor((low + high) / 2);
  if (arr[mid] === target) return mid;                   // found
  if (target < arr[mid]) return binarySearch(arr, target, low, mid - 1);
  return binarySearch(arr, target, mid + 1, high);
}

binarySearch([1, 3, 5, 7, 9, 11, 13], 9); // 4
```

Each call halves the search space, so the stack is only `O(log n)` deep. This is **divide and conquer** at its purest.

## Performance note: `slice` vs. indices

Both work, but they have different costs:

| Approach           | Recursive param                | Pros                        | Cons                       |
| ------------------ | ------------------------------ | --------------------------- | -------------------------- |
| `arr.slice(1)`     | Smaller array each call        | Very readable               | O(n) copy per call → O(n²) overall |
| Index parameter    | Same array, different index    | O(n) total                  | Slightly more bookkeeping  |

For learning, `slice` makes the recursion crystal clear. For performance, **always switch to indices**.

:::quiz
question: For a recursive function that scans an array for a maximum, what is the most natural base case?
options:
  - When the index reaches the last element — return that element.
  - When the array length is zero — return `undefined`.
  - Never — you only return from the recursive case.
  - When the array contains exactly one negative number.
answer: 0
explanation: With a single remaining element there is nothing left to compare — that element is the max of its sub-range. (For an empty array you would return -Infinity or throw, depending on your contract.)
:::

:::quiz
question: Why does naive recursive string reversal `reverseString(s.slice(1)) + s[0]` still run in acceptable time for small inputs but degrade for large ones?
options:
  - String reversal is inherently exponential.
  - The recursion is infinite for any long string.
  - Each call copies the rest of the string via `slice`, turning O(n) work into O(n²) overall.
  - JavaScript strings are linked lists under the hood.
answer: 2
explanation: Each recursive call slices a new string of length n-1, n-2, n-3, ... which sums to O(n²) character copies. An index-based version is O(n).
:::

:::quiz
question: Why is recursion particularly well-suited to `flatten(arr)` for arbitrarily nested arrays?
options:
  - Because recursion is always faster than iteration.
  - Because a single `for` loop cannot know in advance how deep the nesting goes, while recursion handles each level with the same function.
  - Because only recursion can push to an array.
  - Because arrow functions can only be defined recursively.
answer: 1
explanation: The nesting depth is unknown, but each level looks identical: iterate, and recurse whenever you find a nested array. Recursion expresses this uniformly.
:::

:::exercise
title: Recursive `contains` and `countOccurrences`
description: Implement two recursive functions on arrays, without using loops or higher-order array methods. Use an index parameter, not `slice`. `contains(arr, target)` returns `true` if `target` is anywhere in `arr`. `countOccurrences(arr, target)` returns how many times `target` appears.
starterCode: |
  function contains(arr, target, i = 0) {
    // base: i === arr.length → false
    // recursive: arr[i] === target OR contains(arr, target, i + 1)
  }

  function countOccurrences(arr, target, i = 0) {
    // base: i === arr.length → 0
    // recursive: (arr[i] === target ? 1 : 0) + countOccurrences(arr, target, i + 1)
  }

  const arr = [1, 2, 3, 2, 4, 2];
  console.log(contains(arr, 4));          // true
  console.log(contains(arr, 99));         // false
  console.log(countOccurrences(arr, 2));  // 3
  console.log(countOccurrences(arr, 5));  // 0
:::

## Key takeaways

- Most sequence recursions look like "handle the head, recurse on the tail".
- Prefer an **index parameter** over `slice` for O(n) total work on large inputs.
- "Short-circuit" problems like palindrome checks benefit from early returns on mismatch.
- Recursion shines for arbitrarily nested data where a loop's depth is unknown.

## Practice

- [Reverse String](/problems/reverse-string) — classic two-pointer recursion; do it in-place if you can.
- [Sum of Digits](/problems/sum-of-digits-recursive) — same head-and-tail pattern, but on digits of an integer.
- [Power of Two](/problems/power-of-two) — recurse on `n / 2`; stop at 1 (success) or at any odd number > 1 (failure).
