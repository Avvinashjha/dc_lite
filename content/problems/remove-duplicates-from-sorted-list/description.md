Given the head of a singly linked list sorted in nondecreasing order, remove repeated occurrences so that **one node for each distinct value remains**. Return the head of the resulting sorted list, or `null` for an empty input.

Reuse existing nodes and only adjust links; do not create replacement nodes or change their values. Any original node from a run of equal values may be retained. This problem keeps one occurrence of a repeated value rather than deleting the entire run.

For `[1, 1, 2, 3, 3]`, return a list with values `[1, 2, 3]`. For `[2, 2, 2]`, return a single original node with value `2`.

Examples display value arrays, but your function receives nodes with `val` and `next` properties.
