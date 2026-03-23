## Two-End Approach

Stack 1 grows from left, Stack 2 grows from right.

```javascript
class TwoStacks {
  constructor(n) { this.arr = new Array(n); this.top1 = -1; this.top2 = n; this.size = n; }
  push1(x) { if (this.top1 < this.top2 - 1) this.arr[++this.top1] = x; }
  push2(x) { if (this.top1 < this.top2 - 1) this.arr[--this.top2] = x; }
  pop1() { return this.top1 >= 0 ? this.arr[this.top1--] : -1; }
  pop2() { return this.top2 < this.size ? this.arr[this.top2++] : -1; }
}
```

**Time:** O(1) | **Space:** O(n)
