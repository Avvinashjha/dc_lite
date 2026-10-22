# Practical lab: Values, types, and expressions

A grocery store calculates basket totals.

## Your challenge

Calculate the cost of four apples and reject a negative quantity before multiplication.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Four apples cost 5000 paise.
- [ ] A negative quantity raises IllegalArgumentException.
- [ ] Zero apples cost zero.

<details>
<summary>Show a hint</summary>

An if statement can guard the calculation; use the control-flow module if it is new.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
int apples = 4;
if (apples < 0) throw new IllegalArgumentException("Negative quantity");
System.out.println(apples * 1250);
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-02-values-and-types/03-module-quiz) · [Try independent public practice](/quiz/java-values-and-types-practice) · [See the full path](/courses/java)
