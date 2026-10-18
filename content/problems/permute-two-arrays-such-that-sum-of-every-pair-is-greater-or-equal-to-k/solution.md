## Sort + Greedy

Sort `A` ascending and `B` descending, then check every paired sum.

Why is this sufficient? Consider the smallest remaining value `a` in `A` and the largest remaining value `b` in `B`. If `a + b < k`, no partner can work for `a`. Otherwise, if any valid pairing exists, suppose it pairs `a` with `b′` and `b` with `a′`. Swap those partners. The new pair `a + b` is valid, and `a′ + b′ >= a + b′ >= k` because `a′ >= a`. Thus pairing the smallest with the largest preserves feasibility.

Repeat this argument for the remaining entries. Both arrays are sorted in place; the algorithm returns only whether all pairs qualify.

```javascript
function canPermute(A, B, k) {
  A.sort((a, b) => a - b);
  B.sort((a, b) => b - a);
  return A.every((a, i) => a + B[i] >= k);
}
```

**Time:** O(n log n) | **Space:** O(n) as a conservative bound including JavaScript sorting workspace; the pairing scan itself uses O(1) extra space.
