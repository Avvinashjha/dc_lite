# Binary Search on the Answer: Koko Eating Bananas

**LeetCode 875.** Koko has `piles[]` of bananas and `h` hours. Each hour she picks one pile and eats up to `k` bananas from it (if the pile has fewer, she finishes it and stops for the hour). Find the **minimum integer** speed `k` that lets her finish all piles within `h` hours.

This is the canonical **capacity / speed** variant of binary search on the answer.

## Step 1: define the predicate

```text
P(k) = "Can Koko finish all piles in h hours eating at speed k?"
```

At speed `k`, pile of size `p` takes `ceil(p / k)` hours. Total time:

```text
time(k) = sum over piles of ceil(p / k)
```

So `P(k) = time(k) <= h`.

## Step 2: prove monotonicity

If Koko can finish at speed `k`, she can also finish at any larger speed. `P(k)` is false for small `k` and becomes true once `k` is big enough — classic `[F..F, T..T]` shape. We want the **first** true.

## Step 3: pick the search range

- Minimum possible speed: `1` (speed `0` makes no sense).
- Maximum useful speed: `max(piles)` — going faster than the largest pile never helps, since each hour she eats one pile only.

## The code

```javascript
function minEatingSpeed(piles, h) {
  let lo = 1;
  let hi = Math.max(...piles);

  const canFinish = k => {
    let hours = 0;
    for (const p of piles) {
      hours += Math.ceil(p / k);
      if (hours > h) return false;
    }
    return true;
  };

  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (canFinish(mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}
```

## Walkthrough

```text
piles = [3, 6, 7, 11]   h = 8

range: [1, 11]

mid=6  canFinish(6) = ceil(3/6)+ceil(6/6)+ceil(7/6)+ceil(11/6)
                  = 1 + 1 + 2 + 2 = 6   <= 8  -> hi=6
mid=3  = ceil(3/3)+ceil(6/3)+ceil(7/3)+ceil(11/3)
      = 1 + 2 + 3 + 4 = 10  > 8 -> lo=4
mid=5  = 1 + 2 + 2 + 3 = 8   <= 8 -> hi=5
mid=4  = 1 + 2 + 2 + 3 = 8   <= 8 -> hi=4
return 4
```

Minimum speed is 4.

## Complexity

- **Time:** `O(n log U)` where `n = piles.length` and `U = max(piles)`.
- **Space:** O(1).

The outer binary search does `O(log U)` iterations; each iteration’s `canFinish` is `O(n)`. Compare to brute-forcing every speed from 1 upward, which would be `O(n * U)`.

## The recipe (reusable)

Many interview problems follow the same shape:

1. Define `P(x)` as "is x a valid answer?"
2. Prove `P` is monotonic in `x`.
3. Pick a sensible `[lo, hi]` range.
4. Binary search for the first (or last) `x` with `P(x) = true`.

Examples beyond Koko (for your own study): Split Array Largest Sum, Capacity to Ship Packages in D Days, Minimum Number of Days to Make m Bouquets, Find the Smallest Divisor Given a Threshold. All follow the same four steps.

:::quiz
question: In Koko's problem, time(k) is monotonically:
options:
  - Non-increasing in k — faster speed never takes more hours.
  - Non-decreasing in k.
answer: 0
explanation: Eating faster cannot hurt; hence P(k) = "time(k) <= h" is the usual [F..F, T..T] shape.
:::

:::quiz
question: Why is `max(piles)` a sound upper bound for the binary search range?
options:
  - Because speeds above max(piles) do not help — she can only eat one pile per hour and any pile is finished in one hour already at speed max(piles).
  - Because JavaScript numbers overflow otherwise.
answer: 0
explanation: Speed beyond the largest pile is wasted capacity; no better answer exists above max.
:::

:::quiz
question: The total time complexity of the binary-search-on-answer solution is:
options:
  - O(n * max(piles)) — brute force.
  - O(n log max(piles)) — binary search over speeds, linear predicate.
answer: 1
explanation: Each of O(log U) iterations does an O(n) pass.
:::

:::exercise
title: Predicate for capacity-shipping
description: In pseudocode (comments are fine), describe `P(capacity)` for "Capacity to Ship Packages in D Days": given weights and D days, can we ship with the given per-day capacity? State whether P is monotonic in capacity and why.
starterCode: |
  // P(capacity):
  //   simulate days; for each weight, if adding to today's load > capacity,
  //   start a new day; return true iff days <= D
  //
  // Monotonicity: larger capacity -> fewer or equal days -> if P(c) true, P(c+1) true.
:::

## Practice

- [First Bad Version](/problems/first-bad-version) — easier warm-up for the binary-search-on-answer pattern.
