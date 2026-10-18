Given an integer array `nums` sorted in nondecreasing order, modify it **in place** so its first `k` entries contain each distinct value exactly once, in increasing order. Return the integer `k`.

Write into the supplied array using constant extra space. Entries at indices `k` and beyond are ignored; you do not need to remove them or shorten the array. Return only the count, not a new array or an object.

For `[1, 1, 2]`, write `[1, 2]` into the first two positions and return `2`. The editor displays this as `{"k": 2, "nums": [1, 2]}` to show both the return value and the checked prefix.

A one-element array returns `1`. If all values are identical, keep one occurrence in the first position and return `1`.
