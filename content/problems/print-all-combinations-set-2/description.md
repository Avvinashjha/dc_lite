Given an array `arr` and an integer `r`, return every way to choose `r` distinct indices in increasing order, displaying the selected values for each choice.

Keep the input's relative order within each combination. The array need not be sorted, and you must not reorder it. Equal values at different indices are separate choices, so identical value arrays may appear more than once in the result.

For `arr = [2, 1, 2]` and `r = 2`, return `[[2, 1], [2, 2], [1, 2]]`. For `[1, 1, 1]` and `r = 2`, return `[[1, 1], [1, 1], [1, 1]]`: the three index pairs are distinct.

Return `[[]]` when `r = 0`, and `[]` when `r` exceeds the array length. Otherwise include every valid combination once per index choice. The outer result may be in any order; return it rather than printing it.
