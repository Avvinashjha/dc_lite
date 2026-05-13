## Approach 1: Recursion

A power of two, halved, is also a power of two — until we reach `1`. Any odd number greater than `1` is not a power of two.

```javascript
function isPowerOfTwo(n) {
  if (n <= 0) return false;
  if (n === 1) return true;
  if (n % 2 !== 0) return false;
  return isPowerOfTwo(n / 2);
}
```

**Time:** O(log n) &nbsp; **Space:** O(log n) stack

## Approach 2: Bit manipulation (O(1))

Every power of two has exactly one bit set in its binary representation. `n & (n - 1)` clears the lowest set bit — so for a power of two, the result is `0`.

```javascript
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
```

**Time:** O(1) &nbsp; **Space:** O(1)

## Approach 3: Iterative division

```javascript
function isPowerOfTwo(n) {
  if (n <= 0) return false;
  while (n % 2 === 0) n /= 2;
  return n === 1;
}
```

**Time:** O(log n) &nbsp; **Space:** O(1)
