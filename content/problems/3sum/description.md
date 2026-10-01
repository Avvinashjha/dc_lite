You're given an integer array `nums`. Find every triplet of values `[nums[i], nums[j], nums[k]]` drawn from three distinct indices `i`, `j`, and `k` where the three values sum to zero, and return all such triplets.

The same triplet of values should never show up twice in the result, even if it can be built from more than one combination of indices.

**Example 1:**

```
Input: nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
Explanation:
  nums[0] + nums[1] + nums[2] = (-1) + 0 + 1 = 0.
  nums[0] + nums[3] + nums[4] = (-1) + 2 + (-1) = 0. (Note: reordered as [-1,-1,2])
  The distinct triplets are [-1,-1,2] and [-1,0,1].
```

**Example 2:**

```
Input: nums = [0,1,1]
Output: []
Explanation: No triplet in this array sums to 0.
```

**Example 3:**

```
Input: nums = [0,0,0]
Output: [[0,0,0]]
Explanation: The one available triplet happens to sum to 0.
```
