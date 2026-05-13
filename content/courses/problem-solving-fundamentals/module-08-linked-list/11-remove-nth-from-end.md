# Remove Nth Node from End

**LeetCode 19.** Given the head of a list and an integer `n`, remove the **n-th node from the end** and return the head.

Example: given `1 -> 2 -> 3 -> 4 -> 5`, `n = 2` removes node `4` (the 2nd from the end), returning `1 -> 2 -> 3 -> 5`.

This is the canonical **constant-gap two-pointer** problem — and the first place you'll naturally reach for a **dummy head** to clean up edge cases.

## The idea

Use two pointers, `lead` and `follow`, with a fixed gap of `n` between them. Walk both one step at a time. When `lead` falls off the end, `follow` sits exactly `n` nodes from the tail — which is the predecessor of the node we want to remove (if we set up the gap carefully).

## The naive two-pass approach

The obvious solution: compute the length in one pass, then remove the `(length - n)`-th node in a second pass.

```javascript
function removeNthFromEndTwoPass(head, n) {
  let length = 0;
  for (let cur = head; cur !== null; cur = cur.next) length++;
  const dummy = new ListNode(0, head);
  let prev = dummy;
  for (let i = 0; i < length - n; i++) prev = prev.next;
  prev.next = prev.next.next;
  return dummy.next;
}
```

Two passes, O(n) total, O(1) space. Perfectly correct — always worth mentioning in an interview as a baseline.

## The one-pass two-pointer solution

```javascript
function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let lead = dummy;
  let follow = dummy;

  // Advance lead by n + 1 steps so follow lands on the PRED of the target
  for (let i = 0; i <= n; i++) lead = lead.next;

  // Move both until lead falls off the end
  while (lead !== null) {
    lead = lead.next;
    follow = follow.next;
  }

  // follow is the predecessor of the node to delete
  follow.next = follow.next.next;
  return dummy.next;
}
```

### Why `n + 1`?

We want `follow` to end up at the **predecessor** of the node to remove. If we advance `lead` by exactly `n + 1` steps (starting from the dummy), then when `lead === null`, `follow` is `n + 1` nodes before the null terminator — exactly the predecessor of the `n`-th-from-end node.

Work it out on the example:

```text
list:  dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null,  n = 2
                                                  ^
                                                lead after loop (null)

positions from tail:        5    4    3    2    1    0(=null)

We want to remove position 2 (which is the node 4).
The predecessor is node 3 — position 3 from tail.

lead starts at dummy (6 steps from end).
advance n+1 = 3 steps: lead is now at node 3 (3 steps from end).
follow starts at dummy.

walk both:
  lead=3, follow=dummy
  lead=4, follow=1
  lead=5, follow=2
  lead=null, follow=3   <- lead fell off; follow is at node 3

follow is the predecessor of the target (4). 
follow.next = follow.next.next -> link 3 -> 5.

result: 1 -> 2 -> 3 -> 5
```

## Why the dummy head matters here

Consider `n` equal to the **length of the list** — we remove the head itself:

```text
list:  1 -> null,  n = 1
```

Without a dummy, the two-pointer walk leaves `follow` nowhere reasonable, and you'd need a special-case branch "if we're removing the head, return head.next." With the dummy, `follow` lands at the dummy itself, and `follow.next = follow.next.next` cleanly removes the first real node. No branching.

This is the cleanest illustration of why the dummy pattern is worth internalizing — it eliminates the "remove the head" special case.

## Walkthrough on the canonical example

```text
input: head = 1 -> 2 -> 3 -> 4 -> 5, n = 2

dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null
  ^ 
  lead, follow start here

advance lead by n+1 = 3 steps:
  lead = node 3

walk both until lead is null:
  lead=3, follow=dummy
  lead=4, follow=1
  lead=5, follow=2
  lead=null, follow=3  <- stop

follow.next = follow.next.next
  i.e., 3.next = 5

result: 1 -> 2 -> 3 -> 5
```

## Complexity

- **Time:** O(n) — each pointer walks the list at most once.
- **Space:** O(1).

## A common off-by-one

Advance lead by `n` steps (instead of `n + 1`) and you'll land `follow` on the **target** itself, not the predecessor. Your code will try to delete `follow` by doing `follow.next = follow.next.next` — which actually deletes the node **after** the target.

Always trust the derivation: advance by `n + 1` so `follow` ends at the predecessor.

## Edge cases

- `n = 1` (remove the tail) → `lead` becomes null after walking past the tail; `follow` lands at the pre-tail node; splice. ✓
- `n = length(list)` (remove the head) → `lead` becomes null after walking `n + 1` steps from dummy; `follow` stays at dummy; `dummy.next = dummy.next.next` cleanly removes the head. ✓
- `n` larger than the list's length → undefined behavior per LC; you may assume `1 ≤ n ≤ length(list)`. Still worth asking the interviewer.
- Empty list → per LC's constraints, not possible, but returning `null` without crashing is a defensive touch.

## Common bugs

1. **Advancing lead by `n` instead of `n + 1`.** Deletes the wrong node.
2. **Not using a dummy head.** Requires an extra branch for "remove the head."
3. **Looping on `lead.next !== null` instead of `lead !== null`.** Off-by-one — `follow` lands one spot short.
4. **Returning `head` instead of `dummy.next`.** If the head was removed, `head` is a dangling stale pointer; `dummy.next` is the correct new head.

## When this pattern shows up

- "Remove the k-th from the end" (this problem).
- "Find the k-th from the end without computing length" — same template, stop before removing.
- "Swap the k-th and (n - k + 1)-th nodes" — same idea, two gap-based walks.
- Many "compare elements that are k apart" problems in arrays.

The constant-gap two-pointer is a core tool; internalize the template and you'll reach for it reflexively.

:::quiz
question: Why advance `lead` by `n + 1` steps before the coordinated walk?
options:
  - So that when `lead === null`, `follow` lands on the PREDECESSOR of the node to delete (not the node itself).
  - Because n is 1-indexed.
answer: 0
explanation: We need the predecessor to rewrite its `.next`; one extra step shifts follow back by one.
:::

:::quiz
question: What special case does the dummy head eliminate in this problem?
options:
  - Removing the first node (head). The dummy provides a predecessor that doesn't otherwise exist.
  - Removing a middle node.
answer: 0
explanation: Without a dummy, "remove the head" is a different code path from "remove anything else."
:::

:::quiz
question: Space complexity of the one-pass two-pointer solution:
options:
  - O(1) — a dummy node and two pointers, regardless of input size.
  - O(n).
answer: 0
explanation: The dummy is a single node; no auxiliary array or recursion stack is involved.
:::

:::exercise
title: Implement removeNthFromEnd in one pass
description: Implement `removeNthFromEnd(head, n)` using a dummy head plus two pointers with a fixed gap. Don't compute the length first.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function removeNthFromEnd(head, n) {
    // dummy -> head; advance lead by n+1 from dummy; walk until lead === null; splice.
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(removeNthFromEnd(fromArray([1,2,3,4,5]), 2))); // [1,2,3,5]
  console.log(toArray(removeNthFromEnd(fromArray([1]), 1)));         // []
  console.log(toArray(removeNthFromEnd(fromArray([1,2]), 1)));       // [1]
  console.log(toArray(removeNthFromEnd(fromArray([1,2]), 2)));       // [2]
:::

## Practice

- [Remove Nth Node From End of List](/problems/remove-nth-node-from-end-of-list)
