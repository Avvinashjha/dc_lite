Given a binary search tree `root` and an integer `key`, return `[predecessorNode, successorNode]`:

- The predecessor is the original node with the largest value **strictly less than** `key`.
- The successor is the original node with the smallest value **strictly greater than** `key`.

Use `null` for either missing neighbor. The key does not need to occur in the tree. If it does occur, that node cannot be its own predecessor or successor. Return node references, not numbers or new nodes, and leave the tree unchanged.

For the first example, `65` is absent but lies between `60` and `70`, so those nodes are returned. The editor displays their values as `[60, 70]`.

Input examples use level-order arrays with `null` for missing children. Your function receives nodes with `val`, `left`, and `right` properties.
