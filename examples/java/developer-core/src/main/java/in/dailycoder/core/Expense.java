package in.dailycoder.core;

import java.time.LocalDate;

public record Expense(long id, String label, int amount, LocalDate date) {
    public Expense {
        if (label == null || label.isBlank() || amount <= 0 || date == null)
            throw new IllegalArgumentException("An expense needs a label, positive paise, and a date.");
        label = label.strip();
    }
}
