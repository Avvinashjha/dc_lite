# Practical lab: Your first Java program

A café needs a receipt printer.

## Your challenge

Print a second line containing Total: 120 after the coffee count.

## Environment

Save the example as Receipt.java, then run javac Receipt.java and java Receipt. You can also paste the class into JShell and call Receipt.main(new String[0]).

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] The original coffee line remains first.
- [ ] The second line is exactly Total: 120.
- [ ] Compile and run Receipt.java from a terminal.

<details>
<summary>Show a hint</summary>

Add another println inside main, after the existing one.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
System.out.println("Total: 120");
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `fundamentals/` for this stage. Run `./mvnw -pl fundamentals test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-fundamentals/module-01-first-program/03-module-quiz) · [Try independent public practice](/quiz/java-first-program-practice) · [See the full path](/courses/java)
