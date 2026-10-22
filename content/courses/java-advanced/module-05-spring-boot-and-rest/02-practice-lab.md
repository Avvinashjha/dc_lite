# Practical lab: Spring Boot and REST APIs

Expose the expense tracker as a REST service.

## Your challenge

Implement POST /expenses and GET /expenses/{id} with constructor-injected service and validated request DTOs.

## Environment

Spring Initializr Maven project with Spring Web. Import org.springframework.web.bind.annotation.*; place the controller beneath the @SpringBootApplication package. Run ./mvnw spring-boot:run.

## Work through it

1. Predict the original example’s result without running it.
2. Reproduce it locally and explain any difference.
3. Make the requested change in small steps.
4. Check each acceptance criterion below; add a failing case before repairing a bug.

## Acceptance criteria

- [ ] POST a valid expense returns 201 and a Location header.
- [ ] GET the returned URI returns the saved DTO.
- [ ] An invalid amount returns a consistent 400 error.
- [ ] An unknown id returns 404.

<details>
<summary>Show a hint</summary>

Start with an in-memory repository; add persistence in the next module. Use ResponseEntity.created and @Valid.

</details>

<details>
<summary>Show the reference approach</summary>

This is the key change or building block; use the acceptance criteria to finish and verify the complete exercise. Project fragments belong in the environment described above.


```java
record CreateExpense(@jakarta.validation.constraints.NotBlank String label,
                     @jakarta.validation.constraints.Positive int amount) {}
// Controller method outline, with an injected service:
// var saved = service.create(request);
// return ResponseEntity.created(URI.create("/expenses/" + saved.id())).body(saved);
```


</details>

## Runnable reference project

[Download all three Java reference projects](/downloads/java-course-labs.zip). Unzip the archive, read its README, and open `backend/` for this stage. Run `./mvnw -pl backend test` from the archive root. The download contains complete applications and tests; the small reference above highlights the relevant idea. For project-specific setup, API requests, persistence, and failure demonstrations, follow the included walkthrough.

## Review your work

Explain how the change satisfies each criterion. Keep the relevant source and tests in your local project. For the capstone, record setup instructions and demonstrate both a successful path and a rejected operation. Lab completion is self-reported; the course quiz checks conceptual understanding.

[Take this module’s course quiz](/courses/java-advanced/module-05-spring-boot-and-rest/03-module-quiz) · [Try independent public practice](/quiz/java-spring-boot-and-rest-practice) · [See the full path](/courses/java)
