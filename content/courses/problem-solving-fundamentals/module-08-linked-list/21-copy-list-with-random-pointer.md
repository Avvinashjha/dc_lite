# Copy List with Random Pointer

**LeetCode 138.** Each node in the input list has two pointers: `next` (the usual next node) and `random` (points to any other node, or `null`). Return a **deep copy** — a new list whose nodes independently mirror the original's `next` and `random` structure. Modifying the copy must not affect the original.

```text
Original:
  [A] -> [B] -> [C] -> [D] -> null
   |      |      |      |
   v      v      v      v
   D      A      B     null    (random pointers)
```

The challenge: when you clone node `A`, its `random` must point to the **clone of D** — but the clone of D doesn't exist yet when you encounter A.

Two fundamentally different solutions: **O(n) space with a hash map** (easy and expected), and **O(1) extra space with pointer weaving** (the "wow" answer).

## Why this is hard

The obvious approach — clone each node and fix up `random` pointers — breaks because:

- When you clone `A` and want to set `A'.random = cloneOf(D)`, `cloneOf(D)` may not have been created yet.
- You can't just do a second pass because you have no quick way to **map original nodes to their clones**.

Both solutions below solve the same core problem: "given an original node, find its clone."

## Solution 1 — hash map (O(n) space)

Build a `Map` from `originalNode → cloneNode` in one pass, then wire up `next` and `random` pointers in a second pass using the map for translation.

```javascript
function copyRandomList(head) {
  if (head === null) return null;

  const map = new Map();

  // 1. create clones
  for (let cur = head; cur !== null; cur = cur.next) {
    map.set(cur, new Node(cur.val));
  }

  // 2. wire up pointers on the clones
  for (let cur = head; cur !== null; cur = cur.next) {
    const clone = map.get(cur);
    clone.next = cur.next !== null ? map.get(cur.next) : null;
    clone.random = cur.random !== null ? map.get(cur.random) : null;
  }

  return map.get(head);
}
```

Two linear passes, one Map with n entries.

- **Time:** O(n).
- **Space:** O(n) for the map.

This is the **expected interview solution** unless the interviewer explicitly asks for O(1) extra space. It's easy to explain, easy to get right, and easy to debug.

### Recursive variant

A one-pass recursive version is equally valid:

```javascript
function copyRandomListRec(head, memo = new Map()) {
  if (head === null) return null;
  if (memo.has(head)) return memo.get(head);
  const clone = new Node(head.val);
  memo.set(head, clone);
  clone.next = copyRandomListRec(head.next, memo);
  clone.random = copyRandomListRec(head.random, memo);
  return clone;
}
```

Same complexities; O(n) recursion stack in addition to the memo. In JS, the stack grows with list length — OK for small inputs, risky for huge ones.

## Solution 2 — interleaved clones (O(1) extra space)

The clever trick: **weave each clone immediately after its original**. This creates an implicit original-to-clone mapping you can read off in O(1) — the clone of node X is always `X.next`.

Three phases:

1. **Weave.** For each original node `X`, create a clone `X'` and insert it between `X` and `X.next`.
2. **Set random pointers** on the clones using the weave invariant: clone of `X.random` is `X.random.next`.
3. **Unweave.** Separate the interleaved list back into original and clone.

```javascript
function copyRandomListInterleaved(head) {
  if (head === null) return null;

  // Phase 1: weave clones in
  for (let cur = head; cur !== null; cur = cur.next.next) {
    const clone = new Node(cur.val);
    clone.next = cur.next;
    cur.next = clone;
  }

  // Phase 2: assign random pointers on clones
  for (let cur = head; cur !== null; cur = cur.next.next) {
    const clone = cur.next;
    clone.random = cur.random !== null ? cur.random.next : null;
  }

  // Phase 3: unweave
  const cloneHead = head.next;
  for (let cur = head; cur !== null; cur = cur.next) {
    const clone = cur.next;
    cur.next = clone.next;
    clone.next = (clone.next !== null) ? clone.next.next : null;
  }

  return cloneHead;
}
```

### Visualization of phase 1

```text
Before weaving:   A -> B -> C -> null

After weaving:    A -> A' -> B -> B' -> C -> C' -> null
```

Each clone sits immediately after its original.

### Phase 2 — why `cur.random.next` is the right clone

By the weave invariant, every clone's original sits immediately before it. Equivalently, the clone of any original `X` is `X.next`. So for each original `cur`:

