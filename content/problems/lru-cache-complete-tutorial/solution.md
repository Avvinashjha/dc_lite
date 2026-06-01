## Approach: HashMap + Ordered Map

Use a Map which maintains insertion order in JavaScript. On get/put, delete and re-insert the key to move it to the end (most recent). On capacity overflow, delete the first key (least recent).

```javascript
function lruCacheCompleteTutorial(capacity) {
  const cache = new Map();
  return {
    get(key) {
      if (!cache.has(key)) return -1;
      const val = cache.get(key);
      cache.delete(key);
      cache.set(key, val);
      return val;
    },
    put(key, value) {
      cache.delete(key);
      cache.set(key, value);
      if (cache.size > capacity) cache.delete(cache.keys().next().value);
    }
  };
}
```

**Time Complexity:** O(1) per operation

**Space Complexity:** O(capacity)
