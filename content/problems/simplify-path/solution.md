Split the path by `"/"` and process each component using a stack. Skip empty strings and `"."`. For `".."`, pop the stack (if non-empty). Everything else gets pushed. Join the remaining stack elements with `"/"` at the end.

```javascript
function simplifyPath(path) {
  const stack = [];
  const parts = path.split('/');

  for (const part of parts) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  return '/' + stack.join('/');
}
```

**Time:** O(n) where n is the length of the path string.
**Space:** O(n) for the stack in the worst case.
