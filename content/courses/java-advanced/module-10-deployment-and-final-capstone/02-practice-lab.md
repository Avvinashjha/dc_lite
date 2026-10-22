# Practical lab: Delivery, observability, and final capstone

Operate a secure expense API as a small production-style service.

## Your challenge

Package and document the final API. Run a local container, exercise a complete owner journey, and diagnose one intentional dependency failure.

## Environment

JShell or a Java class. The logger also emits a configured log record; its timestamp, format, and destination depend on the runtime logging configuration.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] CI runs tests and produces a reproducible artifact.
- [ ] Container configuration uses external secrets and a persistent database.
- [ ] Create, read, update, conflict, and cross-user denial paths are demonstrated.
- [ ] Readiness, graceful shutdown, and failure logging are verified.
- [ ] README includes setup, API examples, migrations, restore notes, and limitations.

<details>
<summary>Show a hint</summary>

Use Spring Boot Actuator for configured health/metrics and a small container deployment; do not add Kubernetes solely for this capstone.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```text
// Suggested delivery commands from the completed Maven project:
// ./mvnw verify
// ./mvnw spring-boot:build-image
// Supply database and identity-provider configuration externally.
// Exercise the documented API with an owner identity and a different user.
// Record one failing dependency response and correlate its request id.
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-10-deployment-and-final-capstone/03-module-quiz) · [Try independent public practice](/quiz/java-deployment-and-final-capstone-practice) · [See the full path](/courses/java)
