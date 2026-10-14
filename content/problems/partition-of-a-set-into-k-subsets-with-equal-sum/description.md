You're given an integer array `nums` and an integer `k`. Work out whether the array can be split into `k` groups, each non-empty, such that every group's elements add up to the same total.

**Edge cases:** When the overall sum doesn't divide evenly by `k`, no valid split exists, so return `false` right away. With `k = 1` the whole array is trivially one group, so the answer is always `true`. If any single element is larger than `totalSum / k`, it can never fit in a group, so a split is impossible.
