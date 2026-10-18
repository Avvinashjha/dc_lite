Given two equal-length arrays, `keys` and `freq`, construct a binary search tree containing every key exactly once. The keys are distinct and already sorted in increasing order; `freq[i]` is the search frequency of `keys[i]`.

A key's search cost is its frequency multiplied by its **level**, with the root at level `1`, its children at level `2`, and so on. The total cost is the sum over all keys. Only searches for the supplied keys contribute to the cost; there are no costs for unsuccessful searches.

Choose a tree shape that preserves the binary search tree ordering and minimizes the total cost. Return that minimum cost, not the tree. Keys with zero frequency must still be included.

For `keys = [10, 12, 20]` and `freq = [34, 8, 50]`, an optimal tree has root `20`, its left child `10`, and `10`'s right child `12`. Its cost is `50 × 1 + 34 × 2 + 8 × 3 = 142`.
