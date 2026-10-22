# Application security and authorization

**Real-life problem:** Ensure each user sees only their own expenses.

**You will learn:** Authentication versus authorization; Spring Security and established identity flows; Browser security and input boundaries; Secrets, logging, and abuse limits.

## Chapter 1: Authentication versus authorization

Authentication establishes an identity; authorization decides whether that identity may perform an action on a resource. A logged-in user must not gain access to another user’s expense merely by changing an id. Perform object-level authorization in the operation that loads or changes the resource.

**Follow the working project:** Authentication identifies the user; this query enforces object-level authorization. The API returns the same missing-resource outcome for unknown and other-owner ids, avoiding an existence leak.

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

**Observe:** findByIdAndOwner makes ownership part of the database lookup.

**Your turn:** Why must updates and deletes use the same ownership rule as reads?

<details>
<summary>Check your reasoning</summary>

Read protection alone does not prevent unauthorized modifications. Every operation on a resource needs its access rule enforced.

</details>

## Chapter 2: Spring Security and established identity flows

Use a SecurityFilterChain and maintained Spring Security integration. Prefer an established identity provider and standards such as OAuth2/OIDC rather than designing tokens or password storage. If passwords are stored, use a suitable adaptive password encoder. A JWT signature does not hide the token’s payload.

**Follow the working project:** Demo users exist only for local learning and passwords come from environment configuration. The same PasswordEncoder constructs and verifies the hashes. Real deployment should integrate an identity provider and TLS rather than treating demo users as production identity management.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/SecurityConfiguration.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

/** Local teaching identities. Real deployment needs an identity-provider integration and TLS. */
@Configuration
class SecurityConfiguration {
    @Bean PasswordEncoder passwordEncoder() { return PasswordEncoderFactories.createDelegatingPasswordEncoder(); }
    @Bean UserDetailsService users(PasswordEncoder encoder, @Value("${demo.alice-password}") String alice, @Value("${demo.bob-password}") String bob) {
        if (alice.isBlank() || bob.isBlank() || alice.equals(bob)) throw new IllegalArgumentException("Choose different nonblank demo passwords");
        return new InMemoryUserDetailsManager(User.withUsername("alice").password(encoder.encode(alice)).roles("USER").build(), User.withUsername("bob").password(encoder.encode(bob)).roles("USER").build());
    }
    @Bean SecurityFilterChain security(HttpSecurity http) throws Exception {
        return http.authorizeHttpRequests(access -> access.requestMatchers("/csrf", "/actuator/health", "/actuator/health/**", "/error").permitAll().anyRequest().authenticated())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()).csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
            .httpBasic(Customizer.withDefaults()).build();
    }
}

@RestController
class CsrfController {
    record Token(String token, String headerName) {}
    @GetMapping("/csrf") Token token(CsrfToken token) { return new Token(token.getToken(), token.getHeaderName()); }
}
```


</details>

**Observe:** The local demo verifies adaptive password hashes with the configured encoder.

**Your turn:** Why did a raw bcrypt value fail when the authentication manager expected a delegated format?

<details>
<summary>Check your reasoning</summary>

A delegating encoder needs its encoding identifier, such as {bcrypt}, or a matching configured encoder. The reference uses one configured delegating encoder consistently.

</details>

## Chapter 3: Browser security and input boundaries

CSRF and CORS solve different problems. Cookie-authenticated state-changing requests need deliberate CSRF protection. CORS controls browser cross-origin access and is not authorization. Bind only allowed DTO fields, validate inputs, and encode output for its destination.

**Follow the working project:** Basic authentication may be sent automatically by browsers, so this demo retains CSRF protection. CORS is a browser origin policy, not a server authorization system. Unknown DTO fields are rejected rather than bound into an entity.

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

**Observe:** State-changing requests use a real CSRF cookie and matching token header.

**Your turn:** Can a signed JWT be read by someone holding it?

<details>
<summary>Check your reasoning</summary>

Ordinary signed JWT payloads are encoded, not encrypted. Protect tokens as credentials and use maintained validation and identity integrations.

</details>

## Chapter 4: Secrets, logging, and abuse limits

Keep credentials outside source control and avoid logging tokens, passwords, or personal expense details. Apply least privilege to database accounts and outbound credentials. Bound request sizes and rates. Maintain dependency updates and verify security behavior with tests for both allowed and denied requests.

**Follow the working project:** The filter avoids credentials and personal expense bodies. Operational endpoints expose only selected information and sensitive routes still require authentication. Bound request sizes and rate limits at the appropriate application or deployment boundary.

File in the [reference-project download](/downloads/java-course-labs.zip): `backend/src/main/java/in/dailycoder/backend/RequestLogging.java`. Follow its README to build and run it.

<details>
<summary>Read the complete example source</summary>


```java
package in.dailycoder.backend;

import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.MDC;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.util.UUID;

@Component
class RequestLogging extends OncePerRequestFilter {
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String id = UUID.randomUUID().toString();
        response.setHeader("X-Request-Id", id); MDC.put("requestId", id);
        long start = System.nanoTime();
        try { chain.doFilter(request, response); }
        finally {
            LoggerFactory.getLogger(RequestLogging.class).info("request_completed method={} status={} elapsed_ms={}", request.getMethod(), response.getStatus(), (System.nanoTime()-start)/1_000_000);
            MDC.remove("requestId");
        }
    }
}
```


</details>

**Observe:** Logs include a generated request id, method, status, and elapsed time.

**Your turn:** Should an Authorization header be logged when debugging a 401?

<details>
<summary>Check your reasoning</summary>

No. Use safe correlation and error context. Logging a bearer or Basic credential can turn a diagnostic stream into a credential leak.

</details>

## Predict and explore

Open JShell with jshell on Java 25. Paste the statements or declarations in order. Use /reset between modules so earlier definitions do not affect this example.

:::learninglab
{
  "title": "Application security and authorization",
  "code": "record Expense(long id, String owner, int amount) {}\nboolean canRead(String user, Expense expense) {\n  return user != null && user.equals(expense.owner());\n}\nExpense expense = new Expense(1, \"alice\", 1250);\nSystem.out.println(canRead(\"alice\", expense));\nSystem.out.println(canRead(\"bob\", expense));",
  "output": "true\nfalse",
  "steps": [
    {
      "label": "Authenticate",
      "detail": "The application receives an established user identity."
    },
    {
      "label": "Authorize owner",
      "detail": "alice matches the expense owner and may read it."
    },
    {
      "label": "Deny other user",
      "detail": "bob is authenticated but is not authorized for this expense."
    }
  ],
  "prediction": {
    "question": "What do the owner and other-user checks print?",
    "options": [
      "false\nfalse",
      "false\ntrue",
      "true\nfalse",
      "true\ntrue"
    ],
    "answer": 2,
    "explanation": "The application receives an established user identity. alice matches the expense owner and may read it. bob is authenticated but is not authorized for this expense."
  }
}
:::

## Explain it back

Describe why the result follows from the code. Identify one assumption that would change the outcome, then test that change locally. For concurrent examples, distinguish the scheduling from guarantees established by the APIs.

Continue to the [practical lab](/courses/java-advanced/module-07-security-and-authorization/02-practice-lab). You can also revisit the [complete Java curriculum](/courses/java).

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
