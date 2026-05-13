# Detect a Cycle (Floyd's Tortoise and Hare)

**LeetCode 141.** Given the head of a linked list, determine whether the list contains a **cycle** — that is, whether some node's `next` pointer circles back to a previously-visited node.

A cyclic list has no `null` terminator; naive traversal never terminates. **Floyd's Tortoise and Hare** is the elegant O(n)-time, O(1)-space algorithm that solves it using two pointers at different speeds.

## What a cycle looks like

```text
   1 ──► 2 ──► 3 ──► 4 ──► 5
                     ▲      │
                     └──────┘
```

Node 5's `next` points back to node 4. Walking from head 1 with `cur = cur.next` eventually loops forever through `4 -> 5 -> 4 -> 5 -> ...`.

For this lesson we only care whether a cycle **exists**. The next lesson will find **where** the cycle begins.

## The brute force — hash set

The simplest correct approach: walk the list, remember every node seen, return true if you see one twice.

```javascript
function hasCycleSet(head) {
  const seen = new Set();
  for (let cur = head; cur !== null; cur = cur.next) {
    if (seen.has(cur)) return true;
    seen.add(cur);
  }
  return false;
}
```

- **Time:** O(n).
- **Space:** O(n) for the set.

Correct and easy to get right in an interview — always worth mentioning as a baseline. But we can do better on space.

## Floyd's algorithm — O(1) space

Use two pointers, **slow** and **fast**. Slow advances one step at a time; fast advances two. If the list has a cycle, fast eventually **laps** slow and they meet. If the list is acyclic, fast reaches `null`.

```javascript
function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

Exactly the same template as the middle-of-list algorithm, with one extra check per iteration: "did slow and fast collide?"

## Why it works

Consider a list with a cycle of length `c` starting after some prefix of length `p`. Once **both** pointers enter the cycle, slow advances by 1 per step and fast by 2 per step. Relative to slow, fast gains **one position per iteration inside the cycle**. So fast closes the gap by 1 each step, and since the cycle has `c` positions, they must meet in at most `c` iterations.

If the list is acyclic, there's no cycle to lap in — fast keeps advancing and hits `null`.

This is the whole argument. It's one of the prettiest small proofs in computer science.

## Walkthrough — cyclic list

```text
list:  A -> B -> C -> D -> E -> B   (E.next = B; cycle length 4)

step 0: slow=A, fast=A
step 1: slow=B, fast=C
step 2: slow=C, fast=E
step 3: slow=D, fast=C      (fast went E -> B -> C)
step 4: slow=E, fast=E      meet -> return true
```

## Walkthrough — acyclic list

```text
list:  1 -> 2 -> 3 -> 4 -> 5 -> null

step 0: slow=1, fast=1
step 1: slow=2, fast=3
step 2: slow=3, fast=5
step 3: fast.next === null -> exit loop -> return false
```

## Complexity

- **Time:** O(n). In the worst case, slow traverses the entire prefix plus at most one full cycle.
- **Space:** O(1). Two pointers, nothing else.

Contrast with the hash-set version: same time, but O(n) space — and the interviewer will expect the O(1) space version if they mention "Floyd's algorithm" or "tortoise and hare."

## Why fast always catches slow (intuition)

Think of a circular race track of length `c`. Two runners start at the same point; one runs at speed 1 and the other at speed 2. The faster runner gains 1 unit of distance per unit time. After exactly `c` units of time (i.e., `c` iterations), the fast runner has lapped the slow runner and they're back in the same position.

If the list has a non-trivial prefix before the cycle, the setup takes a few extra steps — but once both enter the cycle, the gap-closing argument applies.

## An alternative framing

You can also think of Floyd's as answering: "can I find two indices `i < j` such that the node at step `i` and the node at step `2i` are the same?" In a cyclic list, yes — in an acyclic list, no (because step `2i` becomes null at some point).

This framing generalizes to **cycle detection in any iterated function** — not just linked lists — which is why Floyd's algorithm is used in number theory (Pollard's rho), random number generators, and hash-based cryptanalysis.

## Common bugs

1. **Checking `slow === fast` before the first advance.** They start equal; you'd immediately return true for any non-empty list. Always advance at least once before the check.
2. **Only checking `fast !== null`.** You also need `fast.next !== null` to safely read `fast.next.next`.
3. **Returning `false` inside the loop.** Returning false only makes sense after the loop exits (i.e., fast hit null). Putting a `return false` inside a conditional branch is almost always a bug.
4. **Using `slow.val === fast.val`.** You want **reference** equality, not value equality. Two different nodes may hold the same value.

## When to prefer the hash-set version

- **Interviews that penalize being clever.** If you aren't fully confident in the Floyd argument, write the hash-set version. It's correct, obvious, and still O(n).
- **Problems that also ask you to return the cycle's length or start.** The hash-set version gives those as a byproduct; Floyd's needs a second phase (next lesson).
- **Teaching.** It's easier to explain to a listener who doesn't know the pattern.

Mention both during an interview: Floyd's for optimality, hash-set as a baseline.

:::quiz
question: Why does fast always "catch up" to slow in a cyclic list?
options:
  - Once both are inside the cycle, fast gains exactly one position on slow per iteration; within `c` iterations (cycle length), they must collide.
  - It's random chance.
answer: 0
explanation: The gap-closing argument is deterministic; fast laps slow after at most c steps inside the cycle.
:::

:::quiz
question: On an acyclic list of length n, how many iterations does Floyd's algorithm run?
options:
  - About n/2 — fast reaches null after ~n/2 steps.
  - About n² in the worst case.
answer: 0
explanation: Fast advances twice per iteration; it walks the list in half the iterations.
:::

:::quiz
question: Why compare `slow === fast` with reference equality rather than `slow.val === fast.val`?
options:
  - Two distinct nodes may hold the same value; we need to detect that they are the same node in memory.
  - Reference equality is faster.
answer: 0
explanation: Value equality gives false positives and misses the "same node" condition we actually care about.
:::

:::exercise
title: Implement hasCycle (Floyd's algorithm)
description: Implement `hasCycle(head)` using the slow/fast pattern. Return true if a cycle exists, false otherwise.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function hasCycle(head) {
    // slow/fast; return true when they meet; return false if fast hits null
  }

  function makeList(values, cycleIdx = -1) {
    const d = new ListNode(); let t = d;
    const nodes = [];
    for (const v of values) { t.next = new ListNode(v); t = t.next; nodes.push(t); }
    if (cycleIdx >= 0 && nodes.length > 0) t.next = nodes[cycleIdx];
    return d.next;
  }

  console.log(hasCycle(makeList([1,2,3,4])));       // false
  console.log(hasCycle(makeList([1,2,3,4], 1)));    // true  (tail -> node at idx 1)
  console.log(hasCycle(makeList([1])));             // false
  console.log(hasCycle(makeList([1], 0)));          // true
  console.log(hasCycle(null));                      // false
:::

## Practice

- [Linked List Cycle](/problems/linked-list-cycle)
