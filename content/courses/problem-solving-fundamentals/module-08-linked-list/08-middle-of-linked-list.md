# Middle of the Linked List

**LeetCode 876.** Given the head of a singly linked list, return the **middle** node. For an even-length list, return the **second** middle node.

This is the simplest application of the slow/fast pointer pattern — and the perfect way to cement the template before tackling cycle detection and palindrome check.

## The approach

Use slow/fast starting at the head. When `fast` falls off the end, `slow` is at the middle.

## The code

```javascript
function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

That's the whole solution — four lines of real logic. One pass, O(1) extra space.

## Walkthrough — odd length

```text
list: 1 -> 2 -> 3 -> 4 -> 5

start:    slow=1, fast=1
step 1:   slow=2, fast=3
step 2:   slow=3, fast=5
check:    fast.next === null -> exit loop

return slow = 3  (the true middle of 5)
```

## Walkthrough — even length

```text
list: 1 -> 2 -> 3 -> 4 -> 5 -> 6

start:    slow=1, fast=1
step 1:   slow=2, fast=3
step 2:   slow=3, fast=5
step 3:   slow=4, fast=null (advanced past 6)
check:    fast === null -> exit loop

return slow = 4  (right of center, as specified)
```

The problem specifies the **right** middle for even lengths — that's what our template returns.

## Why this works

Think of slow's position as always equal to half of fast's position. When fast has advanced `k` steps, slow has advanced `k/2`. When fast reaches the end (distance `n` or `n-1` depending on parity), slow has reached `n/2`.

More concretely:

- If `n` is **odd**, fast lands exactly on the last node; slow lands exactly on the middle. `(n-1)/2` steps for fast, `(n-1)/2 / 2`... wait, let's re-count.

With both starting at the head (step 0):

| n (length) | Fast's final position | Slow's final position |
| --- | --- | --- |
| 1 | head (1 node, no steps taken) | head |
| 2 | null (1 step) | 2nd node |
| 3 | 3rd node (1 step) | 2nd node |
| 4 | null (2 steps) | 3rd node |
| 5 | 5th node (2 steps) | 3rd node |
| 6 | null (3 steps) | 4th node |

Slow ends up at position `floor(n/2) + 1` (1-indexed), which matches the "right middle on even, true middle on odd" spec.

## Variant — left middle for even length

Some problems (splitting a list in half for merge sort, for example) want the **left** middle on even lengths so that the first half has `ceil(n/2)` nodes and the second has `floor(n/2)`. Shift fast ahead by one:

```javascript
function leftMiddleNode(head) {
  if (head === null) return null;
  let slow = head;
  let fast = head.next;        // shifted one step
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
```

On `[1,2,3,4,5,6]`, this returns `3` instead of `4`. Use this variant for problems where you need to split the list with the first half being longer (or equal, on odd length).

## Complexity

- **Time:** O(n). Slow visits ~n/2 nodes.
- **Space:** O(1). Two pointers and nothing else.

## Alternative — two-pass length

For completeness, here's the two-pass version:

```javascript
function middleNodeTwoPass(head) {
  let n = 0;
  for (let cur = head; cur !== null; cur = cur.next) n++;
  let cur = head;
  for (let i = 0; i < Math.floor(n / 2); i++) cur = cur.next;
  return cur;
}
```

Same complexity (O(n) time, O(1) space), but makes two passes and requires you to know `n`. The two-pointer version is universally preferred because:

1. One pass is more elegant.
2. It generalizes to cycle detection (where the two-pass version would fail — computing length never terminates in a cyclic list).
3. It's the expected solution in interviews.

## Why this problem matters

"Find the middle" is the seed of many harder problems:

- **Palindrome linked list** (lesson 18): find middle, reverse second half, compare.
- **Merge sort on a linked list** (lesson 17): find middle, split in half, recurse.
- **Reorder list** (LC 143): find middle, reverse second half, interleave.

Mastering this one-pass middle-finder unlocks all three.

## Common bugs

1. **Wrong loop guard.** `while (fast && fast.next)` — both checks needed.
2. **Using `fast.next !== null && fast.next.next !== null`.** Works, but the `fast !== null` form is simpler and more forgiving of `head = null`.
3. **Off-by-one on even length.** If the problem spec says "return the first middle" but your code returns the second (or vice versa), choose the right initialization for `fast`.
4. **Trying to index with `(n+1)/2` or similar formula.** Unnecessary; two pointers do it in one pass.

:::quiz
question: With the standard `slow = head, fast = head` initialization, on an even-length list of length 6, `slow` lands on:
options:
  - The 4th node (right-of-center).
  - The 3rd node (left-of-center).
answer: 0
explanation: Fast advances twice per step; slow ends up at position floor(n/2) + 1 = 4 for n=6.
:::

:::quiz
question: To have `slow` land on the LEFT middle for even lengths, how do you adjust the initialization?
options:
  - Start `fast = head.next` instead of `fast = head`.
  - Reverse the list first.
answer: 0
explanation: Shifting fast ahead by one changes the parity of when fast hits null.
:::

:::quiz
question: Compared to the two-pass (length-then-step) approach, the slow/fast one-pass approach is:
options:
  - Same asymptotic complexity but works even in lists with cycles (where counting length would loop forever).
  - Asymptotically faster.
answer: 0
explanation: Both are O(n) / O(1), but the two-pointer approach terminates on lists with cycles — which matters for the next lessons.
:::

:::exercise
title: Implement middleNode
description: Implement `middleNode(head)` returning the middle node using the slow/fast template. Return the right middle on even-length lists.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function middleNode(head) {
    // standard slow/fast walk
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }

  console.log(middleNode(fromArray([1,2,3,4,5])).val);   // 3
  console.log(middleNode(fromArray([1,2,3,4,5,6])).val); // 4
  console.log(middleNode(fromArray([1])).val);           // 1
  console.log(middleNode(fromArray([1,2])).val);         // 2
:::

## Practice

- [Middle of the Linked List](/problems/middle-of-the-linked-list)
