You're given the head of a singly linked list whose values are already arranged in non-decreasing order. Delete duplicate values so each distinct value remains only once, keeping the list sorted, and return the head of the updated list.

Solve it in place — reuse the existing nodes and simply adjust their pointers rather than building a new list.

**Example 1**

- Input: `head = [1, 1, 2]`
- Output: `[1, 2]`

**Example 2**

- Input: `head = [1, 1, 2, 3, 3]`
- Output: `[1, 2, 3]`

**Constraints**

- The list has between `0` and `300` nodes
- `-100 <= Node.val <= 100`
- The list is sorted in non-decreasing order
