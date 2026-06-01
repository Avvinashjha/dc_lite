Design and implement a data structure for a Least Recently Used (LRU) cache. It should support `get(key)` which returns the value if the key exists (otherwise -1), and `put(key, value)` which inserts or updates the key-value pair. When the cache reaches its capacity, it should invalidate the least recently used item before inserting a new item. Both operations must run in O(1) time.

**Example:**
```
capacity=2: put(1,1), put(2,2), get(1)->1, put(3,3), get(2)->-1
```
