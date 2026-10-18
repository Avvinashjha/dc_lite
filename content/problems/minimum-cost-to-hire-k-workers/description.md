You're given two arrays, `quality` and `wage`, describing a pool of workers, plus a target headcount `k`. Form a group of exactly `k` workers while paying as little in total as possible. Within the hired group, pay must stay proportional to each worker's quality score, and no one can be paid less than the minimum wage they listed.

All selected workers must share one pay rate `r`: worker `i` receives `r × quality[i]`, which must be at least `wage[i]`. Payments may be fractional. Return the total cost, not the worker indices or the rate.

For Example 1, hiring workers `0` and `2` at rate `7` pays `70` and `35`, totaling `105`. Paying each person only their requested wage would not necessarily preserve the required proportions.
