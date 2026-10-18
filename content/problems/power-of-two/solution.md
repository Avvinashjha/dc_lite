## Bit Manipulation

A positive power of two has exactly one set bit. Subtracting one clears its lowest set bit and sets every lower bit, so `n & (n - 1)` clears that lowest set bit. The result is zero exactly when there was only one set bit.

For example, `8` is binary `1000`, and `7` is `0111`: their bitwise AND is zero. In contrast, `12 & 11` is binary `1000`, which is nonzero.

The positivity check excludes zero and all negative inputs. `1` qualifies because it is `2^0`. JavaScript bitwise operators use signed 32-bit integers, matching the stated input range; this expression should not be generalized to arbitrary safe integers outside that range.

```javascript
function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}
```

**Time:** O(1) | **Space:** O(1)
