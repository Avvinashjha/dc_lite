## Approach: Floyd's Cycle Detection

Treat each value as a pointer to the next index. Because there's a duplicate, following these pointers creates a cycle — exactly like a linked list with a loop. Use a slow and fast pointer to detect the cycle, then find the entrance.

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
