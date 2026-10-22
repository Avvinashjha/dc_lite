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
