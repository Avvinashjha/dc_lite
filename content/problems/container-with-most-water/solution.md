Use two pointers starting at the edges. Compute the area as the distance between pointers times the shorter line's height. Move the pointer pointing to the shorter line inward, since moving the taller one can never increase the area.

```javascript
function maxArea(height) {
  let left = 0, right = height.length - 1;
  let max = 0;

  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    max = Math.max(max, area);
    if (height[left] < height[right]) left++;
    else right--;
  }

  return max;
}
```

**Time:** O(n)
**Space:** O(1)
