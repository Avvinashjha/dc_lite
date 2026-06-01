## Stack with Lazy Flattening

```javascript
class NestedIterator {
  constructor(nestedList) { this.stack = [...nestedList].reverse(); }
  hasNext() {
    while (this.stack.length) {
      const top = this.stack[this.stack.length - 1];
      if (typeof top === 'number') return true;
      this.stack.pop();
      for (let i = top.length - 1; i >= 0; i--) this.stack.push(top[i]);
    }
    return false;
  }
  next() { return this.stack.pop(); }
}
```

**Time:** O(1) amortized | **Space:** O(n)
