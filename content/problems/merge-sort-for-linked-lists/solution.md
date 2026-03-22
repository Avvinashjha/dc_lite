## Approach: Recursive Merge Sort

Split the array in half, recursively sort both halves, then merge them using two pointers. This mirrors the linked list approach where you split with slow/fast pointers and merge sorted sublists.

```javascript
function mergeSortForLinkedLists(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortForLinkedLists(arr.slice(0, mid));
  const right = mergeSortForLinkedLists(arr.slice(mid));
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length)
    result.push(left[i] <= right[j] ? left[i++] : right[j++]);
  return result.concat(left.slice(i), right.slice(j));
}
```

**Time Complexity:** O(n log n)

**Space Complexity:** O(n)
