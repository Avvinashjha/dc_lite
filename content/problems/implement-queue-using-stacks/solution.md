## Approach: Two Stacks (Amortized)

Use an input stack for pushes and an output stack for pops. When the output stack is empty and a pop/peek is needed, transfer all elements from the input stack to the output stack, reversing the order. This gives amortized O(1) per operation.

```javascript
function implementQueueUsingStacks() {
  const inStack = [], outStack = [];
  return {
    push(x) { inStack.push(x); },
    pop() {
      if (!outStack.length) while (inStack.length) outStack.push(inStack.pop());
      return outStack.pop();
    },
    peek() {
      if (!outStack.length) while (inStack.length) outStack.push(inStack.pop());
      return outStack[outStack.length - 1];
    },
    empty() { return !inStack.length && !outStack.length; }
  };
}
```

**Time Complexity:** Amortized O(1) per operation

**Space Complexity:** O(n)
