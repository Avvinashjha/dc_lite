Modify a nonempty singly linked list so its values follow the pattern:

`a0 <= a1 >= a2 <= a3 >= a4 …`

The first comparison must be `<=`, and subsequent comparisons alternate. Equality is allowed. Preserve the number of nodes and every value's occurrence count. Swapping node values is permitted; the task does not require preserving their original positions.

Change the list starting at the original head. The function's return value is ignored. Any final ordering that meets the pattern is accepted, even if it differs from the displayed example.

For `[3, 2, 1]`, `[2, 3, 1]` is valid. A one-node list already qualifies. Your function receives nodes with `val` and `next` properties; examples display their values as arrays.
