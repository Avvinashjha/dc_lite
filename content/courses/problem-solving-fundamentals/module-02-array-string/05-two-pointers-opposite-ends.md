# Two Pointers: Opposite Ends

**Two pointers** means tracking two indices into the same array (or string) and moving them according to a rule. The **opposite-ends** pattern places one pointer at the start and one at the end, then moves them inward — ideal for palindromes, sorted arrays, and the "container" geometry problem.

## Palindrome check

Compare `left` and `right`; if characters match, move both pointers inward. If they ever mismatch, it is not a palindrome.

```javascript
function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

```text
  "racecar"
   ^     ^
   L     R   -> match, move inward
    ^   ^
     ^ ^
      ^      -> done, palindrome
```

## Sorted array + target sum

If `nums` is **sorted**, you can find two numbers that sum to `target` in **O(n)**:

- If `nums[left] + nums[right] < target`, increase the sum by moving `left` right.
- If sum too big, move `right` left.

```javascript
function twoSumSorted(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    const sum = nums[left] + nums[right];
    if (sum === target) return [left, right];
    if (sum < target) left++;
    else right--;
  }
  return [];
}
```

This **requires sorted** input. Unsorted arrays need a hash map (previous lesson) or sort first (changes indices unless you track originals).

## Container with most water (intuition)

You have vertical lines at each index; water height is limited by the shorter line. Two pointers at both ends:

- Always move the pointer at the **shorter** line inward — that is the only way you might increase area.

```text
height = [1,8,6,2,5,4,8,3,7]
          ^                   ^
          L                   R
area = width * min(h[L], h[R])
```

The full proof is a great exercise after you try the problem.

:::quiz
question: Opposite two pointers for a palindrome stop when which condition is true?
options:
  - left === right or left > right
  - left + right === length
  - left reaches length
  - right === 0
answer: 0
explanation: You continue while left < right. When they meet or cross, every pair has been checked.
:::

:::quiz
question: The O(n) two-sum on a sorted array fails if the array is unsorted because...
options:
  - JavaScript cannot compare numbers.
  - Moving pointers assumes ordering: shrinking from the right always decreases the sum only if the array is sorted.
  - Maps are required for all arrays.
answer: 1
explanation: The two-pointer proof relies on monotonicity when you move left (sum increases) or right (sum decreases). Without sorting, that guarantee breaks.
:::

:::quiz
question: In "container with most water," why move the shorter line's pointer?
options:
  - The taller line never limits height, so moving it cannot increase area; moving the shorter side might find a taller line.
  - The shorter line should always be removed from the array.
  - It minimizes the number of iterations.
answer: 0
explanation: Area is width times the **minimum** of the two heights. Moving the taller side only shrinks width without improving the limiting height.
:::

:::exercise
title: Reverse only letters
description: Given a string, return a new string with only alphabetic characters reversed in place (non-letters stay where they are). Use two pointers from both ends, skipping non-letters. Example: `a-bC-d` -> `d-bC-a`.
starterCode: |
  function reverseOnlyLetters(s) {
    const arr = s.split("");
    let left = 0, right = arr.length - 1;
    // skip non-letters, swap letters, until left >= right
    return arr.join("");
  }

  console.log(reverseOnlyLetters("ab-cd")); // "dc-ba"
:::

## Practice

- [Container With Most Water](/problems/container-with-most-water) — classic opposite-end greedy proof.
- [Reverse String](/problems/reverse-string) — two pointers from both ends on a character array.
