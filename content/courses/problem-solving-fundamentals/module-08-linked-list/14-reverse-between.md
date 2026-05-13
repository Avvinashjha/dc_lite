# Reverse a Sublist Between Positions

**LeetCode 92. Reverse Linked List II.** Given the head of a list and two positions `left` and `right` (1-indexed, `left ≤ right`), reverse the nodes from position `left` to position `right` **in place** and return the head.

Example: `1 -> 2 -> 3 -> 4 -> 5`, `left = 2`, `right = 4` → `1 -> 4 -> 3 -> 2 -> 5`.

This problem teaches you to **reverse a segment**, not the whole list, and to **reconnect the boundary pointers** correctly — a skill you'll reuse for k-group reversal (lesson 15) and many others.

## Two broad strategies

1. **Cut-and-reuse.** Walk to the start of the segment, remember the predecessor, reverse the [left, right] sub-list, stitch it back.
2. **In-place "front insertion."** Walk to the predecessor of left, then repeatedly pull each subsequent node and insert it at the front of the reversal window. One pass.

Both are O(n) time, O(1) space. Strategy 2 is the more polished one-pass solution and what most interviewers expect.

## The dummy head is essential

If `left = 1`, the segment starts at the head — and the reversed segment's new head **replaces** the original. The dummy provides a universal predecessor so we don't special-case this.

## Strategy 2: one-pass front insertion

```javascript
function reverseBetween(head, left, right) {
  if (head === null || left === right) return head;

  const dummy = new ListNode(0, head);
  let prev = dummy;

  // 1. advance prev to the node BEFORE position `left`
  for (let i = 1; i < left; i++) prev = prev.next;

  // 2. repeatedly pull the node after `cur` and insert it after `prev`
  const cur = prev.next;
  for (let i = 0; i < right - left; i++) {
    const moving = cur.next;
    cur.next = moving.next;
    moving.next = prev.next;
    prev.next = moving;
  }

  return dummy.next;
}
```

Seven meaningful lines. Let's unpack.

### Phase 1 — find the predecessor

Walk `prev` to the node just before position `left`. Starting at `dummy` (position 0), we advance `left - 1` times — that's the `for (let i = 1; i < left; i++)` loop.

Example: `left = 2` → advance once → `prev` is at position 1 (the old head).

### Phase 2 — pull each interior node forward

After phase 1, `cur = prev.next` is the **first node of the segment to reverse**. Every iteration we:

1. Grab the node immediately after `cur` (`moving`).
2. Unlink `moving` from the chain by skipping over it (`cur.next = moving.next`).
3. Insert `moving` right after `prev` (`moving.next = prev.next; prev.next = moving`).

After `right - left` iterations, we've pulled each of the `right - left` nodes following `cur` to the front of the reversal window, which reverses the segment.

## Visualization

```text
Input:  1 -> 2 -> 3 -> 4 -> 5,  left=2, right=4

After phase 1:
    dummy -> 1 -> 2 -> 3 -> 4 -> 5
             ^    ^
           prev  cur

Iteration 1: move 3 to front of segment.
  moving = 3
  cur.next = moving.next       2.next = 4
  moving.next = prev.next      3.next = 2
  prev.next = moving           1.next = 3

  Result: dummy -> 1 -> 3 -> 2 -> 4 -> 5
                   ^         ^
                 prev       cur

Iteration 2: move 4 to front of segment.
  moving = 4
  cur.next = moving.next       2.next = 5
  moving.next = prev.next      4.next = 3
  prev.next = moving           1.next = 4

  Result: dummy -> 1 -> 4 -> 3 -> 2 -> 5
                   ^              ^
                 prev            cur

(right - left = 2 iterations, done.)

return dummy.next = 1 -> 4 -> 3 -> 2 -> 5 ✓
```

## Strategy 1: cut, reverse, stitch

If you find the one-pass flow confusing, here's the alternative — equivalent, slightly more code:

```javascript
function reverseBetweenCut(head, left, right) {
  if (head === null || left === right) return head;

  const dummy = new ListNode(0, head);
  let pre = dummy;
  for (let i = 1; i < left; i++) pre = pre.next;

  let leftNode = pre.next;
  let tail = leftNode;
  for (let i = 0; i < right - left; i++) tail = tail.next;
  let after = tail.next;

  // detach the [leftNode .. tail] segment
  tail.next = null;

  // reverse that segment using the standard iterative reversal
  let prev = null, cur = leftNode;
  while (cur !== null) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }

  // stitch
  pre.next = prev;         // new head of segment
  leftNode.next = after;   // old leftNode is now the segment tail

  return dummy.next;
}
```

Same output. Useful when you're new to the pattern — the "reverse" step is the familiar lesson-12 routine, and you only have to think about the boundary connections once.

## Complexity

Both strategies:

