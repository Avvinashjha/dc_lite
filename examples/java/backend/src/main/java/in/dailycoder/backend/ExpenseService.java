package in.dailycoder.backend;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
class ExpenseService {
    record View(long id, long version, String label, int amount, LocalDate spentOn) {}
    record Page(List<View> content, int page, int size, long totalElements) {}
    static class Missing extends RuntimeException {}
    static class Conflict extends RuntimeException {}
    private final ExpenseRepository repository;
    private final JdbcTemplate jdbc;
    ExpenseService(ExpenseRepository repository, JdbcTemplate jdbc) { this.repository = repository; this.jdbc = jdbc; }
    private static View view(ExpenseEntity e) { return new View(e.id, e.version, e.label, e.amount, e.spentOn); }
    ExpenseEntity owned(long id, String owner) { return repository.findByIdAndOwner(id, owner).orElseThrow(Missing::new); }

    @Transactional
    public View create(String owner, String label, int amount, LocalDate date) {
        var saved = repository.saveAndFlush(new ExpenseEntity(owner, label, amount, date));
        jdbc.update("INSERT INTO expense_outbox(event_id, expense_id, delivered) VALUES (?, ?, false)", UUID.randomUUID().toString(), saved.id);
        return view(saved);
    }
    @Transactional(readOnly = true)
    public View get(long id, String owner) { return view(owned(id, owner)); }
    @Transactional(readOnly = true)
    public Page list(String owner, int page, int size) {
        var rows = repository.findByOwner(owner, PageRequest.of(page, size, Sort.by(Sort.Order.desc("spentOn"), Sort.Order.desc("id"))));
        return new Page(rows.map(ExpenseService::view).getContent(), page, size, rows.getTotalElements());
    }
    @Transactional
    public View update(long id, String owner, long version, String label, int amount, LocalDate date) {
        var saved = owned(id, owner);
        if (saved.version != version) throw new Conflict();
        saved.label = label.strip(); saved.amount = amount; saved.spentOn = date;
        return view(repository.saveAndFlush(saved));
    }
    @Transactional
    public void delete(long id, String owner) { repository.delete(owned(id, owner)); }
    @Transactional(readOnly = true)
    public long total(String owner, YearMonth month) { return repository.total(owner, month.atDay(1), month.plusMonths(1).atDay(1)); }
    @Transactional(readOnly = true)
    public String eventId(long id, String owner) {
        owned(id, owner);
        return jdbc.queryForObject("SELECT event_id FROM expense_outbox WHERE expense_id = ?", String.class, id);
    }
}
