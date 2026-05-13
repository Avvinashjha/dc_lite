## Approach 1: Naive recursion

Direct translation of the recurrence.

```javascript
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}
```

**Time:** roughly O(2^n) &nbsp; **Space:** O(n) stack

Every call branches into two, and subproblems like `fib(k)` are recomputed across many branches. This is great for learning, but `fib(40)` already takes seconds.

## Approach 2: Memoized recursion (top-down DP)

Cache each answer the first time it is computed.

```javascript
function fib(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);

  const result = fib(n - 1, memo) + fib(n - 2, memo);
  memo.set(n, result);
  return result;
}
```

**Time:** O(n) &nbsp; **Space:** O(n)

Every distinct subproblem is solved exactly once.

## Approach 3: Iterative with O(1) space (bottom-up DP)

We only ever need the last two values, so we can discard the rest.

```javascript
function fib(n) {
  if (n < 2) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    [prev, curr] = [curr, prev + curr];
  }
  return curr;
}
```

**Time:** O(n) &nbsp; **Space:** O(1)

## Approach 4: Fast doubling (advanced, O(log n))

Using the identities `F(2k) = F(k) * (2*F(k+1) - F(k))` and `F(2k+1) = F(k)^2 + F(k+1)^2`:

```javascript
function fib(n) {
  function helper(k) {
    if (k === 0) return [0, 1];          // [F(k), F(k+1)]
    const [a, b] = helper(k >> 1);
    const c = a * (2n * BigInt(b) - BigInt(a));
    const d = BigInt(a) * BigInt(a) + BigInt(b) * BigInt(b);
    if (k & 1) return [Number(d), Number(c + d)];
    return [Number(c), Number(d)];
  }
  return helper(n)[0];
}
```

**Time:** O(log n) &nbsp; **Space:** O(log n) stack

Useful when `n` is very large (billions). For the constraint `n <= 30`, Approach 3 is more than enough.
