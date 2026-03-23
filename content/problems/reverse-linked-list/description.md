You get the head of a singly linked list. Reverse the links so the former last node becomes the head. Return the new head.

Do it by changing `next` pointers. You may solve it iteratively or recursively.

**Example 1**

- Input: `head = [1, 2, 3, 4, 5]`
- Output: `[5, 4, 3, 2, 1]`

**Example 2**

- Input: `head = [1, 2]`
- Output: `[2, 1]`

**Example 3**

- Input: `head = []`
- Output: `[]`

**Constraints**

- The list has between `0` and `5000` nodes
- `-5000 <= Node.val <= 5000`
