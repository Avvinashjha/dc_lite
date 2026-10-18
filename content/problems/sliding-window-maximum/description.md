Given an integer array `nums` and a window size `k`, return the maximum of every contiguous window of exactly `k` elements.

Move the window one position to the right each time. Return the maxima in window order, producing exactly `nums.length - k + 1` values. Equal values count normally, and all values may be negative.

For `nums = [4,1,3,2]` and `k = 2`:

| Window | Maximum |
| --- | --- |
| [4, 1] | 4 |
| [1, 3] | 3 |
| [3, 2] | 3 |

The result is `[4,3,3]`.
