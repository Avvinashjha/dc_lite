You're given a `rows x cols` matrix made up of the characters `'0'` and `'1'`. Find the biggest rectangular region made entirely of `'1'`s and return its area. A useful way to think about this: each row can act as the base of a histogram built from consecutive `1`s stacked above it, turning the problem into a 2D version of finding the largest rectangle in a histogram.

**Example:**
```
Input: matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]
Output: 6
```
