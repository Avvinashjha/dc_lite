# Reverse a Linked List (Recursive)

The iterative reversal is the one you'll use in practice — but the **recursive** version is conceptually elegant and shows up as an interview follow-up ("can you do it recursively?"). It's also the mental model behind several harder problems (LC 25 k-group reversal in its recursive form, among others).

## The idea

Trust the recursion. Assume `reverse(head.next)` correctly reverses the **rest** of the list and returns the new head. All we need to do is fold in the current node.

After the recursive call:

```text
Before call:  head -> X -> Y -> Z -> null
After call:   head -> X <- Y <- Z      (head still points at X; Z is the new head we received)
```

So `X` is the old second node and the new tail. To attach `head` at the end, we set `head.next.next = head` (i.e., "X's next should point to head"), then `head.next = null` (the old head is the new tail).

## The code

```javascript
function reverseList(head) {
  if (head === null || head.next === null) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}
```

Four lines of real logic, one of them the recursive call.

## Reading it carefully

Breakdown:

- **`if (head === null || head.next === null) return head;`** — base cases. Empty list or single node: reversed list equals the input. Return as-is.
- **`const newHead = reverseList(head.next);`** — recursively reverse everything past head. This returns the new head of the reversed rest.
- **`head.next.next = head;`** — critical pointer flip. `head.next` still points to the old second node (the recursive call reversed *past* it without rewriting head's `next`). Setting `head.next.next = head` makes that old second node point back to head.
- **`head.next = null;`** — head is the new tail, so its `next` must be null.
- **`return newHead;`** — the new head came from the deepest recursive call; bubble it up unchanged.

## Walkthrough

```text
input:  1 -> 2 -> 3 -> null

call reverseList(1)
  head = 1, head.next = 2
  call reverseList(2)
    head = 2, head.next = 3
    call reverseList(3)
      head = 3, head.next = null -> base case, return 3
    after call: newHead = 3
    now: state is 2 -> 3 -> null (no flips yet above 3)
    head.next.next = head    -> 3.next = 2 (we have 2 -> 3 -> 2 ... wait, see below)
    head.next = null         -> 2.next = null
    return 3  (newHead bubbles up)
  
  after call: newHead = 3, list is now 3 -> 2 -> null (attached to 2)
  state: 1 -> 2 -> null (1 still has 1.next = 2), and separately 3 -> 2 -> null
  
  We hold head = 1, and head.next = 2 (unchanged).
  head.next.next = head    -> 2.next = 1
  head.next = null         -> 1.next = null
  return 3
  
final: 3 -> 2 -> 1 -> null ✓
```

Work this out with pencil and paper once; then it's yours forever.

## Why the magical line `head.next.next = head`?

The key invariant: **after the recursive call, `head.next` still points to the original second node**. The recursion did *not* touch `head.next` — it recursed on `head.next` but only modified the internal pointers of the sub-list. So we still have a bridge from `head` to the original second node.

That second node is the **new last node** of the reversed sub-list. To plug `head` onto the end, we make that node's `next` point back to `head`. That's what `head.next.next = head` does.

Then we sever `head`'s forward pointer (so `head` becomes the final tail) with `head.next = null`.

## Complexity

- **Time:** O(n) — one recursive call per node.
- **Space:** O(n) — the **recursion stack** grows to depth n.

Compare to iterative: O(n) time, **O(1)** space. For long lists, the recursive version can blow the stack (typical JS engines handle ~10k frames; lists longer than that are risky). The iterative version is strictly safer in production.

In interviews, if the question asks for "the best approach," lead with iterative. If asked for the recursive version, you should have it in your toolkit.

## Tail-recursive version (in other languages)

Some compilers eliminate tail recursion into an iterative loop (Scheme, some Haskell, some C++ with optimization). JavaScript engines **do not** guarantee tail-call optimization, so a tail-recursive rewrite in JS still consumes stack. It exists for interest:

```javascript
function reverseListTail(cur, prev = null) {
  if (cur === null) return prev;
  const next = cur.next;
  cur.next = prev;
  return reverseListTail(next, cur);
}
```

This is literally the iterative algorithm in recursive clothing — each "step" becomes a tail call. But in JS, it still allocates a stack frame per step, so it offers no practical advantage.

## When to pick recursive over iterative

Honestly? Almost never, in real code.

- **Iterative is faster** (no function-call overhead per node).
- **Iterative is safer** (O(1) space vs. O(n) stack).
- **Iterative is easier to reason about for "partial" reversals** (lessons 14, 15).

The recursive version is valuable mainly as an exercise in recursive thinking. It's also pedagogically useful for understanding the k-group reversal recursion pattern (lesson 15).

## Common bugs

1. **Forgetting to null out `head.next`.** You'll have `1 -> 2 -> 1 -> 2 -> ...` (a cycle).
2. **Returning `head` instead of `newHead`.** The new head is the deepest recursive call's return; each level must propagate it upward unchanged.
3. **Calling `reverseList(head)` instead of `reverseList(head.next)`.** Infinite recursion.
4. **Missing the `head === null` base case** and crashing on empty lists.

## Connecting back to iterative

Here's a mental bridge between the two:

- **Iterative:** you maintain the "already reversed prefix" in `prev`, and keep walking forward.
- **Recursive:** you defer the "already reversed prefix" to the recursion, and fold in the current node on the way back up.

Two different ways of expressing the same dependency chain. Both are useful.

:::quiz
question: Why is `head.next.next = head` correct after the recursive call?
options:
  - `head.next` still points to the original second node (recursion didn't change head.next); making that node's next point back to head attaches head at the tail of the reversed rest.
  - It's a special JavaScript trick.
answer: 0
explanation: The recursive call reverses everything after `head.next` but doesn't touch `head.next` itself; that bridge is our attachment point.
:::

:::quiz
question: Space complexity of the recursive reversal (non-tail):
options:
  - O(n) — the recursion stack grows to depth n.
  - O(1).
answer: 0
explanation: Each recursive call holds a stack frame until the deepest one returns.
:::

:::quiz
question: Why is the iterative reversal generally preferred over the recursive one in production code?
options:
  - O(1) space (no recursion stack); safer for long lists that could blow the stack.
  - The recursive version is asymptotically slower.
answer: 0
explanation: Both are O(n) time, but iterative uses constant extra space and can't stack-overflow.
:::

:::exercise
title: Implement reverseList recursively
description: Implement `reverseList(head)` recursively. Trust the recursion and focus on the "plug head in at the end" step.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function reverseList(head) {
    // base: head null or head.next null -> return head
    // recurse: newHead = reverseList(head.next)
    // plug head at the end: head.next.next = head; head.next = null
    // return newHead
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(reverseList(fromArray([1,2,3,4,5]))));  // [5,4,3,2,1]
  console.log(toArray(reverseList(fromArray([1]))));          // [1]
  console.log(toArray(reverseList(fromArray([]))));           // []
:::

## Practice

- [Reverse Linked List](/problems/reverse-linked-list)
