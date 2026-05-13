# Moving Average from Data Stream

**LeetCode 346.** Design a class that calculates the **moving average** of the last `size` values from a stream of integers. On each `next(val)`, add the new value and return the average of the most recent `size` values.

This is a small, clean problem that showcases a **fixed-size circular buffer** — and incidentally reuses the circular-queue implementation from lesson 03.

## The naive approach

Keep an array of all values seen. On each `next`:

1. Append the new value.
2. Compute the average of the last `size` items.

```javascript
class MovingAverage {
  constructor(size) { this.size = size; this.data = []; }
  next(val) {
    this.data.push(val);
    const slice = this.data.slice(-this.size);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  }
}
```

This works and is fine for small streams, but each `next` is **O(size)** for the sum and **O(n)** for memory if you never discard old values. A streaming system running for hours will bloat memory indefinitely.

## The proper solution — circular buffer + running sum

Maintain a fixed-size buffer plus a running sum:

- On `next(val)`, subtract the **outgoing** value (the one about to be overwritten) from the running sum, write `val` into the buffer, and add `val` to the sum.
- The average is `sum / count`, where `count = min(steps taken, size)`.

```javascript
class MovingAverage {
  constructor(size) {
    this.size = size;
    this.data = new Array(size).fill(0);
    this.index = 0;          // next slot to overwrite (tail)
    this.count = 0;          // number of valid values (grows then plateaus at size)
    this.sum = 0;
  }

  next(val) {
    if (this.count < this.size) {
      this.count++;
    } else {
      this.sum -= this.data[this.index];
    }
    this.data[this.index] = val;
    this.sum += val;
    this.index = (this.index + 1) % this.size;
    return this.sum / this.count;
  }
}
```

Every operation is **O(1)** time and **O(size)** memory total — independent of how long the stream runs.

## Walkthrough

```text
size = 3

next(1):
  count 0 -> count = 1
  data[0] = 1, sum = 1
  index = 1
  return 1 / 1 = 1

next(10):
  count 1 -> count = 2
  data[1] = 10, sum = 11
  index = 2
  return 11 / 2 = 5.5

next(3):
  count 2 -> count = 3
  data[2] = 3, sum = 14
  index = 0  (wrapped)
  return 14 / 3 ≈ 4.67

next(5):
  count == size -> subtract data[0]=1 from sum (sum=13)
  data[0] = 5, sum = 18
  index = 1
  return 18 / 3 = 6.0
```

The running sum approach avoids re-summing the whole window on each call — a linear operation would make `next` O(size), which defeats the point of streaming.

## Why this is really a circular queue in disguise

Look at the roles:

- `data` is a fixed-size ring buffer.
- `index` is the `tail` pointer, advancing with modular arithmetic.
- The "head" (logical start of the window) is `index` itself — the next cell about to be overwritten is also the **oldest** cell currently in the window.

It's the same structure as lesson 03, specialized with a numeric aggregate (sum) kept in sync with pushes and overwrites.

## The "don't recompute, maintain incrementally" principle

Whenever you have a stream + a **sliding-window aggregate** (sum, count, min, max, or something more exotic), ask: can I maintain the aggregate as the window shifts, adding the incoming and subtracting the outgoing? If yes, you've turned an O(n · k) problem into O(n).

Aggregates that allow this:

- **Sum** (this lesson).
- **Count** trivially.
- **Mean / variance** via running moments.
- **Max / min** — trickier, needs the monotonic deque (previous two lessons).
- **Product** (if all non-zero; handle zero with a counter).

## Floating-point precision caveat

Repeatedly adding and subtracting floats can accumulate error. For strict precision in production code, consider:

- Double-precision floats are usually fine for thousands of items.
- If drift matters, periodically recompute the sum from the buffer to re-anchor.
- For high-precision finance or scientific apps, use a fixed-point or arbitrary-precision library.

## Complexity

| Metric | Value |
| --- | --- |
| Time per `next` | O(1) |
| Memory | O(size) |
| Construction | O(size) |

## Common bugs

1. **Subtracting the outgoing value before the buffer is full.** Leads to incorrect averages in the first `size - 1` steps. Guard with `count < size`.
2. **Using a dynamically growing array.** Works but grows without bound; misses the point of the fixed-size design.
3. **Recomputing sum from scratch on each call.** Turns the solution into O(size) per call — same as the naive version, hiding the bug.
4. **Forgetting the modulo on `index`.** Without `% size`, the index walks off the end.

:::quiz
question: Why keep a running `sum` rather than summing the buffer on each call?
options:
  - O(1) per `next` instead of O(size); total work becomes O(n) for n calls.
  - Just style preference.
answer: 0
explanation: Streaming algorithms need O(1) per update to scale to long streams.
:::

:::quiz
question: When the buffer first fills (count hits size), what does subsequent `next(val)` do?
options:
  - Subtracts the value about to be overwritten, writes the new value, advances the index mod size.
  - Grows the buffer to size+1.
answer: 0
explanation: Fixed-size means we reuse cells; the one about to be overwritten is the oldest.
:::

:::quiz
question: Memory usage of the optimal solution is:
options:
  - O(size)
  - O(number of `next` calls)
answer: 0
explanation: The whole point of the circular buffer is bounded memory regardless of stream length.
:::

:::exercise
title: Implement MovingAverage
description: Build the class with an O(1) `next(val)`. Use a circular buffer and a running sum.
starterCode: |
  class MovingAverage {
    constructor(size) {
      this.size = size;
      this.data = new Array(size).fill(0);
      this.index = 0;
      this.count = 0;
      this.sum = 0;
    }
    next(val) {
      // update sum (subtract outgoing if buffer full)
      // write val, advance index, return sum/count
    }
  }

  const ma = new MovingAverage(3);
  console.log(ma.next(1));    // 1.0
  console.log(ma.next(10));   // 5.5
  console.log(ma.next(3));    // ~4.67
  console.log(ma.next(5));    // 6.0
:::

## Practice

No dedicated practice folder for this problem. The idea generalizes to **any** "sliding window aggregate from a stream" problem you'll encounter.
