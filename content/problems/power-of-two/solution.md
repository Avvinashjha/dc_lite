## Bit Manipulation

```javascript
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
```

**Time:** O(1) | **Space:** O(1)
