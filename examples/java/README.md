# Java course reference projects

Three complete reference implementations accompany the Java learning path. Start with the course exercises; use these projects to compare a working design, run regression tests, and explore a failure. The `modules/` directory also contains a small named-module and jlink exercise.

## Set up once

Install a Java **25 JDK**, not only a runtime. Verify that `java --version`, `javac --version`, and `./mvnw --version` all select Java 25. Set `JAVA_HOME` and put its `bin` directory first on `PATH` if necessary. Open a new terminal after installation.

Unzip the course download and open a terminal in `java-course-labs/`, the directory containing `pom.xml` and `mvnw`.

```sh
./mvnw --version
./mvnw verify
```

On Windows, use `mvnw.cmd` instead of `./mvnw`. The wrapper downloads Maven 3.9.9; Maven then resolves the pinned project dependencies. Internet access is required on the first build. Spring Boot is pinned to 4.0.6, and the parent manages its compatible libraries. Keep those versions together when updating.

`sh verify.sh` runs all tests on H2, compiles and runs the named module, creates a temporary jlink image, and runs the module through that image. A POSIX shell is needed for this convenience script; the Maven projects themselves work without it. `target/`, `data/`, and local passwords are not source files.

## 1. Fundamentals: command-line expense tracker

The application has a validated `Expense` record, an encapsulated `Ledger`, and a command adapter. It uses only JDK classes. JUnit is a test dependency, so the application can also be compiled without Maven.

```sh
./mvnw -pl fundamentals test
java -cp fundamentals/target/classes in.dailycoder.basics.ExpenseTracker
```

Try this transcript:

```text
add Food 1250
add Bus 300
add Wrong nope
add Refund -5
add Morning tea 100
list
total
exit
```

The invalid commands show errors and the program continues. `list` shows only Food, Bus, and Morning tea. `total` prints `Total: 1650`. Labels can contain spaces; the final field of an add command is the positive integer amount in paise. Zero is rejected. The aggregate uses `long` even though each amount is an `int`. EOF also ends input. Data is intentionally in memory for this first project.

To compile directly from the archive root:

```sh
javac -d fundamentals/target/manual fundamentals/src/main/java/in/dailycoder/basics/ExpenseTracker.java
java -cp fundamentals/target/manual in.dailycoder.basics.ExpenseTracker
```

**Explore:** add a category, preserve the invariant for invalid input, and add a test demonstrating that a returned list cannot mutate the ledger.

## 2. Developer core: persistence, files, and an HTTP boundary

The second project adds a repository interface, prepared JDBC statements, transactional batch import, ISO dates, monthly summaries, JSON import/export, and a replaceable exchange-rate interface. H2 runs embedded; no separate database is required for this stage.

```sh
./mvnw -pl developer-core test dependency:copy-dependencies
java -cp 'developer-core/target/classes:developer-core/target/dependency/*' in.dailycoder.core.Main
```

Windows uses a semicolon rather than a colon between classpath entries. Run from the same directory each time so the relative database path resolves to the same `data/expenses` file.

```text
add 2026-10-22 1250 Food
add 2026-11-01 300 Bus
list
total 2026-10
export expenses.json
exit
```

The October total is `1250` paise. Restart and run `list` to verify persistence. `import expenses.json` adds the imported values as new records, so importing the same file twice intentionally creates duplicates; it is not a synchronization command. Use paths without whitespace in this small CLI. The JSON adapter preserves commas and quotes in labels, limits import size to one megabyte, and validates every row before a transactional batch insert.

The application uses `INR -> INR = 1` locally and rejects other conversions until an adapter is configured. It never fabricates an external rate. `HttpExchangeRates` expects a configured endpoint with this contract:

```text
GET /rate?from=INR&to=USD
200 Content-Type: application/json
{"rate":0.012}
```

