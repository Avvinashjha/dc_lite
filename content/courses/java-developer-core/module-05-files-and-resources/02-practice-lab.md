# Practical lab: Files, NIO, and resource management

The expense tracker exports and imports a local report.

## Your challenge

Export three expenses, read them with a resource-managed line stream, and count nonblank records.

## Environment

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] Three nonblank records count as 3.
- [ ] Adding a blank line does not increase the count.
- [ ] Close the stream and delete the temporary file even on failure.

<details>
<summary>Show a hint</summary>

Filter with line -> !line.isBlank() inside the try-with-resources block.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
try (var lines = java.nio.file.Files.lines(path, java.nio.charset.StandardCharsets.UTF_8)) {
  System.out.println(lines.filter(line -> !line.isBlank()).count());
}
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `developer-core/` for this stage. Run `./mvnw -pl developer-core test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-developer-core/module-05-files-and-resources/03-module-quiz) · [Try independent public practice](/quiz/java-files-and-resources-practice) · [See the full path](/courses/java)
