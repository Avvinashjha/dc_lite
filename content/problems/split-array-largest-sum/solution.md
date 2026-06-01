## Binary Search on Answer

```javascript
function splitArray(nums, k) {
  let lo = Math.max(...nums), hi = nums.reduce((a,b)=>a+b,0);
  while (lo < hi) {
    const mid = (lo+hi)>>1;
    let splits = 1, sum = 0;
    for (const n of nums) { if (sum+n>mid) { splits++; sum=n; } else sum+=n; }
    if (splits <= k) hi = mid; else lo = mid+1;
  }
  return lo;
}
```

**Time:** O(n log S) | **Space:** O(1)
