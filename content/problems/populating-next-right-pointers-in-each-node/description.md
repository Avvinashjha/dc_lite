Given the root of a **perfect binary tree**, set each node's `next` pointer to the node immediately to its right on the same level. Set the rightmost node's `next` to `null` on every level.

A perfect binary tree has exactly two children at every internal node, and all leaves are at the same depth. All `next` pointers are initially `null`.

Modify the original nodes and return the original root. Preserve their values and left/right child links. An empty tree returns `null`. Use constant extra space.

For `[1, 2, 3, 4, 5, 6, 7]`, the links are `1 → null`, `2 → 3 → null`, and `4 → 5 → 6 → 7 → null`. In particular, `5` must link to `6` even though they have different parents.

The input uses a level-order array. Your function receives nodes with `val`, `left`, `right`, and `next` properties. The displayed output lists each level by following its `next` pointers; return the root, not those arrays.
