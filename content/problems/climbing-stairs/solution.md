## Approach 1: Naive recursion (don't submit — it times out)

```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}
```

**Time:** O(2^n) &nbsp; **Space:** O(n) stack

Each call branches into two, and subproblems are recomputed many times. Writing this version is still valuable — it builds the recursive intuition we will optimize next.

## Approach 2: Memoized recursion (top-down DP)

Cache each `f(k)` the first time it is computed, so every subproblem is solved exactly once.

```javascript
function climbStairs(n, memo = new Map()) {
  if (n <= 2) return n;
  if (memo.has(n)) return memo.get(n);

  const result = climbStairs(n - 1, memo) + climbStairs(n - 2, memo);
  memo.set(n, result);
  return result;
}
```

**Time:** O(n) &nbsp; **Space:** O(n)

## Approach 3: Iterative with O(1) space (bottom-up DP)

We only ever need the last two values:

```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) [a, b] = [b, a + b];
  return b;
}
```

**Time:** O(n) &nbsp; **Space:** O(1)

This is the canonical answer in interviews. It also mirrors how you would rewrite any "looks-like-Fibonacci" recurrence once you've seen the memoization version.
