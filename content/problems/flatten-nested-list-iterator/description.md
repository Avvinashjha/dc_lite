You're given a nested list where each entry is either a plain integer or another nested list, which may itself contain integers or further nested lists to any depth. Implement `NestedIterator` with `hasNext()` and `next()` to traverse the integers lazily in left-to-right order. Call `next()` only when `hasNext()` is true. The editor drains the iterator into an array for comparison.

Empty nested lists contribute no values. Repeated `hasNext()` calls must not advance past an integer. The input remains unchanged while the iterator is in use.
