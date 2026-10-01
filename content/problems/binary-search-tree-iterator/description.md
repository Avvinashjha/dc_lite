Design an iterator over a binary search tree that walks its values in ascending order. It should expose `next()`, which returns the next-smallest value each time it's called, and `hasNext()`, which reports whether any values remain — both running in average O(1) time while using only O(h) extra memory, where `h` is the tree's height.

**Example:** BST = [7,3,15,null,null,9,20] → next() calls return: 3, 7, 9, 15, 20
