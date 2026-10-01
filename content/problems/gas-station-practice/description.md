Imagine `n` gas stations arranged around a circular route, where station `i` provides `gas[i]` units of fuel and it takes `cost[i]` fuel to drive from station `i` onward to the next one. Starting your trip with an empty tank, find a starting station from which you could complete the full loop in one direction; if there's no such station, return `-1`. You can assume that whenever a valid starting point exists, it is the only one.

**Example 1:**
```
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
```

**Example 2:**
```
Input: gas = [2,3,4], cost = [3,4,3]
Output: -1
```
