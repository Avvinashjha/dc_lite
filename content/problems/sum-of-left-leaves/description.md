You're given the root of a binary tree. A **leaf** is any node without children. A node counts as a **left leaf** only if it's a leaf *and* it's the left child of its parent. Add up the values of every left leaf in the tree and return the total — `0` if there aren't any.

Right leaves don't count, and neither does a node whose only child is on the right.

**Example 1**

- Input: `root = [3, 9, 20, null, null, 15, 7]`
- Output: `24` (left leaves `9` and `15` add up to 24)

**Example 2**

- Input: `root = [1]`
- Output: `0` (the root itself isn't anyone's left child)

**Constraints**

- The tree has between `1` and `1000` nodes
- `-1000 <= Node.val <= 1000`
