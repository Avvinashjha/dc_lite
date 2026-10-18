Construct every structurally distinct binary search tree using each key from `1` through `n` exactly once.

For every node, all values in its left subtree must be smaller and all values in its right subtree must be larger. Left and right positions are distinct. Different insertion sequences that create the same structure count as one tree.

Return an array of **tree-root objects**, not serialized arrays. Each node has `val`, `left`, and `right` properties; a missing child is `null`. The displayed examples use level-order arrays only to show those objects compactly.

Return all valid trees exactly once, in any order. For n = 2, the two possibilities are root 1 with right child 2, and root 2 with left child 1.
