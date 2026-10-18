## Binary Search on Answer

Search between the largest individual value and the sum of all values. For a candidate limit, greedily extend the current subarray until the next value would exceed the limit, then start a new subarray. Because values are nonnegative, this uses the fewest groups possible under that limit.

If at most k groups are needed, the limit is feasible: any group can be split further until there are exactly k nonempty groups, without increasing any sum. Feasibility is monotonic, so binary search finds the smallest limit.

```javascript
function splitArray(nums, k) {
  let lo = Math.max(...nums), hi = nums.reduce((a,b)=>a+b,0);
  while (lo < hi) {
    const mid = Math.floor(lo + (hi-lo)/2);
    let splits = 1, sum = 0;
    for (const n of nums) { if (sum+n>mid) { splits++; sum=n; } else sum+=n; }
    if (splits <= k) hi = mid; else lo = mid+1;
  }
  return lo;
}
```

**Time:** O(n log(S + 1)), where S is the total sum | **Space:** O(1)
