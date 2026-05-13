## Approach 1: Naive O(n) loop

```javascript
function myPow(x, n) {
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  let result = 1;
  for (let i = 0; i < n; i++) result *= x;
  return result;
}
```

**Time:** O(n) &nbsp; **Space:** O(1)

This times out for `n` close to 2^31.

## Approach 2: Recursive fast power (O(log n))

Key identities:

- `x^n = (x^(n/2))^2` when `n` is even.
- `x^n = x * (x^((n-1)/2))^2` when `n` is odd.
- `x^(-n) = 1 / x^n`.

```javascript
function myPow(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / myPow(x, -n);

  const half = myPow(x, Math.floor(n / 2));
  return n % 2 === 0 ? half * half : half * half * x;
}
```

**Time:** O(log n) &nbsp; **Space:** O(log n) stack

Notice the crucial detail: compute `half` **once**, then square it. A naive `myPow(x, n/2) * myPow(x, n/2)` would still be O(n) because it makes two separate recursive calls for the same subproblem.

## Approach 3: Iterative fast power

Walk the bits of `n` from low to high; whenever a bit is `1`, multiply the answer by the current square of `x`.

```javascript
function myPow(x, n) {
  if (n < 0) {
    x = 1 / x;
    n = -n;
  }
  let result = 1;
  let base = x;
  while (n > 0) {
    if (n & 1) result *= base;
    base *= base;
    n = Math.floor(n / 2);
  }
  return result;
}
```

**Time:** O(log n) &nbsp; **Space:** O(1)

This is the answer most interviewers look for: O(log n) time and constant space, with no recursion on the stack.

## Edge case: n = -2^31

In JavaScript, `-(-2**31)` is safely representable as a double, so the straightforward negation works. In languages with fixed-width 32-bit integers you would need to handle this separately (e.g., `long n = -(long)n`).
