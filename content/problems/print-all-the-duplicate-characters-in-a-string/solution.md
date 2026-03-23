Count each character's frequency using a hash map in a single pass. Then filter for characters with a count greater than one.

```javascript
function findDuplicates(str) {
  const freq = {};
  for (const ch of str) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  const duplicates = {};
  for (const [ch, count] of Object.entries(freq)) {
    if (count > 1) {
      duplicates[ch] = count;
    }
  }
  return duplicates;
}
```

**Time:** O(n) — single pass to count, single pass to filter.
**Space:** O(k) where k is the number of distinct characters.
