## Hash Map with a Sorted Character Key

Sort the characters of each word to form its key. Two words have the same key exactly when every character has the same count, so the key identifies their anagram class.

Append the original word to the array stored for that key. Always append, even if the identical word was already seen: duplicate input entries must remain in the output. Empty strings share the empty key. Finally return the map's group arrays.

Sorting a temporary character array leaves both the original words and their input order untouched.

```javascript
function groupAnagrams(words) {
  const map = new Map();
  for (const w of words) {
    const key = w.split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  }
  return [...map.values()];
}
```

**Time:** O(n × (1 + k log(k + 1))), where n is the number of words and k their maximum length. The additive term accounts for empty strings.

**Space:** O(n × (k + 1)) as an upper bound for stored keys, group references, and temporary character arrays.
