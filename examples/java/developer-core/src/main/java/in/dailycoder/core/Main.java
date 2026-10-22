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
