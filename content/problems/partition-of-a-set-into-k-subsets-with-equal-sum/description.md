Given an array of positive integers `nums` and an integer `k`, return whether all array entries can be divided into exactly `k` nonempty groups with the same sum.

Each entry must belong to exactly one group. Equal values at different indices are separate entries. Groups do not need to be contiguous, and their order does not matter. Return a boolean, not the groups themselves. You may reorder the input array.

For `nums = [4, 3, 2, 3, 5, 2, 1]` and `k = 4`, the groups `[5]`, `[4, 1]`, `[3, 2]`, and `[3, 2]` each sum to `5`, so return `true`.

A total sum divisible by `k` is necessary but not sufficient: `[2, 2, 2]` cannot form two groups of sum `3`.
