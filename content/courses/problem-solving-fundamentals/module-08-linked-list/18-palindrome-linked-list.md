# Palindrome Linked List

**LeetCode 234.** Given the head of a singly linked list, return `true` if it's a **palindrome** (reads the same forwards and backwards), else `false`.

Example: `1 -> 2 -> 2 -> 1` → `true`. `1 -> 2` → `false`.

This problem's optimal solution — **O(n) time, O(1) space** — is a perfect demonstration of composing patterns: **find the middle** (lesson 8) + **reverse the second half** (lesson 12) + **walk both halves comparing values**. Three mini-problems you already know.

## Two approaches

### 1. Stack or array (O(n) space)

Dump values to an array, check with two pointers. Easiest to write correctly under pressure:

```javascript
function isPalindromeArr(head) {
  const vals = [];
  for (let cur = head; cur !== null; cur = cur.next) vals.push(cur.val);
  let l = 0, r = vals.length - 1;
  while (l < r) {
    if (vals[l] !== vals[r]) return false;
    l++; r--;
  }
  return true;
}
```

- **Time:** O(n).
- **Space:** O(n).

Correct, simple, and worth mentioning as a baseline. But the real prize is O(1) space.

### 2. Find-mid + reverse second half (O(1) space)

```javascript
function isPalindrome(head) {
  if (head === null || head.next === null) return true;

  // 1. find middle (for even length, take LEFT middle so both halves are easy to walk)
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  // for odd length, skip the middle node
  let right = (fast === null) ? slow : slow.next;

  // 2. reverse the second half
  let prev = null;
  while (right !== null) {
    const next = right.next;
    right.next = prev;
    prev = right;
    right = next;
  }

  // 3. compare halves
  let first = head, second = prev;
  while (second !== null) {
    if (first.val !== second.val) return false;
    first = first.next;
    second = second.next;
  }
  return true;
}
```

Twelve meaningful lines — two patterns you already know, glued together.

## Walkthrough

### Odd length: `1 -> 2 -> 3 -> 2 -> 1`

```text
Step 1: find middle
  slow=1, fast=1
  slow=2, fast=3
  slow=3, fast=1 (fast.next)
  fast.next === null, exit. slow = 3.
  
  fast !== null (it's 1), so right = slow.next = 2 (skip middle node 3).

Step 2: reverse 2 -> 1
  prev=null, right=2
  next=1, 2.next=null, prev=2, right=1
  next=null, 1.next=2, prev=1, right=null
  reversed: 1 -> 2 -> null

Step 3: compare
  first=1 (head), second=1 (reversed tail)
  1 == 1 ✓
  first=2, second=2
  2 == 2 ✓
  second === null, return true ✓
```

### Even length: `1 -> 2 -> 2 -> 1`

```text
Step 1: find middle
  slow=1, fast=1
  slow=2, fast=2 (the second one)
  slow=2 (second), fast=null
  exit. slow = 2 (second 2).
  
  fast === null, so right = slow = 2 (the second 2).

Step 2: reverse 2 -> 1
  reversed: 1 -> 2 -> null

Step 3: compare
  first=1, second=1: equal
  first=2, second=2: equal
  second === null, return true ✓
```

### Not a palindrome: `1 -> 2 -> 3`

```text
Step 1: slow=1, fast=1 -> slow=2, fast=3 -> exit. slow = 2.
  fast !== null (3), so right = slow.next = 3.

Step 2: reverse 3 -> null -> reversed = 3 -> null.

Step 3: compare first=1 vs second=3. 1 !== 3 -> return false ✓
```

## The `right = (fast === null) ? slow : slow.next` trick

`fast` status tells us parity:

- `fast === null` means we walked an **even** number of doubled steps — the list has **even** length, and slow is at the first node of the right half. `right = slow`.
- `fast !== null` means we walked an **odd** number of doubled steps — odd length, and slow is at the exact middle (which is skipped). `right = slow.next`.

Without this adjustment, the comparison is off-by-one on odd lengths.

