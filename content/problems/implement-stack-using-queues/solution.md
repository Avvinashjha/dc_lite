## Approach: Single Queue Rotation

Use a single queue. After pushing a new element, rotate all previous elements behind it by dequeuing and re-enqueuing n-1 elements. This ensures the most recently pushed element is always at the front for O(1) pop and top operations.

```javascript
function implementStackUsingQueues() {
  const queue = [];
  return {
    push(x) {
      queue.push(x);
      for (let i = 0; i < queue.length - 1; i++) queue.push(queue.shift());
    },
    pop() { return queue.shift(); },
    top() { return queue[0]; },
    empty() { return queue.length === 0; }
  };
}
```

**Time Complexity:** O(n) push, O(1) pop/top

**Space Complexity:** O(n)
