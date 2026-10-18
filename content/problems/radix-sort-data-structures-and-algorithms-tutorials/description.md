Given an array `arr` of non-negative integers, return its values sorted in nondecreasing numeric order using **radix sort**. Preserve every occurrence of repeated values. You may return a new array or reorder the input.

Process decimal digits from least significant to most significant. Each digit pass must be stable: numbers with equal digits retain their order from the preceding pass. Treat missing higher digits as zero, and continue until the largest number's digits have been processed.

For `[21, 12, 11]`, the ones-digit pass gives `[21, 11, 12]`; the tens-digit pass then gives `[11, 12, 21]`. Keeping `11` before `12` during the second pass preserves the ordering already established by the ones digit.

Zero is a valid value. Return the sorted array rather than printing it; the exercise asks for radix sort rather than a comparison-sort call.
