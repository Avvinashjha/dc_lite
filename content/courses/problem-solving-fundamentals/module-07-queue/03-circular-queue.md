# Circular Queue (Ring Buffer)

A **circular queue** — also called a **ring buffer** — is a fixed-size array with two indices that **wrap around** the end back to index 0. Every operation is **O(1) worst case**, and memory is **exactly the capacity** you requested. It's the implementation used inside operating-system kernels, network drivers, audio pipelines, and most production queue libraries.

**LeetCode 622** (Design Circular Queue) is the canonical interview version of this.

## The idea

Keep a fixed-size buffer of length `k`, plus two indices:

- `head` — points to the front of the queue (next element to dequeue).
- `tail` — points to the **next empty slot** at the back (where the next enqueue will write).

Both indices advance with `(i + 1) % k` so they wrap around. Two extra state bits disambiguate "queue is empty" from "queue is full," since both cases have `head === tail`.

The two standard disambiguation tricks:

1. **Count the size explicitly.** Keep a `size` field and update it on enqueue/dequeue. Empty when `size === 0`, full when `size === k`.
2. **Waste one slot.** Treat `(tail + 1) % k === head` as "full." The buffer usefully stores at most `k - 1` elements, so capacity is `k - 1`.

The `size` version is more space-efficient and easier to get right; we'll use it.

## The code

```javascript
class CircularQueue {
  constructor(capacity) {
    this.data = new Array(capacity);
    this.capacity = capacity;
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  enqueue(x) {
    if (this.isFull()) return false;
    this.data[this.tail] = x;
    this.tail = (this.tail + 1) % this.capacity;
    this.count++;
    return true;
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const v = this.data[this.head];
    this.data[this.head] = undefined;            // let GC reclaim
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return v;
  }

  peek() {
    if (this.isEmpty()) return undefined;
    return this.data[this.head];
  }

  rear() {
    if (this.isEmpty()) return undefined;
    return this.data[(this.tail - 1 + this.capacity) % this.capacity];
  }

  isEmpty() { return this.count === 0; }
  isFull()  { return this.count === this.capacity; }
  size()    { return this.count; }
}
```

## Visualization

```text
capacity = 5

Initial:  data=[_ _ _ _ _]    head=0  tail=0  count=0

enqueue(1):   data=[1 _ _ _ _]  head=0  tail=1  count=1
enqueue(2):   data=[1 2 _ _ _]  head=0  tail=2  count=2
enqueue(3):   data=[1 2 3 _ _]  head=0  tail=3  count=3
dequeue()=1:  data=[_ 2 3 _ _]  head=1  tail=3  count=2
dequeue()=2:  data=[_ _ 3 _ _]  head=2  tail=3  count=1
enqueue(4):   data=[_ _ 3 4 _]  head=2  tail=4  count=2
enqueue(5):   data=[_ _ 3 4 5]  head=2  tail=0  count=3     ← tail wrapped
enqueue(6):   data=[6 _ 3 4 5]  head=2  tail=1  count=4     ← wrapping write
isFull()?     no (4 < 5)
enqueue(7):   data=[6 7 3 4 5]  head=2  tail=2  count=5     ← now head == tail, BUT count=5 so full
isFull()?     yes
dequeue()=3:  data=[6 7 _ 4 5]  head=3  tail=2  count=4
```

Note how `head === tail` appears in two different situations — when count is 0 (empty) and when count is `capacity` (full). The explicit `count` field distinguishes them.

## Why `(tail - 1 + capacity) % capacity` for rear?

`tail` points to the next **empty** slot, so the most recent enqueued element lives at `tail - 1`. Adding `capacity` before the modulo ensures we don't get a negative result when `tail === 0`.

## Complexity

| Operation | Time | Extra space |
| --- | --- | --- |
| enqueue | O(1) worst case | O(1) per element |
| dequeue | O(1) worst case | O(1) |
| peek / rear | O(1) | O(1) |
| isEmpty / isFull / size | O(1) | O(1) |

Total space is exactly O(capacity) — no growth, no slack. This is its great strength.

