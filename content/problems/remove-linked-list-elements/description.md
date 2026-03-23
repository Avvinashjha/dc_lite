You get the head of a singly linked list and an integer `val`. Delete every node whose value equals `val`. Return the head of the new list (which may differ from the original head if the first nodes are removed).

Keep relative order for the nodes you keep.

**Example 1**

- Input: `head = [1, 2, 6, 3, 4, 5, 6]`, `val = 6`
- Output: `[1, 2, 3, 4, 5]`

**Example 2**

- Input: `head = []`, `val = 1`
- Output: `[]`

**Example 3**

- Input: `head = [7, 7, 7, 7]`, `val = 7`
- Output: `[]`

**Constraints**

- The list has between `0` and `10^4` nodes
- `1 <= Node.val <= 50`
- `0 <= val <= 50`
