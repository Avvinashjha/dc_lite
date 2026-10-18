## Lazy Traversal with List Frames

Keep a stack of lists and their next unread indices. `hasNext()` skips exhausted lists and descends into nested arrays until an integer is ready. It never consumes that integer, so repeated calls are safe. `next()` advances past exactly one integer.

The constructor keeps a reference to the input rather than flattening or copying it. Do not modify the input while iterating.

```javascript
class NestedIterator {
  constructor(nestedList) {
    this.frames = [{ list: nestedList, index: 0 }];
  }

  hasNext() {
    while (this.frames.length) {
      const frame = this.frames[this.frames.length - 1];
      if (frame.index === frame.list.length) {
        this.frames.pop();
        continue;
      }
      const value = frame.list[frame.index];
      if (typeof value === 'number') return true;
      frame.index++;
      this.frames.push({ list: value, index: 0 });
    }
    return false;
  }

  next() {
    if (!this.hasNext()) return undefined;
    const frame = this.frames[this.frames.length - 1];
    return frame.list[frame.index++];
  }
}
```

**Time:** O(1) construction and O(E + C) over a traversal with C method calls, where E counts all integer and nested-list entries. A single call can skip many empty lists, so it is not necessarily O(1) per returned integer.

**Space:** O(D) auxiliary space, where D is the maximum nesting depth; the input is not copied.
