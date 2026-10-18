Given a nonempty singly linked list with nodes `L0 → L1 → … → Ln`, reorder it in place by alternating nodes from the two ends inward:

`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`

These labels identify original node positions, not values. Rewire the original nodes without changing their values or replacing them with copies. Include every node exactly once and end the list with `null`. Use constant extra space.

For `[1, 2, 3, 4, 5]`, the final list is `[1, 5, 2, 4, 3]`; for `[1, 2, 3, 4]`, it is `[1, 4, 2, 3]`. A one-node or two-node list keeps its existing order.

Your function receives nodes with `val` and `next` properties. Modify the list starting at the original head; the function's return value is ignored.
