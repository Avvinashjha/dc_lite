# Spring Boot and REST APIs

**Real-life problem:** Expose the expense tracker as a REST service.

**You will learn:** Spring Boot, dependency injection, and configuration; Controllers, services, and DTOs; REST semantics, validation, and error responses; Pagination and API contracts.

## Chapter 1: Spring Boot, dependency injection, and configuration

Generate a Maven project with Spring Initializr, Java 25, and the current stable Spring Boot release compatible with it. Select Spring Web and Validation. Commit the wrapper and dependency versions. Constructor injection makes collaborators explicit and lets unit tests supply substitutes.

**Follow the working project:** The parent pins Spring Boot 4.0.6 and Java 25. Boot manages compatible dependency versions, so the project does not mix arbitrary Spring versions. Constructor injection exposes required collaborators directly.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/pom.xml`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion><parent><groupId>in.dailycoder</groupId><artifactId>java-course-labs</artifactId><version>1.0.0</version></parent>
  <artifactId>backend</artifactId>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-security</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-flyway</artifactId></dependency>
    <dependency><groupId>org.flywaydb</groupId><artifactId>flyway-database-postgresql</artifactId></dependency>
    <dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>com.h2database</groupId><artifactId>h2</artifactId><scope>runtime</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.security</groupId><artifactId>spring-security-test</artifactId><scope>test</scope></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>
```


</details>

**Observe:** The project starts with explicit web, validation, security, persistence, and test dependencies.

**Your turn:** Which command starts the reference backend?

<details>
<summary>Check your reasoning</summary>

Set the two demo password environment variables described in the README, then run ./mvnw -pl backend spring-boot:run from the archive root.

</details>

## Chapter 2: Controllers, services, and DTOs

A controller translates HTTP into an application call. A service owns business operations. Request and response DTOs define the external contract and keep persistence details private. Keep HTTP concerns out of reusable calculations and avoid returning entities directly.

**Follow the working project:** Request records define allowed fields. Principal supplies authenticated identity; a body field cannot select another owner. The controller’s response DTO excludes the internal owner and database representation.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/ExpenseController.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.net.URI;
import java.time.LocalDate;
import java.time.YearMonth;

