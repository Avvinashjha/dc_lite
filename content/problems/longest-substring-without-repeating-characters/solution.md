## Approach: Sliding window with last-seen index

Keep a window `[left, right]` that has all unique characters. Store the **last index** of each character. When `s[right]` was seen inside the current window, jump `left` to `lastIndex + 1`.

```javascript
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}
```

**Time:** O(n) — each index is visited by `right` once; `left` only moves forward.  
**Space:** O(min(n, alphabet)) for the map.

## Alternative: Sliding window with a Set

Expand `right`, add `s[right]` to a set. While duplicate, remove `s[left]` and increment `left`. Track max window size.

**Time:** O(n) amortized — each character enters and leaves the window at most once.

## Edge cases

- Empty string → `0`.
- All unique → answer is `s.length`.
- `"abba"`-style cases require updating `left` to **after** the previous occurrence of the duplicate, not only `right - 1`.
