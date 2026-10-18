You get the roots of two binary trees. Build a merged tree as follows. Start from both roots. If both nodes exist at the same position, the merged node’s value is the sum of the two values. If only one side exists, that node is used as in that tree. Return the root of the merged tree.

You may reuse nodes from the inputs instead of building a completely separate tree, if you prefer.

Match nodes by their position from the root (the same sequence of left/right steps), not by value or traversal order. A subtree present in only one input is kept in full. If both trees are empty, return `null`.

For `t1 = [1,2]` and `t2 = [3,null,4]`, the roots sum to `4`; the left `2` and right `4` are retained, giving `[4,2,4]`.
