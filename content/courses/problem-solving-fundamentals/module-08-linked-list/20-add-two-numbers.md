# Add Two Numbers

**LeetCode 2.** Two non-negative integers are represented as linked lists, with each node holding a single digit and the digits stored in **reverse order** (least-significant first). Add them and return the sum as a linked list in the same format.

Example: `l1 = 2 -> 4 -> 3` (represents 342), `l2 = 5 -> 6 -> 4` (represents 465). Sum is 807, output: `7 -> 0 -> 8`.

This is the quintessential **parallel-walk** problem: advance two pointers in lockstep, compute a derived value at each step, manage a carry. The linked-list version gives you unbounded integer addition "for free" — no overflow to worry about.

## The algorithm

Simulate long addition, **digit by digit**, from least-significant (the head) to most-significant (the tail):

1. Use a dummy head to build the result.
2. Walk both inputs in lockstep. At each step, sum the digits from `l1`, `l2`, and the carry from the previous step.
3. The new digit is `sum % 10`. The new carry is `Math.floor(sum / 10)` (either 0 or 1).
4. Continue until both lists are exhausted **and** carry is zero.

## The code

```javascript
function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;

  while (l1 !== null || l2 !== null || carry > 0) {
    const d1 = (l1 !== null) ? l1.val : 0;
    const d2 = (l2 !== null) ? l2.val : 0;
    const sum = d1 + d2 + carry;

    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10);

    if (l1 !== null) l1 = l1.next;
    if (l2 !== null) l2 = l2.next;
  }

  return dummy.next;
}
```

Notice the loop condition: `l1 !== null || l2 !== null || carry > 0`. The third clause is critical — a trailing carry means a new most-significant digit that neither input had.

## Walkthrough

```text
l1: 2 -> 4 -> 3   (represents 342)
l2: 5 -> 6 -> 4   (represents 465)

iteration 1:
  d1=2, d2=5, carry=0
  sum = 7
  tail.next = 7, carry = 0
  advance both
  state: dummy -> 7

iteration 2:
  d1=4, d2=6, carry=0
  sum = 10
  tail.next = 0, carry = 1
  advance both
  state: dummy -> 7 -> 0

iteration 3:
  d1=3, d2=4, carry=1
  sum = 8
  tail.next = 8, carry = 0
  advance both (l1 and l2 now null)
  state: dummy -> 7 -> 0 -> 8

Loop check: l1=null, l2=null, carry=0 -> exit.

return dummy.next = 7 -> 0 -> 8   (represents 807 = 342 + 465) ✓
```

## Walkthrough — carry past the end

```text
l1: 9 -> 9 -> 9      (999)
l2: 1                (1)

iteration 1: d1=9, d2=1, carry=0. sum=10. digit=0, carry=1.
  state: dummy -> 0

iteration 2: d1=9, d2=0 (l2 null), carry=1. sum=10. digit=0, carry=1.
  state: dummy -> 0 -> 0

iteration 3: d1=9, d2=0, carry=1. sum=10. digit=0, carry=1.
  state: dummy -> 0 -> 0 -> 0

Loop check: l1=null, l2=null, carry=1 -> continue!

iteration 4: d1=0, d2=0, carry=1. sum=1. digit=1, carry=0.
  state: dummy -> 0 -> 0 -> 0 -> 1

Loop check: all conditions false -> exit.

return 0 -> 0 -> 0 -> 1   (represents 1000 = 999 + 1) ✓
```

The `carry > 0` clause in the loop condition is what allows the final "1" to be added. Without it, the answer would be `0 -> 0 -> 0` — wrong!

## Complexity

- **Time:** O(max(m, n) + 1). Where m, n are list lengths. The +1 is for a possible trailing carry.
- **Space:** O(max(m, n) + 1). Each digit of the output is a new node.

## Why reverse-order storage?

The LeetCode problem stores digits LSB-first for exactly the reason you just saw: **long addition works from LSB to MSB**, and walking a singly linked list goes head-to-tail. Aligning "head" with "LSB" makes the simulation a simple forward walk.

If digits were stored MSB-first (head = most significant), you'd need to **reverse both lists first**, then add, then reverse the result. LC 445 does exactly that.

