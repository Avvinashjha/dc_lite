Check whether a given string qualifies as a well-formed number. That covers plain integers (`"42"`), decimal values (`"3.14"`, `".5"`, `"2."`), and numbers written in scientific notation (`"2e10"`, `"3.1E-5"`).

Structurally, a valid number may begin with a `'+'` or `'-'` sign, then a run of digits that can contain at most one decimal point, and may optionally end with an exponent — an `'e'` or `'E'` followed by an optional sign and more digits.
