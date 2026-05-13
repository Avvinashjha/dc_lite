## Approach: Map from sorted signature

Anagrams share the same letters, so sorting the letters of each word gives a canonical **signature** string.

```javascript
function groupAnagrams(strs) {
  const m = new Map();
  for (const w of strs) {
    const key = [...w].sort().join("");
    if (!m.has(key)) m.set(key, []);
    m.get(key).push(w);
  }
  const keys = [...m.keys()].sort();
  return keys.map(k =>
    m.get(k).sort((a, b) => a.localeCompare(b))
  );
}
```

**Time:** O(n · L log L) for n words of max length L (sorting each word).  
**Space:** O(n · L) to store strings.

## Alternative: count vector as key

Use a length-26 count array, encode as a string key `"1#0#2#..."` — O(n · L) time without sorting each word, better when L is large.

## Note on LeetCode

On the official judge, inner/outer order of groups does not matter. Here we normalize order so `JSON.stringify` matches the test harness.
