## Approach: Floyd's Tortoise and Hare

Use two pointers: slow moves one step at a time, fast moves two steps. If the list has a cycle, the fast pointer will eventually meet the slow pointer. If fast reaches null, there is no cycle.

```javascript
function linkedListCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(1)
