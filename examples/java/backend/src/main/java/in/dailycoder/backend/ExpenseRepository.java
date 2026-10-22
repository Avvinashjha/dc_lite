package in.dailycoder.backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.Optional;

interface ExpenseRepository extends JpaRepository<ExpenseEntity, Long> {
    Optional<ExpenseEntity> findByIdAndOwner(Long id, String owner);
    Page<ExpenseEntity> findByOwner(String owner, Pageable pageable);
    @Query("select coalesce(sum(e.amount), 0) from ExpenseEntity e where e.owner = :owner and e.spentOn >= :from and e.spentOn < :until")
    long total(String owner, LocalDate from, LocalDate until);
}
