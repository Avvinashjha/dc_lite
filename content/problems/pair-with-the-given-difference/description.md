Given an integer array `arr` and a non-negative target difference `n`, return `true` if there are two **distinct indices** `i` and `j` such that `|arr[i] - arr[j]| = n`. Otherwise, return `false`.

The array is not necessarily sorted. The pair can occur in either order and does not need to be adjacent. Return only whether a pair exists, not the pair itself.

When `n = 0`, two equal values at different indices are required: `[1, 1]` qualifies, but `[1]` does not. In `[5, 20, 3, 2, 50, 80]`, the values `2` and `80` give a difference of `78`.
