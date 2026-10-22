# Practical lab: Interfaces, abstraction, and modern models

A payment checkout accepts different payment providers.

## Your challenge

Implement a Cash payment with no fee and create a Receipt for an amount of 100.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Cash implements Payment.
- [ ] charge(100) returns 100.
- [ ] The receipt component accessor returns 100.

<details>
<summary>Show a hint</summary>

An interface method implementation must be public.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
class Cash implements Payment {
  public int charge(int amount) { return amount; }
}
Receipt cashReceipt = new Receipt(new Cash().charge(100));
System.out.println(cashReceipt.charged());
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-09-interfaces-and-records/03-module-quiz) · [Try independent public practice](/quiz/java-interfaces-and-records-practice) · [See the full path](/courses/java)
