## Approach: Copy and Skip

Since we cannot access the previous node, we copy the value of the next node into the current node, then point the current node's next pointer to skip the next node. This effectively deletes the given node from the list.

```javascript
function givenOnlyAPointerReferenceToANodeToBeDeletedInASinglyLinkedListHowDoYouDeleteIt(node) {
  node.val = node.next.val;
  node.next = node.next.next;
}
```

**Time Complexity:** O(1)

**Space Complexity:** O(1)
