## Approach 1: Iterative two pointers

Swap pairs from the outside in.

```javascript
function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
}
```

**Time:** O(n) &nbsp; **Space:** O(1)

This is the answer interviewers look for — minimal memory, cleanest code.

## Approach 2: Recursion

```javascript
function reverseString(s, left = 0, right = s.length - 1) {
  if (left >= right) return s;                                    // base case
  [s[left], s[right]] = [s[right], s[left]];                      // swap ends
  return reverseString(s, left + 1, right - 1);                   // recurse inward
}
```

**Time:** O(n) &nbsp; **Space:** O(n) stack

Same work, different shape. This version is worth writing once to cement the two-pointer recursion pattern — but the iterative version is strictly better in practice because it uses O(1) stack.

## Why not `s.reverse()`?

Calling `Array.prototype.reverse()` on the array literally solves the problem in one line:

```javascript
function reverseString(s) { return s.reverse(); }
```

It is correct, but it dodges the learning objective: building the reversal yourself teaches two-pointer thinking, which shows up everywhere (palindromes, container with most water, valid palindrome II, ...).
