You're given an array `arr`, and each of its values becomes a leaf of a binary tree, placed left to right so that reading the leaves in order reproduces `arr`. Every internal node's value equals the product of the largest leaf in its left subtree and the largest leaf in its right subtree. Build the tree so that the total value stored across the internal (non-leaf) nodes is as small as possible, and return that minimum sum.

Every internal node has exactly two children.

Return only the minimum sum; the leaf values themselves do not contribute to it. The internal-node rule uses the **largest leaf** in each child subtree, not the child root’s value. Leaf order must remain unchanged.

For `[6,2,4]`, combine leaves `2` and `4` under an internal node worth `8`. The root is worth `6 × 4 = 24`, so the total is `8 + 24 = 32`.
