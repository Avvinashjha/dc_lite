You have a rod of length `n` and three allowed cut lengths `x`, `y`, and `z`. Cut the rod into as many pieces as possible where every piece measures exactly `x`, `y`, or `z`, using up the rod with nothing left over. If there's no way to cut the whole rod into pieces of these lengths, return 0.

Each allowed length may be used any number of times; you do not have to use all three. The lengths may be equal. Count **pieces**, not the number of cuts: a rod used as one allowed-length piece returns `1`.

For `n = 7` and lengths `2, 3, 5`, choose `2 + 2 + 3` to get three pieces. Repeatedly taking the smallest length alone would leave an unusable remainder.