It uses a connection timeout, a request timeout, and a 64,000-byte response limit. Non-200 responses, malformed JSON, and nonpositive rates fail. The adapter is AutoCloseable and owns its HttpClient. `ExpenseApplicationTest` uses a local HTTP server for the adapter and a fixed fake for caller behavior. Tests need no external rate provider.

**Explore:** add a date-range report, a category grouping collector, a second repository implementation, and a test for a label containing an apostrophe. The existing rollback test intentionally fails a second database insert and proves the first insert was not committed.

## 3. Advanced: secure expense REST API

The final project provides:

- Create/read/update/delete endpoints with validated request DTOs and bounded pagination.
- Authenticated owner-qualified queries; other users cannot select an owner in the request body.
- JPA optimistic versions, explicit conflict responses, and Flyway migrations.
- A transactional outbox, durable duplicate marker, and a transactional database notification effect.
- Actual CSRF cookie/header handling, adaptive password encoding, safe request correlation logs, health probes, and graceful shutdown.
- Integration tests for validation, real Basic authentication, ownership, stale updates, monthly reports, duplicate delivery, concurrent delivery, and rollback.

This is a **local teaching application**. It binds `127.0.0.1` and requires two different demo passwords in the environment. Demo users and HTTP Basic make the protocol visible; before public deployment replace that configuration with a maintained identity-provider integration, TLS, deployment secret management, and hosting-specific resource/abuse controls. The sample does not issue custom authentication tokens.

On a POSIX shell, choose your own distinct passwords:

```sh
export DEMO_ALICE_PASSWORD='choose-a-local-alice-password'
export DEMO_BOB_PASSWORD='choose-a-different-local-bob-password'
./mvnw -pl backend spring-boot:run
```

The H2 database is stored under `data/` relative to the launch directory. `spring.jpa.hibernate.ddl-auto=validate` verifies the schema; Flyway creates and evolves it. Opening a second process against the same file database can fail due to the file lock. Stop the first application before restarting it.

### Exercise the HTTP contract

Use an HTTP client or curl. The following POSIX example also uses Python 3 to read the token from JSON. Fetching `/csrf` sets the cookie; send that cookie and the matching header for writes. Cookies and token files in these commands are local lab artifacts.

```sh
curl -fsS -c /tmp/java-expense-cookies.txt http://127.0.0.1:8080/csrf > /tmp/java-expense-csrf.json
token=$(python3 -c 'import json; print(json.load(open("/tmp/java-expense-csrf.json"))["token"])')
curl -i -u "alice:$DEMO_ALICE_PASSWORD" -b /tmp/java-expense-cookies.txt \
  -H "X-XSRF-TOKEN: $token" -H 'Content-Type: application/json' \
  -d '{"label":"Food","amount":1250,"spentOn":"2026-10-22"}' \
  http://127.0.0.1:8080/expenses
```

Expect `201 Created`, a `Location: /expenses/<id>` header, and a DTO containing `id`, `version`, `label`, `amount`, and `spentOn`. Use the actual id from the response below; it is not always 1.

```sh
curl -i -u "alice:$DEMO_ALICE_PASSWORD" http://127.0.0.1:8080/expenses/1
curl -i -u "bob:$DEMO_BOB_PASSWORD" http://127.0.0.1:8080/expenses/1
curl -i -u "alice:$DEMO_ALICE_PASSWORD" 'http://127.0.0.1:8080/expenses?page=0&size=20'
curl -i -u "alice:$DEMO_ALICE_PASSWORD" 'http://127.0.0.1:8080/expenses/summary?month=2026-10'
```

Alice gets her DTO; Bob gets 404 for Alice’s id. Anonymous reads get 401. A write without a matching CSRF cookie/header gets 403. Negative amounts, missing dates, unknown fields such as `owner`, or page sizes outside 1–100 are rejected as 400. Problem details describe application validation/missing/conflict failures without exposing SQL or private data.

