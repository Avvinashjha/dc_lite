# Integration tests and API contracts

**Real-life problem:** Catch API, database, and security regressions before release.

**You will learn:** A layered testing strategy; Spring test slices and full application tests; Testcontainers and real database behavior; Contracts, determinism, and failure scenarios.

## Chapter 1: A layered testing strategy

Keep fast unit tests for domain rules, focused integration tests for boundaries, and a small number of complete user journeys. Every layer should detect a distinct risk. Testing private details at every layer produces maintenance work without improving confidence.

**Follow the working project:** Not every rule needs a full application context. Unit tests cover validation and calculation, while integration tests cover wiring and boundaries. Keep a small set of complete journeys to verify that the layers work together.

File in the [reference-project download](/downloads/java-course-labs.zip): `fundamentals/src/test/java/in/dailycoder/basics/ExpenseTrackerTest.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.basics;

import org.junit.jupiter.api.Test;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Scanner;
import static org.junit.jupiter.api.Assertions.*;

class ExpenseTrackerTest {
    @Test void totalsValidExpensesAndProtectsItsCollection() {
        var ledger = new ExpenseTracker.Ledger();
        assertEquals(0, ledger.total());
        ledger.add("Food", 1250); ledger.add("Bus", 300);
        assertEquals(1550, ledger.total());
        assertThrows(UnsupportedOperationException.class, () -> ledger.list().clear());
        assertThrows(IllegalArgumentException.class, () -> ledger.add("Food", -1));
        assertEquals(1550, ledger.total());
    }
    @Test void recoversFromBadCommandsWithoutLosingValidExpenses() {
        var buffer = new StringWriter();
        ExpenseTracker.run(new Scanner("add Food 1250\nadd Bus 300\nadd Wrong nope\nadd Refund -5\nadd Morning tea 100\nlist\ntotal\nexit\nadd Ignored 20\n"), new PrintWriter(buffer));
        String text = buffer.toString();
        assertTrue(text.contains("Food: 1250"));
        assertTrue(text.contains("Bus: 300"));
        assertTrue(text.contains("Morning tea: 100"));
        assertTrue(text.contains("Total: 1650"));
        assertTrue(text.contains("Error:"));
        assertFalse(text.contains("Ignored"));
    }
    @Test void usesLongForAnAggregateOfValidIntAmounts() {
        var ledger = new ExpenseTracker.Ledger();
        ledger.add("A", Integer.MAX_VALUE); ledger.add("B", Integer.MAX_VALUE);
        assertEquals(4294967294L, ledger.total());
    }
}
```


</details>

**Observe:** Fast tests establish the domain and CLI contracts without starting Spring.

**Your turn:** What extra risk does an HTTP test cover beyond directly invoking a service?

<details>
<summary>Check your reasoning</summary>

Routing, JSON binding, validation, authentication, CSRF, status codes, headers, and exception translation can fail even when a direct service call succeeds.

</details>

## Chapter 2: Spring test slices and full application tests

Use WebMvcTest for controller behavior with controlled collaborators, and DataJpaTest for persistence behavior. A SpringBootTest covers a wider context and costs more to start. Match the test boundary to the behavior being verified, including security filters when authorization is under test.