- Its `random` points to some original `cur.random`.
- The clone of that random is `cur.random.next`.
- So `cur.next.random` (the clone of `cur`'s random) should be `cur.random.next`.

All lookups are O(1).

### Phase 3 — unweaving

Separate the interleaved structure back into two independent lists. Walk originals, detaching their clones:

```text
A -> A' -> B -> B' -> C -> C'

After unweaving:
  A -> B -> C -> null   (originals restored)
  A' -> B' -> C' -> null (clone list)
```

### Complexity

- **Time:** O(n) — three linear passes.
- **Space:** O(1) extra — no map, no recursion.

This is the "wow" answer interviewers love. Harder to get right under pressure, but beautiful when it clicks.

## Walkthrough — small example with hash map

```text
input: A -> B -> C
       random: A.random = C, B.random = A, C.random = null

Pass 1 (create clones):
  map = { A: A', B: B', C: C' }

Pass 2 (wire pointers):
  A'.next   = map(B) = B'
  A'.random = map(C) = C'
  B'.next   = map(C) = C'
  B'.random = map(A) = A'
  C'.next   = null
  C'.random = null

Return map(A) = A'.

Result:
  A' -> B' -> C'
  A'.random = C', B'.random = A', C'.random = null   ✓
```

## Why this problem matters

It teaches **indirect addressing**: given that you can't directly reach "the clone of node X" because it doesn't exist yet (or isn't where you expect), you either build an explicit mapping (hash map) or encode the mapping structurally (weaving). Both techniques generalize:

- **Graph deep-copy** uses the same hash-map approach: clone each node once, then reconnect.
- **JSON deep-clone with cycles** needs the same "visited" map to avoid infinite recursion.
- **Immutable data structure rebuilds** often interleave old and new nodes for O(1) cross-reference.

Recognize "I need to build a graph where pointers reference nodes that don't exist yet" → reach for a map.

## Common bugs

1. **Forgetting to unweave in solution 2.** The original list remains corrupted (each node followed by its clone) if you don't restore it in phase 3 — a silent mutation the caller won't expect.
2. **Dereferencing null random pointers.** `cur.random.next` crashes when `cur.random` is null. Always guard.
3. **Phase 1 loop advance.** Must be `cur = cur.next.next` (skip over the just-inserted clone), not `cur = cur.next` (which would try to re-clone the clone).
4. **Using the value as the map key.** Duplicate values would collide. Always use the **node object** as the key.

## When this appears

- **LC 138 Copy List with Random Pointer** (this problem).
- **LC 133 Clone Graph** — same hash-map deep-copy skeleton, generalized.
- **LC 1490 Clone N-ary Tree** — similar structure.
- Any real-world deep-copy that must preserve reference sharing.

:::quiz
question: Why can't you just create each clone and set its `random` in a single pass?
options:
  - When you process node X, the clone of `X.random` may not have been created yet (X.random could come later in the list).
  - You can; the problem is a fake.
answer: 0
explanation: You need either a map (solution 1) or a structural trick (solution 2) to defer the random wiring.
:::

:::quiz
question: In the interleaved-clone solution, the clone of any original node X is always:
options:
  - `X.next` (after phase 1's weave).
  - `X.random`.
answer: 0
explanation: The weave puts each clone immediately after its original.
:::

:::quiz
question: Why must solution 2 include phase 3 (unweaving)?
options:
  - To restore the original list so callers see it unmodified and to produce a standalone clone list.
  - Phase 3 is optional.
answer: 0
explanation: Leaving the weave in place corrupts the original list and makes the clone non-independent.
:::

:::exercise
title: Implement copyRandomList with a hash map
description: Implement the hash-map version of `copyRandomList(head)` in two passes. Don't attempt the interleaved version unless you have time.
starterCode: |
  class Node {
    constructor(val = 0, next = null, random = null) {
      this.val = val; this.next = next; this.random = random;
    }
  }

  function copyRandomList(head) {
    // Pass 1: create clones in a Map from original node -> clone
    // Pass 2: walk originals, set clone.next and clone.random via the map
  }

  // demo builder
  function build() {
    const a = new Node("A"), b = new Node("B"), c = new Node("C");
    a.next = b; b.next = c;
    a.random = c; b.random = a; c.random = null;
    return a;
  }

  const copy = copyRandomList(build());
  console.log(copy.val);                           // "A"
  console.log(copy.next.val);                      // "B"
  console.log(copy.random.val);                    // "C"
  console.log(copy.next.random.val);               // "A"
:::

## Practice

- [Copy List with Random Pointer](/problems/copy-list-with-random-pointer)
