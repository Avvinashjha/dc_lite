## Map Stack and Queue Operations to a Deque

Use an independent deque for each structure. A stack adds and removes at the back; a queue adds at the back and removes at the front. This linked deque keeps all those operations constant-time.

```javascript
function implementStackAndQueueUsingDeque() {
  function deque() {
    let head = null,
      tail = null;
    return {
      addBack(value) {
        const n = { value, prev: tail, next: null };
        if (tail) tail.next = n;
        else head = n;
        tail = n;
      },
      removeBack() {
        if (!tail) return undefined;
        const v = tail.value;
        tail = tail.prev;
        if (tail) tail.next = null;
        else head = null;
        return v;
      },
      removeFront() {
        if (!head) return undefined;
        const v = head.value;
        head = head.next;
        if (head) head.prev = null;
        else tail = null;
        return v;
      },
      front() {
        return head?.value;
      },
      back() {
        return tail?.value;
      },
      empty() {
        return head === null;
      },
    };
  }
  const s = deque(),
    q = deque();
  return {
    stack: {
      push(x) {
        s.addBack(x);
      },
      pop() {
        return s.removeBack();
      },
      peek() {
        return s.back();
      },
      empty() {
        return s.empty();
      },
    },
    queue: {
      enqueue(x) {
        q.addBack(x);
      },
      dequeue() {
        return q.removeFront();
      },
      peek() {
        return q.front();
      },
      empty() {
        return q.empty();
      },
    },
  };
}
```

**Time:** O(1) per operation | **Space:** O(n) for stored elements
