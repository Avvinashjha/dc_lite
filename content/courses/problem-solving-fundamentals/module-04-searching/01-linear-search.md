# Linear Search

**Linear search** walks an array from start to end (or end to start), comparing each element to what you are looking for. It is the simplest search strategy — **O(n)** time, **O(1)** extra space — and sometimes the only correct option.

## Basic pattern

```javascript
function linearSearch(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === target) return i;
  }
  return -1;
}
```

```text
nums = [3, 1, 4, 1, 5]
target = 4

 i: 0   1   2   3   4
    [3,  1,  4,  1,  5]
                 ^
            found at index 2
```

## When linear search is required

- The collection is **not sorted** and you cannot preprocess it.
- You need the **first** occurrence in raw order and cannot sort without breaking semantics.
- Data is a **stream** or **linked list** without random access by index in O(1).

## Early exit

Stop as soon as you find the target — average case can be better than n checks, worst case still O(n).

## Linear vs binary (preview)

If the array is **sorted** and you only need membership or position, **binary search** cuts time to **O(log n)**. Linear search does not assume order — that is both its weakness and its generality.

:::quiz
question: Worst-case time to find a target with linear search in an array of length n is...
options:
  - O(1)
  - O(log n)
  - O(n)
  - O(n²)
answer: 2
explanation: In the worst case you inspect every element once — linear time.
:::

:::quiz
question: Linear search is always slower than binary search for any array.
options:
  - True
  - False — binary search requires sorted data; unsorted data may need linear scan or a hash map, not binary search on raw order.
answer: 1
explanation: Binary search only applies when monotonic order or a similar structure holds. On unsorted arrays, binary search on indices is invalid.
:::

:::quiz
question: Space complexity of iterative linear search excluding the input array is...
options:
  - O(n)
  - O(1)
  - O(log n)
answer: 1
explanation: Only a few index variables — constant extra space.
:::

:::exercise
title: Last occurrence
description: Write `lastLinearSearch(nums, target)` returning the **last** index where `nums[i] === target`, or -1 if none. Use a single forward loop; update a running answer whenever you see a match.
starterCode: |
  function lastLinearSearch(nums, target) {
    let last = -1;
    // ...
    return last;
  }

  console.log(lastLinearSearch([1, 2, 2, 2, 3], 2)); // 3
:::

## Practice

- [Two Sum](/problems/two-sum) — compare the O(n²) nested loop (linear scans) with a hash map.
