Use a monotonic stack that stores bar indices in increasing height order. When a shorter bar is encountered, pop the stack and compute the area using the popped bar's height as the rectangle height, with width determined by the current index and the new stack top.

```javascript
function largestRectangleArea(heights) {
  const stack = [];
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] > h) {
      const height = heights[stack.pop()];
      const width = stack.length ? i - stack[stack.length - 1] - 1 : i;
      maxArea = Math.max(maxArea, height * width);
    }
    stack.push(i);
  }

  return maxArea;
}
```

**Time:** O(n)
**Space:** O(n)
