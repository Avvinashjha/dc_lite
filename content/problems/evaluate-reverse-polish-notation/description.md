You're given an arithmetic expression written in Reverse Polish (postfix) Notation as a list of `tokens`. Compute its value, where the supported operators are `+`, `-`, `*`, and `/`, and division between two integers truncates toward zero rather than rounding down.

Each operator applies to the two preceding results: pop the right operand first, then the left. For example, `["3", "7", "-"]` means `3 - 7`, and `["-7", "3", "/"]` evaluates to `-2`. The expression is valid and never divides by zero.