**Follow the working project:** A focused @WebMvcTest is useful for controller-only risk; @DataJpaTest focuses persistence. This reference uses a full context for cross-layer contracts and keeps the fundamentals/core suites fast and separate.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/test/java/in/dailycoder/backend/ExpenseApiTest.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.jdbc.core.JdbcTemplate;
import tools.jackson.databind.ObjectMapper;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(properties={"spring.datasource.url=${TEST_DB_URL:jdbc:h2:mem:api;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1}", "spring.datasource.username=${TEST_DB_USER:sa}", "spring.datasource.password=${TEST_DB_PASSWORD:}", "demo.alice-password=alice-test-only", "demo.bob-password=bob-test-only"})
@AutoConfigureMockMvc
class ExpenseApiTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired ExpenseService service;
    @Autowired EventDelivery delivery;
    @Autowired ExpenseRepository repository;
    @Autowired org.springframework.transaction.PlatformTransactionManager transactions;
    private final ObjectMapper json = new ObjectMapper();
    private org.springframework.test.web.servlet.request.RequestPostProcessor token() throws Exception {
        var response = mvc.perform(get("/csrf")).andExpect(status().isOk()).andReturn().getResponse();
        var body = json.readTree(response.getContentAsString());
        return request -> {
            request.setCookies(response.getCookies());
            request.addHeader(body.get("headerName").stringValue(), body.get("token").stringValue());
            return request;
        };
    }
    private long create(String owner, String date) throws Exception {
        var response = mvc.perform(post("/expenses").with(user(owner)).with(token()).contentType("application/json").content("{\"label\":\"Tea\",\"amount\":1250,\"spentOn\":\""+date+"\"}"))
            .andExpect(status().isCreated()).andExpect(header().exists("Location")).andReturn();
        return json.readTree(response.getResponse().getContentAsString()).get("id").longValue();
    }
    @Test void createsReadsUpdatesAndDeletesAnOwnedExpense() throws Exception {
        long id = create("alice", "2026-10-22");
        mvc.perform(get("/expenses/"+id).with(user("alice"))).andExpect(status().isOk()).andExpect(jsonPath("$.amount").value(1250)).andExpect(jsonPath("$.owner").doesNotExist());
        String body = "{\"label\":\"Bus\",\"amount\":300,\"spentOn\":\"2026-10-23\",\"version\":0}";
        mvc.perform(put("/expenses/"+id).with(user("alice")).with(token()).contentType("application/json").content(body)).andExpect(status().isOk()).andExpect(jsonPath("$.version").value(1));
        mvc.perform(put("/expenses/"+id).with(user("alice")).with(token()).contentType("application/json").content(body)).andExpect(status().isConflict());
        mvc.perform(delete("/expenses/"+id).with(user("alice")).with(token())).andExpect(status().isNoContent());
        mvc.perform(get("/expenses/"+id).with(user("alice"))).andExpect(status().isNotFound());
    }
    @Test void deniesAnonymousAndCrossOwnerRequests() throws Exception {
        long id = create("alice", "2026-10-22");
        mvc.perform(get("/expenses/"+id)).andExpect(status().isUnauthorized());
        mvc.perform(get("/expenses/"+id).with(user("bob"))).andExpect(status().isNotFound());
        mvc.perform(delete("/expenses/"+id).with(user("bob")).with(token())).andExpect(status().isNotFound());
        mvc.perform(put("/expenses/"+id).with(user("bob")).with(token()).contentType("application/json").content("{\"label\":\"Wrong\",\"amount\":5,\"spentOn\":\"2026-10-22\",\"version\":0}")).andExpect(status().isNotFound());
        mvc.perform(post("/expenses/"+id+"/notify").with(user("bob")).with(token())).andExpect(status().isNotFound());
        assertEquals(1250, service.get(id, "alice").amount());
    }
    @Test void validatesRequestsAndDoesNotAcceptClientOwnership() throws Exception {
        mvc.perform(post("/expenses").with(user("alice")).with(token()).contentType("application/json").content("{\"label\":\"Bad\",\"amount\":-1,\"spentOn\":\"2026-10-22\"}")).andExpect(status().isBadRequest());
        mvc.perform(post("/expenses").with(user("alice")).with(token()).contentType("application/json").content("{\"owner\":\"bob\",\"label\":\"Tea\",\"amount\":1,\"spentOn\":\"2026-10-22\"}")).andExpect(status().isBadRequest());
        mvc.perform(get("/expenses?size=101").with(user("alice"))).andExpect(status().isBadRequest());
        mvc.perform(get("/expenses/summary?month=not-a-month").with(user("alice"))).andExpect(status().isBadRequest());
    }
    @Test void requiresCsrfAndAuthenticatesRealBasicCredentials() throws Exception {
        mvc.perform(get("/greeting?name=Ada").with(httpBasic("alice","alice-test-only"))).andExpect(status().isOk()).andExpect(jsonPath("$.message").value("Hello Ada"));
        mvc.perform(get("/expenses").with(httpBasic("alice","alice-test-only"))).andExpect(status().isOk());
        mvc.perform(get("/expenses").with(httpBasic("alice","wrong"))).andExpect(status().isUnauthorized());
        mvc.perform(post("/expenses").with(httpBasic("alice","alice-test-only")).contentType("application/json").content("{}")).andExpect(status().isForbidden());
        mvc.perform(get("/csrf")).andExpect(status().isOk()).andExpect(jsonPath("$.token").isString()).andExpect(cookie().exists("XSRF-TOKEN"));
    }
    @Test void confinesPagedResultsAndMonthlyTotalsToOwner() throws Exception {
        String owner = "report-" + java.util.UUID.randomUUID();
        create(owner, "2026-10-01"); create(owner, "2026-10-31"); create(owner, "2026-11-01"); create("other-user", "2026-10-22");
        mvc.perform(get("/expenses?size=1").with(user(owner))).andExpect(status().isOk()).andExpect(jsonPath("$.content.length()").value(1)).andExpect(jsonPath("$.totalElements").value(3));
        mvc.perform(get("/expenses/summary?month=2026-10").with(user(owner))).andExpect(status().isOk()).andExpect(jsonPath("$.paise").value(2500));
    }
    @Test void recordsOneEffectAcrossDuplicatesAndRollsBackInterruptedDelivery() throws Exception {
        long id = create("delivery-user", "2026-10-22");
        String event = service.eventId(id,"delivery-user");
        assertThrows(IllegalStateException.class, () -> delivery.deliver(event, () -> { throw new IllegalStateException("simulated crash before commit"); }));
        assertEquals(0, jdbc.queryForObject("SELECT count(*) FROM processed_events WHERE event_id = ?", Integer.class,event));
        assertEquals(0, jdbc.queryForObject("SELECT count(*) FROM notifications WHERE event_id = ?", Integer.class,event));
        assertTrue(delivery.deliver(event)); assertFalse(delivery.deliver(event));
        assertEquals(1, jdbc.queryForObject("SELECT count(*) FROM notifications WHERE event_id = ?", Integer.class,event));
    }
    @Test void duplicateConcurrentDeliveriesApplyOnlyOneEffect() throws Exception {
        long id = create("concurrent-user", "2026-10-22"); String event = service.eventId(id,"concurrent-user");
        try(var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var results = executor.invokeAll(java.util.List.of(() -> delivery.deliver(event), () -> delivery.deliver(event)));
            int applied = 0; for (var result : results) if (Boolean.TRUE.equals(result.get())) applied++;
            assertEquals(1,applied);
        }
        assertEquals(1, jdbc.queryForObject("SELECT count(*) FROM notifications WHERE event_id = ?", Integer.class,event));
    }
    @Test void databaseVersionRejectsOneOfTwoConcurrentWriters() throws Exception {
        long id = create("version-user", "2026-10-22");
        var barrier = new java.util.concurrent.CyclicBarrier(2);
        java.util.concurrent.Callable<Boolean> write = () -> {
            try {
                return new org.springframework.transaction.support.TransactionTemplate(transactions).execute(status -> {
                    var expense = repository.findById(id).orElseThrow();
                    try { barrier.await(5,java.util.concurrent.TimeUnit.SECONDS); }
                    catch(Exception error) { throw new IllegalStateException("Concurrent writer failed to reach barrier",error); }
                    expense.amount += 100;
                    repository.saveAndFlush(expense);
                    return true;
                });
            } catch(org.springframework.dao.OptimisticLockingFailureException conflict) { return false; }
        };
        try(var executor = java.util.concurrent.Executors.newVirtualThreadPerTaskExecutor()) {
            var results = executor.invokeAll(java.util.List.of(write,write));
            int successful = 0; for(var result : results) if (result.get()) successful++;
            assertEquals(1,successful);
        }
        assertEquals(1350,service.get(id,"version-user").amount());
        assertEquals(1,service.get(id,"version-user").version());
    }
}
```


</details>

**Observe:** The application-context tests verify the actual security filters and MVC boundary.

**Your turn:** Would disabling filters make an authorization test meaningful?

<details>
<summary>Check your reasoning</summary>

No. It would remove the behavior the test claims to verify. Use the real configured security boundary for those cases.

</details>

## Chapter 3: Testcontainers and real database behavior

Use Testcontainers for disposable database instances when a container runtime is available. Apply real migrations and verify constraints, transaction effects, and query results. Explicitly account for container startup and cleanup. An in-memory database can be useful but is not proof of PostgreSQL behavior.

**Follow the working project:** Disposable containers are convenient in CI, but the same tests can target an isolated local PostgreSQL instance. Apply the real migration and test constraint failures and concurrency. H2 success alone does not prove PostgreSQL behavior.

File in the [reference-project download](/downloads/java-course-labs.zip): `verify.sh`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```bash
#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")"
if [ -n "${JAVA_HOME:-}" ]; then PATH="$JAVA_HOME/bin:$PATH"; export PATH; fi
(unset TEST_DB_URL TEST_DB_USER TEST_DB_PASSWORD; ./mvnw "$@" --batch-mode verify)
if [ -n "${TEST_DB_URL:-}" ]; then
  ./mvnw "$@" --batch-mode -pl backend test
