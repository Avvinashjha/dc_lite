## Approach 1: Frequency count (O(n) time, O(1) space for 26 letters)

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  return count.every(c => c === 0);
}
```

Or use a plain object / `Map` for character counts if you prefer not to assume lowercase a–z.

## Approach 2: Sort

```javascript
function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const as = [...s].sort().join("");
  const bs = [...t].sort().join("");
  return as === bs;
}
```

**Time:** O(n log n) &nbsp; **Space:** O(n) for the arrays (or O(log n) stack for sort depending on engine).

## Approach 3: Single pass with one map (increment for s, decrement for t)

Same asymptotics as Approach 1; good when the alphabet is not fixed.
