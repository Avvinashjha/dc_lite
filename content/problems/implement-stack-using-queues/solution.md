## Rotate a Single Queue

After enqueuing a new value, rotate the previous values behind it. The newest value is then at the front. The linked queue below supplies constant-time enqueue, dequeue, and front operations; push performs n-1 rotations.

```javascript
function implementStackUsingQueues() {
  let head = null, tail = null, size = 0;
  function enqueue(value) {
    const node = {value, next:null};
    if (tail) tail.next = node; else head = node;
    tail = node; size++;
  }
  function dequeue() {
    const value = head.value; head = head.next; size--;
    if (!head) tail = null;
    return value;
  }
  return {
    push(x) { const oldSize = size; enqueue(x); for(let i=0;i<oldSize;i++)enqueue(dequeue()); },
    pop() { return dequeue(); },
    top() { return head.value; },
    empty() { return size === 0; }
  };
}
```

**Time:** O(n) push, O(1) pop/top/empty | **Space:** O(n)
