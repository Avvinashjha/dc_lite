Imagine standing at position `location` on a 2D plane, given an array of `points` and a viewing `angle` in degrees. Find the largest number of points that can fit inside your field of view at once. Any point sitting exactly at your own location is always counted as visible and doesn't take up any of your viewing angle.

**Example 1:**
```
Input: points = [[2,1],[2,2],[3,3]], angle = 90, location = [1,1]
Output: 3
Explanation: All three points fall within a 90° field of view.
```

**Example 2:**
```
Input: points = [[2,1],[2,2],[3,4],[1,1]], angle = 90, location = [1,1]
Output: 4
Explanation: [1,1] is at the location itself (always counted), plus the other 3 fit in the 90° window.
```

**Edge cases:** Points overlapping the location. `angle = 360` means all points are visible. All points at the same angle from the location.
