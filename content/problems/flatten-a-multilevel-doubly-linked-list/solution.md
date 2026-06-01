## Approach: Iterative with Stack

Traverse the list. When a node has a child, push its next onto a stack, then splice the child list in as the new next. When reaching a node with no next and the stack is non-empty, pop and continue from there.

```javascript
function flattenAMultilevelDoublyLinkedList(head) {
  if (!head) return null;
  let curr = head;
  const stack = [];
  while (curr) {
    if (curr.child) {
      if (curr.next) stack.push(curr.next);
      curr.next = curr.child;
      curr.next.prev = curr;
      curr.child = null;
    }
    if (!curr.next && stack.length) {
      const next = stack.pop();
      curr.next = next;
      next.prev = curr;
    }
    curr = curr.next;
  }
  return head;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(n) for the stack
