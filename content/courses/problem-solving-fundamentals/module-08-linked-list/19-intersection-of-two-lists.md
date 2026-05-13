# Intersection of Two Linked Lists

**LeetCode 160.** Given the heads of two singly linked lists `headA` and `headB`, return the **node** at which they intersect, or `null` if they never do. Intersection is defined by **reference equality**, not value equality.

Key insight: if two lists share a suffix, they converge at some point and share every node from there on. The question is, "which node is the first shared one?"

## The two-pointer trick

Use two pointers, `pA` starting at `headA` and `pB` starting at `headB`. Advance each one step at a time. When a pointer reaches the end of its list, **redirect it to the head of the OTHER list**. If the lists intersect, the two pointers meet at the intersection node. If they don't, both eventually hit `null` simultaneously.

## The code

```javascript
function getIntersectionNode(headA, headB) {
  if (headA === null || headB === null) return null;
  let pA = headA;
  let pB = headB;
  while (pA !== pB) {
    pA = (pA === null) ? headB : pA.next;
    pB = (pB === null) ? headA : pB.next;
  }
  return pA;
}
```

Six lines. Let's unpack why this works.

## Why it works

Suppose list A has length `m`, list B has length `n`, and they share a suffix of length `s`. If there is no intersection, `s = 0`.

- `pA` walks A (length `m`), then switches to B and walks until it meets `pB`. Total distance before meeting or hitting null: some function of `m`, `n`, `s`.
- `pB` walks B, then switches to A.

Key observation: after **at most one switch each**, both pointers have traveled the same total distance — `m + n - s` steps. If they intersect, they arrive at the intersection node at that moment. If they don't, both simultaneously reach `null` (which equals itself — loop exits with `pA = pB = null`, which is returned).

Formally:

- With intersection (s > 0):
  - pA: `(m - s)` steps through A's non-shared part + `s` shared + switches to B + walks `(n - s)` of B's non-shared = `m - s + s + (n - s) = m + n - s` to reach the intersection.
  - pB: symmetric: `n - s + s + (m - s) = m + n - s`.
  - They arrive at the intersection at the same step.

- Without intersection (s = 0):
  - pA: `m` steps to null, switches to B, walks `n` steps to null again. Total `m + n`.
  - pB: `n + m`. Both hit null at step `m + n`. The loop `pA !== pB` is false when both are null. Return `null`. ✓

This is one of the most elegant two-pointer arguments in all of LeetCode.

## Walkthrough

```text
A: 4 -> 1 -> 8 -> 4 -> 5
              ^
B:       5 -> 6 -> 1 ---^   (B joins at node 8; s = 3)

m = 5, n = 6, s = 3.
Non-shared: A has 2, B has 3. After the switch each, they meet.

Step-by-step (values shown, but remember we compare by reference):

i=0:  pA=4, pB=5
i=1:  pA=1, pB=6
i=2:  pA=8, pB=1
i=3:  pA=4, pB=8
i=4:  pA=5, pB=4
i=5:  pA=null -> switch to headB = 5;   pB=5 -> pB = 5's next = 6? wait...

Let me re-trace more carefully. Lengths m=5, n=6.

pA starts at 4 (head of A).
pB starts at 5 (head of B).

step 1: pA=1, pB=6
step 2: pA=8, pB=1
step 3: pA=4 (second 4 in A), pB=8
step 4: pA=5, pB=4
step 5: pA = null (off end of A), pB=5
  After check: pA === null, so pA = headB = 5.
  But first, the loop condition is checked: null !== 5, continue.
  Assignments: pA = headB = 5; pB = 5.next = null.
  Wait, we have both assignments in the same iteration.
  
  Actually the code is:
    pA = (pA === null) ? headB : pA.next;
    pB = (pB === null) ? headA : pB.next;
  
  pA was null -> pA = 5.
  pB was 5 -> pB = null.
  
step 6: loop condition pA=5 !== pB=null, continue.
  pA = 5.next = 6;  pB = null -> headA = 4.
  
step 7: pA=6 !== pB=4, continue.
  pA = 6.next = 1; pB = 4.next = 1.
  
step 8: pA=1, pB=1. Are they the SAME NODE? Yes — the first 1 in B, and A's 1 (second). Wait, these are different.

Hmm, the example is getting tricky because some values are repeated. Let me redo with a cleaner example:

A: a1 -> a2 -> c1 -> c2 -> c3
B: b1 -> b2 -> b3 -> c1 -> c2 -> c3   (intersection at c1; s=3)
m=5, n=6, shared=3.

pA: a1, a2, c1, c2, c3, null->b1, b2, b3, c1  (step 8 lands on c1)
pB: b1, b2, b3, c1, c2, c3, null->a1, a2, c1  (step 8 lands on c1)

Both arrive at c1 at step 8 = m + n - s = 5 + 6 - 3.
Loop condition pA === pB is TRUE at c1. Return c1.
```

## What happens on null / no intersection

If they never share a node, both pointers walk A + B then hit null together:

```text
A: 2 -> 6 -> 4
B: 1 -> 5

pA: 2, 6, 4, null->1, 5, null
pB: 1, 5, null->2, 6, 4, null

Both hit null at step m+n. Loop exits. Return null. ✓
```

## Complexity

- **Time:** O(m + n). Each pointer walks at most `m + n` steps.
- **Space:** O(1). Two pointers.

## Alternative — hash set

```javascript
function getIntersectionNodeSet(headA, headB) {
  const seen = new Set();
  for (let cur = headA; cur !== null; cur = cur.next) seen.add(cur);
  for (let cur = headB; cur !== null; cur = cur.next) {
    if (seen.has(cur)) return cur;
  }
  return null;
}
```

- **Time:** O(m + n).
- **Space:** O(m).

Correct and easy — always mention as the O(m) space baseline.

## Alternative — length alignment

Compute the lengths of both lists, advance the longer one so both have the same remaining length, then walk together:

```javascript
function getIntersectionNodeAlign(headA, headB) {
  const lenA = length(headA), lenB = length(headB);
  let pA = headA, pB = headB;
  for (let i = 0; i < lenA - lenB; i++) pA = pA.next;
  for (let i = 0; i < lenB - lenA; i++) pB = pB.next;
  while (pA !== pB) { pA = pA.next; pB = pB.next; }
  return pA;
}

function length(head) {
  let n = 0;
  for (let c = head; c !== null; c = c.next) n++;
  return n;
}
```

- **Time:** O(m + n) — two passes.
- **Space:** O(1).

More intuitive to some; the switching version is more elegant. Both are acceptable in interviews.

## Why "reference equality" matters

Two lists could hold identical values without sharing any physical nodes — that's **not** intersection. Intersection requires the same node (same memory address) appearing in both traversals. `===` compares references for objects; never use `cur.val === other.val` for this problem.

## A subtle gotcha

The loop condition `pA !== pB` handles the null case gracefully because `null !== null` is false — when both pointers are null, the loop exits and we return `null` (which is correct).

If you wrote `while (pA && pB)`, you'd exit as soon as either one hit null, losing the ability to return null cleanly. The simpler `while (pA !== pB)` is the correct guard.

## Common bugs

1. **Comparing by value** (`pA.val === pB.val`). The problem asks for the intersection node, not a matching value.
2. **Walking past null.** `pA.next` on a null pointer crashes. The switch-on-null trick handles this.
3. **Returning early in the no-intersection case.** If you break out of the loop when `pA === null || pB === null`, you may return the wrong thing. Let the loop run until `pA === pB`.
4. **Modifying input lists** (e.g., to mark visited). Fine for personal projects, bad for shared data.

:::quiz
question: Why does "redirecting to the other list's head on null" make the two pointers meet at the intersection?
options:
  - Both pointers walk a total distance of m+n-s before the first possible meeting; this is algebraically guaranteed by the switch.
  - It's a coincidence specific to the examples.
answer: 0
explanation: The switch equalizes the two pointers' cumulative travel, so they reach the intersection at the same step.
:::

:::quiz
question: Why use reference equality (`===`) rather than value equality (`.val === .val`)?
options:
  - Two distinct nodes might have the same value without actually being the intersection; reference equality is the only correct check.
  - Reference equality is faster.
answer: 0
explanation: The problem is specifically about whether both lists pass through the same node in memory.
:::

:::quiz
question: What does the loop return if the lists never intersect?
options:
  - Null — both pointers reach null at the same step, the loop exits, pA is null, return null.
  - It loops forever.
answer: 0
explanation: `null !== null` is false, so the loop exits cleanly.
:::

:::exercise
title: Implement getIntersectionNode with the two-pointer switch
description: Implement `getIntersectionNode(headA, headB)` using two pointers that redirect to the other list's head on null. Handle the no-intersection case cleanly.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function getIntersectionNode(headA, headB) {
    // two pointers; on null, switch to the other list's head; stop when they meet or both become null
  }

  // build two lists that share a tail
  function buildPair(prefixA, prefixB, tail) {
    function make(arr) { const d = new ListNode(); let t = d; for (const v of arr) { t.next = new ListNode(v); t = t.next; } return { head: d.next, tail: t }; }
    const tNodes = (function(){ const d = new ListNode(); let t = d; for (const v of tail) { t.next = new ListNode(v); t = t.next; } return d.next; })();
    const A = make(prefixA); const B = make(prefixB);
    if (A.tail) A.tail.next = tNodes;
    else return { A: tNodes, B: (B.tail && (B.tail.next = tNodes), B.head || tNodes), inter: tNodes };
    if (B.tail) B.tail.next = tNodes;
    return { A: A.head, B: B.head, inter: tNodes };
  }

  const { A, B, inter } = buildPair([4,1], [5,6,1], [8,4,5]);
  console.log(getIntersectionNode(A, B) === inter);  // true  (points to the node with value 8)
  console.log(getIntersectionNode(A, null));          // null
:::

## Practice

- [Intersection of Two Linked Lists](/problems/intersection-of-two-linked-lists)