fi
mkdir -p modules/target/classes
javac -d modules/target/classes modules/hello/module-info.java modules/hello/in/dailycoder/hello/Main.java
java --module-path modules/target/classes --module course.hello/in.dailycoder.hello.Main
runtime_root=$(mktemp -d)
trap 'rm -rf "$runtime_root"' EXIT HUP INT TERM
jlink --module-path modules/target/classes --add-modules course.hello --output "$runtime_root/image"
"$runtime_root/image/bin/java" --module course.hello/in.dailycoder.hello.Main
```


</details>

**Observe:** An optional second test run uses PostgreSQL through TEST_DB_URL.

**Your turn:** Which failure is especially important to catch against PostgreSQL?

<details>
<summary>Check your reasoning</summary>

A unique-constraint error aborts its transaction. Catch duplicate handling outside the transactional callback rather than trying to commit further work in the aborted transaction.

</details>

## Chapter 4: Contracts, determinism, and failure scenarios

Assert status, important headers, and response fields. Test invalid input, unauthenticated calls, cross-user access, missing records, conflicts, and dependency failures. Inject Clock and fake external services to remove timing and internet dependence. Keep CI failures actionable with useful diagnostics.

**Follow the working project:** The adapter is exercised over real loopback HTTP without relying on the public internet. Caller tests can use a fixed-rate fake. Controlled failure cases make regressions reproducible and diagnosis useful.

File in the [reference-project download](/downloads/java-course-labs.zip): `developer-core/src/test/java/in/dailycoder/core/ExpenseApplicationTest.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.core;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.h2.jdbcx.JdbcDataSource;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

