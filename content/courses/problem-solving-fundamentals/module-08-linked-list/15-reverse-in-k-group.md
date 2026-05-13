# Reverse Nodes in K-Group

**LeetCode 25.** Given the head of a list and an integer `k`, reverse the nodes in **each group of `k`**. If a trailing group has fewer than `k` nodes, leave it in its original order.

Example: `1 -> 2 -> 3 -> 4 -> 5`, `k = 2` → `2 -> 1 -> 4 -> 3 -> 5`.
Example: `1 -> 2 -> 3 -> 4 -> 5`, `k = 3` → `3 -> 2 -> 1 -> 4 -> 5`.

This is a **hard-tagged** problem that really is just "reverse a sub-list" (lesson 14) in a loop. Once you split it that way, the only subtlety is knowing when to stop.

## Plan

1. Use a dummy head so the first group's predecessor is always real.
2. Maintain a `groupPrev` pointer — the node before the current group.
3. Every iteration:
   - Check whether **k nodes remain** starting from `groupPrev.next`. If not, stop (the trailing partial group stays as-is).
   - Reverse the next k nodes in place (the pull-forward technique from lesson 14, but with k - 1 pulls).
   - Advance `groupPrev` to the **end of the just-reversed group**, which is the tail of that group (was its head before reversal).

## The code

```javascript
function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  while (true) {
    const kth = getKth(groupPrev, k);
    if (kth === null) break;          // fewer than k nodes left; leave as-is

    const groupNext = kth.next;

    // reverse the k-node segment between groupPrev and kth (inclusive)
    let prev = groupNext;
    let cur = groupPrev.next;
    while (cur !== groupNext) {
      const tmp = cur.next;
      cur.next = prev;
      prev = cur;
      cur = tmp;
    }

    // update pointers
    const newGroupPrev = groupPrev.next;   // was the old head of this group; now its tail
    groupPrev.next = kth;                  // stitch to the reversed segment's new head
    groupPrev = newGroupPrev;
  }

  return dummy.next;
}

function getKth(start, k) {
  let cur = start;
  for (let i = 0; i < k && cur !== null; i++) cur = cur.next;
  return cur;
}
```

Two helpers:

- **`getKth(start, k)`** returns the k-th node **after** `start`, or `null` if there are fewer than k. We use it to look ahead and decide whether the next group is complete.
- The inner `while` is the standard iterative reversal, just bounded by `cur !== groupNext` instead of `cur !== null`.

## How the inner reversal works

The inner reversal uses the classic three-pointer template, but with a **sentinel end**: instead of stopping when `cur === null`, we stop when `cur === groupNext`. This lets us reverse exactly the k nodes and no more.

Initial `prev = groupNext` so the **last** node we flip points into the unreversed rest of the list, correctly terminating the reversed group.

## Walkthrough — k=2 on 1,2,3,4,5

```text
Initial:  dummy -> 1 -> 2 -> 3 -> 4 -> 5
          groupPrev = dummy

Iteration 1: kth = getKth(dummy, 2) = 2
  groupNext = 3
  
  Reverse 1 -> 2:
    prev=3, cur=1
    tmp=2, cur.next=3, prev=1, cur=2
    tmp=3, cur.next=1, prev=2, cur=3  (stop)
  
  newGroupPrev = 1 (was old head, now tail of reversed group)
  groupPrev.next = 2   (dummy.next = 2)
  groupPrev = 1

  State: dummy -> 2 -> 1 -> 3 -> 4 -> 5
                       ^
                    groupPrev

Iteration 2: kth = getKth(1, 2) = 4
  groupNext = 5

  Reverse 3 -> 4:
    prev=5, cur=3
    tmp=4, cur.next=5, prev=3, cur=4
    tmp=5, cur.next=3, prev=4, cur=5  (stop)

  newGroupPrev = 3
  groupPrev.next = 4   (1.next = 4)
  groupPrev = 3

  State: dummy -> 2 -> 1 -> 4 -> 3 -> 5
                                 ^
                              groupPrev

Iteration 3: kth = getKth(3, 2) = null (only one node after)
  break.

Return dummy.next = 2 -> 1 -> 4 -> 3 -> 5 ✓
```

## Why we check `getKth` BEFORE reversing

If we reversed first and then discovered the group was short, we'd have reversed part of the tail — which the problem forbids. The look-ahead ensures **atomicity**: either the full k-group is reversed, or nothing changes.

