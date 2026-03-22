## Two Stacks (Amortized O(1))

```javascript
class MyQueue {
  constructor() { this.s1 = []; this.s2 = []; }
  push(x) { this.s1.push(x); }
  pop() { this._move(); return this.s2.pop(); }
  peek() { this._move(); return this.s2[this.s2.length - 1]; }
  empty() { return !this.s1.length && !this.s2.length; }
  _move() { if (!this.s2.length) while (this.s1.length) this.s2.push(this.s1.pop()); }
}
```

**Time:** O(1) amortized | **Space:** O(n)
