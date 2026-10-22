# HTTP, JSON, and the developer core capstone

**Real-life problem:** Turn the expense tracker into a tested application boundary.

**You will learn:** HTTP requests and response semantics; Java HttpClient and bounded calls; JSON, DTOs, and validation; Capstone: persistent expense application.

## Chapter 1: HTTP requests and response semantics

A request has a method, target, headers, and sometimes a body. A response has a status, headers, and a body. GET retrieves a representation; POST commonly creates or triggers work. Distinguish transport failure from an HTTP error response: a server returning 404 still completed an HTTP exchange.

**Try it first:** Predict the result, then paste this complete experiment into Java 25 JShell after `/reset`.


```java
var request = java.net.http.HttpRequest.newBuilder(java.net.URI.create("https://example.com/expenses")).header("Accept","application/json").GET().build();
System.out.println(request.method());
System.out.println(request.headers().firstValue("Accept").orElse("missing"));
```


<details>
<summary>Check the result and reasoning</summary>


```text
GET
application/json
```


Building a request does not send it. Accept describes the desired response type; Content-Type describes a supplied body. HTTP 404 and 500 are responses whose status needs interpretation, not proof that no exchange happened.

</details>

**Your turn:** What is the difference between a connection failure and a 404 response?

<details>
<summary>Check your reasoning</summary>

The former may prevent any HTTP response. A 404 is a received response stating the resource is missing according to the server.

</details>

## Chapter 2: Java HttpClient and bounded calls

Reuse HttpClient and set connection and request timeouts. Decode with the intended charset. Do not assume a response is successful because send returned. Check status, bound response handling, and preserve interruption when the caller cancels a blocking operation.

**Follow the working project:** The adapter reuses an HttpClient, bounds connection and request time, and limits response bytes. It preserves InterruptedException so callers can observe cancellation. Its JSON contract is deliberately documented instead of guessed from an arbitrary public service.

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

**Observe:** Successful calls return a positive decimal rate; error statuses and invalid payloads fail.

**Your turn:** Does a timeout imply a remote state-changing operation did not happen?

<details>
<summary>Check your reasoning</summary>

No. The response may have been lost after success. Retry only under an explicit idempotency policy.

</details>

## Chapter 3: JSON, DTOs, and validation

JSON is an interchange format with objects, arrays, strings, numbers, booleans, and null. Use a maintained parser such as Jackson in a Maven project rather than splitting strings. Keep external DTOs separate from database entities and validate their data before it reaches business operations.

**Follow the working project:** A DTO represents the external shape while Expense enforces the domain rules. Parsing does not make data trustworthy; validate values and bounds before storage. The adapter translates ISO date strings to LocalDate explicitly.

File in the [reference-project download](/downloads/java-course-labs.zip): `developer-core/src/main/java/in/dailycoder/core/ExpenseFiles.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.core;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.util.List;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** JSON avoids pretending split(",") is a CSV parser. Dates are ISO strings. */
public final class ExpenseFiles {
    private static final ObjectMapper MAPPER = new ObjectMapper();
    public record Row(String label, int amount, String date) {}
    public static void write(Path path, List<Expense> values) throws IOException {
        var rows = values.stream().map(value -> new Row(value.label(), value.amount(), value.date().toString())).toList();
        Files.writeString(path, MAPPER.writeValueAsString(rows), StandardCharsets.UTF_8);
    }
    public static List<Expense> read(Path path) throws IOException {
        if (Files.size(path) > 1_000_000) throw new IOException("Import exceeds the one-megabyte lab limit");
        var rows = MAPPER.readValue(Files.readString(path, StandardCharsets.UTF_8), new TypeReference<List<Row>>() {});
        return rows.stream().map(row -> new Expense(0, row.label(), row.amount(), java.time.LocalDate.parse(row.date()))).toList();
    }
}
```


</details>

**Observe:** JSON labels round-trip with embedded punctuation and escaped quotation marks.

**Your turn:** Why not expose every persistence field as an import property?

<details>
<summary>Check your reasoning</summary>

External clients should not control identity, ownership, or internal bookkeeping. Bind only the intended contract.

</details>

