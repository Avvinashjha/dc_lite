# Practical lab: Dates, numbers, and text patterns

A booking service schedules visits across time zones.

## Your challenge

Validate a booking code with two uppercase letters, a hyphen, and four digits; divide 100.00 between three people to two decimals.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] AB-1234 matches; AB-12345 does not.
- [ ] Lowercase ab-1234 does not match.
- [ ] The rounded share is 33.33; explicitly note the remaining cent.

<details>
<summary>Show a hint</summary>

Use matches with [A-Z]{2}-[0-9]{4}; equal rounded shares do not always sum to the original.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
System.out.println("AB-1234".matches("[A-Z]{2}-[0-9]{4}"));
var share = new java.math.BigDecimal("100.00").divide(new java.math.BigDecimal("3"), 2, java.math.RoundingMode.HALF_UP);
System.out.println(share);
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-04-dates-numbers-and-patterns/03-module-quiz) · [Try independent public practice](/quiz/java-dates-numbers-and-patterns-practice) · [See the full path](/courses/java)