## Complexity

- **Time:** O(n). Three linear passes: find middle, reverse, compare.
- **Space:** O(1). No auxiliary allocation; we reuse the existing nodes.

## Restoring the list (politeness)

A practical concern: the O(1) space solution **mutates the input** (the second half is now reversed). If callers expect the list to remain intact, restore it before returning:

```javascript
function isPalindromeRestoring(head) {
  const result = isPalindrome(head);
  // reverse the second half back (same code as before)
  // ...
  return result;
}
```

Most LC solutions don't bother, but real production code should restore or document the mutation.

## Alternative: stack of first half

A hybrid that uses O(n/2) space but is simpler to reason about:

```javascript
function isPalindromeStack(head) {
  const stack = [];
  let slow = head, fast = head;
  while (fast !== null && fast.next !== null) {
    stack.push(slow.val);
    slow = slow.next;
    fast = fast.next.next;
  }
  if (fast !== null) slow = slow.next;  // odd length: skip middle
  while (slow !== null) {
    if (stack.pop() !== slow.val) return false;
    slow = slow.next;
  }
  return true;
}
```

- **Time:** O(n).
- **Space:** O(n/2).

Between the array version and the in-place reversal version, this is the middle ground.

## Why this problem matters

It's the canonical example of **composing linked-list patterns**. Three sub-problems, each solved in a prior lesson, glued together into one solution. In interviews, being able to narrate "find middle, reverse second half, compare" is the most important thing — the pattern recognition is the skill.

## Common bugs

1. **Off-by-one on odd lengths.** If you don't skip the middle node, the compare loop runs one step too long.
2. **Comparing past the end.** Loop should run until `second === null`, **not** until `first === null` (first could have one extra node on odd lengths).
3. **Not re-reversing on restore.** If you promise to restore but don't, tests may silently fail.
4. **Using `==` instead of `===`.** JS comparison gotchas: `1 == "1"` is true, `null == undefined` is true. Always `===`.

:::quiz
question: After finding the middle with the standard slow/fast loop, on an ODD-length list, which node should be the start of the "right half to reverse"?
options:
  - `slow.next` — skip the exact middle because there's no mirror partner for it.
  - `slow` itself.
answer: 0
explanation: The middle of an odd-length palindrome is its own mirror; we don't need to compare it.
:::

:::quiz
question: The optimal in-place solution's space complexity is:
options:
  - O(1) — we reverse in place and reuse the existing nodes.
  - O(n/2).
answer: 0
explanation: Only a few pointers; the "reversed second half" uses the same physical nodes.
:::

:::quiz
question: Why stop the compare loop when `second === null` rather than when `first === null`?
options:
  - On odd-length lists, the first half is 1 node longer than the reversed second half; stopping on second ensures we compare exactly as many pairs as the second half has.
  - They're interchangeable.
answer: 0
explanation: `first` may still have the un-skipped middle node; we don't want to compare past the mirror boundary.
:::

:::exercise
title: Implement isPalindrome in O(1) space
description: Implement `isPalindrome(head)` using find-middle + reverse-second-half + compare. No arrays, no stacks.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function isPalindrome(head) {
    if (head === null || head.next === null) return true;
    // 1. find middle with slow/fast
    // 2. determine right = slow or slow.next based on parity
    // 3. reverse right half
    // 4. compare left and reversed right
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }

  console.log(isPalindrome(fromArray([1,2,2,1])));  // true
  console.log(isPalindrome(fromArray([1,2,3,2,1])));// true
  console.log(isPalindrome(fromArray([1,2,3,4])));  // false
  console.log(isPalindrome(fromArray([1])));        // true
  console.log(isPalindrome(fromArray([])));         // true (empty)
:::

## Practice

- [Palindrome Linked List](/problems/palindrome-linked-list)
- [Middle of the Linked List](/problems/middle-of-the-linked-list) (prerequisite pattern)
- [Reverse Linked List](/problems/reverse-linked-list) (prerequisite pattern)
