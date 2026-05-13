# Traversal, Length, and Search

Three basic operations you'll do on a linked list hundreds of times: **walk through it**, **count nodes**, and **find a value**. Each boils down to a `for` loop whose iterator advances via `cur = cur.next` instead of `i++`.

Mastering this pattern is the prerequisite for everything that follows.

## The canonical traversal loop

```javascript
for (let cur = head; cur !== null; cur = cur.next) {
  // ... work with cur ...
}
```

Three ingredients:

1. **Init:** start at `head`.
2. **Guard:** continue while the current node is not `null`.
3. **Advance:** move to `cur.next`.

It's the exact same shape as a standard `for` loop over an array — only the advance step is a pointer follow instead of an index increment.

You can also write it as a `while`:

```javascript
let cur = head;
while (cur !== null) {
  // ... work ...
  cur = cur.next;
}
```

Both are idiomatic. Use the `for` form when the init/advance fit cleanly; `while` when the advance logic is less uniform (e.g., conditional skipping).

## Length (count nodes)

```javascript
function length(head) {
  let count = 0;
  for (let cur = head; cur !== null; cur = cur.next) count++;
  return count;
}
```

- **Time:** O(n). Visits every node once.
- **Space:** O(1).

Edge cases: empty list → returns `0`; single node → returns `1`. The template handles both without special cases.

## Search by value

Return the first node whose value matches `target`, or `null` if none:

```javascript
function find(head, target) {
  for (let cur = head; cur !== null; cur = cur.next) {
    if (cur.val === target) return cur;
  }
  return null;
}
```

- **Time:** O(n) worst case — we walk the whole list.
- **Space:** O(1).

If you only need to know whether a value exists, return `true`/`false`:

```javascript
function contains(head, target) {
  for (let cur = head; cur !== null; cur = cur.next) {
    if (cur.val === target) return true;
  }
  return false;
}
```

## Print / debug walkthrough

For debugging, a simple string-dump helper is invaluable:

```javascript
function show(head) {
  const parts = [];
  for (let cur = head; cur !== null; cur = cur.next) parts.push(cur.val);
  return parts.join(" -> ") + " -> null";
}

show(fromArray([1, 2, 3]));   // "1 -> 2 -> 3 -> null"
```

During interviews, if you're stuck on a tricky pointer bug, print the list state at each step. The issue almost always becomes obvious.

## Walkthrough

```text
list: 10 -> 20 -> 30 -> 40 -> null

length(head):
  cur=10, count=1
  cur=20, count=2
  cur=30, count=3
  cur=40, count=4
  cur=null, exit -> return 4

find(head, 30):
  cur=10, 10 !== 30
  cur=20, 20 !== 30
  cur=30, 30 === 30, return node with val=30
```

## Getting the tail

A recurring sub-task: find the last node of the list.

```javascript
function tail(head) {
  if (head === null) return null;
  let cur = head;
  while (cur.next !== null) cur = cur.next;
  return cur;
}
```

Note the loop condition: `cur.next !== null`, not `cur !== null`. The first stops **on** the last node; the second would overshoot to `null`.

This is the single most common off-by-one in linked-list code. Memorize both forms:

- **`cur !== null`** — visits every node including the last one.
- **`cur.next !== null`** — stops **at** the last node (useful when you need a reference to it).

## The k-th node

Return the node at position `k` (0-indexed), or `null` if out of range.

```javascript
function nodeAt(head, k) {
  let cur = head;
  for (let i = 0; i < k && cur !== null; i++) cur = cur.next;
  return cur;   // null if k >= length
}
```

- **Time:** O(k). O(n) worst case.
- **Space:** O(1).

If you want to reject out-of-bounds explicitly, check after the loop:

```javascript
function nodeAtStrict(head, k) {
  if (k < 0) return null;
  let cur = head;
  for (let i = 0; i < k; i++) {
    if (cur === null) return null;
    cur = cur.next;
  }
  return cur;
}
```

## Complexity summary

| Operation | Time | Space |
| --- | --- | --- |
| Length | O(n) | O(1) |
| Search by value | O(n) | O(1) |
| Access by index | O(k) | O(1) |
| Get tail | O(n) | O(1) |

All four are linear — no shortcut without extra structure. This is the fundamental trade-off of linked lists: access is slow, but mutation by pointer is fast.

## Common bugs

1. **Wrong loop guard for "last node."** Using `cur !== null` when you need `cur.next !== null` skips past the tail into `null` land and throws a TypeError on the next `.val` access.
2. **Forgetting the empty-list case.** `length(null) === 0` works with the template above, but ad-hoc code sometimes assumes `head` is non-null and crashes.
3. **Not advancing the cursor.** `while (cur !== null) { /* work */ }` without `cur = cur.next` is an infinite loop.
4. **Comparing nodes instead of values.** `if (cur === target)` compares references — almost always not what you want. Use `cur.val === target` for value comparison.

:::quiz
question: Which loop condition stops the cursor AT the last node (i.e., `cur.next === null` when the loop exits)?
options:
  - `while (cur !== null)`
  - `while (cur.next !== null)`
answer: 1
explanation: The first form advances past the tail into null; the second stops on the tail.
:::

:::quiz
question: Time complexity of `find(head, target)` in the worst case:
options:
  - O(1)
  - O(n)
answer: 1
explanation: We may need to walk the entire list before finding (or failing to find) the target.
:::

:::quiz
question: If `head` is `null`, what does `length(head)` return using the canonical `for` loop template?
options:
  - 0 — the loop body never runs.
  - It throws an error.
answer: 0
explanation: The guard `cur !== null` is false immediately; count stays at 0.
:::

:::exercise
title: Implement length, find, and nodeAt
description: Implement the three functions using the canonical traversal template. Make sure each handles the empty-list case gracefully.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function length(head) { /* ... */ }
  function find(head, target) { /* return node or null */ }
  function nodeAt(head, k) { /* return node at index k or null */ }

  const h = (() => { const d = new ListNode(); let t = d; for (const v of [10,20,30,40]) { t.next = new ListNode(v); t = t.next; } return d.next; })();

  console.log(length(h));         // 4
  console.log(length(null));      // 0
  console.log(find(h, 30).val);   // 30
  console.log(find(h, 99));       // null
  console.log(nodeAt(h, 0).val);  // 10
  console.log(nodeAt(h, 3).val);  // 40
  console.log(nodeAt(h, 4));      // null
:::

## Practice

No required practice for this lesson. The next lesson introduces insertion — your first real pointer surgery.
