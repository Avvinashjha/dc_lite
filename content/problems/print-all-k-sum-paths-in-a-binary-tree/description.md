Given a binary tree `root` and an integer `k`, return every nonempty downward path whose node values sum to `k`.

A path starts at any node and follows consecutive parent-to-child links to any descendant, including that same node. It need not start at the root or end at a leaf, but it cannot move upward, skip nodes, or cross between branches.

Return each path as values in ancestor-to-descendant order. Different node paths count separately even if their value arrays are identical. Paths may overlap, and negative or zero values are allowed. Return `[]` when none match; do not print the paths.

For `root = [1, 2, 3]` and `k = 3`, return `[[1, 2], [3]]`. For `root = [1, 1, 1]` and `k = 1`, return `[[1], [1], [1]]`, one for each node.

Examples use level-order arrays with `null` for missing children. Your function receives nodes with `val`, `left`, and `right` properties.
