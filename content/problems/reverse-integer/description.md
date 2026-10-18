Given a signed 32-bit integer `x`, reverse its decimal digits while preserving its sign. Return the reversed integer if it lies within `[-2147483648, 2147483647]`; otherwise return `0`.

Leading zeros in the reversed representation disappear: `120` becomes `21`, and `-120` becomes `-21`. Reversing `0` returns `0`. The minus sign is not a digit and stays at the front.

For `x = 1534236469`, reversal would produce `9646324351`, which exceeds the allowed range, so return `0`.
