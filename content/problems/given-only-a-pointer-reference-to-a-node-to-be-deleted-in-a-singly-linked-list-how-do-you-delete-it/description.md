Suppose you only have a reference to one particular node inside a singly linked list — not the list's head — and you need to remove that exact node from the list. It's guaranteed that the node you're given is not the last one in the list. Since you can't reach the preceding node, delete it by overwriting its value with the following node's value and then linking past that following node.

**Example:**
```
Input: list = [4,5,1,9], node = 5
Output: [4,1,9]
```
