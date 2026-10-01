Build a data structure that implements a Least Recently Used (LRU) cache. It needs two operations: `get(key)`, which returns the stored value for that key or `-1` if the key isn't present, and `put(key, value)`, which adds a new key-value pair or updates an existing one. Once the cache is full, inserting a fresh key must first evict whichever entry was used least recently. Both `get` and `put` are expected to run in constant, O(1) time.

**Example:**
```
capacity=2: put(1,1), put(2,2), get(1)->1, put(3,3), get(2)->-1
```
