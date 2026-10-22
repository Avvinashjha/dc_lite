package in.dailycoder.backend;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.dao.DuplicateKeyException;

/** A durable, transactional DATABASE effect. This deliberately does not claim exactly-once email. */
@Service
class EventDelivery {
    private final JdbcTemplate jdbc;
    private final TransactionTemplate transaction;
    EventDelivery(JdbcTemplate jdbc, PlatformTransactionManager manager) { this.jdbc = jdbc; transaction = new TransactionTemplate(manager); }
    public boolean deliver(String eventId) { return deliver(eventId, () -> {}); }
    // The failure hook lets the lab prove rollback after the effect but before commit.
    boolean deliver(String eventId, Runnable afterEffect) {
        try {
            return Boolean.TRUE.equals(transaction.execute(status -> {
                long expenseId = jdbc.queryForObject("SELECT expense_id FROM expense_outbox WHERE event_id = ?", Long.class, eventId);
                jdbc.update("INSERT INTO processed_events(event_id) VALUES (?)", eventId);
                jdbc.update("INSERT INTO notifications(event_id, expense_id) VALUES (?, ?)", eventId, expenseId);
                afterEffect.run();
                jdbc.update("UPDATE expense_outbox SET delivered = true WHERE event_id = ?", eventId);
                return true;
            }));
        } catch (DuplicateKeyException duplicate) {
            // Catch OUTSIDE the transaction: PostgreSQL aborts a transaction on a constraint failure.
            // The marker is this transaction's only unique insert; a committed marker proves prior delivery.
            if (Boolean.TRUE.equals(jdbc.queryForObject("SELECT count(*) > 0 FROM processed_events WHERE event_id = ?", Boolean.class, eventId))) return false;
            throw duplicate;
        }
    }
}
