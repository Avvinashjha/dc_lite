package in.dailycoder.basics;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

/** The first capstone deliberately uses only the JDK. Amounts are integer paise. */
public class ExpenseTracker {
    public record Expense(String label, int amount) {
        public Expense {
            if (label == null || label.isBlank() || amount <= 0)
                throw new IllegalArgumentException("Use a nonblank label and a positive amount in paise.");
            label = label.strip();
        }
    }

    public static final class Ledger {
        private final List<Expense> expenses = new ArrayList<>();
        public void add(String label, int amount) { expenses.add(new Expense(label, amount)); }
        public List<Expense> list() { return List.copyOf(expenses); }
        public long total() {
            long total = 0;
            for (Expense expense : expenses) total = Math.addExact(total, expense.amount());
            return total;
        }
    }

    public static void run(Scanner input, PrintWriter output) {
        Ledger ledger = new Ledger();
        output.println("Commands: add <label> <paise>, list, total, exit");
        while (input.hasNextLine()) {
            String command = input.nextLine().strip();
            if (command.equals("exit")) { output.println("Goodbye"); break; }
            try {
                if (command.startsWith("add ")) {
                    String fields = command.substring(4).strip();
                    int split = fields.lastIndexOf(' ');
                    if (split < 1) throw new IllegalArgumentException("Usage: add <label> <paise>");
                    ledger.add(fields.substring(0, split), Integer.parseInt(fields.substring(split + 1)));
                    output.println("Added");
                } else if (command.equals("list")) {
                    if (ledger.list().isEmpty()) output.println("No expenses yet");
                    for (Expense expense : ledger.list()) output.println(expense.label() + ": " + expense.amount());
                } else if (command.equals("total")) {
                    output.println("Total: " + ledger.total());
                } else if (!command.isEmpty()) {
                    output.println("Unknown command");
                }
            } catch (IllegalArgumentException ex) {
                output.println("Error: " + ex.getMessage());
            }
            output.flush();
        }
        output.flush();
    }

    public static void main(String[] args) {
        try (Scanner input = new Scanner(System.in)) { run(input, new PrintWriter(System.out, true)); }
    }
}
