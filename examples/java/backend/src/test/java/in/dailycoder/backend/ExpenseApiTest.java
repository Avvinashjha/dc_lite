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
