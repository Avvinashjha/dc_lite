A frog is crossing a river. The river is divided into units and at each unit there may or may not be a stone. Given an array `stones` of stone positions in sorted ascending order, the frog starts at stone 0 and its first jump must be 1 unit. If the last jump was `k` units, the next jump must be `k-1`, `k`, or `k+1` units. The frog can only jump forward. Determine if the frog can reach the last stone.

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
