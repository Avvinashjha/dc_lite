You get the roots of two binary trees. Build a merged tree as follows. Start from both roots. If both nodes exist at the same position, the merged node’s value is the sum of the two values. If only one side exists, that node is used as in that tree. Return the root of the merged tree.

You may reuse nodes from the inputs instead of building a completely separate tree, if you prefer.

**Example 1**

- Input: `root1 = [1, 3, 2, 5]`, `root2 = [2, 1, 3, null, 4, null, 7]`
- Output: `[3, 4, 5, 5, 4, null, 7]` (level-order style; `null` marks missing children)

**Example 2**

- Input: `root1 = [1]`, `root2 = [1, 2]`
- Output: `[2, 2]`

**Constraints**

- Each tree has between `0` and `2000` nodes
- `-10^4 <= Node.val <= 10^4`
