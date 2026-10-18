Given an absolute Unix-style path, return its canonical form using these rules:

- An exact `.` segment means the current directory and is ignored.
- An exact `..` segment removes the last directory, if one exists. You cannot move above the root.
- Repeated slashes act as one separator.
- Every other segment is a literal directory name. For example, `...`, `..hidden`, and `a..b` are ordinary names.

The result starts with exactly one slash, uses one slash between directory names, and has no trailing slash unless it is the root `/`. Preserve the spelling and case of directory names. This is a string-processing task; no filesystem access or symbolic-link resolution is needed.
