## Approach: Greedy

If total gas >= total cost, a solution exists. Track the current tank as you traverse. Whenever the tank goes negative, the start must be after the current station. Reset start to the next station and reset current tank.

```javascript
function gasStation(gas, cost) {
  let totalTank = 0, currTank = 0, start = 0;
  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    totalTank += diff;
    currTank += diff;
    if (currTank < 0) { start = i + 1; currTank = 0; }
  }
  return totalTank >= 0 ? start : -1;
}
```

**Time Complexity:** O(n)

**Space Complexity:** O(1)
