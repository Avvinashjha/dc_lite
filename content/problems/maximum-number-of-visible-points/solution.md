## Approach: Polar Angles + Sliding Window

Convert each point to its angle relative to the location using `atan2`. Sort the angles, then duplicate the array with +360° to handle the wraparound. Slide a window of size `angle` degrees across the sorted list to find the maximum count. Add points that sit exactly on the location separately since they're always visible.

```javascript
function visiblePoints(points, angle, location) {
  const [lx, ly] = location;
  let atLocation = 0;
  const angles = [];

  for (const [px, py] of points) {
    if (px === lx && py === ly) {
      atLocation++;
    } else {
      angles.push(Math.atan2(py - ly, px - lx) * (180 / Math.PI));
    }
  }

  angles.sort((a, b) => a - b);
  const n = angles.length;
  const doubled = [...angles, ...angles.map(a => a + 360)];

  let max = 0;
  let left = 0;

  for (let right = 0; right < doubled.length; right++) {
    while (doubled[right] - doubled[left] > angle) left++;
    max = Math.max(max, right - left + 1);
  }

  return max + atLocation;
}
```

**Time Complexity:** O(n log n) for sorting

**Space Complexity:** O(n) for the angles array
