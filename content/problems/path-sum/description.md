Given a binary tree `root` and an integer `targetSum`, return `true` if at least one path **from the root to a leaf** has node values summing to `targetSum`. Otherwise, return `false`.

A leaf has no left or right child. Follow parent-to-child links and include both the root and leaf values. A path cannot stop at an internal node or start below the root. Values may be negative or zero.

An empty tree has no root-to-leaf path, so return `false` even when `targetSum = 0`. A single-node tree qualifies exactly when that node's value equals the target.

In the first example, the path `5 → 4 → 11 → 2` ends at a leaf and sums to `22`. For `root = [1, 2]` and `targetSum = 1`, return `false`: the root alone reaches the target but is not a leaf.

Examples use level-order arrays with `null` for missing children. Your function receives nodes with `val`, `left`, and `right` properties.
