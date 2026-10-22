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
