Implement a Least Recently Used (LRU) cache with a fixed positive `capacity`.

- `get(key)` returns the stored value and marks that key as most recently used. If absent, return `-1` without changing recency.
- `put(key, value)` inserts or updates the key and marks it as most recently used. Updating a key does not consume another slot. Return nothing.
- If inserting a new key exceeds capacity, evict the least recently used key.

Both operations should take O(1) average time. Values may be `0`, so a zero value must not be treated as a missing key.

For capacity `2`, this sequence shows the eviction rule:

| Operation | Keys, least → most recent | Result |
| --- | --- | --- |
| `put(1, 10)` | `1` | — |
| `put(2, 20)` | `1, 2` | — |
| `get(1)` | `2, 1` | `10` |
| `put(3, 30)` | `1, 3` | evicts `2` |
