## Stack-Based Parsing

Use stacks to track multiplier and current string at each nesting level.

```javascript
function decodeString(s) {
  const numStack = [], strStack = [];
  let curr = '', num = 0;
  for (const c of s) {
    if (c >= '0' && c <= '9') num = num * 10 + (c - '0');
    else if (c === '[') { numStack.push(num); strStack.push(curr); num = 0; curr = ''; }
    else if (c === ']') { curr = strStack.pop() + curr.repeat(numStack.pop()); }
    else curr += c;
  }
  return curr;
}
```

**Time:** O(n + W), where W is the total number of characters copied while building intermediate strings. A conservative worst-case bound is O(n × L) for encoded length n and decoded length L; nested groups may copy the same expanded text more than once.
**Space:** O(n + L) for the stacks and live strings, including output.