@RestController @RequestMapping("/expenses")
class ExpenseController {
    record Create(@NotBlank @Size(max=100) String label, @Positive int amount, @NotNull LocalDate spentOn) {}
    record Update(@NotBlank @Size(max=100) String label, @Positive int amount, @NotNull LocalDate spentOn, @NotNull @PositiveOrZero Long version) {}
    record Total(String month, long paise) {}
    record Delivery(boolean applied) {}
    private final ExpenseService service;
    private final EventDelivery delivery;
    ExpenseController(ExpenseService service, EventDelivery delivery) { this.service = service; this.delivery = delivery; }
    @PostMapping
    ResponseEntity<ExpenseService.View> create(@Valid @RequestBody Create input, Principal identity) {
        var value = service.create(identity.getName(), input.label(), input.amount(), input.spentOn());
        return ResponseEntity.created(URI.create("/expenses/" + value.id())).body(value);
    }
    @GetMapping("/{id}")
    ExpenseService.View get(@PathVariable @Positive long id, Principal identity) { return service.get(id, identity.getName()); }
    @GetMapping
    ExpenseService.Page list(@RequestParam(defaultValue="0") @Min(0) int page, @RequestParam(defaultValue="20") @Min(1) @Max(100) int size, Principal identity) { return service.list(identity.getName(), page, size); }
    @PutMapping("/{id}")
    ExpenseService.View update(@PathVariable @Positive long id, @Valid @RequestBody Update input, Principal identity) { return service.update(id, identity.getName(), input.version(), input.label(), input.amount(), input.spentOn()); }
    @DeleteMapping("/{id}")
    ResponseEntity<Void> delete(@PathVariable @Positive long id, Principal identity) { service.delete(id, identity.getName()); return ResponseEntity.noContent().build(); }
    @GetMapping("/summary")
    Total summary(@RequestParam String month, Principal identity) { return new Total(month, service.total(identity.getName(), YearMonth.parse(month))); }
    @PostMapping("/{id}/notify")
    Delivery notify(@PathVariable @Positive long id, Principal identity) { return new Delivery(delivery.deliver(service.eventId(id, identity.getName()))); }
}
```


</details>

**Observe:** The controller binds DTOs and delegates domain operations to an injected service.

**Your turn:** Why is a controller that directly performs all SQL and calculations hard to test?

<details>
<summary>Check your reasoning</summary>

It mixes transport adaptation, business rules, and persistence. Extract meaningful boundaries so each can be verified independently.

</details>

## Chapter 3: REST semantics, validation, and error responses

GET retrieves, POST can create, PUT replaces at a known URI, and DELETE removes. Return statuses that match outcomes, including 201 for creation and 404 for a missing resource. Validate request DTOs with Jakarta validation and translate failures into consistent ProblemDetail responses.

**Follow the working project:** A consistent error contract lets clients recover appropriately. A successful creation includes 201 and Location. Validation rejects bad DTOs before they reach persistence; authorization still applies independently.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/ApiErrors.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.dao.OptimisticLockingFailureException;
import java.time.format.DateTimeParseException;

@RestControllerAdvice
class ApiErrors {
    @ExceptionHandler(ExpenseService.Missing.class)
    ProblemDetail missing() { return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, "Expense not found"); }
    @ExceptionHandler({ExpenseService.Conflict.class, OptimisticLockingFailureException.class})
    ProblemDetail conflict() { return ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, "The expense changed. Reload before updating."); }
    @ExceptionHandler({MethodArgumentNotValidException.class, HandlerMethodValidationException.class, DateTimeParseException.class})
    ProblemDetail invalid() { return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Check required fields, amounts, dates, and page bounds."); }
}
```


</details>

**Observe:** Missing expenses return 404 and stale updates return 409 with problem details.

**Your turn:** Should a validation error return 200 with a success-looking body?

<details>
<summary>Check your reasoning</summary>

No. Use the documented error status and an informative, non-sensitive error representation.

</details>

## Chapter 4: Pagination and API contracts

Bound collection endpoints with a maximum page size and stable sorting. Document request fields, response shapes, and errors. Treat API changes as compatibility decisions: renaming a public field can break a caller even if all internal tests pass. Start with a modular monolith rather than splitting services before boundaries are understood.

**Follow the working project:** The application selects a DTO shape instead of serializing an arbitrary Page implementation. Stable sorting helps navigation; offset pagination still has consistency tradeoffs when data changes between requests.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/ExpenseService.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
class ExpenseService {
    record View(long id, long version, String label, int amount, LocalDate spentOn) {}
    record Page(List<View> content, int page, int size, long totalElements) {}
    static class Missing extends RuntimeException {}
    static class Conflict extends RuntimeException {}
    private final ExpenseRepository repository;
    private final JdbcTemplate jdbc;
    ExpenseService(ExpenseRepository repository, JdbcTemplate jdbc) { this.repository = repository; this.jdbc = jdbc; }
    private static View view(ExpenseEntity e) { return new View(e.id, e.version, e.label, e.amount, e.spentOn); }
    ExpenseEntity owned(long id, String owner) { return repository.findByIdAndOwner(id, owner).orElseThrow(Missing::new); }

