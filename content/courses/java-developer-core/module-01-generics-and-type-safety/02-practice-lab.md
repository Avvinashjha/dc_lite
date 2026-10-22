# Practical lab: Generics and type safety

A parcel locker stores different kinds of packages safely.

## Your challenge

Write sum(List<? extends Number> values), returning a double, and call it with integer and double lists.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] List.of(1, 2, 3) produces 6.0.
- [ ] List.of(1.5, 2.5) produces 4.0.
- [ ] An empty list produces 0.0.

<details>
<summary>Show a hint</summary>

Use Number.doubleValue() while reading; do not insert values into the producer.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
double sum(java.util.List<? extends Number> values) {
  double total = 0;
  for (Number value : values) total += value.doubleValue();
  return total;
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-01-generics-and-type-safety/03-module-quiz) · [Try independent public practice](/quiz/java-generics-and-type-safety-practice) · [See the full path](/courses/java)
