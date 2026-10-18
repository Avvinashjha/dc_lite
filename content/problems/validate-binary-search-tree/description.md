You're given the root of a binary tree. Determine whether it satisfies the binary search tree property: every node's value must be strictly greater than all values in its left subtree and strictly less than all values in its right subtree, not merely compared against its immediate children.

Values must be strictly ordered, so duplicate values are not allowed anywhere in a valid BST. Return a boolean.

The editor passes `root` as a node object with `val`, `left`, and `right` properties. Example arrays are level-order representations; `null` marks a missing child.
