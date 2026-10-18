## Two Pointers

At each position, water depth is min(left maximum, right maximum) minus the bar height. The two-pointer scan resolves the side with the lower current boundary: the opposite side already provides a sufficient wall, so the resolved side's running maximum determines its contribution. Move inward after accounting for that position.

Keep the running maximum before subtracting the current height, ensuring each contribution is nonnegative. Each pointer only moves inward, so every position is handled at most once.

```javascript
function trap(height) {
  let left = 0, right = height.length - 1;
  let leftMax = 0, rightMax = 0, water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}
```

**Time:** O(n) | **Space:** O(1)
