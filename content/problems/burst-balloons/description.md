You're given `n` balloons lined up in a row, each labeled with a number in the array `nums`. Bursting balloon `i` earns `nums[i-1] * nums[i] * nums[i+1]` coins, where the two neighbors are whatever balloons currently remain adjacent to it (treat positions just past either end as holding an implicit `1`). Burst all the balloons, choosing the order that maximizes total coins collected, and return that maximum.

**Example:** nums = [3,1,5,8] → Output: 167
