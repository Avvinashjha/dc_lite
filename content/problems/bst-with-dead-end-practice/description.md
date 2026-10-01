You're given a binary search tree whose values are all positive integers. Determine whether it contains a dead end — a leaf whose value `v` is boxed in on both sides, meaning neither `v - 1` nor `v + 1` (bounded below by `1`) could ever be inserted into the tree without violating the BST property.

**Example:** BST with nodes {8, 5, 2, 7, 11, 1, 3} → true (node 1 is dead end: can't insert 0 or 2)
