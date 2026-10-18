## Compare Differences from the Minimum

Subtracting the same value from every element does not affect whether they are equal. After each allowed move, conceptually subtract one from all elements: the chosen n - 1 elements stay unchanged and the excluded element decreases by one.

In that equivalent process, the highest possible common target is the original minimum. Each value needs value - minimum decrements, so sum those differences. This is an argument about relative values; the actual allowed moves still only increment elements.

```javascript
function minMoves(nums) {
  let minimum = nums[0];
  for (const value of nums) minimum = Math.min(minimum, value);
  let moves = 0;
  for (const value of nums) moves += value - minimum;
  return moves;
}
```

Use a loop instead of spreading the array into Math.min, avoiding JavaScript engine argument-count limits. The maximum result under these bounds is below 2 × 10^14, within the exact integer range of Number.

**Time:** O(n) | **Space:** O(1)