class ExpenseApplicationTest {
    @TempDir Path temp;
    private JdbcDataSource dataSource() {
        var source = new JdbcDataSource();
        source.setURL("jdbc:h2:file:" + temp.resolve("expenses")); return source;
    }
    @Test void persistsAcrossRepositoryInstancesAndFiltersMonths() throws Exception {
        var source = dataSource(); var repository = new JdbcExpenses(source);
        repository.add(new Expense(0, "Alice's tea", 1250, LocalDate.of(2026,10,22)));
        repository.add(new Expense(0, "Bus", 300, LocalDate.of(2026,11,1)));
        var reopened = new JdbcExpenses(source);
        assertEquals(2, reopened.list().size());
        assertEquals("Alice's tea", reopened.list().getFirst().label());
        assertEquals(List.of("Alice's tea"), reopened.findAtLeast(1000).stream().map(Expense::label).toList());
        assertEquals(2, reopened.findAtLeast(300).size());
        assertTrue(reopened.findAtLeast(2000).isEmpty());
        var service = new ExpenseService(reopened, (from, to) -> new java.math.BigDecimal("0.5"));
        assertEquals(1250, service.monthlyTotal(YearMonth.of(2026,10)));
        assertEquals(0, service.monthlyTotal(YearMonth.of(2026,9)));
        assertEquals(0, new java.math.BigDecimal("6.25").compareTo(service.convertedMonthlyTotal(YearMonth.of(2026,10), "TEST")));
    }
    @Test void failedBatchRollsBackEarlierRows() throws Exception {
        var repository = new JdbcExpenses(dataSource());
        var date = LocalDate.of(2026,10,22);
        assertThrows(java.sql.SQLException.class, () -> repository.addAll(List.of(new Expense(0,"Valid",100,date), new Expense(0,"x".repeat(101),100,date))));
        assertTrue(repository.list().isEmpty());
    }
    @Test void importsAndExportsEscapedLabelsAndRejectsInvalidInput() throws Exception {
        Path file = temp.resolve("expenses.json");
        ExpenseFiles.write(file, List.of(new Expense(1,"Tea, \"special\"",1250,LocalDate.of(2026,10,22))));
        assertEquals("Tea, \"special\"", ExpenseFiles.read(file).getFirst().label());
        java.nio.file.Files.writeString(file, "[{\"label\":\"Bad\",\"amount\":-1,\"date\":\"2026-10-22\"}]");
        assertThrows(IllegalArgumentException.class, () -> ExpenseFiles.read(file));
    }
    @Test void httpAdapterChecksStatusAndParsesARealLocalResponse() throws Exception {
        var server = com.sun.net.httpserver.HttpServer.create(new java.net.InetSocketAddress("127.0.0.1",0),0);
        server.createContext("/rate", exchange -> {
            byte[] body = "{\"rate\":0.012}".getBytes(java.nio.charset.StandardCharsets.UTF_8);
            exchange.sendResponseHeaders(200,body.length);
            try(var output = exchange.getResponseBody()) { output.write(body); }
        });
        server.createContext("/fail", exchange -> { exchange.sendResponseHeaders(500,-1); exchange.close(); });
        server.createContext("/bad", exchange -> {
            byte[] body = "{\"rate\":-5}".getBytes(); exchange.sendResponseHeaders(200,body.length);
            try(var output = exchange.getResponseBody()) { output.write(body); }
        });
        server.createContext("/invalid-json", exchange -> {
            byte[] body = "not json".getBytes(); exchange.sendResponseHeaders(200,body.length);
            try(var output = exchange.getResponseBody()) { output.write(body); }
        });
        server.createContext("/oversized", exchange -> {
            byte[] body = "x".repeat(65_000).getBytes(); exchange.sendResponseHeaders(200,body.length);
            try(var output = exchange.getResponseBody()) { output.write(body); }
        });
        server.start();
        try {
            String base = "http://127.0.0.1:" + server.getAddress().getPort();
            try(var rates = new HttpExchangeRates(java.net.URI.create(base+"/rate"))) {
                assertEquals(0, new java.math.BigDecimal("0.012").compareTo(rates.rate("INR","USD")));
            }
            for (String route : List.of("/fail", "/bad", "/invalid-json", "/oversized")) {
                try(var rates = new HttpExchangeRates(java.net.URI.create(base+route))) {
                    assertThrows(java.io.IOException.class, () -> rates.rate("INR","USD"));
                }
            }
        } finally { server.stop(0); }
    }
}
```


</details>

**Observe:** A local HTTP server supplies controlled success, error, and invalid-rate responses.

**Your turn:** Which assertion would detect an adapter converting HTTP 500 into a fake rate?

<details>
<summary>Check your reasoning</summary>

The test expects an IOException for the failing endpoint. A fabricated success would fail that boundary contract.

</details>

## Predict and explore

JUnit Jupiter test source using the Expense and canRead domain example from the previous module. For HTTP tests use the project’s configured Spring MVC test support; these assertions alone are not a full endpoint test.

:::learninglab
{
  "title": "Integration tests and API contracts",
  "code": "// JUnit Jupiter test fragment in the expense service project.\n@org.junit.jupiter.api.Test\nvoid ownerCannotBeChangedByRequest() {\n  var expense = new Expense(1, \"alice\", 1250);\n  org.junit.jupiter.api.Assertions.assertTrue(canRead(\"alice\", expense));\n  org.junit.jupiter.api.Assertions.assertFalse(canRead(\"bob\", expense));\n}",
  "output": "Both ownership assertions pass; a regression allowing bob fails the test.",
  "steps": [
    {
      "label": "Arrange",
      "detail": "Create an expense belonging to alice."
    },
    {
      "label": "Allow",
      "detail": "Verify the owner path succeeds."
    },
    {
      "label": "Deny",
      "detail": "Verify bob is denied; endpoint tests must separately verify the HTTP boundary."
    }
  ],
  "prediction": {
    "question": "What should these ownership assertions establish when run with the previous module’s model?",
    "options": [
      "A failing denial assertion should be ignored as a flaky test",
      "Both ownership assertions pass; a regression allowing bob fails the test.",
      "Both assertions prove every HTTP endpoint is secured automatically",
      "The second assertion should allow bob"
    ],
    "answer": 1,
    "explanation": "Create an expense belonging to alice. Verify the owner path succeeds. Verify bob is denied; endpoint tests must separately verify the HTTP boundary."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-08-integration-tests-and-contracts/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
