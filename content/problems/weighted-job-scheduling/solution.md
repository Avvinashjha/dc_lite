## DP + Binary Search

```javascript
function maxProfit(jobs) {
  jobs.sort((a,b)=>a[1]-b[1]);
  const n = jobs.length, dp = Array(n).fill(0);
  dp[0] = jobs[0][2];
  function findLast(i) {
    let lo=0, hi=i-1, res=-1;
    while (lo<=hi) {
      const mid=(lo+hi)>>1;
      if (jobs[mid][1]<=jobs[i][0]) { res=mid; lo=mid+1; } else hi=mid-1;
    }
    return res;
  }
  for (let i=1;i<n;i++) {
    let incl = jobs[i][2];
    const l = findLast(i);
    if (l!==-1) incl += dp[l];
    dp[i] = Math.max(dp[i-1], incl);
  }
  return dp[n-1];
}
```

**Time:** O(n log n) | **Space:** O(n)
