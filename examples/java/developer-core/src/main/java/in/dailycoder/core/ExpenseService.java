package in.dailycoder.core;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.YearMonth;
import java.util.List;

public final class ExpenseService {
    public interface ExchangeRates { BigDecimal rate(String from, String to) throws Exception; }
    private final ExpenseRepository repository;
    private final ExchangeRates rates;
    public ExpenseService(ExpenseRepository repository, ExchangeRates rates) { this.repository = repository; this.rates = rates; }
    public long monthlyTotal(YearMonth month) throws SQLException {
        return repository.list().stream().filter(value -> YearMonth.from(value.date()).equals(month)).mapToLong(Expense::amount).sum();
    }
    public BigDecimal convertedMonthlyTotal(YearMonth month, String target) throws Exception {
        return BigDecimal.valueOf(monthlyTotal(month), 2).multiply(rates.rate("INR", target));
    }
    public void importValues(List<Expense> values) throws SQLException { repository.addAll(values); }
}