## When to use a circular queue

- **Fixed-capacity producer/consumer** channels.
- **Moving-average windows** over a stream (next lesson's territory).
- Any **bounded buffer** — latest N elements, latest T seconds of data.
- When you want predictable, allocation-free behavior.

## When NOT to use it

- When the maximum size is unknown or unbounded. The circular queue either silently drops new items (if `enqueue` returns false) or requires resizing logic, which defeats the simplicity.
- For ad-hoc BFS where the total number of nodes is a tight upper bound but not a hard cap.

## Common bugs

1. **Off-by-one on `tail`.** Does it point to the last written slot or the next empty slot? Pick one convention and stick with it. The code above uses "next empty slot."
2. **Computing `rear` as `data[tail]`.** That's the next empty slot; the actual last element is `data[tail - 1 + capacity) % capacity]`.
3. **Forgetting the modulo.** Directly incrementing `head` or `tail` without `% capacity` breaks the wrap-around.
4. **Conflating empty and full.** Without the `count` field, `head === tail` is ambiguous. Either use `count`, waste a slot, or add a boolean `empty` flag.
5. **Dequeue without clearing the slot.** Leaving the popped value in `data` prevents garbage collection of reference types. Set to `undefined` (or `null`) after reading.

## Variant: overwrite-on-full ring buffer

Some applications **want** enqueue on a full buffer to **overwrite** the oldest element rather than fail — think of a 10-second rolling audio buffer. The change:

```javascript
enqueue(x) {
  this.data[this.tail] = x;
  this.tail = (this.tail + 1) % this.capacity;
  if (this.isFull()) {
    this.head = (this.head + 1) % this.capacity;   // drop oldest
  } else {
    this.count++;
  }
}
```

Know the two variants — the default LC 622 behavior is "fail on full," not "overwrite."

:::quiz
question: Why do we need either a `count` field or a "waste one slot" convention?
options:
  - Without one, `head === tail` is ambiguous — it could mean empty or full.
  - JavaScript arrays require it.
answer: 0
explanation: Two indices alone cannot distinguish the two extreme states without extra information.
:::

:::quiz
question: In the "next empty slot" convention, the most recently enqueued element lives at:
options:
  - `data[tail]`
  - `data[(tail - 1 + capacity) % capacity]`
answer: 1
explanation: `tail` points past the last filled slot; subtracting 1 (with wrap) gives that slot.
:::

:::quiz
question: Time complexity of enqueue and dequeue on a circular queue:
options:
  - Both O(1) worst case.
  - Amortized O(1), worst case O(n) on resize.
answer: 0
explanation: Fixed capacity means no resizing; each operation is a few constant-time steps.
:::

:::exercise
title: Implement CircularQueue
description: Implement a CircularQueue class with constructor(capacity), enqueue, dequeue, peek, rear, isEmpty, isFull, and size. All ops must be O(1).
starterCode: |
  class CircularQueue {
    constructor(capacity) {
      this.data = new Array(capacity);
      this.capacity = capacity;
      this.head = 0;
      this.tail = 0;
      this.count = 0;
    }

    enqueue(x) { /* return false if full, else write and advance */ }
    dequeue()  { /* advance head, return value */ }
    peek()     { /* ... */ }
    rear()     { /* (tail-1+capacity)%capacity */ }
    isEmpty()  { return this.count === 0; }
    isFull()   { return this.count === this.capacity; }
    size()     { return this.count; }
  }

  const q = new CircularQueue(3);
  console.log(q.enqueue(1)); // true
  console.log(q.enqueue(2)); // true
  console.log(q.enqueue(3)); // true
  console.log(q.enqueue(4)); // false (full)
  console.log(q.rear());     // 3
  console.log(q.isFull());   // true
  console.log(q.dequeue());  // 1
  console.log(q.enqueue(4)); // true
  console.log(q.rear());     // 4
:::

## Practice

No dedicated practice folder for Design Circular Queue exists in this repo. The next lesson implements the queue with a linked list — the unbounded alternative.
