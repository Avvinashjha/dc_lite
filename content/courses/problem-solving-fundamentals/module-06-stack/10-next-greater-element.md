# Next Greater Element

**LeetCode 496.** You have two arrays `nums1` and `nums2`, where `nums1` is a **subset** of `nums2`. For each value in `nums1`, find the **next greater element to its right** in `nums2`. Return `-1` if none exists.

This is the canonical monotonic-stack warm-up. We'll solve the subset variant from LC 496 **and** the core primitive "next greater on an array" — the latter generalizes to many later problems.

## Step 1 — the core primitive

```javascript
function nextGreater(nums) {
  const n = nums.length;
  const ans = new Array(n).fill(-1);
  const stack = [];   // indices, values decreasing

  for (let i = 0; i < n; i++) {
    while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
      const j = stack.pop();
      ans[j] = nums[i];
    }
    stack.push(i);
  }
  return ans;
}
```

This is the template from the previous lesson. It runs in **O(n)** time using **O(n)** space.

## Step 2 — LC 496 with a hash map

LC 496 asks about **specific** values from `nums1`, not positions in `nums2`. The approach:

1. Run `nextGreater` on `nums2`.
2. Build a map from **value → next greater** for every value in `nums2` (the problem guarantees the values are unique in `nums2`, so this is well-defined).
3. For each value in `nums1`, look it up in the map.

```javascript
function nextGreaterElement(nums1, nums2) {
  const n2 = nums2.length;
  const nextGreater = new Map();
  const stack = [];

  for (let i = 0; i < n2; i++) {
    while (stack.length > 0 && stack[stack.length - 1] < nums2[i]) {
      nextGreater.set(stack.pop(), nums2[i]);
    }
    stack.push(nums2[i]);
  }

  return nums1.map(x => nextGreater.has(x) ? nextGreater.get(x) : -1);
}
```

Because the values in `nums2` are unique, we can store **values** on the stack directly (not indices) and use them as map keys. That keeps the code tight.

## Walkthrough

```text
nums2 = [4, 1, 2, 5, 3]

i=0 val=4  stack empty                  push 4    stack=[4]
i=1 val=1  1 < 4, push 1                push 1    stack=[4, 1]
i=2 val=2  2 > 1 pop 1, map: 1 -> 2
           2 < 4, push 2                push 2    stack=[4, 2]
i=3 val=5  5 > 2 pop 2, map: 2 -> 5
           5 > 4 pop 4, map: 4 -> 5
                                         push 5    stack=[5]
i=4 val=3  3 < 5, push 3                push 3    stack=[5, 3]

end: 5 and 3 have no next greater -> not in map -> answer -1

map = { 1:2, 2:5, 4:5 }

nums1 = [4, 1, 2]  ->  [5, 2, 5]
nums1 = [2, 4]     ->  [5, 5]
nums1 = [5]        ->  [-1]
```

## Complexity

- **Time:** O(n + m) where `n = nums2.length` and `m = nums1.length`. The monotonic stack runs in O(n); the final `map` over `nums1` runs in O(m).
- **Space:** O(n) for the stack and the map.

## Variants worth knowing

- **Circular next greater (LC 503).** Treat the array as circular — wrap around once. Implement by iterating `i` from `0` to `2n - 1` and using `nums[i % n]`.
- **Next greater with duplicates.** Use indices (not values) on the stack and keep the condition strict `<`; ties won't trigger premature popping.
- **Previous greater / smaller.** Iterate right-to-left, or record answers on **push** instead of pop.

## Why the brute force is O(n * m)

For each of the `m` queries, you could scan `nums2` from the right of the target until you find something greater. Worst case that's `O(n)` per query → `O(n * m)` overall. For `n = m = 10^5`, that's 10^10 operations — far too slow. The monotonic stack is a huge win.

## Common bugs

1. **Storing duplicate values as keys** when `nums2` might have duplicates. Use indices in that case.
2. **Using `<=` in the while condition** for strict "greater" — it will incorrectly pop equal values.
3. **Forgetting the `-1` default** for values with no next greater.

:::quiz
question: Why is the monotonic-stack solution O(n + m) rather than O(n · m)?
options:
  - Each element in nums2 is pushed and popped at most once; the nums1 loop is O(m).
  - Because JavaScript Maps are O(1).
answer: 0
explanation: The amortized analysis limits the monotonic-stack work to O(n), and the lookup phase is linear in nums1.
:::

:::quiz
question: Why is it safe to push values (not indices) onto the stack in LC 496?
options:
  - Because nums2 is guaranteed to have unique values; each value maps unambiguously to one next-greater.
  - Because we don't need the index for anything.
answer: 0
explanation: Without uniqueness, multiple positions with the same value would collide in the map.
:::

:::quiz
question: For input `nums2 = [4, 1, 2, 5, 3]` what is the map (value → next greater) produced by the monotonic pass?
options:
  - { 1:2, 2:5, 4:5 }
  - { 4:5, 5:3, 1:2 }
answer: 0
explanation: 5 and 3 have no next greater; 4 finds 5, 2 finds 5, 1 finds 2.
:::

:::exercise
title: Implement nextGreaterElement
description: Implement `nextGreaterElement(nums1, nums2)` using a monotonic stack and a value-to-nextGreater map.
starterCode: |
  function nextGreaterElement(nums1, nums2) {
    const stack = [];
    const map = new Map();
    // pass over nums2 with a monotonic decreasing stack
    return nums1.map(x => map.has(x) ? map.get(x) : -1);
  }

  console.log(nextGreaterElement([4, 1, 2], [1, 3, 4, 2]));   // [-1, 3, -1]
  console.log(nextGreaterElement([2, 4], [1, 2, 3, 4]));      // [3, -1]
:::

## Practice

No dedicated practice folder for this exact problem in the repo. The next lesson (Daily Temperatures) applies the same pattern to an index-based version and has a dedicated problem page.
