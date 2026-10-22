# Resilience, caching, and messaging

**Real-life problem:** Prevent duplicate charges when a dependency times out.

**You will learn:** Timeouts, retries, and idempotency; Circuit breakers and resource isolation; Caching and consistency; Messaging, outbox, and duplicate delivery.

## Chapter 1: Timeouts, retries, and idempotency

A timeout means the caller did not receive an answer in time; it does not prove the remote operation never happened. Retry only operations that are safe under an explicit idempotency policy. Bound attempts, add backoff with jitter, and avoid retries at every layer multiplying the load.

**Follow the working project:** Retries need safe operation semantics, bounded attempts, and backoff with jitter. A timeout does not prove the dependency did no work. Multiple retry layers can multiply load and turn a partial outage into overload.

File in the [reference-project download](/downloads/java-course-labs.zip): `developer-core/src/main/java/in/dailycoder/core/HttpExchangeRates.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.core;

import java.io.IOException;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import tools.jackson.databind.ObjectMapper;

/** Adapter for a deliberately small contract: GET ?from=INR&to=USD -> {"rate":0.012}. */
public final class HttpExchangeRates implements ExpenseService.ExchangeRates, AutoCloseable {
    private final URI endpoint;
    private final HttpClient client;
    private final ObjectMapper mapper = new ObjectMapper();
    public HttpExchangeRates(URI endpoint) {
        if (!ListOfSchemes.allowed(endpoint.getScheme()) || endpoint.getHost() == null || endpoint.getRawQuery() != null || endpoint.getFragment() != null)
            throw new IllegalArgumentException("Use an HTTP(S) endpoint without query or fragment");
        this.endpoint = endpoint;
        client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(2)).build();
    }
    public BigDecimal rate(String from, String to) throws IOException, InterruptedException {
        URI uri = URI.create(endpoint + "?from=" + URLEncoder.encode(from, StandardCharsets.UTF_8) + "&to=" + URLEncoder.encode(to, StandardCharsets.UTF_8));
        var request = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(3)).header("Accept", "application/json").GET().build();
        var response = client.send(request, HttpResponse.BodyHandlers.limiting(HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8), 64_000));
        if (response.statusCode() != 200) throw new IOException("Rate service returned HTTP " + response.statusCode());
        try {
            var rate = mapper.readTree(response.body()).get("rate");
            if (rate == null || !rate.isNumber() || rate.decimalValue().signum() <= 0) throw new IOException("Missing or invalid positive rate");
            return rate.decimalValue();
        } catch (tools.jackson.core.JacksonException error) {
            throw new IOException("Invalid rate JSON", error);
        }
    }
    public void close() { client.close(); }
    private static class ListOfSchemes { static boolean allowed(String scheme) { return "http".equals(scheme) || "https".equals(scheme); } }
}
```


</details>

**Observe:** A request has connection/request time bounds and an explicit non-200 failure.

**Your turn:** Would retrying a payment with a new idempotency key on every attempt prevent duplicates?

<details>
<summary>Check your reasoning</summary>

No. The same intended operation needs a stable key and a server-side contract tying it to one effect.

</details>

## Chapter 2: Circuit breakers and resource isolation

A circuit breaker temporarily stops calls after a failure threshold; it does not repair the dependency. Bulkheads and concurrency limits prevent one failing integration from consuming every worker or connection. Choose fallback behavior that remains truthful instead of inventing successful financial results.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var slots = new java.util.concurrent.Semaphore(2);
slots.acquire();
System.out.println(slots.availablePermits());
slots.release();
System.out.println(slots.availablePermits());
```


<details>
<summary>Check the result and reasoning</summary>


```text
1
2
```


A semaphore bounds access to a resource independently of thread count. Bulkheads isolate capacity; circuit breakers stop calls under a failure policy. Neither creates more downstream capacity or repairs a dependency.

</details>

**Your turn:** What must happen if work throws after acquiring a permit?

<details>
<summary>Check your reasoning</summary>

Release it in a finally block. Also bound how long a caller waits to acquire capacity when the contract requires that.

</details>

## Chapter 3: Caching and consistency

A cache trades freshness and memory for reduced work. Define keys, TTL, invalidation, and ownership. Cache-aside loads on a miss but can suffer stampedes and stale data. Protect sensitive results by including identity or authorization scope in any cache contract that needs it.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var cache = new java.util.LinkedHashMap<String,Integer>(16,0.75f,true) { protected boolean removeEldestEntry(java.util.Map.Entry<String,Integer> entry) { return size() > 2; } };
cache.put("a",1); cache.put("b",2); cache.get("a"); cache.put("c",3);
System.out.println(cache.keySet());
```


