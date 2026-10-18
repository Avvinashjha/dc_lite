You're given an integer array of size `n`. For every window size `w` from 1 up to `n`, look at all contiguous subarrays of that length, take the minimum value within each one, and then report the largest of those minimums. Do this for every window size and return the full set of results.

Return an array in increasing window-size order: index `w - 1` holds the answer for windows of length `w`. Windows are contiguous and may overlap.

For `[2,1,2]`, size-1 windows have minima `2,1,2`, so the first answer is `2`. Both size-2 windows have minimum `1`, and the full array also has minimum `1`. Return `[2,1,1]`.
