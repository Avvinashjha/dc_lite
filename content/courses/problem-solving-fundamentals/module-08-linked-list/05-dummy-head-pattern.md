# The Dummy-Head (Sentinel) Pattern

Every linked-list operation that can touch the **head** has two code paths: "head changes" and "head doesn't change." The **dummy-head pattern** (also called the **sentinel node** pattern) collapses them into one. It is the single most effective trick for writing concise, bug-free linked-list code — and it appears in roughly half of all list interview solutions.

## The idea

Before you start your algorithm, allocate a **fake node** that sits before the real head:

```javascript
const dummy = new ListNode(0, head);
```

Now every real node has a predecessor. You can delete, insert, or splice anywhere — including at the first real position — without writing special-case code. At the end, return `dummy.next` as the real head.

```text
              [dummy|*] ──► [A|*] ──► [B|*] ──► [C|null]
                  ^                              
                  └── never contains real data; only a pointer handle
```

## Before and after — remove-by-value

Without dummy (from lesson 04):

```javascript
function removeValue(head, target) {
  if (head === null) return null;
  if (head.val === target) return head.next;   // special case
  let prev = head;
  while (prev.next !== null && prev.next.val !== target) prev = prev.next;
  if (prev.next !== null) prev.next = prev.next.next;
  return head;
}
```

With dummy:

```javascript
function removeValue(head, target) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next !== null && prev.next.val !== target) prev = prev.next;
  if (prev.next !== null) prev.next = prev.next.next;
  return dummy.next;
}
```

Both work — but the second has **no head-special-case branch**. The dummy serves as a universal predecessor, so the loop handles the "target is the head" case exactly the same as every other case.

## Remove all occurrences (LC 203)

This is the example from lesson 04 — rewritten cleanly with a dummy:

```javascript
function removeElements(head, val) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next !== null) {
    if (prev.next.val === val) prev.next = prev.next.next;
    else prev = prev.next;
  }
  return dummy.next;
}
```

Clean, uniform, one loop. No "while the head matches, advance" preamble. This is the version you'd write in an interview.

## Merge two sorted lists (lesson 16 preview)

Here's why interviewers love the dummy head — it makes merging trivial:

```javascript
function mergeTwoLists(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (l1 !== null && l2 !== null) {
    if (l1.val <= l2.val) {
      tail.next = l1;
      l1 = l1.next;
    } else {
      tail.next = l2;
      l2 = l2.next;
    }
    tail = tail.next;
  }
  tail.next = (l1 !== null) ? l1 : l2;
  return dummy.next;
}
```

The dummy plus a `tail` cursor gives us a clean **append-as-you-go** pattern. Without the dummy, the first iteration has to special-case "is this the first node we're building?" — doubling the code length.

We'll formalize this lesson 16. For now, notice the shape: **dummy + tail cursor + return dummy.next**.

## Build a filtered list

Building a new list from an iterator or a filter is trivial with a dummy:

```javascript
function buildListFrom(values) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of values) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}

function filterList(head, predicate) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (let cur = head; cur !== null; cur = cur.next) {
    if (predicate(cur.val)) {
      tail.next = new ListNode(cur.val);
      tail = tail.next;
    }
  }
  return dummy.next;
}
```

Two things to notice:

1. `tail` always points to the **last node of the output built so far**. Appending is always `tail.next = newNode; tail = tail.next`.
2. The final `tail.next` remains `null` (it was `null` in the dummy initially, and every newly-linked node has `next = null`). No explicit "terminate the list" step needed.

## When NOT to use a dummy head

There are a few cases where a dummy adds noise rather than clarity:

- **Traversal without modification.** Reading the list (e.g., computing length or searching) doesn't benefit from a dummy.
- **In-place reversal where the head is always rewritten.** The classic iterative reversal (lesson 12) uses three pointers (`prev`, `cur`, `next`) — no dummy needed because `prev` starts as `null` and serves as the "new head marker."
- **Algorithms that never touch the head as a special case.** For example, finding the middle of the list (lesson 08) — the head is just the starting point, never the target of a delete or splice.

