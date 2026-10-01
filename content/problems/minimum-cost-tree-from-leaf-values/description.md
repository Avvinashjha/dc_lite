You're given an array `arr`, and each of its values becomes a leaf of a binary tree, placed left to right so that reading the leaves in order reproduces `arr`. Every internal node's value equals the product of the largest leaf in its left subtree and the largest leaf in its right subtree. Build the tree so that the total value stored across the internal (non-leaf) nodes is as small as possible, and return that minimum sum.

**Example:** For `arr = [6, 2, 4]`, the lowest possible sum of internal node values is `32`.
