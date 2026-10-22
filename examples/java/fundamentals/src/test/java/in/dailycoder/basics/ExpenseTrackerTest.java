package in.dailycoder.basics;

import org.junit.jupiter.api.Test;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Scanner;
import static org.junit.jupiter.api.Assertions.*;

class ExpenseTrackerTest {
    @Test void totalsValidExpensesAndProtectsItsCollection() {
        var ledger = new ExpenseTracker.Ledger();
        assertEquals(0, ledger.total());
        ledger.add("Food", 1250); ledger.add("Bus", 300);
        assertEquals(1550, ledger.total());
        assertThrows(UnsupportedOperationException.class, () -> ledger.list().clear());
        assertThrows(IllegalArgumentException.class, () -> ledger.add("Food", -1));
        assertEquals(1550, ledger.total());
    }
    @Test void recoversFromBadCommandsWithoutLosingValidExpenses() {
        var buffer = new StringWriter();
        ExpenseTracker.run(new Scanner("add Food 1250\nadd Bus 300\nadd Wrong nope\nadd Refund -5\nadd Morning tea 100\nlist\ntotal\nexit\nadd Ignored 20\n"), new PrintWriter(buffer));
        String text = buffer.toString();
        assertTrue(text.contains("Food: 1250"));
        assertTrue(text.contains("Bus: 300"));
        assertTrue(text.contains("Morning tea: 100"));
        assertTrue(text.contains("Total: 1650"));
        assertTrue(text.contains("Error:"));
        assertFalse(text.contains("Ignored"));
    }
    @Test void usesLongForAnAggregateOfValidIntAmounts() {
        var ledger = new ExpenseTracker.Ledger();
        ledger.add("A", Integer.MAX_VALUE); ledger.add("B", Integer.MAX_VALUE);
        assertEquals(4294967294L, ledger.total());
    }
}
