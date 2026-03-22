## Bit-by-Bit Addition

Traverse both strings from right to left, adding corresponding digits along with any carry.

```javascript
function addBinary(a, b) {
  let i = a.length - 1, j = b.length - 1, carry = 0, result = '';
  while (i >= 0 || j >= 0 || carry) {
    let sum = carry;
    if (i >= 0) sum += parseInt(a[i--]);
    if (j >= 0) sum += parseInt(b[j--]);
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }
  return result;
}
```

**Time:** O(max(m, n)) | **Space:** O(max(m, n))
