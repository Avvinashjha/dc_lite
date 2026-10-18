## Approach: Hash Map and Doubly Linked List

Map each key to its list node. Keep the least recently used entry next to a head sentinel and the most recently used entry next to a tail sentinel. A successful read or update unlinks its node and appends it before the tail. For a new key, append a node; if capacity is exceeded, remove the node after the head and delete its map entry.

Sentinels keep empty-list and endpoint operations uniform. Unlinking and appending use a fixed number of pointer changes; no list scan or array shift is needed.

```javascript
function createLRUCache(capacity) {
  const entries = new Map();
  const head = { next: null };
  const tail = { prev: head };
  head.next = tail;

  function unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  function append(node) {
    node.prev = tail.prev;
    node.next = tail;
    tail.prev.next = node;
    tail.prev = node;
  }

  return {
    get(key) {
      const node = entries.get(key);
      if (!node) return -1;
      unlink(node);
      append(node);
      return node.value;
    },
    put(key, value) {
      let node = entries.get(key);
      if (node) {
        node.value = value;
        unlink(node);
      } else {
        node = { key, value, prev: null, next: null };
        entries.set(key, node);
      }
      append(node);
      if (entries.size > capacity) {
        const oldest = head.next;
        unlink(oldest);
        entries.delete(oldest.key);
      }
    },
  };
}
```

**Time Complexity:** O(1) average per operation, assuming average O(1) hash-map access.

**Space Complexity:** O(capacity) for the map and list.
