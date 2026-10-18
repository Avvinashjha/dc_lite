Partition all entries of `arr` into two groups whose sums have the smallest possible **absolute difference**.

One group must contain exactly `floor(n / 2)` entries; the other contains the remaining entries. For even n the sizes are equal; for odd n they differ by one. Values may be negative, zero, or repeated. Each input position must belong to exactly one group.

Return an object:

- `minDiff`: the minimum absolute difference between the two sums.
- `bestSubset`: the values in an optimal group of size `floor(n / 2)`, not their indices.

Any optimal subset and any ordering of its values are accepted. Respect input multiplicities: a value cannot appear more times than it occurs in `arr`. The other group is implied by the remaining entries. For a one-element input, `bestSubset` is empty.
