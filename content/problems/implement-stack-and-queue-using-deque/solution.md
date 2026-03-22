## Deque Wrapper

```javascript
class Deque {
  constructor() { this.items = []; }
  pushFront(x) { this.items.unshift(x); }
  pushBack(x) { this.items.push(x); }
  popFront() { return this.items.shift(); }
  popBack() { return this.items.pop(); }
  peekFront() { return this.items[0]; }
  peekBack() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}
// Stack: pushBack + popBack
// Queue: pushBack + popFront
```

**Time:** O(1) for all operations (with linked list) | **Space:** O(n)
