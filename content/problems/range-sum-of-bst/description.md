Given a binary search tree `root` and two bounds `low` and `high`, return the sum of every node value in the **inclusive** interval `[low, high]`.

Include both boundary values when present. The bounds need not occur in the tree. Sum qualifying nodes anywhere in the tree, not just along one path, and return `0` when none qualify. Leave the tree unchanged.

For `root = [10, 5, 15, 3, 7, null, 18]`, `low = 7`, and `high = 15`, the qualifying values are `7`, `10`, and `15`, giving `32`.

Examples use level-order arrays with `null` for missing children. Your function receives nodes with `val`, `left`, and `right` properties.
