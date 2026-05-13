# Number of Recent Calls (Time-Window Queue)

**LeetCode 933.** Implement a `RecentCounter` class. You will receive a series of `ping(t)` calls where `t` is a timestamp in milliseconds. For each `ping(t)`, return the number of pings that occurred in the inclusive range `[t - 3000, t]`.

Timestamps are **strictly increasing** across calls, so you don't need to worry about out-of-order pings.

## Why this is a queue problem

Every ping enters the system in arrival order; every ping eventually ages out when its timestamp falls out of the window. **First in, first out** — literally the definition of a queue.

On each `ping(t)`:

1. Enqueue `t`.
2. While the front of the queue is **older than** `t - 3000`, dequeue it.
3. Return the queue's size.

That's the whole algorithm.

## The code

```javascript
class RecentCounter {
  constructor() {
    this.q = [];
    this.head = 0;     // head-index trick so we don't use O(n) shift()
  }

  ping(t) {
    this.q.push(t);
    while (this.head < this.q.length && this.q[this.head] < t - 3000) {
      this.head++;
    }
    return this.q.length - this.head;
  }
}
```

The head-index trick is worth emphasizing: naive `this.q.shift()` would be O(n) per call, turning this into O(n²) across n pings. With a head pointer, each ping is **amortized O(1)** — every timestamp enters the queue once and leaves once.

## Walkthrough

```text
rc = new RecentCounter();

ping(1):    q=[1],    head=0
            while 1 < 1 - 3000? no
            return 1 - 0 = 1

ping(100):  q=[1, 100],  head=0
            while 1 < 100 - 3000 = -2900? no
            return 2 - 0 = 2

ping(3001): q=[1, 100, 3001],  head=0
            while 1 < 3001 - 3000 = 1? no (1 < 1 is false)
            return 3 - 0 = 3

ping(3002): q=[1, 100, 3001, 3002],  head=0
            while 1 < 3002 - 3000 = 2? yes, head=1
            while 100 < 2? no
            return 4 - 1 = 3
```

Notice: at `ping(3002)`, the ping from time `1` aged out (since `1 < 2`), but the one from time `100` is still within the 3-second window (`100 >= 2`).

## Why strict < and not <=

The problem says the window is **inclusive**: `[t - 3000, t]`. A timestamp of exactly `t - 3000` is still in the window. We evict when the front is **strictly less than** `t - 3000` — if it equals, keep it.

Boundary subtleties like these are common in timing problems. Read the spec twice.

## Complexity

- **Time:** Amortized O(1) per `ping`. Each timestamp is pushed once and the head advances past it at most once — total work O(n) for n pings.
- **Space:** O(w) where `w` is the maximum number of pings in any 3-second window. Plus the unbounded underlying array — in practice you can reset the array periodically when `head` gets large, but for LC this isn't needed.

## Memory-tight version

If you need to reclaim memory (long-running server), you can periodically truncate:

```javascript
ping(t) {
  this.q.push(t);
  while (this.head < this.q.length && this.q[this.head] < t - 3000) {
    this.head++;
  }
  if (this.head > 1000) {
    this.q = this.q.slice(this.head);
    this.head = 0;
  }
  return this.q.length - this.head;
}
```

Or swap the array for a **linked-list queue** from lesson 04 — each dequeue releases a node for GC immediately, never growing beyond the live window size.

## Alternative — binary search

Since timestamps are strictly increasing, you could store **all** timestamps in an array and binary-search for the first index `i` with `arr[i] >= t - 3000`. The answer is `arr.length - i`.

Time per call: O(log n). Space: O(n) forever.

The queue approach is simpler and uses less memory, so it's the preferred answer. Still, mentioning the binary-search alternative shows you've thought about the time-vs-space trade-off.

## The broader pattern: sliding time window

Any problem that asks "how many events happened in the last T seconds" (or equivalent) follows this shape:

1. Maintain a queue of event timestamps in arrival order.
2. On each new event, enqueue it, then pop stale events from the front.
3. Return `queue.size`.

Examples:

- **Rate limiting.** Allow at most N requests per user per T seconds. Maintain a queue per user.
- **Heart-rate monitor.** Keep the last 60 seconds of beats; the count is BPM.
- **Sliding window average over a stream** where samples arrive at irregular intervals (vs the fixed-count average from the previous lesson).

## Common bugs

1. **Using `q.shift()` instead of a head index.** Silently turns O(n) into O(n²); passes small tests, fails large ones.
2. **Evicting with `<=` instead of `<`.** Off-by-one on the inclusive boundary.
3. **Comparing `q[0]` when the queue is empty.** Always check emptiness (`head < q.length`) first.
4. **Forgetting that timestamps are strictly increasing.** If they weren't, the queue's FIFO invariant would break and you'd need a different structure (a sorted multiset, a segment tree, etc.).

:::quiz
question: Why do we prefer a head-index pointer over `Array.prototype.shift`?
options:
  - `shift` is O(n); the head-index pattern keeps each ping amortized O(1).
  - `shift` does not work on arrays.
answer: 0
explanation: Amortized O(1) per ping is the correct complexity; using shift defeats it.
:::

:::quiz
question: The eviction condition is `q[head] < t - 3000`. Why `<` and not `<=`?
options:
  - The window is inclusive of `t - 3000`, so equal timestamps still count.
  - Strict inequality is always preferred.
answer: 0
explanation: Boundary: `t - 3000` is still "within 3 seconds," so it stays in the window.
:::

:::quiz
question: What is the advantage of the queue approach over a binary-search-on-a-sorted-array approach?
options:
  - Amortized O(1) per op vs O(log n), and bounded memory with a linked-list variant.
  - The queue is asymptotically slower but simpler.
answer: 0
explanation: Time is better and memory can be bounded by sliding-window size with a linked-list queue.
:::

:::exercise
title: Implement RecentCounter
description: Implement `RecentCounter` with a head-index queue. Evict timestamps older than `t - 3000`, then return the current queue size.
starterCode: |
  class RecentCounter {
    constructor() {
      this.q = [];
      this.head = 0;
    }
    ping(t) {
      // push t; advance head while q[head] < t - 3000; return length - head
    }
  }

  const rc = new RecentCounter();
  console.log(rc.ping(1));     // 1
  console.log(rc.ping(100));   // 2
  console.log(rc.ping(3001));  // 3
  console.log(rc.ping(3002));  // 3
:::

## Practice

No dedicated practice folder for this exact problem. The technique generalizes — try rewriting a rate limiter or a heart-rate counter using the same pattern.
