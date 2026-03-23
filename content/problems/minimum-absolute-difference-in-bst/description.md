You get the root of a **binary search tree** (BST). Among all pairs of distinct nodes, consider the absolute difference of their values. Return the **minimum** such difference.

In a BST, an inorder traversal visits values in sorted order. The minimum gap often occurs between two consecutive values in that order, but your answer must be correct for the whole tree.

**Example 1**

- Input: `root = [4, 2, 6, 1, 3]`
- Output: `1` (e.g. `|3 - 4|` or `|2 - 1|`)

**Example 2**

- Input: `root = [1, 0, 48, null, null, 12, 49]`
- Output: `1` (e.g. `|48 - 49|`)

**Constraints**

- The tree has between `2` and `10^4` nodes
- `0 <= Node.val <= 10^5`
