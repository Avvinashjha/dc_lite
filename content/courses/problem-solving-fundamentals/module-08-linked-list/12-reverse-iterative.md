# Reverse a Linked List (Iterative)

**LeetCode 206.** Given the head of a singly linked list, return the head of the **reversed** list.

`1 -> 2 -> 3 -> 4 -> 5` becomes `5 -> 4 -> 3 -> 2 -> 1`.

Reversal is the second most important linked-list skill, right after traversal. Half of the "harder" linked-list problems (k-group reversal, reverse between positions, palindrome check, reorder list) reduce to "reverse a segment of the list." Master this lesson and the rest fall into place.

## The approach

Walk the list, flipping each node's `next` pointer from "points forward" to "points backward." At the end, what used to be the tail is the new head.

You need **three pointers at all times** — the node you're currently processing (`cur`), the node you just came from (`prev`), and the node you're about to visit (`next`). The art is knowing which one to update first.

## The code

```javascript
function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur !== null) {
    const next = cur.next;    // 1. save the forward link
    cur.next = prev;          // 2. flip the pointer
    prev = cur;               // 3. advance prev
    cur = next;               // 4. advance cur
  }
  return prev;                // prev is the new head (old tail)
}
```

Six lines inside the loop, each doing exactly one thing. Learn this cold — it's the most common whiteboard problem in tech interviews.

## Step-by-step walkthrough

```text
Initial:
  prev = null
  cur  = [1] -> [2] -> [3] -> null

Iteration 1:
  next = cur.next        next = [2]
  cur.next = prev        [1] -> null
  prev = cur             prev = [1]
  cur = next             cur = [2]
  
  state: null <- [1]    [2] -> [3] -> null
                prev    cur

Iteration 2:
  next = cur.next        next = [3]
  cur.next = prev        [2] -> [1]
  prev = cur             prev = [2]
  cur = next             cur = [3]

  state: null <- [1] <- [2]    [3] -> null
                         prev   cur

Iteration 3:
  next = cur.next        next = null
  cur.next = prev        [3] -> [2]
  prev = cur             prev = [3]
  cur = next             cur = null

  state: null <- [1] <- [2] <- [3]
                                prev

Loop exits (cur === null).
return prev = [3], which is the head of the reversed list.
```

## Why the order of the four lines matters

Each line is one pointer write. Doing them in the wrong order severs the list. The mental model:

1. **`next = cur.next`** — cache the forward link. You're about to overwrite it.
2. **`cur.next = prev`** — flip. This is the actual reversal.
3. **`prev = cur`** — prev catches up.
4. **`cur = next`** — cur moves forward using the cached link.

Steps 1 and 4 are a "safekeeping" pair that exists only because step 2 destroys the forward pointer. Steps 3 and 2 are the real work.

If you're ever stuck on pointer-manipulation code, write out each intended before/after state and the code falls out.

## Visualization of the pointer flip

```text
Before this iteration:
  null <- [X] <- [Y]          [Z] -> [W] -> ...
                 prev          cur    cur.next

Save cur.next:    next = W
Flip cur's next:  Z.next = Y
State:            null <- [X] <- [Y] <- [Z]   [W] -> ...
                                        prev   cur=W, after we advance
```

## Complexity

- **Time:** O(n) — one pointer flip per node.
- **Space:** O(1) — three pointers, no allocation.

Both are optimal: you can't reverse the list in less than O(n) time (you must touch every pointer), and you can't use less than O(1) space.

## Returning the new head

The tail of the original list becomes the new head. Since we advance `prev` to point to the current node right before exiting, `prev` ends the loop pointing at the **last node we processed** — which is the old tail, now the new head.

Don't return `head` — that's the **old** head, which now has `next = null` (it's the new tail). A very common bug.

## Edge cases

- Empty list → `cur = null`, loop never runs, `prev = null` returned. ✓
- Single node → one iteration flips `head.next` from null to null (no-op), returns `head`. ✓
- Two nodes → standard case, produces `[B, A]`.

All three work with the canonical code above — no special-casing.

## A common mental trap

Students sometimes try to swap `cur.next` and `cur.prev`-style fields — but singly linked lists have no `prev`. The reversal **creates** the new structure by rewriting `next` pointers; there's no "swap." If you catch yourself writing `cur.prev = something`, you're thinking about doubly linked lists.

## Three-pointer mnemonic

```text
prev    cur    next
  <       *      >
          ^
  (flip cur to point backward toward prev,
   then advance all three)
```

Internalize the visual of three pointers sliding rightward together, with the current node's `next` being flipped backward on each step.

## Common bugs

1. **Returning `head` instead of `prev`.** The old head is now the tail; the new head is `prev`.
2. **Forgetting to save `next` before flipping.** `cur.next = prev; cur = cur.next` advances cur to `prev` (backwards!) because you already overwrote `cur.next`.
3. **Using `while (cur.next !== null)`.** Misses the last node's flip.
4. **Reversing in-place with recursion and blowing the stack.** Recursive reversal is fine for short lists; for long lists, iterative is safer.

## Why this pattern is everywhere

Once you can reverse a full list, you can reverse:

- **Any suffix** — just walk to the start of the suffix and reverse from there.
- **Any sublist** — disconnect the sublist, reverse it, reconnect. This is LC 92 (lesson 14).
- **A k-length window** — the core of LC 25 (lesson 15).
- **The second half of a list for palindrome check** — LC 234 (lesson 18).
- **The second half of a list for reordering** — LC 143.

The reversal engine is `prev`/`cur`/`next`. Everything else is just "which nodes do I pass to it, and how do I reconnect?"

:::quiz
question: After the loop, why do we return `prev` instead of `head`?
options:
  - `prev` was the last non-null node we processed — the old tail, which is now the new head.
  - Because `head` is null after reversal.
answer: 0
explanation: `head` still points to the original first node, which is now the tail (next = null).
:::

:::quiz
question: Why do we save `cur.next` into a temporary `next` variable?
options:
  - We're about to overwrite `cur.next`; without the save, we'd lose the path to the rest of the list.
  - For readability.
answer: 0
explanation: Classic pointer rule: save any reference you need before you overwrite it.
:::

:::quiz
question: Space complexity of the iterative reversal:
options:
  - O(1) — three pointers regardless of list length.
  - O(n) — one pointer per reversed node.
answer: 0
explanation: Only three pointers are used; the nodes themselves are reused in place.
:::

:::exercise
title: Implement reverseList iteratively
description: Implement `reverseList(head)` using the prev/cur/next template. Return the new head.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function reverseList(head) {
    // prev = null, cur = head
    // in the loop: save next, flip cur.next = prev, advance prev = cur, advance cur = next
    // return prev
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(reverseList(fromArray([1,2,3,4,5]))));   // [5,4,3,2,1]
  console.log(toArray(reverseList(fromArray([1,2]))));         // [2,1]
  console.log(toArray(reverseList(fromArray([1]))));           // [1]
  console.log(toArray(reverseList(fromArray([]))));            // []
:::

## Practice

- [Reverse Linked List](/problems/reverse-linked-list)
