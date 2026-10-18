Given an array `nums` formed by rotating a strictly increasing array and an integer `target`, return the target's **zero-based index in the given array**, or `-1` if it is absent.

All values are distinct. A rotation moves a prefix to the end without changing the order inside either part: `[0, 1, 2, 4, 5, 6, 7]` can become `[4, 5, 6, 7, 0, 1, 2]`. An unrotated array is also valid.

Use logarithmic time. For the rotated example above, target `0` has index `4`; do not return its position in the originally sorted array or sort the array before searching.
