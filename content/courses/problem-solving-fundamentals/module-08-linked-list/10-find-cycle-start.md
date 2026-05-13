# Find the Start of a Cycle

**LeetCode 142.** Given the head of a linked list, return the **node where the cycle begins**, or `null` if there is no cycle.

This extends the previous lesson. Floyd's algorithm tells you **whether** a cycle exists; the extension here tells you **where** it starts. The trick is an elegant pointer reset that combines two distance equations into a single observation.

## The algorithm

1. Run Floyd's to find a **meeting point** inside the cycle. If there's no cycle, return `null`.
2. Reset one pointer to the head. Advance **both** pointers one step at a time; they will meet exactly at the **cycle's entry point**.

## The code

```javascript
function detectCycle(head) {
  let slow = head;
  let fast = head;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      // Phase 2: find the entry
      let entry = head;
      while (entry !== slow) {
        entry = entry.next;
        slow = slow.next;
      }
      return entry;
    }
  }
  return null;
}
```

Two phases, each O(n) time, O(1) space total.

## Why it works — the distance argument

Let:

- `p` = length of the prefix before the cycle (number of nodes from head to the entry).
- `c` = length of the cycle.
- `k` = distance from the cycle entry to the meeting point inside the cycle (measured along the cycle).

When slow and fast meet:

- **Slow has taken `p + k` steps.**
- **Fast has taken `2(p + k)` steps.**
- Fast's extra distance is some whole number of full cycles: `2(p + k) - (p + k) = p + k`, which must equal `n · c` for some integer `n ≥ 1`.

So `p + k = n · c`, which rearranges to `p = n · c - k`.

Interpret the right side: **starting from the meeting point, walking `n · c - k` steps brings you back to `k` steps before the meeting point — which is exactly the cycle entry** (since `k` is the distance from the entry to the meeting point).

Walking `n · c - k` steps from the meeting point is the same as walking `p` steps. Meanwhile, walking `p` steps from the head reaches the cycle entry. So both pointers — one from the head, one from the meeting point, each advancing one step at a time — land at the cycle entry simultaneously.

Compact version:

```text
slow_distance = p + k
fast_distance = 2(p + k)
fast - slow   = n · c    (they differ by an integer number of laps)
=> p + k = n · c
=> p = n · c - k
```

Pretty.

## Walkthrough

```text
list:  A -> B -> C -> D -> E -> F -> C     (F.next = C; cycle entry is C)
        prefix: p=2 (A, B)
        cycle:  C -> D -> E -> F -> back to C, c=4

Phase 1 (Floyd's):
  step 1: slow=B, fast=C
  step 2: slow=C, fast=E
  step 3: slow=D, fast=C     (fast went E -> F -> C)
  step 4: slow=E, fast=E     meet at E

  Check: p + k = ? Slow has moved 4 steps; slow = E, which is 2 steps past the entry C.
         So k = 2; n · c - k = 4 - 2 = 2 = p ✓

Phase 2:
  entry = A, meet pointer = E
  step 1: entry = B, meet = F
  step 2: entry = C, meet = C     meet!

  return C  (cycle entry)
```

## Why this is so much better than the brute force

The hash-set approach (lesson 09's baseline) also solves this problem:

```javascript
function detectCycleSet(head) {
  const seen = new Set();
  for (let cur = head; cur !== null; cur = cur.next) {
    if (seen.has(cur)) return cur;
    seen.add(cur);
  }
  return null;
}
```

It's correct and easy. But it uses **O(n) extra space**. Floyd's elegant derivation gets you **O(1) space**. In interviews, the expected answer is the two-phase Floyd's — the hash-set version is a fallback.

## Complexity

- **Time:** O(n). Phase 1 runs at most `p + c` iterations; phase 2 runs at most `p` iterations. Linear total.
- **Space:** O(1). Three pointers.

## Subtle implementation details

1. **Both phase 2 pointers advance at the same speed.** Don't use slow/fast in phase 2 — that's a common copy-paste bug.
2. **Start phase 2 from the meeting point, not a fresh slow=head.** The meeting point holds the math; resetting both would destroy the distance equation.
3. **Return `null` if we never meet.** That's the no-cycle case; the `while` loop exits without triggering the inner block.

## Edge cases

- Empty list (`head === null`) → return `null`.
- Single node with no cycle (`head.next === null`) → return `null`.
- Single node with self-cycle (`head.next === head`) → Floyd's meets immediately at `head` after one iteration; phase 2 runs zero iterations and returns `head`. ✓

## When this shows up

- **LC 142 Linked List Cycle II** (this problem).
- **Cycle detection in iterated functions** — Pollard's rho algorithm for integer factorization uses the same two-phase structure.
- **Find duplicate number in an array** (LC 287) — clever reduction to cycle detection by treating the array as a linked list where `next(i) = arr[i]`.

The last one is especially cool: LC 287 asks you to find the single duplicate in an array of `n+1` integers in the range `[1..n]` using O(1) space. The function `f(i) = arr[i]` must have a cycle (pigeonhole), and the **duplicate value** is precisely the **cycle entry node**. Recognize that reduction and you've solved a "hard-tagged" problem with an algorithm you already know.

## Common bugs

1. **Using slow/fast speeds in phase 2.** Advance both at 1 step.
2. **Starting phase 2's reset pointer at the meeting point instead of head.** Swap them and the algorithm fails.
3. **Returning the meeting point instead of the entry.** Easy to do if you prematurely `return slow` inside phase 1.
4. **Forgetting to return `null` when no cycle.** Ensure the outer `while` exits cleanly.

:::quiz
question: Why does resetting one pointer to head and advancing both one step at a time work?
options:
  - The distance from head to cycle entry (p) equals the distance from the meeting point back to the entry (modulo the cycle length); so the two pointers land at the entry simultaneously.
  - It's a coincidence.
answer: 0
explanation: The algebraic identity p = n · c - k is the whole reason this works.
:::

:::quiz
question: In phase 2, how fast does each pointer advance?
options:
  - Both one step per iteration.
  - Reset pointer one step, meeting pointer two steps.
answer: 0
explanation: Equal speeds — the distance identity only works with equal-speed pointers.
:::

:::quiz
question: If the list has no cycle, Floyd's algorithm:
options:
  - Returns null after fast hits the end; phase 2 never starts.
  - Loops forever.
answer: 0
explanation: Fast eventually becomes null (or fast.next becomes null) and the outer loop exits.
:::

:::exercise
title: Implement detectCycle
description: Implement `detectCycle(head)` returning the cycle entry node (or null). Use two phases — Floyd's, then the entry-finder reset.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function detectCycle(head) {
    // Phase 1: slow/fast until they meet (return null if fast hits null)
    // Phase 2: reset one pointer to head; advance both by 1 until they meet; return the meeting node
  }

  function makeList(values, cycleIdx = -1) {
    const d = new ListNode(); let t = d;
    const nodes = [];
    for (const v of values) { t.next = new ListNode(v); t = t.next; nodes.push(t); }
    if (cycleIdx >= 0 && nodes.length > 0) t.next = nodes[cycleIdx];
    return d.next;
  }

  const l1 = makeList([3, 2, 0, -4], 1);
  console.log(detectCycle(l1)?.val);      // 2
  console.log(detectCycle(makeList([1, 2])));   // null
  console.log(detectCycle(makeList([1], 0))?.val); // 1
:::

## Practice

No dedicated practice folder for LC 142 in this repo. Complete [Linked List Cycle](/problems/linked-list-cycle) first, then solve LC 142 on your platform of choice using the two-phase algorithm.
