# Practical lab: Arrays and problem solving

A weather station summarizes daily temperatures.

## Your challenge

Write maximum(int[] readings) that rejects an empty array and works for all-negative readings.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] {-8, -3, -9} returns -3.
- [ ] {7} returns 7.
- [ ] {} throws IllegalArgumentException.

<details>
<summary>Show a hint</summary>

Check length before reading readings[0].

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
int maximum(int[] readings) {
  if (readings.length == 0) throw new IllegalArgumentException("No readings");
  int max = readings[0];
  for (int value : readings) if (value > max) max = value;
  return max;
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-05-arrays-and-algorithms/03-module-quiz) · [Try independent public practice](/quiz/java-arrays-and-algorithms-practice) · [See the full path](/courses/java)
