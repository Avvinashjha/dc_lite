## Approach: Floyd's Cycle Detection

Treat each value as a pointer to the next index. Because there's a duplicate, following these pointers creates a cycle — exactly like a linked list with a loop. Use a slow and fast pointer to detect the cycle, then find the entrance. Index 0 cannot belong to the cycle because no value points to 0. The cycle entrance has two incoming links on this walk, so its index is the duplicated value.

For `[1,3,4,2,2]`, the index walk is `0 → 1 → 3 → 2 → 4 → 2 → …`; the cycle starts at `2`. Reset the slow pointer to index `0`, then move both pointers one step at a time to find that entrance.

```javascript
function findDuplicate(nums) {
  let slow = nums[0];
  let fast = nums[nums[0]];

  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[nums[fast]];
  }

  slow = 0;
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(1)
