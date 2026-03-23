The first half of row n mirrors row n-1, and the second half is its complement. If k is in the first half, recurse with the same k. If k is in the second half, recurse with k minus the half-size and flip the result.

```javascript
function kthGrammar(n, k) {
  if (n === 1) return 0;
  const half = Math.pow(2, n - 2);
  if (k <= half) {
    return kthGrammar(n - 1, k);
  } else {
    return kthGrammar(n - 1, k - half) ^ 1;
  }
}
```

**Time:** O(n)
**Space:** O(n) for recursion stack
