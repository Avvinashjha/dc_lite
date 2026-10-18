You're given two arrays, `nums1` and `nums2`, where every element of `nums1` also appears somewhere in `nums2`. For each value in `nums1`, locate that same value's position in `nums2` and find the first element to its right that is larger — this is its "next greater element." If no larger element follows it in `nums2`, use `-1` instead.

“Next” means the first qualifying position to the right in `nums2`, not the smallest larger value. For query `1` in `[1,5,2]`, the answer is `5`, not `2`. Do not wrap around or search to the left. Return answers in `nums1` order.
