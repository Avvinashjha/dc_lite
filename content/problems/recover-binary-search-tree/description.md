Exactly two **node values** in a binary search tree were swapped by mistake. Restore the valid BST by swapping those values back.

All values are distinct. Keep every original node and its left/right child links unchanged; only the misplaced values should change. Modify the tree in place. The function's return value is ignored.

Inorder traversal of a valid BST visits values in strictly increasing order. The swapped nodes may be adjacent or far apart in that traversal, and one may be the root.

For `root = [3, 1, 4, null, null, 2]`, swapping values `3` and `2` restores `[2, 1, 4, null, null, 3]` without changing the tree's shape.

Examples use level-order arrays with `null` for missing children. Your function receives nodes with `val`, `left`, and `right` properties.