For an update, send `PUT /expenses/<id>` with the same fields as create plus the version last read, for example `"version":0`. A successful update increments the version. Reusing the stale version returns 409; reload and decide whether the user’s intended change is still appropriate. Do not automatically overwrite the winner. `DELETE /expenses/<id>` returns 204 for the owner and cascades this project’s event records. This sample deliberately does not retain deleted expense history.

### Demonstrate event delivery

After creation, send `POST /expenses/<id>/notify` with Alice’s credentials, cookie, and CSRF header. The first call returns `{"applied":true}`; repeating it returns `{"applied":false}`. An unauthorized caller cannot deliver another owner’s event.

The effect is a `notifications` **database row**, not an external email. The deduplication marker and effect commit together. A process crash before commit leaves both absent. This does not promise exactly-once execution of an external service; an external sender needs an idempotency contract and retry/reconciliation design. The tests verify duplicate, concurrent, and rollback cases rather than inferring them from an in-memory set.

### Run the same tests on PostgreSQL

Create an isolated PostgreSQL database for the exercise. Never point this test suite at a database containing real records.

```sh
export TEST_DB_URL='jdbc:postgresql://127.0.0.1:5432/java_course'
export TEST_DB_USER='java_course'
export TEST_DB_PASSWORD='your-local-test-password'
./mvnw -pl backend test
```

Flyway applies the same migration. The script `sh verify.sh` always runs the first suite on H2, then runs the backend suite on PostgreSQL when `TEST_DB_URL` is present. Tests create fixtures and retain rows; use a disposable test database. The test credentials in Java sources are test fixtures, not application defaults.

For a running application with PostgreSQL, set `DB_URL`, `DB_USER`, and `DB_PASSWORD` and run with `--spring.profiles.active=postgres` or `SPRING_PROFILES_ACTIVE=postgres`. Keep the two demo password variables set for this local exercise. A PostgreSQL database is an explicit external dependency; it is not created by this application.

### Package and operate the app

```sh
./mvnw -pl backend package
java -jar backend/target/backend-1.0.0.jar
```

With a container runtime available, build from the backend directory:

```sh
docker build -t java-expenses-lab backend
docker run --rm -p 127.0.0.1:8080:8080 \
  -e DEMO_ALICE_PASSWORD -e DEMO_BOB_PASSWORD \
  -v java-expense-data:/app/data java-expenses-lab
```

The container uses a non-root user and a named data volume. Check the image/runtime requirements on your host. `GET /actuator/health/readiness` and `/actuator/health/liveness` are available locally. Metrics require authentication. An `X-Request-Id` header corresponds to a safe log correlation id. No request body or Authorization header is written by the request logger. Stop with SIGTERM or Ctrl-C; graceful shutdown has a 20-second completion window.

For PostgreSQL recovery practice, take a `pg_dump` of the isolated lab database, restore into a **different empty lab database** with `pg_restore`, start the app against that restored database, and verify one previously saved expense and its version. Do not call a backup successful until the restore and owner journey have been checked. Add a new Flyway migration for schema changes instead of rewriting an applied V1.

## Named-module exercise

`modules/hello/module-info.java` exports a small package. `verify.sh` runs these equivalent commands and creates its runtime image in a temporary directory:

```sh
javac -d modules/target/classes modules/hello/module-info.java modules/hello/in/dailycoder/hello/Main.java
java --module-path modules/target/classes --module course.hello/in.dailycoder.hello.Main
jlink --module-path modules/target/classes --add-modules course.hello --output /tmp/java-course-runtime
/tmp/java-course-runtime/bin/java --module course.hello/in.dailycoder.hello.Main
```

Choose a new, nonexistent output path for each manual jlink run. The output in both runs is `Hello from a named module`. An image is platform-specific, so build and test it for its intended platform.

## Completion evidence

Keep your own branch and explain at least one design choice in each project. Demonstrate normal input, an invalid request, persistence after restart, a cross-user denial, a stale update, and a duplicate event. Passing quizzes supports recall; these demonstrations show the behavior you can build and diagnose.
