Given a nonempty singly linked list and an integer `n`, remove exactly the **nth node from the end**, counting from `1`, and return the new head.

The last node is position `1` from the end. If `n` equals the list length, remove the head. The input guarantees a valid `n`.

Remove by position, not by value. Keep every other original node in its original order without changing values or creating replacement nodes. Return `null` when removing the only node.

For `[1, 2, 3, 4, 5]` and `n = 2`, remove node `4` to obtain `[1, 2, 3, 5]`. Your function receives nodes with `val` and `next` properties; examples show value arrays.

**Follow-up:** Solve it in one forward pass using constant extra space.
