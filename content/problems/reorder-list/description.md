Given a nonempty singly linked list with nodes `L0 → L1 → … → Ln`, reorder its original nodes in place as:

`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`

Alternate from the front and back of the original list, using every node exactly once. The labels identify node positions, not values. Rewire `next` pointers without changing node values or creating replacement nodes. End the list with `null` and use constant extra space.

For `[1, 2, 3, 4]`, produce `[1, 4, 2, 3]`. For `[1, 2, 3, 4, 5]`, produce `[1, 5, 2, 4, 3]`; the middle node appears once at the end.

Your function receives nodes with `val` and `next` properties. Modify the list starting at the original head; the function's return value is ignored.
