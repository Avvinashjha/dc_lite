## Monotonic Deque

Keep indices in decreasing value order. Remove expired indices from the front and smaller values from the back. A head index avoids shifting an array on every removal; periodic compaction keeps storage proportional to the window size.

```javascript
function maxSlidingWindow(nums, k) {
  const deque = [], result = []; let head = 0;
  for (let i = 0; i < nums.length; i++) {
    while (head < deque.length && deque[head] <= i - k) head++;
    while (deque.length > head && nums[deque[deque.length-1]] <= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[head]]);
    if (head >= k) { deque.splice(0,head); head = 0; }
  }
  return result;
}
```

**Time:** O(n) amortized | **Space:** O(k) auxiliary space, excluding output
