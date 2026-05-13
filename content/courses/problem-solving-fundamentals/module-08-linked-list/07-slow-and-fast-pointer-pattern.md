# The Slow and Fast Pointer Pattern

The **slow and fast pointer** technique (sometimes called the **two-pointer** or **tortoise and hare** pattern) uses two pointers that traverse the list at **different speeds**. It's the most versatile linked-list pattern you'll learn — it powers **middle-of-list**, **cycle detection**, **find n-th from end**, **palindrome check**, **list intersection**, and several other problems.

The whole toolkit rests on one beautifully simple idea: **if the fast pointer moves twice as fast as the slow one, by the time fast reaches the end, slow is halfway there.**

## The template

```javascript
let slow = head;
let fast = head;
while (fast !== null && fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
}
// when the loop ends, slow is somewhere useful (usually the middle)
```

Three parts:

1. **Initialize both at head.**
2. **Loop guard:** `fast !== null && fast.next !== null` — ensures `fast.next.next` is always safe.
3. **Advance:** slow moves one, fast moves two.

The guard has two checks because both `fast` and `fast.next` must be non-null before we can take a **two-step** advance.

## Where slow lands — odd vs even length

For odd-length lists, the midpoint is unambiguous; for even-length lists, there are two "middles" (the left and the right of center). The template above lands slow on the **right middle** for even lengths:

```text
n = 5 (odd):  A B [C] D E      slow lands at C (true middle)
n = 6 (even): A B C [D] E F    slow lands at D (right of center)
```

If you want the **left middle** on even lengths, initialize `fast = head.next` instead:

```javascript
let slow = head;
let fast = head.next;
while (fast !== null && fast.next !== null) {
  slow = slow.next;
  fast = fast.next.next;
}
// slow lands on the left middle for even lengths
```

Different problems want different halves. Read the problem carefully and pick the right initialization.

## Why the two-pointer trick works mathematically

Every iteration, slow advances by 1 and fast by 2. So if slow has advanced `k` steps, fast has advanced `2k`. When `fast` reaches the end (`k = n/2` for even or `(n-1)/2` for odd), slow has advanced exactly half as far.

This relationship generalizes beyond middle-finding. The two key applications in this module:

1. **Middle of a list** — slow is the middle when fast reaches the end. (Lesson 08.)
2. **Cycle detection** — if there is a cycle, fast eventually overtakes slow **inside** the cycle and they meet. (Lesson 09.)

The distance-gap-closes-in-a-cycle argument is the engine behind **Floyd's algorithm**, one of the most elegant algorithmic tricks in computer science.

## Variant: lead-and-follow (fixed-gap pointers)

For "n-th from the end" (lesson 11), we use a variant where fast is **ahead by a fixed amount** rather than moving faster:

```javascript
let lead = head;
for (let i = 0; i < k; i++) lead = lead.next;
let follow = head;
while (lead.next !== null) {
  lead = lead.next;
  follow = follow.next;
}
// follow is now k steps from the end
```

Same underlying principle — two pointers with a known relationship. Here the relationship is a **constant lead**, not a speed ratio.

## Variant: pointer switcher (list intersection)

For the intersection-of-two-lists problem (lesson 19), we use two pointers that traverse one list, then the other:

```javascript
let pA = headA;
let pB = headB;
while (pA !== pB) {
  pA = (pA === null) ? headB : pA.next;
  pB = (pB === null) ? headA : pB.next;
}
return pA;
```

At convergence, the pointers have each traveled the same total distance, so they meet at the intersection node (or both at `null` if no intersection exists). A different application of the same two-pointer principle.

## When to reach for slow/fast

Recognize the pattern when a problem asks for:

- **The middle of the list.**
- **Whether the list has a cycle.**
- **Where a cycle begins.**
- **The n-th node from the end.**
- **Whether the list is a palindrome.**
- **Whether two lists intersect.**
- **"Do something to the first half / second half" of a list.**

If the problem involves **distances** or **ratios** in a linked list, two pointers at different speeds are almost always involved.

## Mental anchor — the gap

I find it helpful to think about the **gap** between the two pointers, not their absolute positions. In the standard template:

- Both start at the same position (gap = 0).
- Each step, the gap grows by 1 (fast advances 2, slow advances 1).
- In a cycle, the gap eventually matches the cycle length, at which point fast laps slow.
- In a non-cyclic list, fast hits null before that happens.

For the constant-lead variant, the gap is **locked** from the start and maintained throughout.

## Why not just use length?

You could always:

1. Compute the length `n` in one pass.
2. Do a second pass to position `n/2`.

That's also O(n) time, O(1) space — same as the two-pointer approach. So why prefer two pointers?

- **One pass** feels more elegant.
- For **cycle detection**, computing length first requires knowing the list terminates — but if there's a cycle, your length computation never returns.
- It generalizes: the two-pointer pattern extends naturally to n-from-end, palindrome, and intersection problems where "compute the length" wouldn't give you an obvious answer.

## Common bugs

1. **Wrong loop guard.** Using `while (fast !== null)` alone misses the case where `fast.next` is null — and `fast.next.next` crashes.
2. **Using `fast.next !== null && fast.next.next !== null`** — also correct but inconsistent. Prefer the simpler `fast !== null && fast.next !== null`.
3. **Advancing slow before checking fast.** Always advance both inside the loop; don't peek before the guard.
4. **Picking the wrong half on even length.** If the problem asks for the **first** half (e.g., splitting into halves for merge-sort), you want `fast = head.next` or you'll land on the wrong node.

:::quiz
question: Why does the standard two-pointer loop use `while (fast !== null && fast.next !== null)`?
options:
  - To safely perform `fast = fast.next.next` without dereferencing null.
  - It's just convention.
answer: 0
explanation: A two-step advance requires both `fast` and `fast.next` to be non-null.
:::

:::quiz
question: After the standard slow/fast loop ends on a list of length 6 (nodes A–F), where is `slow`?
options:
  - At D (the right-of-center node).
  - At C (the left-of-center node).
answer: 0
explanation: With `fast = head` start, slow lands on the right middle for even lengths.
:::

:::quiz
question: Which variant of the two-pointer pattern has a CONSTANT gap rather than a growing one?
options:
  - The lead-and-follow (fixed offset) variant used in n-from-end.
  - The standard slow (1 step) / fast (2 step) variant.
answer: 0
explanation: Lead-and-follow moves both pointers at the same speed with a fixed head start.
:::

:::exercise
title: Two-pointer template — find middle
description: Use the standard slow/fast template to return the middle (right-of-center on even lengths) node's value. Don't compute the length first; do it in one pass.
starterCode: |
  class ListNode {
    constructor(val = 0, next = null) { this.val = val; this.next = next; }
  }

  function middleValue(head) {
    if (head === null) return null;
    let slow = head, fast = head;
    // advance slow by 1 and fast by 2 until fast or fast.next is null
    return slow.val;
  }

  function fromArray(a) { const d = new ListNode(); let t = d; for (const v of a) { t.next = new ListNode(v); t = t.next; } return d.next; }

  console.log(middleValue(fromArray([1,2,3,4,5])));   // 3
  console.log(middleValue(fromArray([1,2,3,4,5,6])));  // 4 (right middle)
  console.log(middleValue(fromArray([1])));           // 1
  console.log(middleValue(null));                     // null
:::

## Practice

No required practice for this lesson. The next lesson solves the simplest application — find the middle of the list.
