Each entry in `jobs` is `[start, end, profit]`. Choose a subset of jobs with no overlapping time intervals and return the largest possible total profit. The jobs may be given in any order.

**Touching endpoints are allowed:** a job ending at time `t` is compatible with a job starting at time `t`. You must take a selected job in full, and each job can be selected at most once. Different entries may have identical times; overlapping jobs cannot both be selected.

Return the profit only, not the chosen jobs. For the first example, the best selection is:

| Start | End | Profit |
| --- | --- | --- |
| 1 | 2 | 50 |
| 2 | 100 | 200 |

These jobs meet at time `2`, giving `250` total profit. Taking the shorter intermediate jobs would earn less.
