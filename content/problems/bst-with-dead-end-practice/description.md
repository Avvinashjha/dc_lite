Given a binary search tree of distinct positive integers, determine whether it contains a **dead end**: a leaf below which no new distinct positive integer can be inserted while preserving the BST ordering.

The allowed values below a leaf are bounded by its ancestors and by the minimum value 1. For example, in a tree with root 2 and left child 1, the leaf 1 is a dead end: nothing lies below 1, and no integer lies strictly between 1 and 2.
