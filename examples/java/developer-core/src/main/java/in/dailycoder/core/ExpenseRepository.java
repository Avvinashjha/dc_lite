package in.dailycoder.core;

import java.sql.SQLException;
import java.util.List;

public interface ExpenseRepository {
    Expense add(Expense expense) throws SQLException;
    List<Expense> list() throws SQLException;
    List<Expense> findAtLeast(int minimum) throws SQLException;
    void addAll(List<Expense> expenses) throws SQLException;
}
