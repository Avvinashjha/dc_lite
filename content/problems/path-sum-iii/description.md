Given a binary tree `root` and an integer `targetSum`, return the number of nonempty downward paths whose node values sum to the target.

A path follows consecutive parent-to-child links. It may start at any node and end at any descendant, including the starting node itself. It cannot move upward, cross between sibling branches, or skip nodes. Different paths may overlap; count each choice of starting and ending nodes separately, even when their values are identical.

Return `0` for an empty tree. Negative and zero values are allowed. For a three-node chain of zeros and target `0`, all six paths count: three single-node paths, two two-node paths, and the entire chain.

In the first example, the three paths summing to `8` are `5 → 3`, `5 → 2 → 1`, and `-3 → 11`.

Examples use level-order arrays with `null` for missing children. Your function receives nodes with `val`, `left`, and `right` properties.
