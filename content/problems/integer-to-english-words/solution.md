## Chunk by Thousands

```javascript
function numberToWords(num) {
  if (num === 0) return "Zero";
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
    'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const thousands = ['','Thousand','Million','Billion'];
  function helper(n) {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n/10)] + ' ' + helper(n%10);
    return ones[Math.floor(n/100)] + ' Hundred ' + helper(n%100);
  }
  let result = '', i = 0;
  while (num > 0) {
    if (num % 1000 !== 0) result = helper(num % 1000) + thousands[i] + ' ' + result;
    num = Math.floor(num / 1000); i++;
  }
  return result.trim();
}
```

**Time:** O(1) | **Space:** O(1)
