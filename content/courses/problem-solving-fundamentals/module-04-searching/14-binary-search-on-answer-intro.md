# Binary Search on the Answer: Pattern and First Bad Version

So far we have binary-searched over **array indices**. The same idea works over any **integer range** if you can answer a yes/no question `P(x)` that is **monotonic** — once `P` flips from false to true, it stays true.

This is called **binary search on the answer**: you binary-search the smallest (or largest) value `x` for which `P(x)` holds.

## The shape of the problem

Picture the answer space as a boolean array:

```text
x:     0  1  2  3  4  5  6  7  8
P(x):  F  F  F  F  T  T  T  T  T
                   ^
                   first true (the answer we want)
```

Finding the first `T` in a monotone `[F, F, ..., F, T, ..., T]` sequence is exactly binary search — except `P(x)` may be an actual function call, not a precomputed array.

## The generic template

```javascript
function firstTrue(lo, hi, P) {
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (P(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

Notice the half-open `[lo, hi)` template: the same one we used for lower bound.

## LeetCode 278 — First Bad Version

The API exposes `isBadVersion(v)`. All versions from some unknown `k` onward are bad. Find `k` with as few API calls as possible.

```text
versions:      1  2  3  4  5  6
isBadVersion:  F  F  F  T  T  T     -> answer is 4
```

**Straight substitution:** `P(v) = isBadVersion(v)`, search range `[1, n]`.

```javascript
function firstBadVersion(n) {
  let lo = 1;
  let hi = n;
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (isBadVersion(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

Here we use `lo + Math.floor((hi - lo) / 2)` rather than `(lo + hi) >>> 1` because `n` can be up to `2^31 - 1` and the raw sum overflows the 32-bit-friendly region — a common real-world gotcha.

## Walkthrough

```text
n = 5, first bad = 4

lo=1 hi=5 mid=3 isBad(3)=false -> lo=4
lo=4 hi=5 mid=4 isBad(4)=true  -> hi=4
lo=4 hi=4 -> return 4
```

Three API calls for n=5 — logarithmic.

## When is a problem "binary search on the answer"?

Checklist:

1. You can write a function `P(x)` that answers "is `x` a valid answer?" (or "does `x` satisfy the constraint?").
2. `P` is **monotonic** in `x`: once true, stays true (or vice versa).
3. You want the **smallest** (or largest) `x` with `P(x) = true`.

## Complexity

- **Time:** `O(log U)` calls to `P`, where `U = hi - lo` is the answer range size. If `P` itself costs `T`, total time is `O(T · log U)`.
- **Space:** O(1).

:::quiz
question: What must be true about P(x) for binary search on the answer to work?
options:
  - P must be monotonic — once it becomes true, it stays true for larger x (or once false, stays false).
  - P must be constant.
answer: 0
explanation: The [F..F, T..T] shape is what makes the halving argument valid.
:::

:::quiz
question: Why do we prefer `lo + Math.floor((hi - lo) / 2)` over `(lo + hi) >>> 1` in First Bad Version?
options:
  - Because `n` can be close to 2^31, and the raw sum exceeds the safe 32-bit range the `>>> 1` trick assumes.
  - Because `>>> 1` always rounds up.
answer: 0
explanation: Using `lo + (hi - lo) / 2` avoids the addition ever overflowing a 32-bit surface.
:::

:::quiz
question: If `P(x)` has the shape [T, T, T, F, F, F] (once false, stays false), we are searching for:
options:
  - The last x with P(x) = true — the mirror of the first-true case with the `<=` vs `<` swapped.
  - Nothing — binary search only works on [F..F, T..T].
answer: 0
explanation: Monotonicity in either direction works; adjust the comparison accordingly.
:::

:::exercise
title: Implement firstTrue
description: Implement a generic `firstTrue(lo, hi, P)` that returns the smallest integer `x` in `[lo, hi]` for which `P(x)` is true. Assume such an `x` exists.
starterCode: |
  function firstTrue(lo, hi, P) {
    // half-open binary search
    return lo;
  }

  const k = 7;
  const P = x => x >= k;
  console.log(firstTrue(0, 20, P)); // 7
:::

## Practice

- [First Bad Version](/problems/first-bad-version)
