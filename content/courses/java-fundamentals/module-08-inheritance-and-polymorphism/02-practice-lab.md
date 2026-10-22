# Practical lab: Inheritance and polymorphism

A checkout supports several shipping policies.

## Your challenge

Add FreeShipping as a subtype whose fee is zero, then sum standard and free shipping through Shipping references.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] new FreeShipping().fee() returns 0.
- [ ] A Shipping reference to FreeShipping still returns 0.
- [ ] The standard plus free total is 50.

<details>
<summary>Show a hint</summary>

Override fee with the same parameter list and a compatible return type.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
class FreeShipping extends Shipping {
  @Override int fee() { return 0; }
}
Shipping free = new FreeShipping();
System.out.println(new Shipping().fee() + free.fee());
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-08-inheritance-and-polymorphism/03-module-quiz) · [Try independent public practice](/quiz/java-inheritance-and-polymorphism-practice) · [See the full path](/courses/java)
