## Approach: Deque Operations Mapping

For stack: push maps to addBack, pop maps to removeBack. For queue: enqueue maps to addBack, dequeue maps to removeFront. The deque naturally supports both patterns.

```javascript
function implementStackAndQueueUsingDeque() {
  return {
    stack: (() => {
      const d = [];
      return {
        push(x) { d.push(x); },
        pop() { return d.pop(); },
        peek() { return d[d.length - 1]; },
        empty() { return d.length === 0; }
      };
    })(),
    queue: (() => {
      const d = [];
      return {
        enqueue(x) { d.push(x); },
        dequeue() { return d.shift(); },
        peek() { return d[0]; },
        empty() { return d.length === 0; }
      };
    })()
  };
}
```

**Time Complexity:** O(1) for stack operations, O(n) for queue dequeue

**Space Complexity:** O(n)
