Use a sliding window approach. Maintain a count of characters in the current window. If the window size minus the largest character frequency seen so far exceeds `k`, shrink the window from the left.

`maxFreq` is a historical maximum, not necessarily the current window's maximum after shrinking. This is safe when finding only the best length: a stale count can retain a window of an already achievable size, but cannot establish a larger record until a sufficiently large frequency is reached again. Do not use this window directly to return the actual substring without validating its current counts.

```javascript
function characterReplacement(s, k) {
  const count = {};
  let left = 0, maxFreq = 0, result = 0;

  for (let right = 0; right < s.length; right++) {
    count[s[right]] = (count[s[right]] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[s[right]]);

    while ((right - left + 1) - maxFreq > k) {
      count[s[left]]--;
      left++;
    }

    result = Math.max(result, right - left + 1);
  }

  return result;
}
```

**Time:** O(n)
**Space:** O(1) — at most 26 character counts