- **Time:** O(n) — one pass (strategy 2) or one walk plus one reverse (strategy 1, still linear).
- **Space:** O(1) — a few pointers.

## Complete example — left = 1

Using strategy 2 with `head = 1 -> 2 -> 3`, `left = 1`, `right = 3`:

```text
dummy -> 1 -> 2 -> 3

Phase 1: i from 1; 1 < 1 is false; loop doesn't run. prev = dummy.
Phase 2: cur = 1.

Iteration 1:
  moving = 2
  cur.next = 3
  2.next = 1
  dummy.next = 2

  State: dummy -> 2 -> 1 -> 3

Iteration 2:
  moving = 3
  cur.next = null
  3.next = 2
  dummy.next = 3

  State: dummy -> 3 -> 2 -> 1 -> null

return dummy.next = 3 -> 2 -> 1 ✓
```

The dummy absorbs the "reverse from the head" case without any branching. This is textbook dummy-head payoff.

## Edge cases

- **`left === right`** → nothing to do, return head. (Guard at the top.)
- **`left === 1`** → prev stays at dummy, everything works.
- **`right === length`** → after the loop, cur's `next` is null, which matches the list's tail.

## Common bugs

1. **Advancing to `left` instead of `left - 1`.** You'd point `prev` at the first node of the segment instead of its predecessor.
2. **Forgetting to update `prev.next`, `moving.next`, AND `cur.next`.** All three are needed per iteration.
3. **Using `cur.next = cur.next.next; ...`** without naming `moving` — possible but confusing. Name the intermediate.
4. **Looping `right - left + 1` times instead of `right - left`.** One extra pull past the segment, corrupting the structure.

## Recursive variant

A neat recursive solution reduces the problem step by step:

```javascript
function reverseBetweenRec(head, left, right) {
  if (left === 1) return reverseFirstK(head, right);
  head.next = reverseBetweenRec(head.next, left - 1, right - 1);
  return head;
}

function reverseFirstK(head, k) {
  if (k === 1) return head;
  const newHead = reverseFirstK(head.next, k - 1);
  // ... (like recursive full-list reversal, with trailing reconnection)
  const after = head.next.next;
  head.next.next = head;
  head.next = after;
  return newHead;
}
```

Elegant, but more complex than the one-pass iterative version. Stick with iterative in interviews unless explicitly asked.

## Why this matters

This is the **first non-trivial reversal problem**. It teaches you:

- Dummy-head for clean boundary handling.
- The predecessor-pointer pattern for in-place segment surgery.
- The "pull forward" reversal technique — which scales directly to k-group reversal (lesson 15).

If you can do this in one pass on a whiteboard, you can do k-group reversal in one pass on a whiteboard.

:::quiz
question: Why advance `prev` to `left - 1` rather than `left`?
options:
  - We need a handle on the predecessor of the segment so we can rewrite its `.next` to point at the reversed segment's new head.
  - Because JavaScript is 0-indexed.
answer: 0
explanation: Without the predecessor, you can't stitch the reversed segment back in.
:::

:::quiz
question: In the "pull forward" iteration `moving.next = prev.next; prev.next = moving`, why do we assign `moving.next` BEFORE `prev.next`?
options:
  - `moving.next` must point at the current segment head (`prev.next`) before we overwrite `prev.next` to point at `moving`.
  - Order doesn't matter.
answer: 0
explanation: Overwriting prev.next first severs the existing segment head from the chain.
:::

:::quiz
question: How many iterations does the "pull forward" loop run for `left = 2, right = 5`?
options:
  - 3 (right - left).
  - 4 (right - left + 1).
answer: 0
explanation: You pull each of the 3 interior successors forward to reverse a segment of 4 nodes.
:::

:::exercise
title: Implement reverseBetween in one pass
description: Implement `reverseBetween(head, left, right)` using the dummy-head + pull-forward technique. Don't cut and stitch; do it in one pass.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function reverseBetween(head, left, right) {
    if (head === null || left === right) return head;
    const dummy = new ListNode(0, head);
    let prev = dummy;
    for (let i = 1; i < left; i++) prev = prev.next;
    const cur = prev.next;
    for (let i = 0; i < right - left; i++) {
      // pull cur.next to the front of the segment
    }
    return dummy.next;
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(reverseBetween(fromArray([1,2,3,4,5]), 2, 4))); // [1,4,3,2,5]
  console.log(toArray(reverseBetween(fromArray([1,2,3,4,5]), 1, 5))); // [5,4,3,2,1]
  console.log(toArray(reverseBetween(fromArray([1,2,3,4,5]), 1, 1))); // [1,2,3,4,5]
  console.log(toArray(reverseBetween(fromArray([5]), 1, 1)));         // [5]
:::

## Practice

- [Reverse Linked List II](/problems/reverse-linked-list-ii)
