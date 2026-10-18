## Count, Then Filter

Scan every character and increment its frequency. Do not normalize letter case or trim spaces: the contract treats each printable ASCII character separately.

In a second pass over the frequency entries, copy only counts greater than one to the result. This reports each repeated character exactly once with its full count. An empty input or all-distinct input naturally produces an empty object.

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
**Space:** O(k), where k is the number of distinct characters, including the result. Under the printable ASCII constraint, k is at most 95, so space is bounded independently of input length.