## Variant — LC 445 (digits stored MSB-first)

If you must do it without reversing:

1. Push each list's values onto a stack.
2. Pop both stacks in parallel, adding with carry.
3. Prepend (rather than append) each result digit by inserting at the head.

```javascript
function addTwoNumbersMSB(l1, l2) {
  const s1 = [], s2 = [];
  for (let c = l1; c !== null; c = c.next) s1.push(c.val);
  for (let c = l2; c !== null; c = c.next) s2.push(c.val);

  let head = null;
  let carry = 0;
  while (s1.length > 0 || s2.length > 0 || carry > 0) {
    const d1 = s1.length > 0 ? s1.pop() : 0;
    const d2 = s2.length > 0 ? s2.pop() : 0;
    const sum = d1 + d2 + carry;
    const node = new ListNode(sum % 10, head);   // prepend
    head = node;
    carry = Math.floor(sum / 10);
  }
  return head;
}
```

Stacks let us iterate from LSB to MSB even though the list is stored MSB to LSB. The **prepend** (inserting at head rather than appending to tail) puts the output in MSB-first order.

## Why this problem is important

Three reasons:

1. **Parallel-walk template.** Walk two data sources in lockstep, producing a third. This shape appears in merge problems, diff algorithms, and many array-pair problems.
2. **Carry/state management.** The carry is the archetype of "small stateful piece carried through a linear scan." Similar patterns: running sum, running max, longest-so-far.
3. **Unbounded precision.** Neither JS numbers nor 32-bit ints can hold arbitrary-length sums — but linked lists of digits can. You've built a small arbitrary-precision integer adder.

## Common bugs

1. **Forgetting the `carry > 0` clause** in the loop condition. Misses trailing carries.
2. **Using `sum / 10` instead of `Math.floor(sum / 10)`.** `/` in JS is float division; `7 / 10 === 0.7`, not 0. `Math.floor` (or `(sum / 10) | 0` for small numbers) gives the integer quotient.
3. **Advancing `l1 = l1.next` without the null guard.** Crashes when one list is longer than the other.
4. **Allocating new nodes unnecessarily.** The output must be new nodes; but be careful not to create extra trailing nodes (e.g., by using `new ListNode(0)` at the end if you accidentally break the loop wrong).
5. **Off-by-one on the dummy.** Return `dummy.next`, not `dummy`.

:::quiz
question: Why include `carry > 0` in the loop condition alongside `l1 !== null || l2 !== null`?
options:
  - A trailing carry can produce a new most-significant digit that neither input had (e.g., 999 + 1 = 1000); the loop must run one more iteration to emit it.
  - For performance.
answer: 0
explanation: Without this clause, the carry is silently dropped.
:::

:::quiz
question: The sum of two digits plus a carry is at most:
options:
  - 19 (9 + 9 + 1). So the carry is at most 1, and `sum % 10` gives the new digit, `Math.floor(sum / 10)` gives the new carry.
  - 20.
answer: 0
explanation: Decimal digit pairs plus carry stay under 20, so carry is always 0 or 1.
:::

:::quiz
question: Space complexity:
options:
  - O(max(m, n) + 1) — one output node per digit plus possibly one for the trailing carry.
  - O(1) — we reuse input nodes.
answer: 0
explanation: Output digits must be new nodes; we don't modify the inputs.
:::

:::exercise
title: Implement addTwoNumbers
description: Implement `addTwoNumbers(l1, l2)` where digits are stored LSB-first. Don't forget the trailing-carry case.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function addTwoNumbers(l1, l2) {
    // dummy + tail cursor; loop while l1 or l2 or carry > 0
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }
  function toArray(h)   { const a = []; for (let c = h; c; c = c.next) a.push(c.val); return a; }

  console.log(toArray(addTwoNumbers(fromArray([2,4,3]), fromArray([5,6,4])))); // [7,0,8]  (342 + 465 = 807)
  console.log(toArray(addTwoNumbers(fromArray([0]),     fromArray([0]))));     // [0]
  console.log(toArray(addTwoNumbers(fromArray([9,9,9]), fromArray([1]))));     // [0,0,0,1]  (999 + 1 = 1000)
:::

## Practice

- [Add Two Numbers](/problems/add-two-numbers)
