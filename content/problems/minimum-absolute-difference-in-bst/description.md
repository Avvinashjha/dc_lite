You're handed the root of a **binary search tree** (BST). Look at every possible pair of distinct nodes and compute the absolute difference between their values — return the smallest difference found across all such pairs.

Since an inorder walk of a BST produces values in sorted order, the smallest gap always occurs between two values that are neighbors in that ordering. Still, your solution needs to hold for the tree as a whole, not just one neighboring pair.
