You get the root of a binary tree. A **leaf** is a node with no children. A **left leaf** is a leaf that is the **left** child of its parent. Return the sum of the values of all left leaves. If there are none, the sum is `0`.

Do not count right leaves. Do not count a node that has only a right child.

**Example 1**

- Input: `root = [3, 9, 20, null, null, 15, 7]`
- Output: `24` (left leaf `9` plus left leaf `15`)

**Example 2**

- Input: `root = [1]`
- Output: `0` (the root is not a left child)

**Constraints**

- The tree has between `1` and `1000` nodes
- `-1000 <= Node.val <= 1000`
