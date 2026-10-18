Design an iterator over a binary search tree that walks its values in ascending order. It should expose `next()`, which returns the next-smallest value each time it's called, and `hasNext()`, which reports whether any values remain — with `next()` running in amortized O(1) time and `hasNext()` in O(1) time while using only O(h) extra memory, where `h` is the tree's height.

`hasNext()` must not advance the iterator. Calls to `next()` occur only when `hasNext()` is true.
