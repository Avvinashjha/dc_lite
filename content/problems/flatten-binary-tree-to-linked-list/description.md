Rearrange the original binary-tree nodes in place into a chain following **preorder**: visit the root, then its left subtree, then its right subtree.

Set every `left` pointer to `null` and use `right` pointers to connect consecutive nodes. Preserve node values. The final node’s `right` pointer is `null`. An empty tree stays empty.

The runner checks the original root after the function finishes; returning a separate tree does not satisfy the task.