## Complexity

- **Time:** O(n). Each node is visited by `getKth` once and reversed once. 2n total operations = O(n).
- **Space:** O(1). A handful of pointers; no recursion.

## Recursive variant

A compact recursive solution is also common:

```javascript
function reverseKGroupRec(head, k) {
  let cur = head;
  for (let i = 0; i < k; i++) {
    if (cur === null) return head;    // fewer than k; leave as-is
    cur = cur.next;
  }
  // now cur is the k-th node (0-indexed: head of the NEXT group)
  const prev = reverseFirst(head, k);
  head.next = reverseKGroupRec(cur, k);
  return prev;
}

function reverseFirst(head, k) {
  let prev = null, cur = head;
  for (let i = 0; i < k; i++) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}
```

Beautiful, but uses O(n/k) stack depth. For typical k (like 2 or 3), recursion depth is large. The iterative version is stack-safe and preferred.

## Why this is a "hard" problem

It combines three patterns:

1. **Bounded reversal** (reverse exactly k nodes, not until null).
2. **Lookahead** (peek k steps ahead to decide whether to reverse).
3. **Stitching** (the new group's tail needs to connect to the **next group's** eventual new head).

Each is simple on its own; combining them correctly on a whiteboard under pressure is the challenge. The iterative skeleton above is the pattern to memorize.

## Common bugs

1. **Reversing a partial trailing group.** Always call `getKth` first.
2. **Forgetting to advance `groupPrev` to the reversed group's new tail.** The old head of the group becomes the new tail; this is what `newGroupPrev` captures.
3. **Inner reversal's `prev` initialization.** Must be `groupNext` (not `null`) so the reversed segment's tail correctly links into the rest of the list.
4. **Off-by-one in `getKth`.** `getKth(dummy, 2)` should return the 2nd real node, not the 1st or the 3rd.

## When this pattern appears

- **LC 25 Reverse Nodes in k-Group** (this problem).
- **Rotating a list by k** positions — related but cleaner (rotate a list without reversing).
- **Odd-even linked list (LC 328)** — different grouping logic but same "split, reverse, reconnect" skeleton.
- **Swap nodes in pairs (LC 24)** — exactly this problem with `k = 2`; you can solve it with `reverseKGroup(head, 2)`.

Master the iterative k-group template and you've unlocked a whole cluster of problems.

:::quiz
question: Why do we call `getKth` BEFORE reversing each group?
options:
  - To detect short trailing groups without reversing them (the problem requires leaving them untouched).
  - For performance.
answer: 0
explanation: If we reversed first and then noticed a short group, we'd have violated the spec.
:::

:::quiz
question: In the inner reversal, why initialize `prev = groupNext` instead of `prev = null`?
options:
  - So the LAST flipped node of the group links into the rest of the list (the unreversed tail).
  - `null` would work equally well.
answer: 0
explanation: If `prev = null`, the reversed group's tail would terminate the list prematurely.
:::

:::quiz
question: How does `groupPrev` advance between iterations?
options:
  - It moves to what was the group's original head — now the group's tail after reversal.
  - It moves to `kth`.
answer: 0
explanation: The next group's "pre" is the node just before the next group, which is the tail of the group we just reversed.
:::

:::exercise
title: Implement reverseKGroup
description: Implement `reverseKGroup(head, k)` iteratively using dummy head, getKth lookahead, and bounded inner reversal.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function reverseKGroup(head, k) {
    // dummy -> head; groupPrev = dummy
    // loop: find kth; if null break; reverse [groupPrev.next..kth]; advance groupPrev
  }

  function getKth(start, k) {
    let cur = start;
    for (let i = 0; i < k && cur !== null; i++) cur = cur.next;
    return cur;
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(reverseKGroup(fromArray([1,2,3,4,5]), 2))); // [2,1,4,3,5]
  console.log(toArray(reverseKGroup(fromArray([1,2,3,4,5]), 3))); // [3,2,1,4,5]
  console.log(toArray(reverseKGroup(fromArray([1,2,3,4]), 2)));   // [2,1,4,3]
  console.log(toArray(reverseKGroup(fromArray([1,2]), 3)));       // [1,2]
:::

## Practice

- [Reverse Nodes in k-Group](/problems/reverse-nodes-in-k-group)