The rule of thumb: **if your algorithm might delete, insert, or splice at the very beginning, use a dummy.**

## Walkthrough — building a dummy-head merge in your head

```text
l1: 1 -> 3 -> 5
l2: 2 -> 4 -> 6

dummy -> ?  tail=dummy

Step 1: l1=1, l2=2. 1<=2, attach l1. tail.next=1, tail=1. l1=3.
  dummy -> 1 -> ?   tail=1

Step 2: l1=3, l2=2. 2<3, attach l2. tail.next=2, tail=2. l2=4.
  dummy -> 1 -> 2 -> ?  tail=2

Step 3: l1=3, l2=4. 3<=4, attach l1. tail=3. l1=5.
  dummy -> 1 -> 2 -> 3 -> ?

... and so on. No "is this the first node?" branching. Each step is a one-line attach.
```

## Key mental image

```text
dummy  <---- we don't care about this node's value, just its .next
  │
  │
  v
(real head of the list you're building or manipulating)
```

The dummy is a **trampoline**: you jump off it once, forget it exists, and use its `.next` as your real result.

## A subtle point: dummy sits on the stack frame

The dummy is a one-node allocation that **only exists while the function runs**. Once you return `dummy.next`, nothing references the dummy object — it's eligible for garbage collection. The memory cost is exactly one node per function call, regardless of input size. This is negligible.

## Common bugs

1. **Returning `dummy` instead of `dummy.next`.** You'll return a list whose first node has the fake value (usually 0), followed by the real list.
2. **Forgetting to advance `tail`** in build-up patterns. The new node is linked, but the next append overwrites it.
3. **Mutating `dummy.val`.** The dummy's value is a throwaway; never read it or use it in logic.
4. **Using a dummy when you shouldn't.** For pure traversal, a dummy is wasted code and hides the loop structure.

## When you see these patterns, reach for a dummy

- "Return the list after removing X."
- "Merge two sorted lists."
- "Partition a list around value X."
- "Keep only elements matching predicate P."
- "Remove the N-th node from the end."
- "Add two numbers represented as lists."

The dummy-head pattern will probably clean up the solution.

:::quiz
question: What does returning `dummy.next` at the end of a dummy-head function accomplish?
options:
  - Hides the fake sentinel node and returns the real first node of the built/modified list.
  - Returns the second element of the list.
answer: 0
explanation: `dummy.next` is whatever you actually linked first (or `null` if nothing was linked).
:::

:::quiz
question: Why does the merge-two-sorted-lists solution with a dummy NOT need a special case for the first node?
options:
  - Because `tail` always starts pointing at the dummy, the "append to tail" code works identically for the very first node.
  - Because JavaScript arrays handle it.
answer: 0
explanation: The dummy is a universal predecessor; "append after tail" works from iteration 1 onward.
:::

:::quiz
question: Memory cost of using a dummy head in a function:
options:
  - One extra node, allocated on the function's frame and reclaimed after return.
  - O(n) extra — one dummy per list element.
answer: 0
explanation: Only one dummy per call, independent of list length.
:::

:::exercise
title: Rewrite removeElements with a dummy head
description: Implement LC 203 removeElements(head, val) using the dummy-head pattern. Handle consecutive matches at the head.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function removeElements(head, val) {
    // allocate a dummy before head; walk with prev starting at dummy
    // skip or advance; return dummy.next
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(removeElements(fromArray([1,2,6,3,4,5,6]), 6))); // [1,2,3,4,5]
  console.log(toArray(removeElements(fromArray([7,7,7,7]), 7)));       // []
  console.log(toArray(removeElements(fromArray([]), 1)));              // []
:::

## Practice

- [Remove Linked List Elements](/problems/remove-linked-list-elements)
