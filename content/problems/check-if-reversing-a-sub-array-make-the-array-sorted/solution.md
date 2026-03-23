## Find Unsorted Window

Find the first and last position where the array deviates, check if reversing makes it sorted.

```javascript
function canSortByReversing(arr) {
  const n = arr.length;
  let i = 0;
  while (i < n - 1 && arr[i] <= arr[i+1]) i++;
  if (i === n - 1) return true;
  let j = n - 1;
  while (j > 0 && arr[j] >= arr[j-1]) j--;
  const reversed = [...arr.slice(0, i), ...arr.slice(i, j+1).reverse(), ...arr.slice(j+1)];
  for (let k = 0; k < n - 1; k++) if (reversed[k] > reversed[k+1]) return false;
  return true;
}
```

**Time:** O(n) | **Space:** O(n)
