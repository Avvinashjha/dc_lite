You're given an integer array `nums` and an integer `k`. Count how many contiguous, non-empty subarrays have a sum that's evenly divisible by `k`.

**Edge cases:** A subarray summing to zero counts, since zero is divisible by any `k`. Watch out for negative numbers — how the remainder is computed can differ across languages.

Count subarrays by their start and end indices. Overlapping subarrays count separately, even when they contain the same values. The empty subarray never counts. For three zeros, all six nonempty subarrays have a sum divisible by any allowed k.
