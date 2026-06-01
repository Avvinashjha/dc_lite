## Hash Map with Sorted Key

```javascript
function groupAnagrams(words) {
  const map = new Map();
  for (const w of words) {
    const key = w.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(w);
  }
  return [...map.values()];
}
```

**Time:** O(n × k log k) | **Space:** O(n × k)
