Taking `k` cards from the ends is equivalent to leaving a contiguous subarray of size `n - k` in the middle. To maximize the points from the `k` cards, minimize the sum of the middle `n - k` cards using a sliding window.

```javascript
function maxScore(cardPoints, k) {
  const n = cardPoints.length;
  const windowSize = n - k;
  let windowSum = 0;

  for (let i = 0; i < windowSize; i++) {
    windowSum += cardPoints[i];
  }

  let minWindowSum = windowSum;
  const totalSum = cardPoints.reduce((a, b) => a + b, 0);

  for (let i = windowSize; i < n; i++) {
    windowSum += cardPoints[i] - cardPoints[i - windowSize];
    minWindowSum = Math.min(minWindowSum, windowSum);
  }

  return totalSum - minWindowSum;
}
```

**Time:** O(n)
**Space:** O(1)
