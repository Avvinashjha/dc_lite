Sliding window with two pointers. Build a frequency map for `t`. Expand the right pointer until the window satisfies all requirements, then shrink from the left to find the tightest valid window. Track how many distinct characters are fully satisfied to avoid recounting the entire map each step.

```javascript
function minWindow(s, t) {
  if (t.length > s.length) return '';

  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  let have = 0;
  const required = need.size;
  const window = new Map();
  let minLen = Infinity;
  let minStart = 0;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    window.set(ch, (window.get(ch) || 0) + 1);

    if (need.has(ch) && window.get(ch) === need.get(ch)) {
      have++;
    }

    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        minStart = left;
      }
      const leftCh = s[left];
      window.set(leftCh, window.get(leftCh) - 1);
      if (need.has(leftCh) && window.get(leftCh) < need.get(leftCh)) {
        have--;
      }
      left++;
    }
  }

  return minLen === Infinity ? '' : s.substring(minStart, minStart + minLen);
}
```

**Time:** O(|s| + |t|) — each pointer traverses the string at most once.
**Space:** O(|s| + |t|) for the hash maps.
