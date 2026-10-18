Boyer-Moore Voting Algorithm. Maintain a candidate and a counter. Walk through the array: if the counter is zero, pick the current element as the new candidate. Increment the counter when the element matches the candidate, decrement otherwise. The majority element always survives because it appears more than half the time.

Think of each decrement as cancelling a pair of different values. Removing such a pair cannot eliminate the strict majority among the remaining elements. The surviving candidate is therefore the answer. The existence guarantee matters: without it, a second pass would be needed to verify the candidate's frequency.

```javascript
function majorityElement(nums) {
  let candidate = nums[0];
  let count = 0;

  for (const num of nums) {
    if (count === 0) candidate = num;
    count += (num === candidate) ? 1 : -1;
  }

  return candidate;
}
```

**Time:** O(n) — single pass.
**Space:** O(1) — only two variables.
