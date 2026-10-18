Given an array `pre` containing a valid preorder traversal of a binary search tree with distinct values, reconstruct that tree and return its root.

Preorder visits each node **before its left subtree, then its right subtree**. In this BST, every value in a node's left subtree is smaller and every value in its right subtree is larger. These rules determine one tree for the supplied traversal.

Create nodes with `val`, `left`, and `right` properties, using `null` for missing children. Return the root node, not an array. The editor displays the result in level order and trims trailing `null` entries.

For `pre = [8, 5, 1, 7, 10, 12]`, the root is `8`. Its left subtree has root `5` with children `1` and `7`; its right subtree has root `10` with right child `12`.
