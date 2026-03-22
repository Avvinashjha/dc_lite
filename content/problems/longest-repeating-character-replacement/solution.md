Use a sliding window approach. Maintain a count of characters in the current window. If the window size minus the most frequent character count exceeds `k`, shrink the window from the left.

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
