# JPA, database migrations, and transactions

**Real-life problem:** Persist the expense API safely under concurrent updates.

**You will learn:** Entities, repositories, and DTO mapping; Relationships, fetch plans, and N+1; Transactions and optimistic locking; Migrations, indexes, and production safety.

## Chapter 1: Entities, repositories, and DTO mapping

Add Spring Data JPA and a PostgreSQL driver to the API project. An entity models persisted identity and lifecycle; a repository handles access. Define id generation explicitly. Use DTO mapping at the service boundary so lazy relationships and internal columns do not leak into JSON.

**Follow the working project:** An entity has persistence identity and lifecycle; it is not the API DTO. A protected no-argument constructor supports JPA. The service maps managed state to a value after persistence operations.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/ExpenseEntity.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity @Table(name = "expenses")
class ExpenseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Version Long version;
    @Column(nullable = false) String owner;
    @Column(nullable = false, length = 100) String label;
    @Column(nullable = false) int amount;
    @Column(name = "spent_on", nullable = false) LocalDate spentOn;
    protected ExpenseEntity() {}
    ExpenseEntity(String owner, String label, int amount, LocalDate spentOn) {
        this.owner = owner; this.label = label.strip(); this.amount = amount; this.spentOn = spentOn;
    }
}
```


</details>

**Observe:** Each expense has generated identity, a version, and validated column mappings.

**Your turn:** Why not use a mutable entity directly as the input to POST?

<details>
<summary>Check your reasoning</summary>

It exposes persistence and security-sensitive fields and can let callers bind state they do not own.

</details>

## Chapter 2: Relationships, fetch plans, and N+1

Map only relationships the application needs and understand their ownership. Lazy associations can trigger many additional queries while iterating. Inspect SQL and choose a fetch join, projection, or entity graph for the use case. Avoid solving N+1 by making every relationship eager.

**Follow the working project:** This capstone intentionally keeps the model flat so it does not need a lazy object graph. When adding categories or line items, inspect SQL and choose a fetch plan; avoid introducing N+1 through DTO mapping.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/ExpenseRepository.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.Optional;

interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
    Optional<ExpenseEntity> findByIdAndOwner(Long id, String owner);
    Page<ExpenseEntity> findByOwner(String owner, Pageable pageable);
    @Query("select coalesce(sum(e.amount), 0) from ExpenseEntity e where e.owner = :owner and e.spentOn >= :from and e.spentOn < :until")
    long total(String owner, LocalDate from, LocalDate until);
}
```


</details>

**Observe:** The list endpoint fetches one page of expenses scoped to an owner.

**Your turn:** How would you detect an N+1 regression after adding a relationship?

<details>
<summary>Check your reasoning</summary>

Exercise a page with several rows, inspect query counts/SQL, and compare a use-case-specific fetch join, projection, or entity graph.

</details>

## Chapter 3: Transactions and optimistic locking

Place a transaction around a complete business operation. Proxy-based @Transactional requires a call through the proxy; self-invocation does not add a new transaction boundary. @Version detects conflicting updates, which callers need to handle explicitly. A transaction does not automatically imply the strongest isolation level.

**Follow the working project:** Calls through the Spring proxy establish the transaction boundary. The version check catches an already stale client value, and @Version protects against a concurrent database write between reading and flushing.

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

**Observe:** Creation writes the expense and its outbox record in one transaction.

**Your turn:** Does the manual version comparison make @Version redundant?

<details>
<summary>Check your reasoning</summary>

No. Another transaction can commit after the comparison. The database version check at flush still protects that race.

</details>

## Chapter 4: Migrations, indexes, and production safety

Use a migration tool such as Flyway to evolve schemas with versioned changes. Keep production schema evolution separate from automatic destructive recreation. Add indexes based on query plans, and test with the same database family used in production. Document rollback or forward-fix choices for data changes.

**Follow the working project:** The same migration is tested on H2 and PostgreSQL. Constraints and indexes are part of the application contract. A deployment needs a compatible migration strategy, including how older application versions behave during a transition.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/resources/db/migration/V1__expense_schema.sql`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```sql
CREATE TABLE expenses (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  version BIGINT NOT NULL DEFAULT 0,
  owner VARCHAR(255) NOT NULL,
  label VARCHAR(100) NOT NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  spent_on DATE NOT NULL
);
CREATE INDEX expenses_owner_date ON expenses(owner, spent_on DESC, id DESC);
CREATE TABLE expense_outbox (
  event_id VARCHAR(36) PRIMARY KEY,
  expense_id BIGINT NOT NULL UNIQUE REFERENCES expenses(id) ON DELETE CASCADE,
  delivered BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE processed_events (
  event_id VARCHAR(36) PRIMARY KEY REFERENCES expense_outbox(event_id) ON DELETE CASCADE
);
CREATE TABLE notifications (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  event_id VARCHAR(36) NOT NULL REFERENCES expense_outbox(event_id) ON DELETE CASCADE,
  expense_id BIGINT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE
);
```


</details>

**Observe:** Flyway applies a versioned schema; Hibernate validates it instead of recreating it.

**Your turn:** Should an already applied V1 migration be edited to rename a live column?

<details>
<summary>Check your reasoning</summary>

No. Add a new migration with an intentional transition. Editing history can cause checksum failures and does not safely evolve an existing database.

</details>

## Predict and explore

Extend the previous Spring API project with Spring Data JPA, PostgreSQL, and Flyway. Configure a local database and a migration before running repository operations. This fragment demonstrates the versioned model.

:::learninglab
{
  "title": "JPA, database migrations, and transactions",
  "code": "// Entity fragment in a Spring Data JPA project; imports: jakarta.persistence.*\n@Entity\nclass ExpenseEntity {\n  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n  Long id;\n  @Version Long version;\n  String label;\n  int amount;\n  protected ExpenseEntity() {}\n}",
  "output": "Concurrent update with a stale version → optimistic-lock failure",
  "steps": [
    {
      "label": "Read",
      "detail": "Two transactions load the same row and version."
    },
    {
      "label": "First update",
      "detail": "One transaction updates the row and increments the version."
    },
    {
      "label": "Conflicting update",
      "detail": "The stale version no longer matches, so the second update fails."
    }
  ],
  "prediction": {
    "question": "Two transactions load the same version. One commits first. What happens when the other flushes a stale update?",
    "options": [
      "Both writes always succeed and the later write silently wins",
      "The version column is ignored because it is a Long",
      "Every read is rejected before any update",
      "Concurrent update with a stale version → optimistic-lock failure"
    ],
    "answer": 3,
    "explanation": "Two transactions load the same row and version. One transaction updates the row and increments the version. The stale version no longer matches, so the second update fails."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-06-jpa-and-transactions/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
