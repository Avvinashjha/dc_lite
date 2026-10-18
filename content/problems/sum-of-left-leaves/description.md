You're given the root of a binary tree. A **leaf** is any node without children. A node counts as a **left leaf** only if it's a leaf *and* it's the left child of its parent. Add up the values of every left leaf in the tree and return the total — `0` if there aren't any.

The root has no parent and never counts as a left leaf, even when it is the only node. A left child with any children is not a leaf. Count qualifying leaves anywhere in the tree, including inside a right subtree; values may be negative.