## Chapter 4: Capstone: persistent expense application

Combine records, collection queries, a repository interface, JDBC storage, and unit tests. Add import/export and a monthly summary. Keep HTTP calls behind an adapter that tests can replace. Deliver a README with setup, schema creation, test commands, sample inputs, and known limits.

**Follow the working project:** This entry point wires the repository and service, then adapts commands to operations. The exchange-rate boundary is replaceable: tests supply a fixed rate, while a separate adapter test uses a local HTTP server.

File in the [reference-project download](/downloads/java-course-labs.zip): `developer-core/src/main/java/in/dailycoder/core/Main.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.core;

import org.h2.jdbcx.JdbcDataSource;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) throws Exception {
        var source = new JdbcDataSource(); source.setURL("jdbc:h2:file:./data/expenses");
        var repository = new JdbcExpenses(source);
        var service = new ExpenseService(repository, (from, to) -> {
            if (!from.equals(to)) throw new IllegalArgumentException("Configure an ExchangeRates adapter for another currency");
            return java.math.BigDecimal.ONE;
        });
        System.out.println("Commands: add <date> <paise> <label>, list, total <YYYY-MM>, export <path>, import <path>, exit");
        try (var input = new Scanner(System.in)) {
            while (input.hasNextLine()) {
                String line = input.nextLine().strip();
                if (line.equals("exit")) break;
                try {
                    String[] fields = line.split("\\s+", 4);
                    switch (fields[0]) {
                        case "add" -> {
                            if (fields.length != 4) throw new IllegalArgumentException("Usage: add <date> <paise> <label>");
                            var saved = repository.add(new Expense(0, fields[3], Integer.parseInt(fields[2]), LocalDate.parse(fields[1])));
                            System.out.println("Added " + saved.id());
                        }
                        case "list" -> repository.list().forEach(System.out::println);
                        case "total" -> System.out.println("Total paise: " + service.monthlyTotal(YearMonth.parse(required(fields))));
                        case "export" -> { ExpenseFiles.write(Path.of(required(fields)), repository.list()); System.out.println("Exported"); }
                        case "import" -> { service.importValues(ExpenseFiles.read(Path.of(required(fields)))); System.out.println("Imported"); }
                        default -> System.out.println("Unknown command");
                    }
                } catch (Exception error) { System.out.println("Error: " + error.getMessage()); }
            }
        }
    }
    private static String required(String[] fields) {
        if (fields.length < 2) throw new IllegalArgumentException("Missing argument");
        return fields[1];
    }
}
```


</details>

**Observe:** The application can add, list, summarize, import, and export persisted expenses.

**Your turn:** What should you demonstrate after restarting the process?

<details>
<summary>Check your reasoning</summary>

Saved rows remain, a monthly total excludes other months, malformed imports do not partly commit, and dependency failure does not become a fabricated exchange rate.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "HTTP, JSON, and the developer core capstone",
  "code": "var request = java.net.http.HttpRequest.newBuilder(java.net.URI.create(\"https://example.com/expenses\"))\n  .timeout(java.time.Duration.ofSeconds(5))\n  .header(\"Accept\", \"application/json\")\n  .GET()\n  .build();\nSystem.out.println(request.method());\nSystem.out.println(request.headers().firstValue(\"Accept\").orElse(\"missing\"));",
  "output": "GET\napplication/json",
  "steps": [
    {
      "label": "Build URI",
      "detail": "The request targets an HTTPS endpoint; building does not send it."
    },
    {
      "label": "Set contract",
      "detail": "The request asks for JSON and has a five-second request timeout."
    },
    {
      "label": "Inspect",
      "detail": "The method is GET and the Accept header is application/json."
    }
  ],
  "prediction": {
    "question": "What method and Accept header are printed without sending a request?",
    "options": [
      "POST\napplication/json",
      "GET\nmissing",
      "GET\ntext/plain",
      "GET\napplication/json"
    ],
    "answer": 3,
    "explanation": "The request targets an HTTPS endpoint; building does not send it. The request asks for JSON and has a five-second request timeout. The method is GET and the Accept header is application/json."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-developer-core/module-10-http-json-and-core-capstone/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