    @Transactional
    public View create(String owner, String label, int amount, LocalDate date) {
        var saved = repository.saveAndFlush(new ExpenseEntity(owner, label, amount, date));
        jdbc.update("INSERT INTO expense_outbox(event_id, expense_id, delivered) VALUES (?, ?, false)", UUID.randomUUID().toString(), saved.id);
        return view(saved);
    }
    @Transactional(readOnly = true)
    public View get(long id, String owner) { return view(owned(id, owner)); }
    @Transactional(readOnly = true)
    public Page list(String owner, int page, int size) {
        var rows = repository.findByOwner(owner, PageRequest.of(page, size, Sort.by(Sort.Order.desc("spentOn"), Sort.Order.desc("id"))));
        return new Page(rows.map(ExpenseService::view).getContent(), page, size, rows.getTotalElements());
    }
    @Transactional
    public View update(long id, String owner, long version, String label, int amount, LocalDate date) {
        var saved = owned(id, owner);
        if (saved.version != version) throw new Conflict();
        saved.label = label.strip(); saved.amount = amount; saved.spentOn = date;
        return view(repository.saveAndFlush(saved));
    }
    @Transactional
    public void delete(long id, String owner) { repository.delete(owned(id, owner)); }
    @Transactional(readOnly = true)
    public long total(String owner, YearMonth month) { return repository.total(owner, month.atDay(1), month.plusMonths(1).atDay(1)); }
    @Transactional(readOnly = true)
    public String eventId(long id, String owner) {
        owned(id, owner);
        return jdbc.queryForObject("SELECT event_id FROM expense_outbox WHERE expense_id = ?", String.class, id);
    }
}
```


</details>

**Observe:** List responses have bounded size and deterministic date/id ordering.

**Your turn:** What happens for page size 101 in this API?

<details>
<summary>Check your reasoning</summary>

The controller rejects it as a 400 request validation error. The maximum is 100, and the default is 20.

</details>

## Predict and explore

Spring Initializr Maven project with Spring Web. Import org.springframework.web.bind.annotation.*; place the controller beneath the @SpringBootApplication package. Run ./mvnw spring-boot:run.

:::learninglab
{
  "title": "Spring Boot and REST APIs",
  "code": "// File: GreetingController.java in the generated Spring project package.\n@RestController\nclass GreetingController {\n  record Greeting(String message) {}\n  @GetMapping(\"/greeting\")\n  Greeting greeting(@RequestParam(defaultValue = \"Java\") String name) {\n    return new Greeting(\"Hello \" + name);\n  }\n}",
  "output": "GET /greeting?name=Ada → 200 {\"message\":\"Hello Ada\"}",
  "steps": [
    {
      "label": "Route",
      "detail": "GET /greeting?name=Ada maps to greeting."
    },
    {
      "label": "Bind",
      "detail": "The request parameter becomes name = Ada."
    },
    {
      "label": "Serialize",
      "detail": "The returned record becomes a JSON response with message = Hello Ada."
    }
  ],
  "prediction": {
    "question": "In the configured Spring project, what response follows GET /greeting?name=Ada?",
    "options": [
      "GET /greeting?name=Ada → 200 {\"message\":\"Hello Ada\"}",
      "GET /greeting?name=Ada → 404",
      "GET /greeting?name=Ada → 200 {\"message\":\"Hello Java\"}",
      "GET /greeting?name=Ada → 201 {\"message\":\"Hello Ada\"}"
    ],
    "answer": 0,
    "explanation": "GET /greeting?name=Ada maps to greeting. The request parameter becomes name = Ada. The returned record becomes a JSON response with message = Hello Ada."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-05-spring-boot-and-rest/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

<details>
<summary>Official references and further reading</summary>

- [Java language, APIs, and JVM learning map](https://dev.java/learn/)
- [Java LTS release roadmap](https://www.oracle.com/technetwork/java/javase/tech/eol-135779.html)
- [Virtual thread adoption guidance](https://inside.java/2023/09/20/virtual-threads-adoption-guide/)
- [Maven project and dependency guides](https://maven.apache.org/guides/)
- [JUnit Jupiter user guide](https://docs.junit.org/6.1.3/overview.html)
- [Spring REST service guide](https://spring.io/guides/gs/rest-service/)
- [Spring Data JPA guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [Spring Boot testing reference](https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html)
- [Spring Boot Java compatibility](https://docs.spring.io/spring-boot/system-requirements.html)

</details>
