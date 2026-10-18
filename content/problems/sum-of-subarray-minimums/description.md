For every **nonempty contiguous subarray** of `arr`, find its minimum value. Return the sum of all those minimums modulo `1,000,000,007`.

Count subarrays by their start and end indices. Equal-valued subarrays at different positions count separately, and overlapping subarrays also count. This asks for the sum of minimum values, not the number of subarrays.

For `[2,2]`, the two singleton subarrays and the full subarray each contribute 2, giving `6`.
