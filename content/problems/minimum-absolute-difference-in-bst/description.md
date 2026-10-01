You're handed the root of a **binary search tree** (BST). Look at every possible pair of distinct nodes and compute the absolute difference between their values — return the smallest difference found across all such pairs.

Since an inorder walk of a BST produces values in sorted order, the smallest gap usually turns up between two values that are neighbors in that ordering. Still, your solution needs to hold for the tree as a whole, not just one neighboring pair.

**Example 1**

- Input: `root = [4, 2, 6, 1, 3]`
- Output: `1` (e.g. `|3 - 4|` or `|2 - 1|`)

**Example 2**

- Input: `root = [1, 0, 48, null, null, 12, 49]`
- Output: `1` (e.g. `|48 - 49|`)

**Constraints**

- The tree has between `2` and `10^4` nodes
- `0 <= Node.val <= 10^5`
