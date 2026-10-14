Design a collection that supports three operations — `insert`, `remove`, and `getRandom` — each running in average O(1) time, with the twist that the same value is allowed to appear in the collection more than once.

insert(val) returns true only for a value not already present; remove(val) returns true if one occurrence was removed. getRandom() is called only when non-empty and samples uniformly among stored occurrences, so duplicate values have proportionally greater probability.
