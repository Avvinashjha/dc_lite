package in.dailycoder.backend;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity @Table(name = "expenses")
class ExpenseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) Long id;
    @Version Long version;
    @Column(nullable = false) String owner;
    @Column(nullable = false, length = 100) String label;
    @Column(nullable = false) int amount;
    @Column(name = "spent_on", nullable = false) LocalDate spentOn;
    protected ExpenseEntity() {}
    ExpenseEntity(String owner, String label, int amount, LocalDate spentOn) {
        this.owner = owner; this.label = label.strip(); this.amount = amount; this.spentOn = spentOn;
    }
}
