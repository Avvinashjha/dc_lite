## Backtracking with Pruning

Fix digits from left to right. If the current digit is already the largest in its suffix, keep it without spending a swap. Otherwise, place that largest digit here. When it appears more than once, try every occurrence: the displaced digit can change the best suffix.

Track the best complete string. Stop as soon as it equals all digits sorted in descending order, the global upper bound. Memoize each arrangement and prefix position with the largest remaining swap budget already explored; a revisit with no more swaps cannot improve the result.

```javascript
function findMaximumNum(num, k) {
  const digits = [...num];
  const target = [...num].sort().reverse().join('');
  const seen = new Map();
  let best = num;

  function search(index, remaining) {
    const current = digits.join('');
    if (current > best) best = current;
    if (best === target || remaining === 0 || index === digits.length) return;

    const key = index + ':' + current;
    if ((seen.get(key) ?? -1) >= remaining) return;
    seen.set(key, remaining);

    let largest = digits[index];
    for (let i = index + 1; i < digits.length; i++) {
      if (digits[i] > largest) largest = digits[i];
    }
    if (largest === digits[index]) {
      search(index + 1, remaining);
      return;
    }

    for (let i = digits.length - 1; i > index; i--) {
      if (digits[i] !== largest) continue;
      [digits[index], digits[i]] = [digits[i], digits[index]];
      search(index + 1, remaining - 1);
      [digits[index], digits[i]] = [digits[i], digits[index]];
      if (best === target) return;
    }
  }

  search(0, k);
  return best;
}
```

**Time:** Exponential in the worst case. If `C` recursive calls are made, scanning, string construction, and map-key work cost O(nC), plus O(n log n) to form the target. Memoization and the upper bound prune repeated or already optimal searches; they do not make the problem polynomial.

**Space:** O(nS + n), where `S` is the number of memoized states. Each stored key contains the full arrangement, and recursion depth is at most `n`.
