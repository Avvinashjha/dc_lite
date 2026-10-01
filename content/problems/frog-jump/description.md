A frog needs to cross a river that's divided into evenly spaced units, some of which have stones. You're given the positions of the stones as a sorted array `stones`, with the frog beginning on the stone at position 0 and required to make its very first jump exactly 1 unit forward. After a jump of `k` units, its next jump must measure `k-1`, `k`, or `k+1` units, and it can only ever jump forward. Determine whether the frog is able to reach the final stone.

**Example 1:**
```
Input: stones = [0,1,3,5,6,8,12,17]
Output: true
```

**Example 2:**
```
Input: stones = [0,1,2,3,4,8,9,11]
Output: false
```
