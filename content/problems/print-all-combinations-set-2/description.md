You're given an array of `n` elements and a target size `r`. List every combination of `r` elements drawn from the array, always moving forward through the array (no revisiting earlier positions) preserving the original index order inside each combination. The input need not be sorted; equal values at different indices are separate choices.

**Edge cases:** With `r = 0`, the only valid combination is the empty one. If `r > n`, no combination is possible. If `r = n`, the entire array is the sole combination.
