At a party of `N` people, a *celebrity* is someone whom every other person knows, but who knows no one else themselves. Using a function `knows(a, b)` that tells you whether person `a` knows person `b`, identify the celebrity if one exists, or return `-1` if there isn't one.

People are labeled `0` through `n - 1`. Return that zero-based label. Ignore whether a person knows themselves.

Examples display a matrix where row a, column b is 1 exactly when a knows b. **Your function receives a callable `knows(a, b)`, not the matrix itself.** Knowledge need not be mutual.