<details>
<summary>Check the result and reasoning</summary>


```text
[a, c]
```


Access-order eviction removes b, the least recently accessed entry. This single-threaded demonstration has no TTL or distributed invalidation. A real cache needs key scope, freshness, maximum size, and stampede behavior defined.

</details>

**Your turn:** Why must an owner-sensitive cache key or access check account for identity?

<details>
<summary>Check your reasoning</summary>

Otherwise a cached result authorized for one user may be reused for another user without the required permission check.

</details>

## Chapter 4: Messaging, outbox, and duplicate delivery

Queues decouple work but introduce delivery, ordering, and retry choices. At-least-once delivery requires idempotent consumers. An outbox records an event in the same database transaction as its business change, then publishes it asynchronously. It still requires duplicate handling and operational monitoring.

**Follow the working project:** The outbox event is written with the expense. Delivery records its deduplication marker and database effect in one transaction. This proves a local database effect; it does not magically make external email exactly-once. External senders need their own idempotency and retry contract.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/EventDelivery.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.dao.DuplicateKeyException;

/** A durable, transactional DATABASE effect. This deliberately does not claim exactly-once email. */
@Service
class EventDelivery {
    private final JdbcTemplate jdbc;
    private final TransactionTemplate transaction;
    EventDelivery(JdbcTemplate jdbc, PlatformTransactionManager manager) { this.jdbc = jdbc; transaction = new TransactionTemplate(manager); }
    public boolean deliver(String eventId) { return deliver(eventId, () -> {}); }
    // The failure hook lets the lab prove rollback after the effect but before commit.
    boolean deliver(String eventId, Runnable afterEffect) {
        try {
            return Boolean.TRUE.equals(transaction.execute(status -> {
                long expenseId = jdbc.queryForObject("SELECT expense_id FROM expense_outbox WHERE event_id = ?", Long.class, eventId);
                jdbc.update("INSERT INTO processed_events(event_id) VALUES (?)", eventId);
                jdbc.update("INSERT INTO notifications(event_id, expense_id) VALUES (?, ?)", eventId, expenseId);
                afterEffect.run();
                jdbc.update("UPDATE expense_outbox SET delivered = true WHERE event_id = ?", eventId);
                return true;
            }));
        } catch (DuplicateKeyException duplicate) {
            // Catch OUTSIDE the transaction: PostgreSQL aborts a transaction on a constraint failure.
            // The marker is this transaction's only unique insert; a committed marker proves prior delivery.
            if (Boolean.TRUE.equals(jdbc.queryForObject("SELECT count(*) > 0 FROM processed_events WHERE event_id = ?", Boolean.class, eventId))) return false;
            throw duplicate;
        }
    }
}
```


</details>

**Observe:** Duplicate or concurrent delivery writes one notification row, and a failed attempt rolls back both marker and effect.

**Your turn:** Why is an in-memory Set of processed ids insufficient?

<details>
<summary>Check your reasoning</summary>

It is lost on restart and does not atomically commit with the business effect. It also requires coordination under concurrent deliveries.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Resilience, caching, and messaging",
  "code": "var processed = new java.util.HashSet<String>();\nint accepted = 0;\nfor (String eventId : java.util.List.of(\"e1\", \"e1\", \"e2\")) {\n  if (processed.add(eventId)) accepted++;\n}\nSystem.out.println(accepted);",
  "output": "2",
  "steps": [
    {
      "label": "First e1",
      "detail": "add succeeds; accepted becomes 1."
    },
    {
      "label": "Duplicate e1",
      "detail": "add returns false; accepted stays 1."
    },
    {
      "label": "New e2",
      "detail": "add succeeds; accepted becomes 2. This in-memory demo is single-threaded and not durable."
    }
  ],
  "prediction": {
    "question": "How many unique events does this single-threaded in-memory demonstration accept?",
    "options": [
      "2",
      "3",
      "1",
      "0"
    ],
    "answer": 0,
    "explanation": "add succeeds; accepted becomes 1. add returns false; accepted stays 1. add succeeds; accepted becomes 2. This in-memory demo is single-threaded and not durable."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-09-resilience-caching-and-messaging/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
